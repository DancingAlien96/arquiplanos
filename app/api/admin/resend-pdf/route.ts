import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Project from "@/lib/models/Project";
import { getPdfAttachments } from "@/lib/pdfAttachments";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { orderId, email } = await req.json();
  if (!orderId) return NextResponse.json({ error: "orderId requerido" }, { status: 400 });

  await connectDB();
  const order = await Order.findById(orderId);
  if (!order) return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });

  const toEmail: string = email || order.buyerEmail;
  if (!toEmail) return NextResponse.json({ error: "No hay email para esta orden" }, { status: 400 });

  const project = await Project.findById(order.projectId).lean() as {
    name: string;
    pdfPath?: string;
    pdfPaths?: string[];
  } | null;

  if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });

  const attachments = await getPdfAttachments(project);
  if (!attachments.length) return NextResponse.json({ error: "Proyecto sin PDF en disco" }, { status: 404 });

  const resend = new Resend(process.env.RESEND_API_KEY!);
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: toEmail,
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

  await Order.findByIdAndUpdate(orderId, { status: "paid", buyerEmail: toEmail });
  return NextResponse.json({ ok: true });
}
