"use client";

import { useState } from "react";

const FIELD =
  "w-full rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not send your message.");
        return;
      }
      setDone(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="rounded-md border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700">
        Thanks — we&apos;ve received your message and will get back to you by email.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {error && (
        <p className="rounded-md border border-mp-accent/20 bg-mp-accent-soft px-3 py-2 text-xs text-mp-accent">
          {error}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Your name"
          required
          className={FIELD}
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="Your email"
          required
          className={FIELD}
        />
      </div>
      <input
        value={form.subject}
        onChange={(e) => set("subject", e.target.value)}
        placeholder="Subject"
        required
        className={FIELD}
      />
      <textarea
        value={form.message}
        onChange={(e) => set("message", e.target.value)}
        placeholder="How can we help?"
        rows={4}
        required
        className={FIELD}
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-md bg-mp-charcoal px-4 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
