"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProjectOption = { id: string; number: number | null; title: string };

export default function NewCampaignForm({ projects }: { projects: ProjectOption[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetAmount: 0,
    type: "cagnotte",
    projectId: "",
    isActive: true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        projectId: form.projectId || null,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data?.error ?? "Impossible de créer la cagnotte.");
      return;
    }

    if (data.id) router.push("/admin/dons");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-dark mb-1">Titre</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={2}
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark mb-1">Objectif (FCFA)</label>
        <input
          type="number"
          min={0}
          value={form.targetAmount}
          onChange={(e) => setForm((f) => ({ ...f, targetAmount: Number(e.target.value) }))}
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark mb-1">Type</label>
        <select
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value, projectId: e.target.value === "libre" ? "" : f.projectId }))}
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        >
          <option value="cagnotte">Cagnotte</option>
          <option value="libre">Don libre</option>
        </select>
      </div>
      {form.type === "cagnotte" && (
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Projet lié (optionnel)</label>
          <select
            value={form.projectId}
            onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          >
            <option value="">Aucun projet spécifique</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.number ? `Projet n°${project.number} - ` : ""}
                {project.title}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={form.isActive}
          onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
          className="rounded border-primary/20"
        />
        <label htmlFor="isActive" className="text-sm text-dark">
          Active
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? "Création..." : "Créer"}
      </button>
    </form>
  );
}
