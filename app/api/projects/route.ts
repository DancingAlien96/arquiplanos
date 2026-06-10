import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";

// GET /api/projects
export async function GET() {
  await connectDB();
  const projects = await Project.find().sort({ createdAt: -1 }).lean();
  return Response.json(projects);
}

// POST /api/projects  →  recibe JSON con imágenes en base64
export async function POST(request: NextRequest) {
  await connectDB();

  let body: {
    name?: string;
    description?: string;
    category?: string;
    price?: number;
    currency?: string;
    features?: string;
    floors?: string;
    bedrooms?: string;
    size?: string;
    coverImage?: string;
    images?: string[];
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const { name, description, category, price, currency, features, floors, bedrooms, size, coverImage, images } = body;

  if (!name?.trim() || !description?.trim() || !category?.trim() || price == null || isNaN(price)) {
    return Response.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const featuresList = features
    ? features.split(",").map((f) => f.trim()).filter(Boolean)
    : [];

  const project = await Project.create({
    name: name.trim(),
    description: description.trim(),
    category: category.trim(),
    price,
    currency: currency ?? "USD",
    features: featuresList,
    floors: floors ?? "",
    bedrooms: bedrooms ?? "",
    size: size ?? "",
    coverImage: coverImage ?? "",
    images: images ?? [],
  });

  return Response.json(project, { status: 201 });
}
