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
      ""
    );
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RECURRENTE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] RECURRENTE_WEBHOOK_SECRET no configurado");
    return NextResponse.json({ error: "Configuración incorrecta" }, { status: 500 });
  }

  const rawBody = await req.text();
  const msgId = req.headers.get("svix-id") ?? req.headers.get("webhook-id") ?? "";
  const msgTimestamp = req.headers.get("svix-timestamp") ?? req.headers.get("webhook-timestamp") ?? "";
  const msgSignature = req.headers.get("svix-signature") ?? req.headers.get("webhook-signature") ?? "";

  if (!msgId || !msgTimestamp || !msgSignature) {
    return NextResponse.json({ error: "Faltan headers de firma" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    const wh = new Webhook(webhookSecret);
    payload = wh.verify(rawBody, {
      "webhook-id": msgId,
      "webhook-timestamp": msgTimestamp,
      "webhook-signature": msgSignature,
    }) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  // Log completo para diagnosticar estructura del payload de Recurrente
  console.log("[webhook] payload recibido:", JSON.stringify(payload, null, 2));

  try {
    const eventType: string = ((payload?.type ?? payload?.event ?? payload?.event_type ?? "") as string).toLowerCase();
    const data = (payload?.data ?? payload?.object ?? payload) as Record<string, unknown>;

    console.log("[webhook] eventType:", eventType);

    // Aceptar cualquier evento de pago exitoso
    const isPaid =
      eventType.includes("succeed") ||
      eventType.includes("paid") ||
      eventType.includes("complet") ||
      eventType.includes("approv") ||
      eventType.includes("confirm");

    if (!isPaid) {
      console.log("[webhook] evento ignorado:", eventType);
      return NextResponse.json({ ok: true, skipped: true, eventType });
    }

    // Extraer checkoutId intentando múltiples rutas
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

    // Extraer email del comprador probando múltiples rutas
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

    // Último recurso: consultar la API de Recurrente directamente
    if (!buyerEmail && checkoutId) {
      console.log("[webhook] email no en payload, consultando API de Recurrente...");
      buyerEmail = await fetchEmailFromRecurrente(checkoutId);
    }

    console.log("[webhook] buyerEmail:", buyerEmail || "(vacío)");

    const project = await Project.findById(order.projectId).lean() as {
      name: string;
      pdfPath?: string;
    } | null;

    if (!project) {
      console.error("[webhook] Proyecto no encontrado:", order.projectId);
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    await Order.findByIdAndUpdate(order._id, { status: "paid", buyerEmail });

    if (!buyerEmail) {
      console.error("[webhook] No se pudo obtener el email del comprador para order:", String(order._id));
      return NextResponse.json({ ok: true, warning: "Pago registrado pero email no disponible" });
    }

    if (!project.pdfPath) {
      console.error("[webhook] Proyecto sin PDF:", order.projectId);
      return NextResponse.json({ ok: true, warning: "Pago registrado pero proyecto sin PDF" });
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
      return NextResponse.json({ ok: true, warning: "Pago registrado pero PDF no disponible en disco" });
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
