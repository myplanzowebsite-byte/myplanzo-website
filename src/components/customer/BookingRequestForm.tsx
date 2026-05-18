"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BookingRequestForm({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [eventDetails, setEventDetails] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          eventDetails,
          eventDate: eventDate
            ? new Date(`${eventDate}T00:00:00.000Z`).toISOString()
            : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed");
        return;
      }
      router.push(`/customer/bookings/${data.booking.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 border-t border-mp-border pt-4">
      <h2 className="text-sm font-semibold text-mp-charcoal">Request booking</h2>
      <p className="text-xs text-mp-muted">
        Tell the vendor what you need. They&apos;ll reply with a quote you can accept and pay.
      </p>
      {error ? (
        <p className="rounded-md border border-mp-accent/20 bg-mp-accent-soft px-3 py-2 text-sm text-mp-accent">{error}</p>
      ) : null}
      <div>
        <label className="text-xs font-medium text-mp-muted">Event date</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="mt-1 w-full rounded-md border border-mp-border bg-mp-card px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-mp-muted">Event details</label>
        <textarea
          required
          value={eventDetails}
          onChange={(e) => setEventDetails(e.target.value)}
          className="mt-1 w-full rounded-md border border-mp-border bg-mp-card px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
          rows={3}
          placeholder="Guest count, what you're looking for…"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-mp-charcoal px-4 py-2 text-sm font-medium text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
