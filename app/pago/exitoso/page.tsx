import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function PagoExitoso({
  searchParams,
}: {
  searchParams: Promise<{ checkout_id?: string; id?: string }>;
}) {
  const params = await searchParams;
  const checkoutId = params.checkout_id ?? params.id ?? "";

  // Intentar entrega inmediata del PDF al llegar a esta página
  if (checkoutId) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
      await fetch(`${baseUrl}/api/checkout/deliver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutId }),
      });
    } catch {
      // Silencioso — el webhook es el mecanismo principal
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-semibold text-slate-950">¡Pago exitoso!</h1>
        <p className="text-slate-600 leading-7">
          Tu compra fue procesada correctamente. Recibirás los planos en tu correo electrónico en los próximos minutos.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
