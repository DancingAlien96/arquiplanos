export const dynamic = "force-dynamic";

import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import AdminProjectList from "./components/AdminProjectList";
import LogoutButton from "./components/LogoutButton";

export default async function AdminPage() {
  await connectDB();
  const projectDocs = await Project.find().sort({ createdAt: -1 }).lean();
  const projects = JSON.parse(JSON.stringify(projectDocs));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-4 sm:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 transition">
              ← Volver al sitio
            </Link>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">Panel de Administración</h1>
          </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/proyectos/nuevo"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Nuevo Proyecto
          </Link>
          <LogoutButton />
        </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-600">
            {projects.length === 0
              ? "No hay proyectos aún. Crea el primero."
              : `${projects.length} proyecto${projects.length !== 1 ? "s" : ""} en la galería`}
          </p>
        </div>

        <AdminProjectList projects={projects} />
      </main>
    </div>
  );
}
