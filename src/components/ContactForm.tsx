"use client";

import { useState } from "react";

export default function ContactForm({ contactEmail }: { contactEmail: string }) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
    const subject = encodeURIComponent(`Contact Mission Miséricorde — ${name}`);
    const body = encodeURIComponent(
      `${message}\n\n--\n${name}\n${email}`
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-primary/10 p-5 text-center text-sm text-primary sm:p-6 sm:text-base">
        <p>Votre messagerie va s&apos;ouvrir. Envoyez le message pour nous contacter.</p>
        <p className="mt-2 text-xs text-ink/80 sm:text-sm">
          Si rien ne s&apos;ouvre, envoyez un email à{" "}
          <a href={`mailto:${contactEmail}`} className="underline font-medium text-primary">
            {contactEmail}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-dark">
          Nom
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full min-h-[44px] rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-base text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:py-3"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-dark">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full min-h-[44px] rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-base text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:py-3"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-dark">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full min-h-[120px] resize-y rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-base text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:py-3"
        />
      </div>
      <button
        type="submit"
        className="btn-primary w-full text-base"
      >
        Envoyer
      </button>
    </form>
  );
}
