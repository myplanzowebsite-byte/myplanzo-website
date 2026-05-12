import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VendorCard, type VendorCardData } from "@/components/VendorCard";
import { formatINR, priceUnitForListing } from "@/lib/format";

// Same set as the homepage category strip so users see consistent filters.
const CATEGORIES: { emoji: string; label: string }[] = [
  { emoji: "🎂", label: "Birthday" },
  { emoji: "👶", label: "Baby Shower" },
  { emoji: "💍", label: "Anniversary" },
  { emoji: "👋", label: "Farewell" },
  { emoji: "🏢", label: "Corporate" },
  { emoji: "🌸", label: "Kitty Party" },
  { emoji: "🎀", label: "Decorators" },
  { emoji: "📸", label: "Photographers" },
  { emoji: "🍽️", label: "Caterers" },
  { emoji: "🏛️", label: "Venues" },
  { emoji: "🎵", label: "DJ & Music" },
  { emoji: "🎂", label: "Cake" },
];

export default async function BrowsePage(props: {
  searchParams?: Promise<{ event?: string; zone?: string }>;
}) {
  const searchParams = await props.searchParams;
  const selectedEvent = searchParams?.event;
  const zone = searchParams?.zone;

  const listings = await prisma.serviceListing.findMany({
    where: {
      status: "ACTIVE",
      vendor: { verificationStatus: "ACTIVE" },
      ...(selectedEvent ? { eventTags: { has: selectedEvent } } : {}),
      ...(zone ? { location: { contains: zone, mode: "insensitive" } } : {}),
    },
    include: {
      vendor: {
        include: { reviews: { select: { rating: true } } },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 40,
  });

  const cards: VendorCardData[] = listings.map((l) => {
    const ratings = l.vendor.reviews.map((r) => r.rating);
    const avgRating = ratings.length
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : undefined;

    const unit = priceUnitForListing({ title: l.title, eventTags: l.eventTags });

    return {
      id: l.id,
      name: l.title,
      category: l.vendor.businessName,
      meta: l.location || "Mumbai",
      rating: avgRating,
      countLabel: ratings.length ? `${ratings.length} reviews` : undefined,
      price: l.priceMin ? formatINR(l.priceMin) : "Contact",
      unit: l.priceMin ? unit : undefined,
      img: l.photos?.[0] ?? undefined,
      href: `/listings/${l.id}`,
      buttonLabel: "Book now",
      verified: true,
    };
  });

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-mp-charcoal">Browse vendors</h1>
          <p className="text-sm text-mp-muted">Select an event type to filter vendors in Mumbai.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/browse"
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              !selectedEvent
                ? "border-mp-charcoal bg-mp-charcoal text-mp-panel"
                : "border-mp-border bg-mp-card text-mp-charcoal"
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href={`/browse?event=${encodeURIComponent(c.label)}`}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                selectedEvent === c.label
                  ? "border-mp-charcoal bg-mp-charcoal text-mp-panel"
                  : "border-mp-border bg-mp-card text-mp-charcoal"
              }`}
            >
              {c.emoji} {c.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Vendor cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <VendorCard key={c.id} v={c} />
        ))}
        {cards.length === 0 && (
          <p className="text-sm text-mp-muted">No active listings yet.</p>
        )}
      </div>
    </div>
  );
}
