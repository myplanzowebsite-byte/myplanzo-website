"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LOCATIONS } from "@/lib/mockListings";

const SELECT =
  "rounded-md border border-mp-border bg-mp-card px-2.5 py-1.5 text-sm text-mp-charcoal outline-none focus:border-mp-accent";

const RATINGS = [
  { label: "Any rating", value: "" },
  { label: "4★ & up", value: "4" },
  { label: "3★ & up", value: "3" },
];

const BUDGET_MIN = 0;
const BUDGET_MAX = 200000;
const BUDGET_STEP = 1000;

export function BrowseFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const initialMax = Number(params.get("maxBudget") || "") || BUDGET_MAX;
  const [budget, setBudget] = useState<number>(initialMax);

  // Keep slider state in sync with the URL when the user navigates back/forward.
  useEffect(() => {
    const v = Number(params.get("maxBudget") || "") || BUDGET_MAX;
    setBudget(v);
  }, [params]);

  function apply(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/browse?${next.toString()}`);
  }

  function commitBudget(value: number) {
    apply("maxBudget", value >= BUDGET_MAX ? "" : String(value));
  }

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col">
        <label className="text-[11px] uppercase tracking-wider text-mp-muted">
          Budget · up to ₹{budget.toLocaleString("en-IN")}
          {budget >= BUDGET_MAX ? "+" : ""}
        </label>
        <input
          type="range"
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          onMouseUp={(e) => commitBudget(Number((e.target as HTMLInputElement).value))}
          onTouchEnd={(e) => commitBudget(Number((e.target as HTMLInputElement).value))}
          onKeyUp={(e) => commitBudget(Number((e.target as HTMLInputElement).value))}
          className="mt-1 w-48 accent-mp-accent"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-[11px] uppercase tracking-wider text-mp-muted">Rating</label>
        <select
          value={params.get("minRating") ?? ""}
          onChange={(e) => apply("minRating", e.target.value)}
          className={`${SELECT} mt-1`}
        >
          {RATINGS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-[11px] uppercase tracking-wider text-mp-muted">Location</label>
        <select
          value={params.get("location") ?? ""}
          onChange={(e) => apply("location", e.target.value)}
          className={`${SELECT} mt-1`}
        >
          <option value="">Any location</option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-[11px] uppercase tracking-wider text-mp-muted">Available on</label>
        <input
          type="date"
          value={params.get("date") ?? ""}
          onChange={(e) => apply("date", e.target.value)}
          className={`${SELECT} mt-1`}
          title="Available on date"
        />
      </div>
    </div>
  );
}
