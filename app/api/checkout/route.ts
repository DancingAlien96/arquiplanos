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
    const headers = {
      "X-SECRET-KEY": secretKey,
      "Content-Type": "application/json",
    };

    // Paso 1: crear producto en Recurrente con el precio
    const productRes = await fetch(`${RECURRENTE_BASE}/products`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: project.name,
        description: project.description,
        success_url: `${baseUrl}/pago/exitoso`,
        cancel_url: `${baseUrl}/pago/cancelado`,
        prices_attributes: [
          {
            amount_as_decimal: project.price.toString(),
            currency: project.currency || "GTQ",
            charge_type: "one_time",
          },
        ],
      }),
    });

    if (!productRes.ok) {
      const err = await productRes.text();
      console.error("Recurrente product error:", err);
      return NextResponse.json({ error: "Error creando producto en Recurrente" }, { status: 500 });
    }

    const productData = await productRes.json();
    const priceId = productData?.prices?.[0]?.id;

    if (!priceId) {
      return NextResponse.json({ error: "No se obtuvo price_id de Recurrente" }, { status: 500 });
    }

    // Paso 2: crear checkout con el price_id
    const checkoutRes = await fetch(`${RECURRENTE_BASE}/checkouts`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        items: [{ price_id: priceId }],
      }),
    });

    if (!checkoutRes.ok) {
      const err = await checkoutRes.text();
      console.error("Recurrente checkout error:", err);
      return NextResponse.json({ error: "Error creando checkout en Recurrente" }, { status: 500 });
    }

    const checkoutData = await checkoutRes.json();
    const checkoutUrl = checkoutData?.checkout_url;

    if (!checkoutUrl) {
      return NextResponse.json({ error: "No se obtuvo checkout_url de Recurrente" }, { status: 500 });
    }

    // Guardar Order con email del comprador para garantizar entrega del PDF
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
