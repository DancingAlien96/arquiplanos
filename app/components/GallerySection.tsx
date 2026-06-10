"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import type { IProject } from "@/lib/models/Project";

const INITIAL_COUNT = 6;
const SYMBOLS: Record<string, string> = { GTQ: "Q", USD: "$", MXN: "$", EUR: "€" };
const currencySymbol = (c: string) => SYMBOLS[c] ?? c + " ";

const STYLES = ["Moderna", "Mediterránea", "Industrial", "Sustentable", "Montaña", "Playa"];
const FLOORS_OPTIONS = ["1 piso", "2 pisos", "3+ pisos"];
const BEDROOMS_OPTIONS = ["1", "2", "3", "4+"];
const SIZE_OPTIONS = ["Pequeño", "Mediano", "Grande", "Muy grande"];

interface Filters {
  style: string;
  floors: string;
  bedrooms: string;
  size: string;
}

const EMPTY: Filters = { style: "", floors: "", bedrooms: "", size: "" };

function ChevronIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 ${active ? "text-white" : "text-slate-400"}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function GallerySection({ projects }: { projects: IProject[] }) {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [showAll, setShowAll] = useState(false);

  function setFilter(key: keyof Filters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setShowAll(false);
  }

  function clearFilters() {
    setFilters(EMPTY);
    setShowAll(false);
  }

  const filtered = projects.filter((p) => {
    if (filters.style && p.category !== filters.style) return false;
    if (filters.floors && p.floors !== filters.floors) return false;
    if (filters.bedrooms && p.bedrooms !== filters.bedrooms) return false;
    if (filters.size && p.size !== filters.size) return false;
    return true;
  });

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = filtered.length > INITIAL_COUNT;
  const anyActive = filters.style || filters.floors || filters.bedrooms || filters.size;

  return (
    <section id="galeria" className="mx-auto w-full max-w-7xl bg-white px-6 pb-24 pt-16 text-slate-950 sm:px-10">

      {/* Encabezado */}
      <div className="max-w-xl">
        <p className="text-sm uppercase tracking-[0.28em] text-amber-700/90">Galería</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Galería de Planos
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
          Explora nuestra colección de planos arquitectónicos modernos y funcionales.
        </p>
      </div>

      {/* Panel de filtros */}
      <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <SlidersHorizontal className="h-4 w-4" />
          Filtrar planos
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Estilo */}
          <div className="relative">
            <select
              value={filters.style}
              onChange={(e) => setFilter("style", e.target.value)}
              className={`w-full appearance-none rounded-2xl border px-4 py-3 pr-9 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-950/10 ${
                filters.style ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <option value="">Estilo</option>
              {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronIcon active={!!filters.style} />
          </div>

          {/* Pisos */}
          <div className="relative">
            <select
              value={filters.floors}
              onChange={(e) => setFilter("floors", e.target.value)}
              className={`w-full appearance-none rounded-2xl border px-4 py-3 pr-9 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-950/10 ${
                filters.floors ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <option value="">Número de pisos</option>
              {FLOORS_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <ChevronIcon active={!!filters.floors} />
          </div>

          {/* Tamaño */}
          <div className="relative">
            <select
              value={filters.size}
              onChange={(e) => setFilter("size", e.target.value)}
              className={`w-full appearance-none rounded-2xl border px-4 py-3 pr-9 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-950/10 ${
                filters.size ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <option value="">Tamaño</option>
              {SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronIcon active={!!filters.size} />
          </div>

          {/* Dormitorios */}
          <div className="relative">
            <select
              value={filters.bedrooms}
              onChange={(e) => setFilter("bedrooms", e.target.value)}
              className={`w-full appearance-none rounded-2xl border px-4 py-3 pr-9 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-950/10 ${
                filters.bedrooms ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <option value="">Dormitorios</option>
              {BEDROOMS_OPTIONS.map((b) => (
                <option key={b} value={b}>{b === "4+" ? "4+ dormitorios" : `${b} ${b === "1" ? "dormitorio" : "dormitorios"}`}</option>
              ))}
            </select>
            <ChevronIcon active={!!filters.bedrooms} />
          </div>
        </div>

        {/* Conteo y limpiar */}
        {anyActive && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {filtered.length === 0
                ? "Sin resultados"
                : `${filtered.length} plano${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Grid de resultados */}
      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center text-slate-500">
          <p>No hay planos con esos filtros.</p>
          <button onClick={clearFilters} className="text-sm font-semibold text-slate-950 underline underline-offset-4">
            Ver todos los planos
          </button>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {visible.map((project) => (
              <article
                key={String(project._id)}
                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-lg shadow-slate-200/40"
              >
                <div className="relative h-72 overflow-hidden bg-slate-100">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="space-y-4 px-6 py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-950">{project.name}</h3>
                      <p className="text-sm text-slate-500">{project.category}</p>
                      {(project.floors || project.bedrooms || project.size) && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {project.floors && (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                              {project.floors}
                            </span>
                          )}
                          {project.bedrooms && (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                              {project.bedrooms} {project.bedrooms === "1" ? "dorm." : "dorms."}
                            </span>
                          )}
                          {project.size && (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                              {project.size}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-semibold text-slate-950">
                        {currencySymbol(project.currency)}{project.price.toLocaleString()}
                      </p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{project.currency}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.features.slice(0, 2).map((f) => (
                      <span
                        key={f}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600"
                      >
                        {f}
                      </span>
                    ))}
                    {project.features.length > 2 && (
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">
                        +{project.features.length - 2}
                      </span>
                    )}
                  </div>
                  <a
                    href={`/proyectos/${String(project._id)}`}
                    className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Ver Detalles
                  </a>
                </div>
              </article>
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              {showAll ? (
                <button
                  onClick={() => { setShowAll(false); document.getElementById("galeria")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <ChevronUp className="h-4 w-4" />
                  Ver Menos
                </button>
              ) : (
                <button
                  onClick={() => setShowAll(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Ver {filtered.length - INITIAL_COUNT} planos más
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
