"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { IProject } from "@/lib/models/Project";

export default function AdminProjectList({ projects }: { projects: IProject[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar el proyecto "${name}"? Esta acción no se puede deshacer.`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      router.refresh();
    } catch {
      alert("No se pudo eliminar el proyecto.");
    } finally {
      setDeletingId(null);
    }
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white py-24 text-center">
        <p className="text-slate-400 text-sm">No hay proyectos todavía</p>
        <a
          href="/admin/proyectos/nuevo"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          + Crear primer proyecto
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <div
          key={String(project._id)}
          className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
        >
          <div className="relative h-48 bg-slate-100">
            {project.images?.[0] ? (
              <Image
                src={project.images[0]}
                alt={project.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 text-xs">
                Sin imagen
              </div>
            )}
          </div>
          <div className="space-y-3 px-5 py-5">
            <div>
              <p className="font-semibold text-slate-950 leading-tight">{project.name}</p>
              <p className="text-xs text-slate-500 mt-1">{project.category} · ${project.price.toLocaleString()} {project.currency}</p>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">{project.description}</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => handleDelete(String(project._id), project.name)}
                disabled={deletingId === String(project._id)}
                className="flex-1 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
              >
                {deletingId === String(project._id) ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
