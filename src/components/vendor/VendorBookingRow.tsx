"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Booking, Payment } from "@prisma/client";

type RowProps = {
  booking: Booking & { customer: { email: string }; payments: Payment[] };
};

export function VendorBookingRow({ booking }: RowProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function decline() {
    setLoading(true);
    try {
      await fetch(`/api/bookings/${booking.id}/vendor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "decline" }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const paid = booking.payments.some((p) => p.status === "CAPTURED");
  const showPaymentBadge = booking.status === "CONFIRMED" || booking.status === "COMPLETED";

  return (
    <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)] text-sm space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{booking.customer.email}</span>
        <div className="flex items-center gap-2">
          {showPaymentBadge && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                paid
                  ? "bg-green-500/15 text-green-700"
                  : "bg-mp-warm text-mp-charcoal"
              }`}
            >
              {paid ? "Paid" : "Unpaid"}
            </span>
          )}
          <span className="text-mp-muted">{booking.status}</span>
        </div>
      </div>
      <p className="text-mp-muted whitespace-pre-wrap">{booking.eventDetails}</p>
      <div className="flex gap-2 pt-2">
        <Link
          href={`/vendor/messages/${booking.id}`}
          className="rounded-md bg-mp-charcoal px-3 py-1.5 text-xs text-mp-panel transition-colors hover:bg-mp-accent"
        >
          {booking.status === "PENDING" ? "Send quote" : "Messages"}
        </Link>
        {booking.status === "PENDING" && (
          <button
            type="button"
            disabled={loading}
            onClick={decline}
            className="rounded-md border border-mp-border px-3 py-1.5 text-xs disabled:opacity-60"
          >
            {loading ? "…" : "Decline"}
          </button>
        )}
      </div>
    </div>
  );
}
