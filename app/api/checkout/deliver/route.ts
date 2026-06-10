import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { readFile } from "fs/promises";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Project from "@/lib/models/Project";

const RECURRENTE_BASE = "https://app.recurrente.com/api";

export async function POST(req: NextRequest) {
  try {
    const { checkoutId } = await req.json();
    if (!checkoutId) {
      return NextResponse.json({ error: "checkoutId requerido" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findOne({ checkoutId });

    if (!order) {
      return NextResponse.json({ error: "Order no encontrada" }, { status: 404 });
    }

    // Si ya fue entregado, no hacer nada
    if (order.status === "paid") {
      return NextResponse.json({ ok: true, alreadyDelivered: true });
    }

    // Consultar Recurrente para verificar el estado del pago y obtener el email
    const recurrenteRes = await fetch(`${RECURRENTE_BASE}/checkouts/${checkoutId}`, {
      headers: { "X-SECRET-KEY": process.env.RECURRENTE_SECRET_KEY! },
    });

    if (!recurrenteRes.ok) {
      return NextResponse.json({ error: "No se pudo verificar el pago" }, { status: 400 });
    }

    const checkoutData = await recurrenteRes.json();
    console.log("[deliver] checkout de Recurrente:", JSON.stringify(checkoutData, null, 2));

    // Verificar que el checkout realmente esté pagado
    const status: string = (checkoutData?.status ?? checkoutData?.state ?? "").toLowerCase();
    const isPaid =
      status.includes("paid") ||
      status.includes("success") ||
      status.includes("complet") ||
      status.includes("approv");

    if (!isPaid) {
      return NextResponse.json({ error: "Pago no confirmado", status }, { status: 402 });
    }

    const buyerEmail: string =
      order.buyerEmail ||
      checkoutData?.customer_email ||
      checkoutData?.customer?.email ||
      checkoutData?.billing?.email ||
      "";

    const project = await Project.findById(order.projectId).lean() as {
      name: string;
      pdfPath?: string;
    } | null;

    if (!project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    await Order.findByIdAndUpdate(order._id, { status: "paid", buyerEmail });

    if (!buyerEmail || !project.pdfPath) {
      return NextResponse.json({ ok: true, warning: "Pago registrado, email o PDF no disponible" });
    }

    const uploadsDir = path.resolve(process.cwd(), "uploads", "pdfs");
    const pdfFilePath = path.resolve(uploadsDir, project.pdfPath);

    if (!pdfFilePath.startsWith(uploadsDir + path.sep)) {
      return NextResponse.json({ error: "Ruta inválida" }, { status: 500 });
    }

    const pdfBuffer = await readFile(pdfFilePath).catch(() => null);

    if (!pdfBuffer || pdfBuffer.slice(0, 5).toString() !== "%PDF-") {
      return NextResponse.json({ ok: true, warning: "PDF no disponible en disco" });
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

    console.log("[deliver] Email enviado a:", buyerEmail);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[deliver] Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
