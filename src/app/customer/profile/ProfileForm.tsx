"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VENDOR_CATEGORIES } from "@/lib/mockListings";

type Initial = {
  displayName: string;
  photoUrl: string;
  eventType: string;
  location: string;
  budgetRange: string;
  categories: string[];
};

const FIELD =
  "w-full rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2";

export function ProfileForm({
  email,
  phone,
  initial,
}: {
  email: string;
  phone: string;
  initial: Initial;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  function set(key: "displayName" | "photoUrl" | "eventType" | "location" | "budgetRange", value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleCategory(label: string) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(label)
        ? f.categories.filter((c) => c !== label)
        : [...f.categories, label],
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: form.displayName || undefined,
          photoUrl: form.photoUrl,
          preferences: {
            eventType: form.eventType || undefined,
            location: form.location || undefined,
            budgetRange: form.budgetRange || undefined,
            categories: form.categories,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ kind: "err", text: data.error || "Could not save changes." });
        return;
      }
      setMsg({ kind: "ok", text: "Profile saved." });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)]"
    >
      {msg && (
        <p
          className={`rounded-md border px-3 py-2 text-xs ${
            msg.kind === "ok"
              ? "border-green-500/20 bg-green-500/10 text-green-700"
              : "border-mp-accent/20 bg-mp-accent-soft text-mp-accent"
          }`}
        >
          {msg.text}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-medium text-mp-muted">Display name</span>
          <input
            value={form.displayName}
            onChange={(e) => set("displayName", e.target.value)}
            placeholder="Your name"
            className={FIELD}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-mp-muted">Profile photo URL</span>
          <input
            value={form.photoUrl}
            onChange={(e) => set("photoUrl", e.target.value)}
            placeholder="https://…"
            className={FIELD}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-medium text-mp-muted">Email</span>
          <input value={email} disabled className={`${FIELD} opacity-60`} />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-mp-muted">Mobile number</span>
          <input value={phone} disabled className={`${FIELD} opacity-60`} />
        </label>
      </div>
      <p className="text-xs text-mp-text3">
        Email can&apos;t be changed. To update your mobile number, use the Security section below.
      </p>

      <div className="border-t border-mp-border pt-5">
        <p className="text-sm font-semibold text-mp-charcoal mb-3">Event preferences</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-xs font-medium text-mp-muted">Event type</span>
            <input
              value={form.eventType}
              onChange={(e) => set("eventType", e.target.value)}
              placeholder="Birthday"
              className={FIELD}
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-mp-muted">Location</span>
            <input
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Mumbai"
              className={FIELD}
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-mp-muted">Budget range</span>
            <input
              value={form.budgetRange}
              onChange={(e) => set("budgetRange", e.target.value)}
              placeholder="₹10k–₹25k"
              className={FIELD}
            />
          </label>
        </div>
        <div className="mt-4 space-y-2">
          <span className="text-xs font-medium text-mp-muted">Preferred categories</span>
          <div className="flex flex-wrap gap-2">
            {VENDOR_CATEGORIES.map((c) => {
              const on = form.categories.includes(c.label);
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => toggleCategory(c.label)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    on
                      ? "border-mp-charcoal bg-mp-charcoal text-mp-panel"
                      : "border-mp-border bg-mp-card text-mp-charcoal"
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-mp-charcoal px-4 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
      >
        {loading ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
