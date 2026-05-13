import Link from "next/link";
import type { MockListing } from "@/lib/mockListings";
import { formatINR, priceUnitForListing } from "@/lib/format";

export function MockListingDetail({
  listing,
  isLoggedIn,
}: {
  listing: MockListing;
  isLoggedIn: boolean;
}) {
  const unit = priceUnitForListing({ title: listing.title, eventTags: listing.eventTags });
  const priceLabel = `${formatINR(listing.priceMin)}${listing.priceMax ? ` – ${formatINR(listing.priceMax)}` : ""}`;
  const loginNext = `/listings/${listing.id}`;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <Link href="/browse" className="text-sm text-mp-charcoal underline">
          ← Back to browse
        </Link>
        <span className="rounded-md border border-mp-border bg-mp-panel px-2 py-1 text-[10px] uppercase tracking-wider text-mp-muted">
          Preview listing
        </span>
      </div>

      {listing.photos[0] && (
        <div className="rounded-[var(--radius-mp-card)] overflow-hidden shadow-[var(--shadow-mp-card)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={listing.photos[0]} alt={listing.title} className="w-full h-64 object-cover" />
        </div>
      )}

      <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)] space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-mp-steel">{listing.category}</p>
            <h1 className="text-2xl font-semibold text-mp-charcoal mt-1">{listing.title}</h1>
            <p className="text-sm text-mp-muted mt-1">{listing.vendorName}</p>
          </div>
          {listing.waPhone && (
            <a
              href={`https://wa.me/${listing.waPhone}?text=${encodeURIComponent(`Hi ${listing.vendorName}, I saw you on MyPlanzo.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-mp-border bg-mp-card px-4 py-2 text-sm font-medium text-mp-charcoal hover:border-green-500/40"
            >
              WhatsApp
            </a>
          )}
        </div>

        <div className="border-t border-mp-border pt-4 flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-mp-muted">Pricing</p>
            <p className="font-semibold text-mp-charcoal">
              {priceLabel}
              <span className="ml-1 text-xs font-normal text-mp-text3">{unit}</span>
            </p>
          </div>
          <div>
            <p className="text-mp-muted">Location</p>
            <p className="font-semibold text-mp-charcoal">{listing.location}</p>
          </div>
          <div>
            <p className="text-mp-muted">Events completed</p>
            <p className="font-semibold text-mp-charcoal">{listing.eventsCompleted}</p>
          </div>
          <div>
            <p className="text-mp-muted">Good for</p>
            <p className="font-semibold text-mp-charcoal">{listing.eventTags.join(", ")}</p>
          </div>
        </div>

        <div className="border-t border-mp-border pt-4">
          <p className="text-sm font-semibold text-mp-charcoal mb-3">Customer Reviews</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${i < Math.floor(listing.rating) ? "text-mp-accent" : "text-mp-muted"}`}
                >
                  ★
                </span>
              ))}
            </span>
            <span className="text-sm text-mp-muted">
              {listing.rating.toFixed(1)} · {listing.reviewCount} reviews
            </span>
          </div>
          {listing.reviews.map((review, idx) => (
            <div key={idx} className="text-sm border-t border-mp-border pt-3 mt-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-mp-accent">★</span>
                  ))}
                </span>
                <span className="font-medium text-mp-charcoal text-xs">{review.title}</span>
                <span className="text-xs text-mp-text3">· {review.author}</span>
              </div>
              <p className="text-mp-muted">{review.comment}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-mp-charcoal whitespace-pre-wrap border-t border-mp-border pt-4">
          {listing.description}
        </p>

        <div className="border-t border-mp-border pt-4">
          <p className="rounded-md border border-mp-border bg-mp-panel px-4 py-3 text-sm text-mp-muted">
            This is a preview listing — bookings are disabled.
            {!isLoggedIn && (
              <>
                {" "}
                <Link
                  href={`/login?next=${encodeURIComponent(loginNext)}`}
                  className="underline text-mp-charcoal"
                >
                  Sign up
                </Link>{" "}
                to book real vendors when they come online.
              </>
            )}
          </p>
        </div>
      </div>

      {!isLoggedIn && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-mp-border bg-mp-panel/95 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <p className="text-sm text-mp-muted">
              <span className="font-semibold text-mp-charcoal">Like this vendor?</span> Sign up to
              book and shortlist.
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
