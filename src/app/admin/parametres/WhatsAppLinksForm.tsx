"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WhatsAppLinksForm({
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
        <label className="block text-sm font-medium text-dark mb-1">Contact principal (lien WhatsApp)</label>
        <input
          type="url"
          value={form.whatsapp_main}
          onChange={(e) => setForm((f) => ({ ...f, whatsapp_main: e.target.value }))}
          placeholder="https://wa.me/221786347307"
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark mb-1">Chaîne WhatsApp</label>
        <input
          type="url"
          value={form.whatsapp_group_1}
          onChange={(e) => setForm((f) => ({ ...f, whatsapp_group_1: e.target.value }))}
          placeholder="https://whatsapp.com/channel/0029Vb5KlXaEgGfRrY7rpp3P"
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark mb-1">Groupe WhatsApp 2</label>
        <input
          type="url"
          value={form.whatsapp_group_2}
          onChange={(e) => setForm((f) => ({ ...f, whatsapp_group_2: e.target.value }))}
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark mb-1">Groupe WhatsApp 3</label>
        <input
          type="url"
          value={form.whatsapp_group_3}
          onChange={(e) => setForm((f) => ({ ...f, whatsapp_group_3: e.target.value }))}
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
