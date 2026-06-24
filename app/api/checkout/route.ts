import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import Order from "@/lib/models/Order";

const RECURRENTE_BASE = "https://app.recurrente.com/api";

export async function POST(req: NextRequest) {
  try {
    const { projectId, buyerEmail } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: "projectId requerido" }, { status: 400 });
    }

    await connectDB();
    const project = await Project.findById(projectId).lean() as {
      name: string;
      description: string;
      price: number;
      currency: string;
    } | null;

    if (!project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const secretKey = process.env.RECURRENTE_SECRET_KEY!;

    // Recurrente: pago único directo, sin product/price step
    // amount_in_cents = precio * 100
    const amountInCents = Math.round(project.price * 100);
    const currency = project.currency || "GTQ";

    const checkoutRes = await fetch(`${RECURRENTE_BASE}/checkouts`, {
      method: "POST",
      headers: {
        "X-SECRET-KEY": secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            name: project.name,
            amount_in_cents: amountInCents,
            currency,
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/pago/exitoso`,
        cancel_url: `${baseUrl}/pago/cancelado`,
      }),
    });

    if (!checkoutRes.ok) {
      const err = await checkoutRes.text();
      console.error("[checkout] error:", checkoutRes.status, err);
      return NextResponse.json({ error: "Error creando checkout en Recurrente", detail: err }, { status: 500 });
    }

    const checkoutData = await checkoutRes.json();
    const checkoutUrl = checkoutData?.checkout_url;

    if (!checkoutUrl) {
      console.error("[checkout] sin checkout_url:", JSON.stringify(checkoutData));
      return NextResponse.json({ error: "No se obtuvo checkout_url de Recurrente", detail: checkoutData }, { status: 500 });
    }

    await Order.create({
      checkoutId: checkoutData.id,
      projectId,
      buyerEmail: buyerEmail ?? "",
      status: "pending",
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
