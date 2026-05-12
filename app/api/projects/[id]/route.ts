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

// PUT /api/projects/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  await connectDB();

  const project = await Project.findById(id);
  if (!project) return Response.json({ error: "No encontrado" }, { status: 404 });

  const body = await req.json();
  const { name, description, category, price, currency, features, coverImage, images } = body;

  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;
  if (category !== undefined) project.category = category;
  if (price !== undefined) project.price = Number(price);
  if (currency !== undefined) project.currency = currency;
  if (features !== undefined)
    project.features = typeof features === "string"
      ? features.split(",").map((f: string) => f.trim()).filter(Boolean)
      : features;
  if (coverImage !== undefined) project.coverImage = coverImage;
  if (images !== undefined) project.images = images;

  await project.save();
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
