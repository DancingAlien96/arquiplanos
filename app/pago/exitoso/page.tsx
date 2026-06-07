import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PagoExitoso() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-semibold text-slate-950">¡Pago exitoso!</h1>
        <p className="text-slate-600 leading-7">
          Tu compra fue procesada correctamente. Recibirás los planos en tu correo electrónico en un plazo máximo de 24 horas hábiles.
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
