import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VendorCard, type VendorCardData } from "@/components/VendorCard";
import { BrowseFilters } from "@/components/BrowseFilters";
import { formatINR, priceUnitForListing } from "@/lib/format";
import { EVENT_TYPES, MOCK_LISTINGS, filterMockListings } from "@/lib/mockListings";
import { getVendorCategories } from "@/lib/vendorCategories";

// Builds /browse?... preserving the current filter state, with `patch`
// overrides (null clears a key). Keeps the chips/pills synced.
type FilterState = {
  selectedCategory?: string;
  selectedEvent?: string;
  zone?: string;
  q?: string;
  maxBudget?: number;
  minRating?: number;
  date?: string;
};
type FilterPatch = Partial<{
  category: string | null;
  event: string | null;
  zone: string | null;
  location: string | null;
  q: string | null;
  maxBudget: number | string | null;
  minRating: number | string | null;
  date: string | null;
}>;

function buildBrowseHref(state: FilterState, patch: FilterPatch = {}): string {
  const p = new URLSearchParams();
  const cur: Record<string, string | undefined> = {
    category: state.selectedCategory,
    event: state.selectedEvent,
    location: state.zone,
    q: state.q,
    maxBudget: state.maxBudget ? String(state.maxBudget) : undefined,
    minRating: state.minRating ? String(state.minRating) : undefined,
    date: state.date,
  };
  // Apply patch — null clears, defined value sets, undefined leaves current.
  for (const [k, v] of Object.entries(patch)) {
    if (v === null) cur[k === "zone" ? "location" : k] = undefined;
    else if (v !== undefined) cur[k === "zone" ? "location" : k] = String(v);
  }
  for (const [k, v] of Object.entries(cur)) {
    if (v) p.set(k, v);
  }
  const qs = p.toString();
  return qs ? `/browse?${qs}` : "/browse";
}

function FilterPill({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full border border-mp-charcoal bg-mp-charcoal px-2.5 py-0.5 text-[11px] font-medium text-mp-panel hover:bg-mp-accent"
    >
      <span>{label}</span>
      <span aria-hidden className="text-mp-panel/80">✕</span>
    </Link>
  );
}

export const metadata: Metadata = {
  title: "Browse vendors",
  description:
    "Browse verified decorators, caterers, photographers, venues, DJs & cake makers for events in Mumbai.",
  openGraph: {
    title: "Browse vendors · MyPlanzo",
    description:
      "Browse verified decorators, caterers, photographers, venues, DJs & cake makers for events in Mumbai.",
    images: [{ url: "/logo1.jpeg", width: 1200, height: 630, alt: "MyPlanzo" }],
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
    location?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const selectedCategory = searchParams?.category;
  const selectedEvent = searchParams?.event;
  const zone = searchParams?.zone || searchParams?.location;
  const q = searchParams?.q;

  const maxBudget = Number(searchParams?.maxBudget) || undefined;
  const minRating = Number(searchParams?.minRating) || undefined;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(searchParams?.date ?? "")
    ? searchParams!.date!
    : undefined;

  const vendorCategories = await getVendorCategories();

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
              { category: { contains: q, mode: "insensitive" } },
              { vendor: { is: { businessName: { contains: q, mode: "insensitive" } } } },
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
      photos: l.photos ?? undefined,
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
    photos: m.photos,
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
          Discover (swipe)
        </Link>
      </div>

      {/* Helper to build a hrefs that keeps the other filters intact */}
      {(() => null)()}

      {/* Category chips (primary filter) */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildBrowseHref({ selectedEvent, zone, q, maxBudget, minRating, date }, { category: null })}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${
            !selectedCategory
              ? "border-mp-charcoal bg-mp-charcoal text-mp-panel"
              : "border-mp-border bg-mp-card text-mp-charcoal"
          }`}
        >
          All
        </Link>
        {vendorCategories.map((c) => {
          const isActive = selectedCategory === c.title;
          return (
            <Link
              key={c.id}
              href={buildBrowseHref(
                { selectedCategory, selectedEvent, zone, q, maxBudget, minRating, date },
                { category: isActive ? null : c.title },
              )}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                isActive
                  ? "border-mp-charcoal bg-mp-charcoal text-mp-panel"
                  : "border-mp-border bg-mp-card text-mp-charcoal"
              }`}
            >
              {c.title}
            </Link>
          );
        })}
      </div>

      {/* Event tag filter (secondary) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-mp-muted mr-1">Event:</span>
        {EVENT_TYPES.map((evt) => {
          const isActive = selectedEvent === evt;
          return (
            <Link
              key={evt}
              href={buildBrowseHref(
                { selectedCategory, selectedEvent, zone, q, maxBudget, minRating, date },
                { event: isActive ? null : evt },
              )}
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
            href={buildBrowseHref(
              { selectedCategory, zone, q, maxBudget, minRating, date },
              { event: null },
            )}
            className="text-xs text-mp-muted underline ml-1"
          >
            clear event
          </Link>
        )}
      </div>

      {/* Budget / rating / availability filters */}
      <BrowseFilters />

      {/* Active filter summary — shows every applied filter as a removable chip */}
      {hasFilter && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-mp-border bg-mp-warm px-3 py-2 text-xs">
          <span className="font-semibold uppercase tracking-wide text-mp-muted">Active filters:</span>
          {selectedCategory && (
            <FilterPill
              label={`Category: ${selectedCategory}`}
              href={buildBrowseHref(
                { selectedEvent, zone, q, maxBudget, minRating, date },
                { category: null },
              )}
            />
          )}
          {selectedEvent && (
            <FilterPill
              label={`Event: ${selectedEvent}`}
              href={buildBrowseHref(
                { selectedCategory, zone, q, maxBudget, minRating, date },
                { event: null },
              )}
            />
          )}
          {zone && (
            <FilterPill
              label={`Location: ${zone}`}
              href={buildBrowseHref(
                { selectedCategory, selectedEvent, q, maxBudget, minRating, date },
                { zone: null, location: null },
              )}
            />
          )}
          {maxBudget && (
            <FilterPill
              label={`Up to ₹${maxBudget.toLocaleString("en-IN")}`}
              href={buildBrowseHref(
                { selectedCategory, selectedEvent, zone, q, minRating, date },
                { maxBudget: null },
              )}
            />
          )}
          {minRating && (
            <FilterPill
              label={`${minRating}★ & up`}
              href={buildBrowseHref(
                { selectedCategory, selectedEvent, zone, q, maxBudget, date },
                { minRating: null },
              )}
            />
          )}
          {date && (
            <FilterPill
              label={`Available ${date}`}
              href={buildBrowseHref(
                { selectedCategory, selectedEvent, zone, q, maxBudget, minRating },
                { date: null },
              )}
            />
          )}
          {q && (
            <FilterPill
              label={`Search: "${q}"`}
              href={buildBrowseHref(
                { selectedCategory, selectedEvent, zone, maxBudget, minRating, date },
                { q: null },
              )}
            />
          )}
          <Link href="/browse" className="ml-auto text-mp-charcoal underline">
            Clear all
          </Link>
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
