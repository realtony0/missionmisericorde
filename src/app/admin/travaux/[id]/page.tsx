import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditProjectForm from "./EditProjectForm";

export default async function AdminEditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const project = await prisma.ongoingProject.findUnique({
    where: { id },
    include: { steps: { orderBy: { order: "asc" } } },
  });
  if (!project) notFound();

  return (
    <div>
      <Link href="/admin/travaux" className="text-primary text-sm hover:underline mb-4 inline-block">
        ← Retour aux travaux
      </Link>
      <h1 className="text-2xl font-bold text-dark mb-6">
        Modifier : {project.number ? `Projet n°${project.number} - ` : ""}
        {project.title}
      </h1>
      <EditProjectForm project={project} />
    </div>
  );
}
