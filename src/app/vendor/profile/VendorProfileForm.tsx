"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/ImageUploader";
import { VENDOR_CATEGORIES } from "@/lib/mockListings";

type Initial = {
  businessName: string;
  description: string;
  location: string;
  photoUrl: string;
  coverImageUrl: string;
  categories: string[];
  contactPreference: string;
  portfolioUrls: string[];
};

const FIELD =
  "w-full rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2";

const CONTACT_OPTIONS = ["Chat only", "Chat & calls"];

export function VendorProfileForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <section className="space-y-4 rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            {form.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.photoUrl}
                alt={form.businessName}
                className="size-16 rounded-full border border-mp-border object-cover"
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full border border-mp-border bg-mp-panel text-xl text-mp-muted">
                {form.businessName.slice(0, 1).toUpperCase() || "B"}
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-mp-charcoal">{form.businessName}</h2>
              <p className="text-xs text-mp-muted">{form.location || "Location not set"}</p>
            </div>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="rounded-md border border-mp-border px-3 py-1.5 text-sm text-mp-charcoal hover:border-mp-accent hover:bg-mp-warm"
          >
            Edit profile
          </button>
        </div>

        {form.description && (
          <p className="whitespace-pre-line text-sm text-mp-charcoal">{form.description}</p>
        )}

        {form.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {form.categories.map((c) => (
              <span
                key={c}
                className="rounded-full border border-mp-border bg-mp-panel px-2.5 py-0.5 text-xs text-mp-charcoal"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {form.contactPreference && (
          <p className="text-xs text-mp-muted">Contact preference: {form.contactPreference}</p>
        )}

        {form.portfolioUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {form.portfolioUrls.slice(0, 5).map((u) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={u} src={u} alt="Portfolio" className="h-20 w-full rounded-md object-cover" />
            ))}
          </div>
        )}
      </section>
    );
  }

  function set<K extends keyof Initial>(key: K, value: Initial[K]) {
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
    setBusy(true);
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: form.businessName,
          description: form.description || undefined,
          location: form.location || undefined,
          photoUrl: form.photoUrl || null,
          coverImageUrl: form.coverImageUrl || null,
          categories: form.categories,
          contactPreference: form.contactPreference || null,
          portfolioUrls: form.portfolioUrls,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ kind: "err", text: data.error || "Could not save." });
        return;
      }
      setMsg({ kind: "ok", text: "Profile saved." });
      setEditing(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-6 rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)]"
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

      {/* Cover + logo */}
      <div className="space-y-3">
        <span className="text-xs font-medium text-mp-muted">Cover image</span>
        {form.coverImageUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.coverImageUrl}
              alt="Cover"
              className="h-36 w-full rounded-md object-cover"
            />
            <button
              type="button"
              onClick={() => set("coverImageUrl", "")}
              className="absolute right-2 top-2 rounded-md bg-mp-charcoal/80 px-2 py-1 text-[10px] text-white"
            >
              Remove
            </button>
          </div>
        ) : (
          <ImageUploader label="Upload cover" onUploaded={(u) => set("coverImageUrl", u)} />
        )}

        <span className="text-xs font-medium text-mp-muted">Profile photo / logo</span>
        <div className="flex items-center gap-3">
          {form.photoUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.photoUrl}
                alt="Logo"
                className="h-16 w-16 rounded-full object-cover"
              />
              <button
                type="button"
                onClick={() => set("photoUrl", "")}
                className="text-xs text-mp-muted underline"
              >
                Remove
              </button>
            </>
          ) : (
            <ImageUploader label="Upload photo" onUploaded={(u) => set("photoUrl", u)} />
          )}
        </div>
      </div>

      {/* Business fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-medium text-mp-muted">Business name</span>
          <input
            value={form.businessName}
            onChange={(e) => set("businessName", e.target.value)}
            required
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
      </div>

      <label className="block space-y-1">
        <span className="text-xs font-medium text-mp-muted">About your business</span>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={4}
          className={FIELD}
        />
      </label>

      <div className="space-y-2">
        <span className="text-xs font-medium text-mp-muted">Categories</span>
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

      <label className="block space-y-1">
        <span className="text-xs font-medium text-mp-muted">Contact preference</span>
        <select
          value={form.contactPreference}
          onChange={(e) => set("contactPreference", e.target.value)}
          className={FIELD}
        >
          <option value="">Not set</option>
          {CONTACT_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>

      {/* Portfolio gallery */}
      <div className="space-y-2 border-t border-mp-border pt-4">
        <span className="text-xs font-medium text-mp-muted">
          Portfolio gallery ({form.portfolioUrls.length})
        </span>
        {form.portfolioUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {form.portfolioUrls.map((u) => (
              <div key={u} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="Portfolio" className="h-24 w-full rounded-md object-cover" />
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "portfolioUrls",
                      form.portfolioUrls.filter((x) => x !== u),
                    )
                  }
                  className="absolute right-1 top-1 rounded bg-mp-charcoal/80 px-1.5 py-0.5 text-[10px] text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        {form.portfolioUrls.length < 24 && (
          <ImageUploader
            label="Add portfolio photo"
            onUploaded={(u) => set("portfolioUrls", [...form.portfolioUrls, u])}
          />
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-mp-charcoal px-4 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save profile"}
        </button>
        <button
          type="button"
          onClick={() => {
            setForm(initial);
            setEditing(false);
          }}
          className="rounded-md border border-mp-border px-4 py-2 text-sm text-mp-charcoal hover:bg-mp-warm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
