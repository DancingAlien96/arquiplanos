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
  floors?: string;     // "1 piso" | "2 pisos" | "3+ pisos"
  bedrooms?: string;   // "1" | "2" | "3" | "4+"
  size?: string;       // "Pequeño" | "Mediano" | "Grande" | "Muy grande"
  pdfPath?: string;
  pdfPaths?: string[];
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
    floors: { type: String, default: "" },
    bedrooms: { type: String, default: "" },
    size: { type: String, default: "" },
    pdfPath: { type: String, default: "" },
    pdfPaths: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Project = models.Project ?? model<IProject>("Project", ProjectSchema);

export default Project;
