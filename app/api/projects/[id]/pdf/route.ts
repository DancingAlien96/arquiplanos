import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { cookies } from "next/headers";

function uploadsDir() {
  return path.resolve(process.cwd(), "uploads", "pdfs");
}

async function requireAdmin() {
  const cookieStore = await cookies();
  return !!cookieStore.get("admin_session");
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!await requireAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

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

    if (buffer.subarray(0, 5).toString() !== "%PDF-") {
      return NextResponse.json({ error: "El archivo no es un PDF válido" }, { status: 400 });
    }

    const dir = uploadsDir();
    await mkdir(dir, { recursive: true });

    const filename = `${id}_${Date.now()}.pdf`;
    const dest = path.resolve(dir, filename);

    if (!dest.startsWith(dir + path.sep)) {
      return NextResponse.json({ error: "Ruta inválida" }, { status: 400 });
    }

    await writeFile(dest, buffer);

    await connectDB();
    await Project.findByIdAndUpdate(id, { $push: { pdfPaths: filename } });

    return NextResponse.json({ ok: true, filename });
  } catch (error) {
    console.error("PDF upload error:", error);
    return NextResponse.json({ error: "Error al subir el PDF" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!await requireAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const filename = req.nextUrl.searchParams.get("filename") ?? "";

  // Validar que el filename sea del formato esperado y no contenga path traversal
  if (!filename || !/^[a-f0-9]{24}_\d+\.pdf$/.test(filename)) {
    return NextResponse.json({ error: "Nombre de archivo inválido" }, { status: 400 });
  }

  if (!filename.startsWith(id + "_")) {
    return NextResponse.json({ error: "El archivo no pertenece a este proyecto" }, { status: 400 });
  }

  const dir = uploadsDir();
  const filePath = path.resolve(dir, filename);

  if (!filePath.startsWith(dir + path.sep)) {
    return NextResponse.json({ error: "Ruta inválida" }, { status: 400 });
  }

  try {
    await unlink(filePath).catch(() => {});
    await connectDB();
    await Project.findByIdAndUpdate(id, { $pull: { pdfPaths: filename } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PDF delete error:", error);
    return NextResponse.json({ error: "Error al eliminar el PDF" }, { status: 500 });
  }
}
