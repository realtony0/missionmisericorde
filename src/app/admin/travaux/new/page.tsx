import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import NewProjectForm from "./NewProjectForm";

export default async function AdminNewProjectPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div>
      <Link href="/admin/travaux" className="text-primary text-sm hover:underline mb-4 inline-block">
        ← Retour aux travaux
      </Link>
      <h1 className="text-2xl font-bold text-dark mb-6">Nouveau projet</h1>
      <NewProjectForm />
    </div>
  );
}
