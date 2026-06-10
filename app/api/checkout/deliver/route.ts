import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Project from "@/lib/models/Project";
import { getPdfAttachments } from "@/lib/pdfAttachments";

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
      console.error("[deliver] Order no encontrada para checkoutId:", checkoutId);
      return NextResponse.json({ error: "Order no encontrada" }, { status: 404 });
    }

    if (order.status === "paid") {
      return NextResponse.json({ ok: true, alreadyDelivered: true });
    }

    // Verificar con la API de Recurrente antes de marcar como pagado o enviar PDF.
    // No mutar la orden ni enviar nada si la verificación falla.
    const recurrenteRes = await fetch(`${RECURRENTE_BASE}/checkouts/${checkoutId}`, {
      headers: { "X-SECRET-KEY": process.env.RECURRENTE_SECRET_KEY! },
    });

    if (!recurrenteRes.ok) {
      const errText = await recurrenteRes.text();
      console.error("[deliver] Recurrente API error:", recurrenteRes.status, errText);
      return NextResponse.json({ error: "No se pudo verificar el pago" }, { status: 402 });
    }

    const checkoutData = await recurrenteRes.json();
    console.log("[deliver] Recurrente response:", JSON.stringify(checkoutData, null, 2));

    const status: string = (
      checkoutData?.status ??
      checkoutData?.state ??
      checkoutData?.payment_status ??
      ""
    ).toString().toLowerCase();

    const isPaid =
      status.includes("paid") ||
      status.includes("success") ||
      status.includes("complet") ||
      status.includes("approv") ||
      status.includes("succeed");

    if (!isPaid) {
      console.warn("[deliver] Estado no confirmado:", status, "| respuesta completa:", JSON.stringify(checkoutData));
      return NextResponse.json({ error: "Pago no confirmado", status }, { status: 402 });
    }

    // Email: solo desde la Order (guardado al crear el checkout) o desde la API de Recurrente.
    // Nunca desde el cuerpo de la petición.
    const buyerEmail: string =
      order.buyerEmail ||
      checkoutData?.customer_email ||
      checkoutData?.customer?.email ||
      checkoutData?.billing?.email ||
      "";

    // Marcar como pagado solo después de confirmación de la API
    await Order.findByIdAndUpdate(order._id, { status: "paid", buyerEmail });
    console.log("[deliver] Order marcada como paid:", String(order._id), "email:", buyerEmail || "(vacío)");

    if (!buyerEmail) {
      console.error("[deliver] Sin email para order:", String(order._id));
      return NextResponse.json({ ok: true, warning: "Pago registrado, email no disponible" });
    }

    const project = await Project.findById(order.projectId).lean() as {
      name: string;
      pdfPath?: string;
      pdfPaths?: string[];
    } | null;

    if (!project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    const attachments = await getPdfAttachments(project);

    if (!attachments.length) {
      console.error("[deliver] Proyecto sin PDFs:", order.projectId);
      return NextResponse.json({ ok: true, warning: "Pago registrado, proyecto sin PDF" });
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
      attachments,
    });

    console.log("[deliver] Email enviado a:", buyerEmail);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[deliver] Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
