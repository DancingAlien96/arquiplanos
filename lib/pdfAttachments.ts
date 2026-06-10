import { readFile } from "fs/promises";
import path from "path";

interface ProjectPdfFields {
  name: string;
  pdfPath?: string;
  pdfPaths?: string[];
}

export interface PdfAttachment {
  filename: string;
  content: Buffer;
}

export async function getPdfAttachments(project: ProjectPdfFields): Promise<PdfAttachment[]> {
  const uploadsDir = path.resolve(process.cwd(), "uploads", "pdfs");

  // Combina pdfPaths (nuevo) con pdfPath legacy si no está ya incluido
  const filenames = [
    ...(project.pdfPaths ?? []),
    ...(project.pdfPath && !project.pdfPaths?.includes(project.pdfPath)
      ? [project.pdfPath]
      : []),
  ].filter(Boolean);

  const attachments: PdfAttachment[] = [];

  for (let i = 0; i < filenames.length; i++) {
    const filename = filenames[i];
    const filePath = path.resolve(uploadsDir, filename);

    if (!filePath.startsWith(uploadsDir + path.sep)) continue;

    const buffer = await readFile(filePath).catch(() => null);
    if (!buffer || buffer.subarray(0, 5).toString() !== "%PDF-") continue;

    const label = filenames.length > 1
      ? `${project.name.replace(/\s+/g, "_")}_planos_${i + 1}.pdf`
      : `${project.name.replace(/\s+/g, "_")}_planos.pdf`;

    attachments.push({ filename: label, content: buffer });
  }

  return attachments;
}
