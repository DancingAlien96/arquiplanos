import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await connectDB();
  const project = await Project.findById(id).lean();
  if (!project) return Response.json({ error: "No encontrado" }, { status: 404 });
  return Response.json(project);
}

// DELETE /api/projects/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await connectDB();

  const project = await Project.findById(id);
  if (!project) return Response.json({ error: "No encontrado" }, { status: 404 });

  // Las imágenes están almacenadas como base64 en MongoDB, no hay archivos que borrar
  await project.deleteOne();
  return Response.json({ success: true });
}
