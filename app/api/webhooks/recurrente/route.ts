import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { Resend } from "resend";
import { readFile } from "fs/promises";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Project from "@/lib/models/Project";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  // Verificar firma Svix antes de procesar cualquier dato
  const webhookSecret = process.env.RECURRENTE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("RECURRENTE_WEBHOOK_SECRET no configurado");
    return NextResponse.json({ error: "Configuración incorrecta" }, { status: 500 });
  }

  const rawBody = await req.text();
  // Svix puede enviar svix-* o webhook-* según la versión; aceptamos ambos
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

  try {
    const eventType: string = (payload?.type ?? payload?.event ?? "") as string;
    const data = payload?.data as Record<string, unknown> | undefined;
    const checkoutId: string = (data?.id ?? data?.object?.toString() ?? "") as string;

    if (!checkoutId) {
      return NextResponse.json({ error: "checkoutId no encontrado en payload" }, { status: 400 });
    }

    // Solo procesamos pagos exitosos
    const isPaid =
      eventType.includes("succeeded") ||
      eventType.includes("paid") ||
      eventType.includes("completed");

    if (!isPaid) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    await connectDB();

    const order = await Order.findOne({ checkoutId });
    if (!order) {
      console.error("Order no encontrada para checkoutId:", checkoutId);
      return NextResponse.json({ error: "Order no encontrada" }, { status: 404 });
    }

    if (order.status === "paid") {
      return NextResponse.json({ ok: true, alreadyProcessed: true });
    }

    // Usar el email guardado en la orden en lugar del del payload,
    // para que un payload forjado no redirija el PDF a otro destinatario.
    // Si aún no hay email en la orden, tomarlo del payload verificado.
    const buyerEmail: string =
      order.buyerEmail ||
      ((data?.customer_email ?? "") as string);

    const project = await Project.findById(order.projectId).lean() as {
      name: string;
      pdfPath?: string;
    } | null;

    if (!project) {
      console.error("Proyecto no encontrado:", order.projectId);
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    await Order.findByIdAndUpdate(order._id, { status: "paid", buyerEmail });

    if (buyerEmail && project.pdfPath) {
      const uploadsDir = path.resolve(process.cwd(), "uploads", "pdfs");
      const pdfFilePath = path.resolve(uploadsDir, project.pdfPath);

      // Prevenir path traversal: el archivo debe estar dentro de uploadsDir
      if (!pdfFilePath.startsWith(uploadsDir + path.sep)) {
        console.error("Ruta de PDF fuera de bounds:", pdfFilePath);
        return NextResponse.json({ error: "Ruta inválida" }, { status: 500 });
      }

      let pdfBuffer: Buffer | undefined;
      try {
        pdfBuffer = await readFile(pdfFilePath);
      } catch {
        console.error("PDF no encontrado en disco:", pdfFilePath);
      }

      if (pdfBuffer && pdfBuffer.slice(0, 5).toString() === "%PDF-") {
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
          replyTo: undefined,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
