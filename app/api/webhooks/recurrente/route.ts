import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { readFile } from "fs/promises";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Project from "@/lib/models/Project";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Recurrente envía eventos tipo "checkout.succeeded" o similar
    const eventType: string = payload?.type ?? payload?.event ?? "";
    const checkoutId: string =
      payload?.data?.id ??
      payload?.data?.object?.id ??
      payload?.checkout_id ??
      "";

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
      // Ya procesado, responder OK para evitar reenvíos de Svix
      return NextResponse.json({ ok: true, alreadyProcessed: true });
    }

    // Obtener email del comprador del payload de Recurrente
    const buyerEmail: string =
      payload?.data?.customer_email ??
      payload?.data?.object?.customer_email ??
      payload?.customer_email ??
      order.buyerEmail ??
      "";

    // Obtener proyecto y su PDF
    const project = await Project.findById(order.projectId).lean() as {
      name: string;
      pdfPath?: string;
    } | null;

    if (!project) {
      console.error("Proyecto no encontrado:", order.projectId);
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    // Marcar como pagado
    await Order.findByIdAndUpdate(order._id, { status: "paid", buyerEmail });

    // Enviar email con PDF adjunto si existe
    if (buyerEmail && project.pdfPath) {
      const pdfFilePath = path.join(process.cwd(), "uploads", "pdfs", project.pdfPath);
      let pdfBuffer: Buffer | undefined;

      try {
        pdfBuffer = await readFile(pdfFilePath);
      } catch {
        console.error("PDF no encontrado en disco:", pdfFilePath);
      }

      if (pdfBuffer) {
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
