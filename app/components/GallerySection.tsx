"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, ChevronUp } from "lucide-react";
import type { IProject } from "@/lib/models/Project";

const CATEGORIES = ["Todos", "Moderna", "Mediterránea", "Industrial", "Sustentable", "Montaña", "Playa"];
const INITIAL_COUNT = 6;

export default function GallerySection({ projects }: { projects: IProject[] }) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [showAll, setShowAll] = useState(false);

  const filtered =
    activeCategory === "Todos"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = filtered.length > INITIAL_COUNT;

  function handleCategory(cat: string) {
    setActiveCategory(cat);
    setShowAll(false);
  }

  return (
    <section className="mx-auto w-full max-w-7xl bg-white px-6 pb-24 pt-16 text-slate-950 sm:px-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="text-sm uppercase tracking-[0.28em] text-amber-700/90">Galería</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Galería de Planos
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
            Explora nuestra colección de planos arquitectónicos modernos y funcionales.
          </p>
        </div>
        {hasMore && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Ver Todo ({filtered.length})
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={
              activeCategory === cat
                ? "rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center text-slate-500">
          No hay planos en esta categoría aún.
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
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">{project.name}</h3>
                      <p className="text-sm text-slate-500">{project.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-slate-950">${project.price.toLocaleString()}</p>
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
