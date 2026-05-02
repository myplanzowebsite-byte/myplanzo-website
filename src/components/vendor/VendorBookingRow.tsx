"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Booking, Payment } from "@prisma/client";

type RowProps = {
  booking: Booking & { customer: { email: string }; payments: Payment[] };
};

export function VendorBookingRow({ booking }: RowProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function respond(action: "accept" | "decline") {
    setLoading(action);
    try {
      await fetch(`/api/bookings/${booking.id}/vendor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)] text-sm space-y-2">
      <div className="flex flex-wrap justify-between gap-2">
        <span className="font-medium">{booking.customer.email}</span>
        <span className="text-mp-muted">{booking.status}</span>
      </div>
      <p className="text-mp-muted whitespace-pre-wrap">{booking.eventDetails}</p>
      {booking.status === "PENDING" ? (
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => respond("accept")}
            className="rounded-md bg-mp-charcoal px-3 py-1.5 text-xs text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
          >
            {loading === "accept" ? "…" : "Accept"}
          </button>
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => respond("decline")}
            className="rounded-md border border-mp-border px-3 py-1.5 text-xs disabled:opacity-60"
          >
            {loading === "decline" ? "…" : "Decline"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
