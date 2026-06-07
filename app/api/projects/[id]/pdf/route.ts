import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Verificar sesión admin
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Archivo PDF requerido" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), "uploads", "pdfs");

    await mkdir(uploadsDir, { recursive: true });

    const filename = `${id}.pdf`;
    await writeFile(path.join(uploadsDir, filename), buffer);

    await connectDB();
    await Project.findByIdAndUpdate(id, { pdfPath: filename });

    return NextResponse.json({ ok: true, filename });
  } catch (error) {
    console.error("PDF upload error:", error);
    return NextResponse.json({ error: "Error al subir el PDF" }, { status: 500 });
  }
}
