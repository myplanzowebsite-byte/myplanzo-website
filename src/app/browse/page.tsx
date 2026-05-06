import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VendorCard, type VendorCardData } from "@/components/VendorCard";

export default async function BrowsePage(props: {
  searchParams?: Promise<{ event?: string; location?: string }>;
}) {
  const searchParams = await props.searchParams;
  const selectedEvent = searchParams?.event;

  const [eventTypes, listings] = await Promise.all([
    prisma.eventType.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.serviceListing.findMany({
      where: {
        status: "ACTIVE",
        vendor: { verificationStatus: "ACTIVE" },
        ...(selectedEvent ? { eventTags: { has: selectedEvent } } : {}),
      },
      include: {
        vendor: {
          include: { reviews: { select: { rating: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 40,
    }),
  ]);

  const cards: VendorCardData[] = listings.map((l) => {
    const ratings = l.vendor.reviews.map((r) => r.rating);
    const avgRating = ratings.length
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : undefined;

    return {
      id: l.id,
      name: l.title,
      category: l.vendor.businessName,
      meta: l.location || "Mumbai",
      rating: avgRating,
      countLabel: ratings.length ? `${ratings.length} reviews` : undefined,
      price: l.priceMin ? `₹${l.priceMin.toLocaleString()}` : "Contact",
      unit: l.priceMin ? "starting" : undefined,
      img: l.photos?.[0] ?? undefined,
      // Clicking "Book now" navigates to the listing detail — middleware gates auth
      href: `/customer/listings/${l.id}`,
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
          {eventTypes.map((et) => (
            <Link
              key={et.id}
              href={`/browse?event=${encodeURIComponent(et.title)}`}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                selectedEvent === et.title
                  ? "border-mp-charcoal bg-mp-charcoal text-mp-panel"
                  : "border-mp-border bg-mp-card text-mp-charcoal"
              }`}
            >
              {et.emoji} {et.title}
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
