"use client";

import { useState } from "react";
import { Send, Mail } from "lucide-react";

interface Order {
  _id: string;
  checkoutId: string;
  projectName: string;
  buyerEmail: string;
  status: string;
  createdAt: string;
}

export default function OrdersList({ orders }: { orders: Order[] }) {
  const [sending, setSending] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, "ok" | "error">>({});
  const [emailOverrides, setEmailOverrides] = useState<Record<string, string>>({});

  async function resend(orderId: string) {
    setSending(orderId);
    try {
      const res = await fetch("/api/admin/resend-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, email: emailOverrides[orderId] || undefined }),
      });
      setResults((r) => ({ ...r, [orderId]: res.ok ? "ok" : "error" }));
    } catch {
      setResults((r) => ({ ...r, [orderId]: "error" }));
    } finally {
      setSending(null);
    }
  }

  if (orders.length === 0) {
    return <p className="text-sm text-slate-500">No hay órdenes aún.</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order._id}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-slate-950">{order.projectName}</p>
            <p className="text-xs text-slate-500">
              {order.buyerEmail || <span className="text-amber-600">Sin email</span>}
            </p>
            <p className="text-xs text-slate-400">
              {new Date(order.createdAt).toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" })}
              {" · "}
              <span className={
                order.status === "paid"
                  ? "text-green-600 font-medium"
                  : order.status === "failed"
                  ? "text-red-500 font-medium"
                  : "text-amber-600 font-medium"
              }>
                {order.status === "paid" ? "Pagado" : order.status === "failed" ? "Fallido" : "Pendiente"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!order.buyerEmail && (
              <input
                type="email"
                placeholder="Email del comprador"
                value={emailOverrides[order._id] ?? ""}
                onChange={(e) => setEmailOverrides((v) => ({ ...v, [order._id]: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/10 w-48"
              />
            )}
            {results[order._id] === "ok" && (
              <span className="text-xs text-green-600 font-medium">✓ Enviado</span>
            )}
            {results[order._id] === "error" && (
              <span className="text-xs text-red-500 font-medium">Error</span>
            )}
            <button
              onClick={() => resend(order._id)}
              disabled={sending === order._id}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {sending === order._id
                ? <Mail className="h-3.5 w-3.5 animate-pulse" />
                : <Send className="h-3.5 w-3.5" />}
              {sending === order._id ? "Enviando..." : "Reenviar PDF"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
