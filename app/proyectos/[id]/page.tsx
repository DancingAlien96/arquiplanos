import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import ProjectDetailClient from "./ProjectDetailClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;

  await connectDB();
  const doc = await Project.findById(id).lean();
  if (!doc) notFound();

  const project = JSON.parse(JSON.stringify(doc));

  return <ProjectDetailClient project={project} />;
}
