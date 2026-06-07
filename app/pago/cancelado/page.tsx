import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PagoCancelado() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="h-16 w-16 text-red-400" />
        </div>
        <h1 className="text-3xl font-semibold text-slate-950">Pago cancelado</h1>
        <p className="text-slate-600 leading-7">
          No se realizó ningún cargo. Puedes intentarlo de nuevo cuando quieras.
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
