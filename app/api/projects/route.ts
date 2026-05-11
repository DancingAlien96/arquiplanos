import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

// GET /api/projects  →  lista todos los proyectos
export async function GET() {
  await connectDB();
  const projects = await Project.find().sort({ createdAt: -1 }).lean();
  return Response.json(projects);
}

// POST /api/projects  →  crea un proyecto (multipart/form-data)
export async function POST(request: NextRequest) {
  await connectDB();

  const formData = await request.formData();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const price = Number(formData.get("price"));
  const currency = (formData.get("currency") as string) || "USD";
  const featuresRaw = formData.get("features") as string;
  const features = featuresRaw
    ? featuresRaw.split(",").map((f) => f.trim()).filter(Boolean)
    : [];

  if (!name || !description || !category || isNaN(price)) {
    return Response.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  // Guardar imágenes en public/uploads/
  const imageFiles = formData.getAll("images") as File[];
  const imagePaths: string[] = [];

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  for (const file of imageFiles) {
    if (!(file instanceof File) || file.size === 0) continue;

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
    if (!allowed.includes(ext)) continue;

    const filename = `${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);
    imagePaths.push(`/uploads/${filename}`);
  }

  const project = await Project.create({
    name,
    description,
    category,
    price,
    currency,
    features,
    images: imagePaths,
  });

  return Response.json(project, { status: 201 });
}
