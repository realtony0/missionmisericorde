"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SocialLinksForm({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initial);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-dark mb-1">Facebook</label>
        <input
          type="url"
          value={form.social_facebook}
          onChange={(e) => setForm((f) => ({ ...f, social_facebook: e.target.value }))}
          placeholder="https://facebook.com/..."
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark mb-1">Instagram</label>
        <input
          type="url"
          value={form.social_instagram}
          onChange={(e) => setForm((f) => ({ ...f, social_instagram: e.target.value }))}
          placeholder="https://instagram.com/..."
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark mb-1">YouTube</label>
        <input
          type="url"
          value={form.social_youtube}
          onChange={(e) => setForm((f) => ({ ...f, social_youtube: e.target.value }))}
          placeholder="https://youtube.com/..."
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark mb-1">TikTok</label>
        <input
          type="url"
          value={form.social_tiktok}
          onChange={(e) => setForm((f) => ({ ...f, social_tiktok: e.target.value }))}
          placeholder="https://tiktok.com/@..."
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
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
