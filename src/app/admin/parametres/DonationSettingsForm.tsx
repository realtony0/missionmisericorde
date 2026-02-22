"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DonationSettingsForm({
  initial,
}: {
  initial: { payment_methods: string; payment_security: string };
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
        <label className="block text-sm font-medium text-dark mb-1">Moyens de paiement (texte)</label>
        <p className="text-xs text-dark/70 mb-2">
          Une ligne par moyen (ex: Wave + Orange Money : +221..., PayPal : email...).
        </p>
        <textarea
          value={form.payment_methods}
          onChange={(e) => setForm((f) => ({ ...f, payment_methods: e.target.value }))}
          rows={3}
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark mb-1">Message de sécurisation</label>
        <textarea
          value={form.payment_security}
          onChange={(e) => setForm((f) => ({ ...f, payment_security: e.target.value }))}
          rows={4}
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
