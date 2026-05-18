"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type BookingRow = { id: string; label: string; status: string };

export function EventBookings({
  eventId,
  linked,
  unlinked,
}: {
  eventId: string;
  linked: BookingRow[];
  unlinked: BookingRow[];
}) {
  const router = useRouter();
  const [pick, setPick] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function setEvent(bookingId: string, value: string | null) {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/event`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not update booking.");
        return;
      }
      setPick("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-md border border-mp-accent/20 bg-mp-accent-soft px-3 py-2 text-xs text-mp-accent">
          {error}
        </p>
      )}

      <ul className="space-y-2">
        {linked.map((b) => (
          <li
            key={b.id}
            className="flex items-center justify-between gap-3 rounded-md border border-mp-border bg-mp-panel px-4 py-3"
          >
            <Link href={`/customer/bookings/${b.id}`} className="flex-1 text-sm">
              <span className="font-medium text-mp-charcoal">{b.label}</span>
              <span className="ml-2 text-xs text-mp-muted">{b.status}</span>
            </Link>
            <button
              onClick={() => setEvent(b.id, null)}
              disabled={busy}
              className="text-xs text-mp-muted underline hover:text-mp-accent disabled:opacity-60"
            >
              Remove
            </button>
          </li>
        ))}
        {linked.length === 0 && (
          <p className="text-sm text-mp-muted">No bookings linked to this event yet.</p>
        )}
      </ul>

      {unlinked.length > 0 && (
        <div className="flex gap-2 border-t border-mp-border pt-4">
          <select
            value={pick}
            onChange={(e) => setPick(e.target.value)}
            className="flex-1 rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
          >
            <option value="">Link an existing booking…</option>
            {unlinked.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label} ({b.status})
              </option>
            ))}
          </select>
          <button
            onClick={() => pick && setEvent(pick, eventId)}
            disabled={busy || !pick}
            className="rounded-md bg-mp-charcoal px-4 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
          >
            Link
          </button>
        </div>
      )}
    </div>
  );
}
