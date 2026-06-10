"use client";

import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Lock, Zap, Clock, Loader2 } from "lucide-react";
import type { IProject } from "@/lib/models/Project";

const SYMBOLS: Record<string, string> = { GTQ: "Q", USD: "$", MXN: "$", EUR: "€" };
const currencySymbol = (c: string) => SYMBOLS[c] ?? c + " ";

export default function ProjectDetailClient({ project }: { project: IProject }) {
  const allImages = [
    ...(project.coverImage ? [project.coverImage] : []),
    ...project.images,
  ];

  const [activeImg, setActiveImg] = useState(allImages[0] ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  async function handleComprar() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Ingresa un correo electrónico válido para recibir tu PDF.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project._id, buyerEmail: trimmedEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar el pago");
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white px-6 py-4 sm:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="text-xl font-semibold tracking-tight text-slate-950">
            Habitio Design
          </a>
          <nav className="hidden gap-8 text-sm font-medium text-slate-700 sm:flex">
            <a href="/#servicios" className="hover:text-slate-950 transition">Servicios</a>
            <a href="/#galeria" className="hover:text-slate-950 transition">Galería</a>
            <a href="/#precios" className="hover:text-slate-950 transition">Precios</a>
            <a href="/#contacto" className="hover:text-slate-950 transition">Contacto</a>
          </nav>
          <a
            href="/#contacto"
            className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Ver Planos
          </a>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4 sm:px-10">
        <p className="text-xs text-slate-500">
          <a href="/" className="hover:text-slate-800 transition">Inicio</a>
          <span className="mx-2">·</span>
          <a href="/#galeria" className="hover:text-slate-800 transition">Galería</a>
          <span className="mx-2">·</span>
          <span className="text-slate-800">{project.name}</span>
        </p>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-6 pb-24 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left: images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-slate-100">
              {activeImg ? (
                <Image
                  src={activeImg}
                  alt={project.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                  Sin imagen
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(src)}
                    className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl transition ${
                      activeImg === src
                        ? "ring-2 ring-slate-950 ring-offset-2"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`Vista ${i + 1}`}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: info */}
          <div className="flex flex-col gap-6 lg:pt-2">
            {/* Category badge */}
            <span className="inline-flex w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700">
              {project.category}
            </span>

            {/* Title & description */}
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {project.name}
              </h1>
              <p className="text-base leading-7 text-slate-600">{project.description}</p>
            </div>

            {/* Features */}
            {project.features.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Características
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.features.map((f: string) => (
                    <span
                      key={f}
                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-700"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-semibold text-slate-950">
                {currencySymbol(project.currency)}{project.price.toLocaleString()}
              </span>
              <span className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                {project.currency}
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <div className="space-y-1.5">
                <label htmlFor="buyer-email" className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Tu correo electrónico
                </label>
                <input
                  id="buyer-email"
                  type="email"
                  placeholder="nombre@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/10 disabled:opacity-60"
                />
                <p className="text-xs text-slate-500">Aquí recibirás el PDF de tus planos después del pago.</p>
              </div>
              {error && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
              )}
              <button
                onClick={handleComprar}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Procesando...</>
                ) : (
                  <><ShoppingCart className="h-5 w-5" /> Comprar Ahora · {currencySymbol(project.currency)}{project.price.toLocaleString()} {project.currency}</>
                )}
              </button>
              <a
                href="/#galeria"
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Seguir Explorando
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Pago Seguro
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Entrega Inmediata
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Garantía 30 días
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer simple */}
      <footer className="border-t border-slate-100 bg-slate-50 px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-7xl flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between">
          <span className="text-sm font-semibold text-slate-950">Habitio Design</span>
          <p className="text-xs text-slate-500">Diseños arquitectónicos modernos y funcionales</p>
        </div>
      </footer>
    </div>
  );
}
