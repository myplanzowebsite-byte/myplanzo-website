"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SELECT =
  "rounded-md border border-mp-border bg-mp-card px-2.5 py-1.5 text-sm text-mp-charcoal outline-none focus:border-mp-accent";

const BUDGETS = [
  { label: "Any budget", value: "" },
  { label: "Under ₹10k", value: "10000" },
  { label: "Under ₹25k", value: "25000" },
  { label: "Under ₹50k", value: "50000" },
  { label: "Under ₹1L", value: "100000" },
];

const RATINGS = [
  { label: "Any rating", value: "" },
  { label: "4★ & up", value: "4" },
  { label: "3★ & up", value: "3" },
];

export function BrowseFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function apply(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/browse?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs uppercase tracking-wider text-mp-muted">Filter:</span>
      <select
        value={params.get("maxBudget") ?? ""}
        onChange={(e) => apply("maxBudget", e.target.value)}
        className={SELECT}
      >
        {BUDGETS.map((b) => (
          <option key={b.value} value={b.value}>
            {b.label}
          </option>
        ))}
      </select>
      <select
        value={params.get("minRating") ?? ""}
        onChange={(e) => apply("minRating", e.target.value)}
        className={SELECT}
      >
        {RATINGS.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={params.get("date") ?? ""}
        onChange={(e) => apply("date", e.target.value)}
        className={SELECT}
        title="Available on date"
      />
    </div>
  );
}
