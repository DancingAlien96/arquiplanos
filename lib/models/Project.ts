import mongoose, { Schema, model, models } from "mongoose";

export interface IProject {
  _id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  features: string[];
  coverImage: string;   // imagen de portada (base64 data URL)
  images: string[];     // imágenes del carrusel (base64 data URLs)
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
  },
  { timestamps: true }
);

const Project = models.Project ?? model<IProject>("Project", ProjectSchema);

export default Project;
