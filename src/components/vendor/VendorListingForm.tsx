"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VENDOR_CATEGORIES } from "@/lib/mockListings";
import { ImageUploader } from "@/components/ImageUploader";

const MAX_PHOTOS = 10;

export function VendorListingForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE">("DRAFT");
  const [photos, setPhotos] = useState<string[]>([]);
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
        body: JSON.stringify({
          title,
          description,
          category: category || undefined,
          status,
          photos,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed");
        return;
      }
      setTitle("");
      setDescription("");
      setCategory("");
      setPhotos([]);
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

      {/* Photos — up to 10 */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-mp-muted">Photos ({photos.length}/{MAX_PHOTOS})</span>
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {photos.map((u) => (
              <div key={u} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="Listing" className="h-20 w-full rounded-md object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotos((p) => p.filter((x) => x !== u))}
                  className="absolute right-1 top-1 rounded bg-mp-charcoal/80 px-1.5 py-0.5 text-[10px] text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        {photos.length < MAX_PHOTOS && (
          <ImageUploader
            label="Add photo"
            onUploaded={(u) => setPhotos((p) => (p.length < MAX_PHOTOS ? [...p, u] : p))}
          />
        )}
      </div>

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
