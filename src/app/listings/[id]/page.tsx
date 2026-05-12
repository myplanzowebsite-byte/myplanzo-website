import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { ShortlistButton } from "@/components/customer/ShortlistButton";
import { BookingRequestForm } from "@/components/customer/BookingRequestForm";
import { formatINR, priceUnitForListing } from "@/lib/format";

type ListingReview = {
  rating: number;
  title?: string | null;
  comment?: string | null;
};

export default async function PublicListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [listing, session] = await Promise.all([
    prisma.serviceListing.findFirst({
      where: { id, status: "ACTIVE", vendor: { verificationStatus: "ACTIVE" } },
      include: { vendor: { include: { reviews: { select: { rating: true, title: true, comment: true } } } } },
    }),
    readSession(),
  ]);
  if (!listing) notFound();

  const isLoggedIn = !!session?.sub;
  const reviews: ListingReview[] = listing.vendor.reviews ?? [];
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const unit = priceUnitForListing({ title: listing.title, eventTags: listing.eventTags });
  const priceLabel = listing.priceMin
    ? `${formatINR(listing.priceMin)}${listing.priceMax ? ` – ${formatINR(listing.priceMax)}` : ""}`
    : "Contact for pricing";

  const loginNext = `/listings/${listing.id}`;

  return (
    <div className="space-y-6 pb-24">
      <Link href="/browse" className="text-sm text-mp-charcoal underline">
        ← Back to browse
      </Link>

      {listing.photos?.[0] && (
        <div className="rounded-[var(--radius-mp-card)] overflow-hidden shadow-[var(--shadow-mp-card)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={listing.photos[0]} alt={listing.title} className="w-full h-64 object-cover" />
        </div>
      )}

      <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)] space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-mp-charcoal">{listing.title}</h1>
            <p className="text-sm text-mp-muted mt-1">{listing.vendor.businessName}</p>
          </div>
          {isLoggedIn ? (
            <ShortlistButton listingId={listing.id} />
          ) : (
            <Link
              href={`/login?next=${encodeURIComponent(loginNext)}`}
              className="rounded-md border border-mp-border bg-mp-card px-4 py-2 text-sm font-medium text-mp-charcoal hover:border-mp-accent/40 hover:bg-mp-panel"
            >
              Shortlist
            </Link>
          )}
        </div>

        <div className="border-t border-mp-border pt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <p className="text-mp-muted">Pricing</p>
            <p className="font-semibold text-mp-charcoal">
              {priceLabel}
              {listing.priceMin && <span className="ml-1 text-xs font-normal text-mp-text3">{unit}</span>}
            </p>
          </div>
          <div>
            <p className="text-mp-muted">Location</p>
            <p className="font-semibold text-mp-charcoal">{listing.location || "Mumbai"}</p>
          </div>
          {listing.vendor.eventsCompleted > 0 && (
            <div>
              <p className="text-mp-muted">Events Completed</p>
              <p className="font-semibold text-mp-charcoal">{listing.vendor.eventsCompleted}</p>
            </div>
          )}
        </div>

        <div className="border-t border-mp-border pt-4">
          <p className="text-sm font-semibold text-mp-charcoal mb-3">Customer Reviews</p>
          {avgRating > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < Math.floor(avgRating) ? 'text-mp-accent' : 'text-mp-muted'}`}>
                      ★
                    </span>
                  ))}
                </span>
                <span className="text-sm text-mp-muted">{avgRating.toFixed(1)} based on {reviews.length} reviews</span>
              </div>
              {reviews.slice(0, 3).map((review, idx) => (
                <div key={idx} className="text-sm border-t border-mp-border pt-3 mt-3">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-mp-accent">★</span>
                      ))}
                    </span>
                    <span className="font-medium text-mp-charcoal text-xs">{review.title}</span>
                  </div>
                  <p className="text-mp-muted">{review.comment}</p>
                </div>
              ))}
            </>
          ) : (
            <p className="text-sm italic text-mp-text3">No reviews yet</p>
          )}
        </div>

        <p className="text-sm text-mp-charcoal whitespace-pre-wrap border-t border-mp-border pt-4">{listing.description}</p>

        {isLoggedIn ? (
          <BookingRequestForm listingId={listing.id} />
        ) : (
          <div className="border-t border-mp-border pt-4">
            <p className="text-sm text-mp-muted">Sign in to send a booking request to this vendor.</p>
          </div>
        )}
      </div>

      {/* Sticky CTA for logged-out users */}
      {!isLoggedIn && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-mp-border bg-mp-panel/95 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <p className="text-sm text-mp-muted">
              <span className="font-semibold text-mp-charcoal">Like this vendor?</span> Sign up to book and shortlist.
            </p>
            <Link
              href={`/login?next=${encodeURIComponent(loginNext)}`}
              className="rounded-md bg-mp-steel px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Sign up to book
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
