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
 * Month grid that supports three modes:
 *  - read-only (default): shows availability; past + blocked dates are struck through.
 *  - `editable`: vendor toggles unavailable dates on/off.
 *  - `selectable`: customer picks an event date; blocked + past dates are disabled.
 * Dates are plain YYYY-MM-DD strings — no timezone math.
 */
export function MonthCalendar({
  blockedDates,
  editable = false,
  onToggle,
  busyDate,
  highlightDates = [],
  highlightLabel = "Booking",
  selectable = false,
  selectedDate,
  onSelect,
}: {
  blockedDates: string[];
  editable?: boolean;
  onToggle?: (ymd: string) => void;
  busyDate?: string | null;
  /** Dates to mark in a distinct colour (e.g. upcoming bookings). */
  highlightDates?: string[];
  highlightLabel?: string;
  /** When true, available dates are clickable and call `onSelect`. */
  selectable?: boolean;
  selectedDate?: string | null;
  onSelect?: (ymd: string) => void;
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
          const isSelected = selectable && selectedDate === ymd;

          const base = "aspect-square rounded text-xs flex items-center justify-center relative";
          const style = isPast
            ? "text-mp-text3 line-through decoration-mp-border"
            : isBlocked
              ? "text-mp-text3 bg-mp-warm line-through decoration-mp-accent decoration-2"
              : isSelected
                ? "bg-mp-charcoal text-mp-panel ring-2 ring-mp-accent"
                : isHighlighted
                  ? "bg-mp-steel text-white"
                  : "bg-mp-card text-mp-charcoal hover:bg-mp-warm";

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

          if (selectable) {
            const disabled = isPast || isBlocked;
            return (
              <button
                key={ymd}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onSelect?.(ymd)}
                aria-pressed={isSelected}
                className={`${base} ${style} transition-opacity ${
                  disabled ? "cursor-not-allowed" : "hover:opacity-80"
                }`}
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
            <span className="inline-block h-2.5 w-6 rounded-sm bg-mp-warm">
              <span className="block h-full w-full border-t-2 border-mp-accent" style={{ transform: "translateY(4px)" }} />
            </span>
            Unavailable
          </span>
        )}
        {selectable && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-mp-charcoal" />
            Your pick
          </span>
        )}
        {highlightDates.length > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-mp-steel" />
            {highlightLabel}
          </span>
        )}
        {editable && <span>Tap a date to toggle</span>}
        {selectable && !editable && <span>Tap any available date to pick it</span>}
      </p>
    </div>
  );
}
