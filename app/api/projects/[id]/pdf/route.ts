import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import mongoose from "mongoose";
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

  // Validar que id sea un ObjectId válido antes de usarlo en el filesystem
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Archivo PDF requerido" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Verificar magic bytes PDF (%PDF-) en lugar de confiar en file.type
    if (buffer.slice(0, 5).toString() !== "%PDF-") {
      return NextResponse.json({ error: "El archivo no es un PDF válido" }, { status: 400 });
    }

    const uploadsDir = path.resolve(process.cwd(), "uploads", "pdfs");
    await mkdir(uploadsDir, { recursive: true });

    const filename = `${id}.pdf`;
    const dest = path.resolve(uploadsDir, filename);

    // Prevenir path traversal: dest debe estar dentro de uploadsDir
    if (!dest.startsWith(uploadsDir + path.sep)) {
      return NextResponse.json({ error: "Ruta inválida" }, { status: 400 });
    }

    await writeFile(dest, buffer);

    await connectDB();
    await Project.findByIdAndUpdate(id, { pdfPath: filename });

    return NextResponse.json({ ok: true, filename });
  } catch (error) {
    console.error("PDF upload error:", error);
    return NextResponse.json({ error: "Error al subir el PDF" }, { status: 500 });
  }
}
