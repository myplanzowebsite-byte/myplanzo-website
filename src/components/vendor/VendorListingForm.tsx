"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VENDOR_CATEGORIES } from "@/lib/mockListings";

export function VendorListingForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE">("DRAFT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category: category || undefined, status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed");
        return;
      }
      setTitle("");
      setDescription("");
      setCategory("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-3 rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]"
    >
      <h2 className="text-sm font-semibold text-mp-charcoal">New listing</h2>
      {error ? (
        <p className="rounded-md border border-mp-accent/20 bg-mp-accent-soft px-3 py-2 text-xs text-mp-accent">{error}</p>
      ) : null}
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={3}
        className="w-full rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
      >
        <option value="" disabled>
          Select category…
        </option>
        {VENDOR_CATEGORIES.map((c) => (
          <option key={c.label} value={c.label}>
            {c.emoji} {c.label}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as "DRAFT" | "ACTIVE")}
        className="rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
      >
        <option value="DRAFT">Draft</option>
        <option value="ACTIVE">Active</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-mp-charcoal px-4 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
      >
        {loading ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
