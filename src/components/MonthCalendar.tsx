"use client";

import { useState } from "react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad = (n: number) => String(n).padStart(2, "0");

function todayYmd() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Month grid showing a vendor's blocked (unavailable) dates.
 * `editable` mode lets a vendor toggle dates; otherwise it's read-only.
 * Dates are plain YYYY-MM-DD strings — no timezone math.
 */
export function MonthCalendar({
  blockedDates,
  editable = false,
  onToggle,
  busyDate,
  highlightDates = [],
  highlightLabel = "Booking",
}: {
  blockedDates: string[];
  editable?: boolean;
  onToggle?: (ymd: string) => void;
  busyDate?: string | null;
  /** Dates to mark in a distinct colour (e.g. upcoming bookings). */
  highlightDates?: string[];
  highlightLabel?: string;
}) {
  const now = new Date();
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });

  const blocked = new Set(blockedDates);
  const highlighted = new Set(highlightDates);
  const today = todayYmd();
  const firstDow = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();

  function shift(delta: number) {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }

  const cells: (string | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${view.y}-${pad(view.m + 1)}-${pad(d)}`);
  }

  return (
    <div className="rounded-md border border-mp-border bg-mp-panel p-3">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          className="rounded px-2 py-1 text-sm text-mp-muted hover:bg-mp-warm"
        >
          ‹
        </button>
        <span className="text-sm font-medium text-mp-charcoal">
          {MONTHS[view.m]} {view.y}
        </span>
        <button
          type="button"
          onClick={() => shift(1)}
          className="rounded px-2 py-1 text-sm text-mp-muted hover:bg-mp-warm"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="py-1 text-[10px] font-medium text-mp-muted">
            {w}
          </span>
        ))}
        {cells.map((ymd, i) => {
          if (!ymd) return <span key={`b${i}`} />;
          const day = Number(ymd.slice(8));
          const isPast = ymd < today;
          const isBlocked = blocked.has(ymd);
          const isHighlighted = highlighted.has(ymd);
          const isBusy = busyDate === ymd;

          const base = "aspect-square rounded text-xs flex items-center justify-center";
          const style = isPast
            ? "text-mp-text3"
            : isBlocked
              ? "bg-mp-accent text-white"
              : isHighlighted
                ? "bg-mp-steel text-white"
                : "bg-mp-card text-mp-charcoal";

          if (editable && !isPast) {
            return (
              <button
                key={ymd}
                type="button"
                disabled={isBusy}
                onClick={() => onToggle?.(ymd)}
                className={`${base} ${style} transition-opacity hover:opacity-80 disabled:opacity-50`}
              >
                {day}
              </button>
            );
          }
          return (
            <span key={ymd} className={`${base} ${style}`}>
              {day}
            </span>
          );
        })}
      </div>

      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-mp-muted">
        {(blockedDates.length > 0 || editable) && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-mp-accent" />
            Unavailable
          </span>
        )}
        {highlightDates.length > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-mp-steel" />
            {highlightLabel}
          </span>
        )}
        {editable && <span>Tap a date to toggle</span>}
      </p>
    </div>
  );
}
