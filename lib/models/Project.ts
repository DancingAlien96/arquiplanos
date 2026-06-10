import { Schema, model, models } from "mongoose";

export interface IProject {
  _id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  features: string[];
  coverImage: string;
  images: string[];
  pdfPath?: string;    // legacy — un solo PDF
  pdfPaths?: string[]; // múltiples PDFs en uploads/pdfs/
  createdAt?: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    features: { type: [String], default: [] },
    coverImage: { type: String, default: "" },
    images: { type: [String], default: [] },
    pdfPath: { type: String, default: "" },
    pdfPaths: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Project = models.Project ?? model<IProject>("Project", ProjectSchema);

export default Project;
