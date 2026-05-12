"use client";

import Link from "next/link";
import { useState } from "react";

interface ShortlistItem {
  id: string;
  listing: {
    id: string;
    title: string;
    description: string;
    priceMin: number | null;
    priceMax: number | null;
    location: string | null;
    vendor: {
      businessName: string;
      eventsCompleted: number;
      reviews: Array<{ rating: number }>;
    };
  };
  listingId: string;
}

export function CustomerShortlistPageClient({
  items,
}: {
  items: ShortlistItem[];
}) {
  const [viewMode, setViewMode] = useState<"list" | "compare">("list");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-mp-charcoal">Shortlist (Step 3 of 4)</h1>
          <p className="text-sm text-mp-muted mt-1">Review your saved vendors</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                viewMode === "list"
                  ? "bg-mp-charcoal text-mp-panel border-mp-charcoal"
                  : "bg-mp-card text-mp-charcoal border-mp-border"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("compare")}
              disabled={items.length < 2}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                viewMode === "compare"
                  ? "bg-mp-charcoal text-mp-panel border-mp-charcoal"
                  : items.length < 2
                  ? "bg-mp-card text-mp-muted border-mp-border opacity-50"
                  : "bg-mp-card text-mp-charcoal border-mp-border"
              }`}
            >
              Compare ({items.length})
            </button>
          </div>
          <Link href="/browse" className="text-sm text-mp-accent underline">
            ← Add more
          </Link>
        </div>
      </div>

      {viewMode === "list" ? (
        <ListViewContent items={items} />
      ) : (
        <CompareViewContent items={items} />
      )}
    </div>
  );
}

function ListViewContent({ items }: { items: ShortlistItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((s) => (
        <li
          key={s.id}
          className="flex items-center justify-between rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]"
        >
          <div className="flex-1">
            <p className="font-medium text-mp-charcoal">{s.listing.title}</p>
            <p className="text-xs text-mp-muted mt-1">{s.listing.vendor.businessName}</p>
            <div className="mt-2 flex items-center gap-3 text-xs text-mp-muted">
              {s.listing.priceMin && (
                <span>₹{s.listing.priceMin.toLocaleString()}+</span>
              )}
              {s.listing.location && <span>{s.listing.location}</span>}
            </div>
          </div>
          <Link
            href={`/listings/${s.listingId}`}
            className="ml-4 px-3 py-1.5 rounded-md bg-mp-charcoal text-mp-panel text-sm font-medium hover:bg-mp-accent"
          >
            Book
          </Link>
        </li>
      ))}
      {items.length === 0 ? (
        <p className="text-mp-muted text-sm">Nothing shortlisted yet.</p>
      ) : null}
    </ul>
  );
}

function CompareViewContent({ items }: { items: ShortlistItem[] }) {
  const compareItems = items.slice(0, 4);

  return (
    <div className="overflow-x-auto rounded-[var(--radius-mp-card)] border border-mp-border shadow-[var(--shadow-mp-card)]">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-mp-border bg-mp-panel">
            <th className="text-left font-semibold text-mp-charcoal p-4 sticky left-0 bg-mp-panel min-w-[180px]">
              Vendor
            </th>
            {compareItems.map((item) => (
              <th key={item.id} className="text-center font-semibold text-mp-charcoal p-4 min-w-[160px]">
                <p className="font-medium text-sm">{item.listing.vendor.businessName}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-mp-border hover:bg-mp-warm/30">
            <td className="font-medium text-mp-charcoal p-4 bg-mp-panel sticky left-0">Pricing</td>
            {compareItems.map((item) => (
              <td key={item.id} className="text-center p-4">
                {item.listing.priceMin ? (
                  <>
                    <p className="font-semibold text-mp-accent">
                      ₹{item.listing.priceMin.toLocaleString()}
                    </p>
                    {item.listing.priceMax && (
                      <p className="text-xs text-mp-muted">
                        - ₹{item.listing.priceMax.toLocaleString()}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-mp-muted">Contact</p>
                )}
              </td>
            ))}
          </tr>

          <tr className="border-b border-mp-border hover:bg-mp-warm/30">
            <td className="font-medium text-mp-charcoal p-4 bg-mp-panel sticky left-0">Rating</td>
            {compareItems.map((item) => {
              const avgRating = item.listing.vendor.reviews.length
                ? item.listing.vendor.reviews.reduce((sum, r) => sum + r.rating, 0) / item.listing.vendor.reviews.length
                : 0;

              return (
                <td key={item.id} className="text-center p-4">
                  <div className="flex items-center justify-center gap-1">
                    <span className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(avgRating) ? "text-mp-accent" : "text-mp-muted"}>
                          ★
                        </span>
                      ))}
                    </span>
                  </div>
                  {avgRating > 0 && (
                    <p className="text-xs text-mp-muted mt-1">
                      {avgRating.toFixed(1)} ({item.listing.vendor.reviews.length})
                    </p>
                  )}
                </td>
              );
            })}
          </tr>

          <tr className="border-b border-mp-border hover:bg-mp-warm/30">
            <td className="font-medium text-mp-charcoal p-4 bg-mp-panel sticky left-0">Events Done</td>
            {compareItems.map((item) => (
              <td key={item.id} className="text-center p-4">
                <p className="font-medium">{item.listing.vendor.eventsCompleted || 0}</p>
              </td>
            ))}
          </tr>

          <tr className="border-b border-mp-border hover:bg-mp-warm/30">
            <td className="font-medium text-mp-charcoal p-4 bg-mp-panel sticky left-0">Location</td>
            {compareItems.map((item) => (
              <td key={item.id} className="text-center p-4">
                <p>{item.listing.location || "Mumbai"}</p>
              </td>
            ))}
          </tr>

          <tr>
            <td className="p-4 bg-mp-panel sticky left-0"></td>
            {compareItems.map((item) => (
              <td key={item.id} className="text-center p-4">
                <Link
                  href={`/listings/${item.listingId}`}
                  className="inline-block px-3 py-1.5 bg-mp-charcoal text-mp-panel rounded-md text-sm font-medium hover:bg-mp-accent"
                >
                  Book
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
