"use client";

import { useEffect, useState } from "react";
import { MonthCalendar } from "@/components/MonthCalendar";

export function AvailabilityManager() {
  const [blocked, setBlocked] = useState<string[]>([]);
  const [busyDate, setBusyDate] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/vendor/availability");
      const data = await res.json().catch(() => ({}));
      if (res.ok) setBlocked(data.blocked ?? []);
      setLoaded(true);
    })();
  }, []);

  async function toggle(ymd: string) {
    const isBlocked = blocked.includes(ymd);
    setBusyDate(ymd);
    try {
      const res = await fetch(
        `/api/vendor/availability${isBlocked ? `?date=${ymd}` : ""}`,
        isBlocked
          ? { method: "DELETE" }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ date: ymd }),
            },
      );
      if (res.ok) {
        setBlocked((b) => (isBlocked ? b.filter((x) => x !== ymd) : [...b, ymd]));
      }
    } finally {
      setBusyDate(null);
    }
  }

  return (
    <section className="space-y-3 rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
      <div>
        <h2 className="text-sm font-semibold text-mp-charcoal">Availability</h2>
        <p className="text-xs text-mp-muted">
          Block dates you can&apos;t take bookings. Customers see this on your listings.
        </p>
      </div>
      {loaded ? (
        <MonthCalendar
          blockedDates={blocked}
          editable
          onToggle={toggle}
          busyDate={busyDate}
        />
      ) : (
        <p className="text-xs text-mp-muted">Loading calendar…</p>
      )}
    </section>
  );
}
