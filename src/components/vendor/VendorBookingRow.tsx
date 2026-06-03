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
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

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

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setOtpError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otp.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setOtpError(data.error || "Could not verify the code.");
        return;
      }
      setOtp("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function markComplete() {
    setLoading(true);
    try {
      await fetch(`/api/bookings/${booking.id}/complete`, { method: "POST" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const isCaptured = (kind: string) =>
    booking.payments.some((p) => p.kind === kind && p.status === "CAPTURED");
  const advanceDone = isCaptured("ADVANCE") || isCaptured("FULL");
  const balanceDone = isCaptured("BALANCE") || isCaptured("FULL");
  const fullyPaid = advanceDone && balanceDone;
  const paid = booking.payments.some((p) => p.status === "CAPTURED");
  const showPaymentBadge = booking.status === "CONFIRMED" || booking.status === "COMPLETED";

  const stageLabel: Record<string, string> = {
    BOOKED: "Booked",
    ADVANCE_PAID: "Advance paid",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
  };

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
          <span className="text-mp-muted">
            {showPaymentBadge ? stageLabel[booking.stage] ?? booking.status : booking.status}
          </span>
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

      {/* Fully paid, awaiting arrival — collect the customer's OTP to start. */}
      {booking.stage === "ADVANCE_PAID" && fullyPaid && (
        <form onSubmit={verifyOtp} className="space-y-1 border-t border-mp-border pt-2">
          <p className="text-xs text-mp-muted">
            On arrival, ask the customer for their 6-digit code and enter it to start the event.
          </p>
          <div className="flex gap-2">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              placeholder="Arrival code"
              className="w-32 rounded-md border border-mp-border bg-mp-panel px-3 py-1.5 text-sm tracking-widest text-mp-charcoal"
            />
            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="rounded-md bg-mp-charcoal px-3 py-1.5 text-xs text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
            >
              {loading ? "…" : "Confirm arrival"}
            </button>
          </div>
          {otpError && <p className="text-xs text-mp-accent">{otpError}</p>}
        </form>
      )}

      {/* Event underway — let the vendor mark it complete. */}
      {booking.stage === "IN_PROGRESS" && (
        <div className="border-t border-mp-border pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={markComplete}
            className="rounded-md bg-mp-charcoal px-3 py-1.5 text-xs text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
          >
            {loading ? "…" : "Mark event as complete"}
          </button>
        </div>
      )}
    </div>
  );
}
