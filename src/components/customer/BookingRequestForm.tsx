"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EVENT_TYPES, GUEST_COUNT_PRESETS } from "@/lib/mockListings";
import { MonthCalendar } from "@/components/MonthCalendar";

const FIELD =
  "mt-1 w-full rounded-md border border-mp-border bg-mp-card px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2";

export function BookingRequestForm({
  listingId,
  blockedDates = [],
}: {
  listingId: string;
  blockedDates?: string[];
}) {
  const router = useRouter();
  const [eventType, setEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [dateMode, setDateMode] = useState<"fixed" | "flexible">("fixed");
  const [flexDays, setFlexDays] = useState<number>(3);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!eventType) {
      setError("Pick an event type so the vendor can quote accurately.");
      return;
    }
    setLoading(true);
    try {
      const parts: string[] = [];
      if (eventType) parts.push(`Event: ${eventType}`);
      if (guestCount) parts.push(`Guests: ${guestCount}`);
      if (eventDate) {
        parts.push(
          dateMode === "fixed"
            ? `Date: ${eventDate} (fixed)`
            : `Date: ${eventDate} (±${flexDays} days)`,
        );
      }
      if (notes.trim()) parts.push(`Notes: ${notes.trim()}`);
      const eventDetails = parts.join("\n") || "—";

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          eventDetails,
          eventType: eventType || undefined,
          guestCount: guestCount || undefined,
          eventDate: eventDate
            ? new Date(`${eventDate}T00:00:00.000Z`).toISOString()
            : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // No verified phone yet — send them to the profile to add and verify one.
        if (data.code === "PHONE_REQUIRED") {
          router.push("/customer/profile?verifyPhone=1");
          return;
        }
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
        <label className="text-xs font-medium text-mp-muted">Event type</label>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className={FIELD}
        >
          <option value="">Select…</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-mp-muted">
          Pick an event date
          {eventDate && (
            <span className="ml-1 font-normal text-mp-charcoal">— {eventDate}</span>
          )}
        </label>
        <div className="mt-1 lg:max-w-[50%]">
          <MonthCalendar
            blockedDates={blockedDates}
            selectable
            selectedDate={eventDate}
            onSelect={(ymd) => setEventDate(ymd)}
          />
        </div>
      </div>

      {eventDate && (
        <div className="rounded-md border border-mp-border bg-mp-warm p-3 space-y-2">
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setDateMode("fixed")}
              className={`rounded-full border px-3 py-1 transition ${
                dateMode === "fixed"
                  ? "border-mp-charcoal bg-mp-charcoal text-mp-panel"
                  : "border-mp-border bg-mp-card text-mp-charcoal"
              }`}
            >
              Fixed date
            </button>
            <button
              type="button"
              onClick={() => setDateMode("flexible")}
              className={`rounded-full border px-3 py-1 transition ${
                dateMode === "flexible"
                  ? "border-mp-charcoal bg-mp-charcoal text-mp-panel"
                  : "border-mp-border bg-mp-card text-mp-charcoal"
              }`}
            >
              Flexible (± days)
            </button>
          </div>
          {dateMode === "flexible" && (
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 7, 14].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFlexDays(n)}
                  className={`rounded-full border px-2.5 py-0.5 text-xs transition ${
                    flexDays === n
                      ? "border-mp-accent bg-mp-accent text-mp-panel"
                      : "border-mp-border bg-mp-card text-mp-charcoal hover:border-mp-accent/40"
                  }`}
                >
                  ± {n} day{n > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          )}
          <p className="text-[11px] text-mp-muted">
            {dateMode === "fixed"
              ? "Vendor will only quote if this exact date is open."
              : `Vendor can suggest any date in a ${flexDays * 2 + 1}-day window around your pick.`}
          </p>
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-mp-muted">Approx. number of guests</label>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {GUEST_COUNT_PRESETS.map((g) => {
            const on = guestCount === g.value;
            return (
              <button
                key={g.value}
                type="button"
                onClick={() => setGuestCount(on ? "" : g.value)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  on
                    ? "border-mp-charcoal bg-mp-charcoal text-mp-panel"
                    : "border-mp-border bg-mp-card text-mp-charcoal hover:border-mp-accent/40"
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-mp-muted">
          Anything specific you want to mention?
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className={FIELD}
          placeholder="Theme, dietary needs, venue access, must-have shots, surprise element…"
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
