"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EVENT_TYPES, LOCATIONS } from "@/lib/mockListings";
import type { VendorCategoryOption } from "@/lib/vendorCategories";
import { ImageUploader } from "@/components/ImageUploader";

const MAX_PHOTOS = 10;
const MIN_PHOTOS = 5;

const PRICING_UNITS = [
  { value: "per_event", label: "per event" },
  { value: "per_plate", label: "per plate" },
  { value: "per_day", label: "per day" },
  { value: "per_hour", label: "per hour" },
] as const;

const FIELD =
  "w-full rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2";

export function VendorListingForm({
  vendorCategories,
}: {
  vendorCategories: VendorCategoryOption[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE">("DRAFT");
  const [photos, setPhotos] = useState<string[]>([]);
  const [basePrice, setBasePrice] = useState<string>("");
  const [priceUnit, setPriceUnit] = useState<string>("per_event");
  const [location, setLocation] = useState<string>("");
  const [events, setEvents] = useState<string[]>([]);
  const [minGuests, setMinGuests] = useState<string>("");
  const [maxGuests, setMaxGuests] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showGuestRange = category === "Caterers" || category === "Venues";

  function toggleEvent(t: string) {
    setEvents((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (photos.length < MIN_PHOTOS) {
      setError(`Please add at least ${MIN_PHOTOS} photos so customers can see your work.`);
      return;
    }
    setLoading(true);
    try {
      const priceNum = basePrice.trim() ? Number(basePrice) : undefined;
      const unitLabel = PRICING_UNITS.find((u) => u.value === priceUnit)?.label ?? "";
      const guestLine = showGuestRange && (minGuests || maxGuests)
        ? `\nGuest range: ${minGuests || "?"} – ${maxGuests || "?"}`
        : "";
      const enrichedDescription = `${description.trim()}${
        priceNum ? `\n\nBase price: ₹${priceNum.toLocaleString("en-IN")} ${unitLabel}` : ""
      }${guestLine}`;

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: enrichedDescription,
          category: category || undefined,
          status,
          photos,
          priceMin: priceNum,
          eventTags: events,
          location: location || undefined,
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
      setBasePrice("");
      setPriceUnit("per_event");
      setLocation("");
      setEvents([]);
      setMinGuests("");
      setMaxGuests("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]"
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
        className={FIELD}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={3}
        className={FIELD}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-medium text-mp-muted">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={FIELD}
          >
            <option value="" disabled>Select category…</option>
            {vendorCategories.map((c) => (
              <option key={c.id} value={c.title}>
                {c.emoji} {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-mp-muted">Location / service area</span>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={FIELD}
          >
            <option value="">Select…</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Pricing */}
      <div className="space-y-1">
        <span className="text-xs font-medium text-mp-muted">Pricing</span>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-mp-muted">₹</span>
            <input
              type="number"
              min={0}
              placeholder="Base price"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className={`${FIELD} pl-6`}
            />
          </div>
          <select
            value={priceUnit}
            onChange={(e) => setPriceUnit(e.target.value)}
            className={FIELD}
          >
            {PRICING_UNITS.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Events (multi-select) */}
      <div className="space-y-1">
        <span className="text-xs font-medium text-mp-muted">Events you serve (multi-select)</span>
        <div className="flex flex-wrap gap-1.5">
          {EVENT_TYPES.map((t) => {
            const on = events.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleEvent(t)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
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

      {/* Guest range for caterers / venues */}
      {showGuestRange && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-medium text-mp-muted">Min guests</span>
            <input
              type="number"
              min={0}
              value={minGuests}
              onChange={(e) => setMinGuests(e.target.value)}
              className={FIELD}
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-mp-muted">Max guests</span>
            <input
              type="number"
              min={0}
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              className={FIELD}
            />
          </label>
        </div>
      )}

      {/* Photos — minimum 5, up to 10 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-mp-muted">
            Photos ({photos.length}/{MAX_PHOTOS})
          </span>
          <span
            className={`text-[11px] font-medium ${
              photos.length >= MIN_PHOTOS ? "text-green-700" : "text-mp-accent"
            }`}
          >
            {photos.length >= MIN_PHOTOS
              ? `✓ Minimum ${MIN_PHOTOS} reached`
              : `Add ${MIN_PHOTOS - photos.length} more (min ${MIN_PHOTOS})`}
          </span>
        </div>
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
