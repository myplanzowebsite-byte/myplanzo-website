import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VendorCard, type VendorCardData } from "@/components/VendorCard";
import { BrowseFilters } from "@/components/BrowseFilters";
import { formatINR, priceUnitForListing } from "@/lib/format";
import {
  VENDOR_CATEGORIES,
  EVENT_TAGS,
  MOCK_LISTINGS,
  filterMockListings,
} from "@/lib/mockListings";

export const metadata: Metadata = {
  title: "Browse vendors",
  description:
    "Browse verified decorators, caterers, photographers, venues, DJs & cake makers for events in Mumbai.",
  openGraph: {
    title: "Browse vendors · MyPlanzo",
    description:
      "Browse verified decorators, caterers, photographers, venues, DJs & cake makers for events in Mumbai.",
    images: [{ url: "/logo.jpg", width: 1200, height: 630, alt: "MyPlanzo" }],
  },
};

export default async function BrowsePage(props: {
  searchParams?: Promise<{
    category?: string;
    event?: string;
    zone?: string;
    q?: string;
    maxBudget?: string;
    minRating?: string;
    date?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const selectedCategory = searchParams?.category;
  const selectedEvent = searchParams?.event;
  const zone = searchParams?.zone;
  const q = searchParams?.q;

  const maxBudget = Number(searchParams?.maxBudget) || undefined;
  const minRating = Number(searchParams?.minRating) || undefined;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(searchParams?.date ?? "")
    ? searchParams!.date!
    : undefined;

  const listings = await prisma.serviceListing.findMany({
    where: {
      status: "ACTIVE",
      vendor: {
        verificationStatus: "ACTIVE",
        ...(date
          ? { availability: { none: { date: new Date(`${date}T00:00:00.000Z`) } } }
          : {}),
      },
      ...(selectedCategory ? { category: { equals: selectedCategory, mode: "insensitive" } } : {}),
      ...(selectedEvent ? { eventTags: { has: selectedEvent } } : {}),
      ...(zone ? { location: { contains: zone, mode: "insensitive" } } : {}),
      ...(maxBudget ? { priceMin: { lte: maxBudget } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      vendor: {
        include: { reviews: { select: { rating: true } } },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 40,
  });

  let dbCards: VendorCardData[] = listings.map((l) => {
    const ratings = l.vendor.reviews.map((r) => r.rating);
    const avgRating = ratings.length
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : undefined;

    const unit = priceUnitForListing({ title: l.title, eventTags: l.eventTags });

    return {
      id: l.id,
      name: l.title,
      category: l.category ?? l.vendor.businessName,
      meta: l.location || "Mumbai",
      rating: avgRating,
      countLabel: ratings.length ? `${ratings.length} reviews` : undefined,
      price: l.priceMin ? formatINR(l.priceMin) : "Contact",
      unit: l.priceMin ? unit : undefined,
      img: l.photos?.[0] ?? undefined,
      href: `/listings/${l.id}`,
      buttonLabel: "View →",
      verified: true,
    };
  });
  if (minRating) {
    dbCards = dbCards.filter((c) => (c.rating ?? 0) >= minRating);
  }

  // Mock listings preview cleanly even before real vendors exist. They have no
  // availability data, so the date filter never excludes them.
  let mocks = filterMockListings({ category: selectedCategory, event: selectedEvent, zone, q });
  if (maxBudget) mocks = mocks.filter((m) => m.priceMin <= maxBudget);
  if (minRating) mocks = mocks.filter((m) => m.rating >= minRating);

  const mockCards: VendorCardData[] = mocks.map((m) => ({
    id: m.id,
    name: m.vendorName,
    category: m.category,
    meta: m.location,
    rating: m.rating,
    countLabel: `${m.reviewCount} reviews`,
    price: formatINR(m.priceMin),
    unit: priceUnitForListing({ title: m.title, eventTags: m.eventTags }),
    img: m.photos[0],
    waPhone: m.waPhone,
    href: `/listings/${m.id}`,
    buttonLabel: "View →",
    verified: true,
  }));

  const cards = [...dbCards, ...mockCards];

  const hasFilter = !!(
    selectedCategory || selectedEvent || zone || q || maxBudget || minRating || date
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-mp-charcoal">Browse vendors</h1>
          <p className="text-sm text-mp-muted">
            {hasFilter
              ? "Filtered results — clear filters to see all categories."
              : "Pick a category to find verified vendors in Mumbai."}
          </p>
        </div>
        <Link
          href="/customer/discover"
          className="shrink-0 rounded-full border border-mp-border bg-mp-card px-3 py-1.5 text-sm text-mp-charcoal transition hover:border-mp-accent"
        >
          ✨ Discover (swipe)
        </Link>
      </div>

      {/* Category chips (primary filter) */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/browse"
          className={`rounded-full border px-3 py-1.5 text-sm transition ${
            !selectedCategory && !selectedEvent
              ? "border-mp-charcoal bg-mp-charcoal text-mp-panel"
              : "border-mp-border bg-mp-card text-mp-charcoal"
          }`}
        >
          All
        </Link>
        {VENDOR_CATEGORIES.map((c) => (
          <Link
            key={c.label}
            href={`/browse?category=${encodeURIComponent(c.label)}`}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              selectedCategory === c.label
                ? "border-mp-charcoal bg-mp-charcoal text-mp-panel"
                : "border-mp-border bg-mp-card text-mp-charcoal"
            }`}
          >
            {c.emoji} {c.label}
          </Link>
        ))}
      </div>

      {/* Event tag filter (secondary) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-mp-muted mr-1">Event:</span>
        {EVENT_TAGS.map((evt) => {
          const params = new URLSearchParams();
          if (selectedCategory) params.set("category", selectedCategory);
          if (zone) params.set("zone", zone);
          params.set("event", evt);
          const isActive = selectedEvent === evt;
          return (
            <Link
              key={evt}
              href={`/browse?${params.toString()}`}
              className={`rounded-full border px-2.5 py-1 text-xs transition ${
                isActive
                  ? "border-mp-steel bg-mp-steel/15 text-mp-steel"
                  : "border-mp-border bg-mp-card text-mp-muted hover:text-mp-charcoal"
              }`}
            >
              {evt}
            </Link>
          );
        })}
        {selectedEvent && (
          <Link
            href={`/browse${selectedCategory ? `?category=${encodeURIComponent(selectedCategory)}` : ""}`}
            className="text-xs text-mp-muted underline ml-1"
          >
            clear event
          </Link>
        )}
      </div>

      {/* Budget / rating / availability filters */}
      <BrowseFilters />

      {/* Active filter summary */}
      {(zone || q || date) && (
        <div className="flex flex-wrap gap-2 text-xs text-mp-muted">
          {zone && <span>Zone: <span className="text-mp-charcoal">{zone}</span></span>}
          {q && <span>Search: <span className="text-mp-charcoal">&ldquo;{q}&rdquo;</span></span>}
          {date && <span>Available on: <span className="text-mp-charcoal">{date}</span></span>}
          <Link href="/browse" className="underline">Clear all</Link>
        </div>
      )}

      {/* Vendor cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <VendorCard key={c.id} v={c} />
        ))}
        {cards.length === 0 && (
          <p className="text-sm text-mp-muted">No matches. Try clearing filters.</p>
        )}
      </div>

      {!hasFilter && (
        <p className="pt-4 text-xs text-mp-muted">
          Showing {MOCK_LISTINGS.length} preview listings + any live vendors.
        </p>
      )}
    </div>
  );
}
