"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactFormSettings({ initialEmail }: { initialEmail: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState(initialEmail);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact_email: email }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-dark mb-1">Email affiché sur la page Contact</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="contact@exemple.org"
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
