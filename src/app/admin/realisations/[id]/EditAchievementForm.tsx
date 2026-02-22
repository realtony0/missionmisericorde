"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Achievement } from "@prisma/client";
import MediaUploader from "@/components/admin/MediaUploader";

const categories = [
  { value: "Puits", label: "Puits" },
  { value: "Mini_forage", label: "Mini-forage" },
  { value: "Internats", label: "Internats" },
  { value: "Mosquees", label: "Mosquées" },
  { value: "Autres", label: "Autres" },
];

function parsePhotos(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  } catch {
    // Ignore malformed JSON and fallback to an empty list.
  }
  return [];
}

export default function EditAchievementForm({ achievement }: { achievement: Achievement }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [form, setForm] = useState({
    name: achievement.name,
    number: achievement.number,
    category: achievement.category,
    location: achievement.location ?? "",
    region: achievement.region ?? "",
    lat: achievement.lat?.toString() ?? "",
    lng: achievement.lng?.toString() ?? "",
    completedAt: achievement.completedAt
      ? new Date(achievement.completedAt).toISOString().slice(0, 10)
      : "",
    note: achievement.note ?? "",
    description: achievement.description ?? "",
    videoUrl: achievement.videoUrl ?? "",
    photos: parsePhotos(achievement.photos),
  });

  const normalizedPhotos = useMemo(
    () =>
      Array.from(
        new Set(form.photos.map((item) => item.trim()).filter(Boolean))
      ),
    [form.photos]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/admin/achievements/${achievement.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        photos: normalizedPhotos,
        lat: form.lat.trim() ? Number(form.lat) : null,
        lng: form.lng.trim() ? Number(form.lng) : null,
        completedAt: form.completedAt ? form.completedAt : null,
      }),
    });
    setSaving(false);
    router.refresh();
  }

  function addPhoto(url: string) {
    const trimmed = url.trim();
    if (!trimmed) return;
    setForm((prev) => ({ ...prev, photos: [...prev.photos, trimmed] }));
    setNewPhotoUrl("");
  }

  function removePhoto(index: number) {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Nom du projet</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Numéro</label>
          <input
            type="number"
            min={1}
            value={form.number}
            onChange={(e) => setForm((f) => ({ ...f, number: Number(e.target.value || 0) }))}
            required
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
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
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Date de fin</label>
          <input
            type="date"
            value={form.completedAt}
            onChange={(e) => setForm((f) => ({ ...f, completedAt: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
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

      <div className="grid sm:grid-cols-2 gap-4">
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
      </div>

      <div>
        <label className="block text-sm font-medium text-dark mb-1">Note</label>
        <input
          type="text"
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={4}
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-dark">Galerie photos</label>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://..."
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            className="flex-1 px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
          <button
            type="button"
            onClick={() => addPhoto(newPhotoUrl)}
            className="px-4 py-2 rounded-lg border border-primary/20 text-dark hover:bg-primary/5"
          >
            Ajouter URL
          </button>
        </div>
        <MediaUploader
          folder="mission-misericorde/achievements"
          resourceType="image"
          accept="image/*"
          label="Uploader une photo"
          onUploaded={(url) => addPhoto(url)}
        />
        <ul className="space-y-2">
          {normalizedPhotos.map((url, index) => (
            <li
              key={`${url}-${index}`}
              className="flex items-center justify-between gap-3 text-sm bg-cream px-3 py-2 rounded border border-primary/10"
            >
              <span className="truncate">{url}</span>
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="text-red-600 hover:underline shrink-0"
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Vidéo (URL)</label>
          <input
            type="url"
            value={form.videoUrl}
            onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
        <MediaUploader
          folder="mission-misericorde/achievements"
          resourceType="video"
          accept="video/*"
          label="Uploader une vidéo"
          onUploaded={(url) => setForm((f) => ({ ...f, videoUrl: url }))}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
