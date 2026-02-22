"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  { value: "Puits", label: "Puits" },
  { value: "Mini_forage", label: "Mini-forage" },
  { value: "Internats", label: "Internats" },
  { value: "Mosquees", label: "Mosquées" },
  { value: "Autres", label: "Autres" },
];

export default function NewProjectForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    number: "",
    title: "",
    category: "Puits",
    location: "",
    region: "",
    lat: "",
    lng: "",
    startDate: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    progress: 0,
    status: "En cours",
    inaugurationVideoUrl: "",
    archiveToAchievements: true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      number: form.number.trim() ? Number(form.number) : null,
      lat: form.lat.trim() ? Number(form.lat) : null,
      lng: form.lng.trim() ? Number(form.lng) : null,
      targetAmount: form.targetAmount.trim() ? Number(form.targetAmount) : null,
      currentAmount: form.currentAmount.trim() ? Number(form.currentAmount) : 0,
      startDate: form.startDate || null,
    };

    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data?.error ?? "Impossible de créer le projet.");
      return;
    }

    if (data.id) router.push(`/admin/travaux/${data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Numéro du projet</label>
          <input
            type="number"
            min={1}
            placeholder="29"
            value={form.number}
            onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Catégorie</label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

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

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Localisation (texte)</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Région</label>
          <input
            type="text"
            value={form.region}
            onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            value={form.lat}
            onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Longitude</label>
          <input
            type="number"
            step="any"
            value={form.lng}
            onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Date de début</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={3}
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Objectif financier (FCFA)</label>
          <input
            type="number"
            min={0}
            value={form.targetAmount}
            onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Montant actuel (FCFA)</label>
          <input
            type="number"
            min={0}
            value={form.currentAmount}
            onChange={(e) => setForm((f) => ({ ...f, currentAmount: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Progression (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.progress}
            onChange={(e) => setForm((f) => ({ ...f, progress: Number(e.target.value) }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Statut</label>
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          >
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Vidéo inauguration (URL)</label>
          <input
            type="url"
            value={form.inaugurationVideoUrl}
            onChange={(e) => setForm((f) => ({ ...f, inaugurationVideoUrl: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-dark">
        <input
          type="checkbox"
          checked={form.archiveToAchievements}
          onChange={(e) => setForm((f) => ({ ...f, archiveToAchievements: e.target.checked }))}
          className="rounded border-primary/30"
        />
        Archiver automatiquement dans Réalisations quand le projet est terminé
      </label>

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
