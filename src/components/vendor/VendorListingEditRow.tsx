"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EVENT_TYPES, LOCATIONS } from "@/lib/mockListings";
import type { VendorCategoryOption } from "@/lib/vendorCategories";
import { ImageUploader } from "@/components/ImageUploader";

const MAX_PHOTOS = 10;
const MIN_PHOTOS = 5;

const FIELD =
  "w-full rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2";

type Listing = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  location: string | null;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  photos: string[];
  priceMin: number | null;
  priceMax: number | null;
  eventTags: string[];
};

export function VendorListingEditRow({
  listing,
  vendorCategories,
}: {
  listing: Listing;
  vendorCategories: VendorCategoryOption[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: listing.title,
    description: listing.description,
    category: listing.category ?? "",
    location: listing.location ?? "",
    status: listing.status,
    photos: listing.photos,
    priceMin: listing.priceMin ? String(listing.priceMin) : "",
    eventTags: listing.eventTags,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function toggleEvent(t: string) {
    setForm((f) => ({
      ...f,
      eventTags: f.eventTags.includes(t)
        ? f.eventTags.filter((x) => x !== t)
        : [...f.eventTags, t],
    }));
  }

  async function save() {
    setErr(null);
    if (form.status === "ACTIVE" && form.photos.length < MIN_PHOTOS) {
      setErr(
        `Active listings need at least ${MIN_PHOTOS} photos. Add ${
          MIN_PHOTOS - form.photos.length
        } more or move to draft.`,
      );
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category || null,
          location: form.location || null,
          status: form.status,
          photos: form.photos,
          priceMin: form.priceMin ? Number(form.priceMin) : null,
          eventTags: form.eventTags,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Could not save.");
        return;
      }
      setEditing(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function setStatusOnly(status: "DRAFT" | "ACTIVE" | "ARCHIVED") {
    if (status === "ACTIVE" && listing.photos.length < MIN_PHOTOS) {
      setErr(
        `Add at least ${MIN_PHOTOS} photos before publishing this listing (${
          MIN_PHOTOS - listing.photos.length
        } more needed).`,
      );
      setEditing(true);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function archive() {
    await setStatusOnly("ARCHIVED");
  }

  const statusPill =
    listing.status === "ACTIVE"
      ? "bg-green-500/10 text-green-700 border-green-500/20"
      : listing.status === "DRAFT"
        ? "bg-mp-warm text-mp-charcoal border-mp-border"
        : "bg-mp-panel text-mp-muted border-mp-border";

  if (!editing) {
    return (
      <li className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {listing.photos[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={listing.photos[0]}
                alt={listing.title}
                className="h-16 w-16 rounded-md object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-md border border-mp-border bg-mp-panel text-xs text-mp-muted">
                No photo
              </div>
            )}
            <div>
              <p className="font-medium text-mp-charcoal">{listing.title}</p>
              <p className="mt-0.5 text-xs text-mp-muted">
                {listing.category ?? "Uncategorised"}
                {listing.location ? ` · ${listing.location}` : ""}
                {listing.priceMin ? ` · from ₹${listing.priceMin.toLocaleString("en-IN")}` : ""}
              </p>
              <span
                className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusPill}`}
              >
                {listing.status}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={() => setEditing(true)}
              className="rounded-md border border-mp-border px-3 py-1 text-xs text-mp-charcoal hover:border-mp-accent hover:bg-mp-warm"
            >
              Edit
            </button>
            {listing.status !== "ARCHIVED" && (
              <button
                onClick={() =>
                  setStatusOnly(listing.status === "ACTIVE" ? "DRAFT" : "ACTIVE")
                }
                disabled={busy}
                className="rounded-md border border-mp-border px-3 py-1 text-xs text-mp-charcoal hover:border-mp-accent hover:bg-mp-warm disabled:opacity-60"
              >
                {listing.status === "ACTIVE" ? "Move to draft" : "Publish"}
              </button>
            )}
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="space-y-3 rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]">
      {err && (
        <p className="rounded-md border border-mp-accent/20 bg-mp-accent-soft px-3 py-2 text-xs text-mp-accent">
          {err}
        </p>
      )}

      <input
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        placeholder="Title"
        className={FIELD}
      />
      <textarea
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        rows={3}
        placeholder="Description"
        className={FIELD}
      />

      <div className="grid gap-2 sm:grid-cols-2">
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className={FIELD}
        >
          <option value="">Category…</option>
          {vendorCategories.map((c) => (
            <option key={c.id} value={c.title}>
              {c.emoji} {c.title}
            </option>
          ))}
        </select>
        <select
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          className={FIELD}
        >
          <option value="">Location…</option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-mp-muted">₹</span>
        <input
          type="number"
          min={0}
          value={form.priceMin}
          onChange={(e) => setForm((f) => ({ ...f, priceMin: e.target.value }))}
          placeholder="Base price"
          className={`${FIELD} pl-6`}
        />
      </div>

      <div className="space-y-1">
        <span className="text-xs font-medium text-mp-muted">Events</span>
        <div className="flex flex-wrap gap-1.5">
          {EVENT_TYPES.map((t) => {
            const on = form.eventTags.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleEvent(t)}
                className={`rounded-full border px-2.5 py-0.5 text-xs transition ${
                  on
                    ? "border-mp-charcoal bg-mp-charcoal text-mp-panel"
                    : "border-mp-border bg-mp-card text-mp-charcoal hover:border-mp-accent/40"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-mp-muted">
            Photos ({form.photos.length}/{MAX_PHOTOS})
          </span>
          <span
            className={`text-[11px] font-medium ${
              form.photos.length >= MIN_PHOTOS ? "text-green-700" : "text-mp-accent"
            }`}
          >
            {form.photos.length >= MIN_PHOTOS
              ? `✓ Minimum ${MIN_PHOTOS} reached`
              : `Need ${MIN_PHOTOS - form.photos.length} more to publish`}
          </span>
        </div>
        {form.photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {form.photos.map((u) => (
              <div key={u} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="Listing" className="h-20 w-full rounded-md object-cover" />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, photos: f.photos.filter((x) => x !== u) }))}
                  className="absolute right-1 top-1 rounded bg-mp-charcoal/80 px-1.5 py-0.5 text-[10px] text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        {form.photos.length < MAX_PHOTOS && (
          <ImageUploader
            label="Add photo"
            onUploaded={(u) =>
              setForm((f) => (f.photos.length < MAX_PHOTOS ? { ...f, photos: [...f.photos, u] } : f))
            }
          />
        )}
      </div>

      <select
        value={form.status}
        onChange={(e) =>
          setForm((f) => ({ ...f, status: e.target.value as "DRAFT" | "ACTIVE" | "ARCHIVED" }))
        }
        className={FIELD}
      >
        <option value="DRAFT">Draft (hidden)</option>
        <option value="ACTIVE">Active (visible)</option>
        <option value="ARCHIVED">Archived</option>
      </select>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={save}
          disabled={busy}
          className="rounded-md bg-mp-charcoal px-4 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
        <button
          onClick={() => setEditing(false)}
          className="rounded-md border border-mp-border px-4 py-2 text-sm text-mp-charcoal hover:bg-mp-warm"
        >
          Cancel
        </button>
        <div className="ml-auto">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="rounded-md border border-mp-accent/40 px-3 py-2 text-xs text-mp-accent hover:bg-mp-accent-soft"
            >
              Archive listing
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-mp-muted">Archive this listing?</span>
              <button
                onClick={archive}
                disabled={busy}
                className="rounded-md bg-mp-accent px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-60"
              >
                Yes, archive
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-mp-muted underline"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
