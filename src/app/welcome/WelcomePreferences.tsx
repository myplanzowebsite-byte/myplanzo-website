"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VENDOR_CATEGORIES, EVENT_TYPES, LOCATIONS } from "@/lib/mockListings";

const BUDGET_MIN = 5000;
const BUDGET_MAX = 500000;

const FIELD =
  "w-full rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2";

export function WelcomePreferences() {
  const router = useRouter();
  const [form, setForm] = useState({ eventType: "", location: "", budgetRange: "" });
  const [budgetMax, setBudgetMax] = useState<number>(50000);
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
            budgetRange: `Up to ₹${budgetMax.toLocaleString("en-IN")}`,
            categories: categories.length ? categories : undefined,
          },
        }),
      });
      const params = new URLSearchParams();
      if (form.eventType) params.set("event", form.eventType);
      if (form.location) params.set("location", form.location);
      if (budgetMax > 0) params.set("maxBudget", String(budgetMax));
      // First selected category becomes the category chip; multiple categories
      // collapse to a single filter so the URL stays clean.
      if (categories.length === 1) params.set("category", categories[0]);
      const qs = params.toString();
      router.push(qs ? `/browse?${qs}` : "/browse");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1">
          <span className="text-xs font-medium text-mp-muted">Event type</span>
          <select
            value={form.eventType}
            onChange={(e) => set("eventType", e.target.value)}
            className={FIELD}
          >
            <option value="">Select event type…</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-mp-muted">Location</span>
          <select
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            className={FIELD}
          >
            <option value="">Select location…</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-mp-muted">
            Budget · up to ₹{budgetMax.toLocaleString("en-IN")}
          </span>
          <input
            type="range"
            min={BUDGET_MIN}
            max={BUDGET_MAX}
            step={1000}
            value={budgetMax}
            onChange={(e) => setBudgetMax(Number(e.target.value))}
            className="w-full accent-mp-accent"
          />
          <div className="flex justify-between text-[10px] text-mp-text3">
            <span>₹{(BUDGET_MIN / 1000).toFixed(0)}k</span>
            <span>₹{(BUDGET_MAX / 1000).toFixed(0)}k+</span>
          </div>
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
