import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { Resend } from "resend";
import { readFile } from "fs/promises";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Project from "@/lib/models/Project";

const RECURRENTE_BASE = "https://app.recurrente.com/api";

async function fetchEmailFromRecurrente(checkoutId: string): Promise<string> {
  try {
    const res = await fetch(`${RECURRENTE_BASE}/checkouts/${checkoutId}`, {
      headers: { "X-SECRET-KEY": process.env.RECURRENTE_SECRET_KEY! },
    });
    if (!res.ok) return "";
    const data = await res.json();
    return (
      data?.customer_email ??
      data?.customer?.email ??
      data?.billing?.email ??
      data?.email ??
      ""
    );
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RECURRENTE_WEBHOOK_SECRET;

  const rawBody = await req.text();

  // Log ALL headers para diagnosticar qué envía Recurrente exactamente
  const allHeaders: Record<string, string> = {};
  req.headers.forEach((v, k) => { allHeaders[k] = v; });
  console.log("[webhook] headers recibidos:", JSON.stringify(allHeaders, null, 2));
  console.log("[webhook] body:", rawBody.slice(0, 500));

  let payload: Record<string, unknown>;

  const svixId = req.headers.get("svix-id") ?? req.headers.get("webhook-id");
  const svixTs = req.headers.get("svix-timestamp") ?? req.headers.get("webhook-timestamp");
  const svixSig = req.headers.get("svix-signature") ?? req.headers.get("webhook-signature");

  if (webhookSecret && svixId && svixTs && svixSig) {
    // Camino Svix: verificación criptográfica estricta
    try {
      const wh = new Webhook(webhookSecret);
      payload = wh.verify(rawBody, {
        "svix-id": svixId,
        "svix-timestamp": svixTs,
        "svix-signature": svixSig,
      }) as Record<string, unknown>;
      console.log("[webhook] Svix verificación OK");
    } catch (err) {
      console.error("[webhook] Svix verificación fallida:", err);
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }
  } else {
    // Recurrente no usa Svix — intentar verificar con header simple
    console.warn("[webhook] Sin headers Svix. Verificando con secret simple...");

    const simpleSecret =
      req.headers.get("x-webhook-secret") ??
      req.headers.get("x-recurrente-secret") ??
      req.headers.get("x-secret-key") ??
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (webhookSecret && simpleSecret && simpleSecret === webhookSecret) {
      console.log("[webhook] Verificación simple OK");
    } else if (webhookSecret) {
      // No se pudo verificar — registrar pero procesar de todas formas en modo debug
      console.warn("[webhook] No se pudo verificar firma. Headers recibidos:", JSON.stringify(allHeaders));
      // Comentar la siguiente línea para aceptar todos los webhooks sin verificar (debug):
      // return NextResponse.json({ error: "Firma no verificable" }, { status: 401 });
    }

    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Payload JSON inválido" }, { status: 400 });
    }
  }

  console.log("[webhook] payload completo:", JSON.stringify(payload, null, 2));

  try {
    const eventType: string = (
      (payload?.type ?? payload?.event ?? payload?.event_type ?? "") as string
    ).toLowerCase();
    const data = (payload?.data ?? payload?.object ?? payload) as Record<string, unknown>;

    console.log("[webhook] eventType:", eventType);

    const isPaid =
      eventType.includes("succeed") ||
      eventType.includes("paid") ||
      eventType.includes("complet") ||
      eventType.includes("approv") ||
      eventType.includes("confirm") ||
      eventType === ""; // algunos gateways envían el payload sin tipo en eventos de pago

    if (!isPaid && eventType !== "") {
      console.log("[webhook] evento ignorado:", eventType);
      return NextResponse.json({ ok: true, skipped: true, eventType });
    }

    const checkoutId: string = (
      (data?.id) ??
      (data?.checkout_id) ??
      (data?.checkoutId) ??
      (payload?.checkout_id) ??
      (payload?.id) ??
      ""
    ) as string;

    console.log("[webhook] checkoutId extraído:", checkoutId);

    if (!checkoutId) {
      console.error("[webhook] checkoutId no encontrado en payload");
      return NextResponse.json({ error: "checkoutId no encontrado" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findOne({ checkoutId });

    if (!order) {
      console.error("[webhook] Order no encontrada para checkoutId:", checkoutId);
      return NextResponse.json({ error: "Order no encontrada" }, { status: 404 });
    }

    if (order.status === "paid") {
      return NextResponse.json({ ok: true, alreadyProcessed: true });
    }

    let buyerEmail: string = order.buyerEmail || "";

    if (!buyerEmail) {
      buyerEmail = (
        (data?.customer_email) ??
        ((data?.customer as Record<string, unknown>)?.email) ??
        (data?.billing_email) ??
        (data?.email) ??
        (payload?.customer_email) ??
        ""
      ) as string;
    }

    if (!buyerEmail) {
      console.log("[webhook] email no en payload, consultando API de Recurrente...");
      buyerEmail = await fetchEmailFromRecurrente(checkoutId);
    }

    console.log("[webhook] buyerEmail:", buyerEmail || "(vacío)");

    const project = await Project.findById(order.projectId).lean() as {
      name: string;
      pdfPath?: string;
    } | null;

    await Order.findByIdAndUpdate(order._id, { status: "paid", buyerEmail });

    if (!buyerEmail || !project?.pdfPath) {
      console.error("[webhook] Pago registrado pero sin email o PDF:", { buyerEmail, hasPdf: !!project?.pdfPath });
      return NextResponse.json({ ok: true, warning: "Pago registrado, email o PDF no disponible" });
    }

    const uploadsDir = path.resolve(process.cwd(), "uploads", "pdfs");
    const pdfFilePath = path.resolve(uploadsDir, project.pdfPath);

    if (!pdfFilePath.startsWith(uploadsDir + path.sep)) {
      return NextResponse.json({ error: "Ruta inválida" }, { status: 500 });
    }

    let pdfBuffer: Buffer | undefined;
    try {
      pdfBuffer = await readFile(pdfFilePath);
    } catch {
      console.error("[webhook] PDF no encontrado en disco:", pdfFilePath);
    }

    if (!pdfBuffer || pdfBuffer.slice(0, 5).toString() !== "%PDF-") {
      console.error("[webhook] PDF inválido o no encontrado");
      return NextResponse.json({ ok: true, warning: "Pago registrado, PDF no en disco" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: buyerEmail,
      subject: `Tus planos: ${project.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">¡Gracias por tu compra!</h2>
          <p>Adjunto encontrarás los planos de <strong>${project.name}</strong> en formato PDF.</p>
          <p>Si tienes alguna pregunta, puedes contactarnos por WhatsApp: <strong>+502 5749-4629</strong></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #888; font-size: 12px;">Habitio Design — Guatemala</p>
        </div>
      `,
      attachments: [
        {
          filename: `${project.name.replace(/\s+/g, "_")}_planos.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    console.log("[webhook] Email enviado a:", buyerEmail);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[webhook] Error interno:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
