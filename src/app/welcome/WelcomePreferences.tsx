"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VENDOR_CATEGORIES } from "@/lib/mockListings";

const FIELD =
  "w-full rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2";

export function WelcomePreferences() {
  const router = useRouter();
  const [form, setForm] = useState({ eventType: "", location: "", budgetRange: "" });
  const [categories, setCategories] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleCategory(label: string) {
    setCategories((c) =>
      c.includes(label) ? c.filter((x) => x !== label) : [...c, label],
    );
  }

  async function save() {
    setBusy(true);
    try {
      await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: {
            eventType: form.eventType || undefined,
            location: form.location || undefined,
            budgetRange: form.budgetRange || undefined,
            categories: categories.length ? categories : undefined,
          },
        }),
      });
      router.push("/browse");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
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

      <div className="space-y-2">
        <span className="text-xs font-medium text-mp-muted">Preferred categories</span>
        <div className="flex flex-wrap gap-2">
          {VENDOR_CATEGORIES.map((c) => {
            const on = categories.includes(c.label);
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

      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={busy}
          className="rounded-md bg-mp-charcoal px-4 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save & start browsing"}
        </button>
        <button
          onClick={() => router.push("/browse")}
          className="rounded-md border border-mp-border px-4 py-2 text-sm text-mp-charcoal hover:bg-mp-warm"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
