import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShortlistButton } from "@/components/customer/ShortlistButton";
import { BookingRequestForm } from "@/components/customer/BookingRequestForm";

type ListingReview = {
  rating: number;
  title?: string | null;
  comment?: string | null;
};

export default async function CustomerListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.serviceListing.findFirst({
    where: { id, status: "ACTIVE", vendor: { verificationStatus: "ACTIVE" } },
    include: { vendor: { include: { reviews: { select: { rating: true, title: true, comment: true } } } } },
  });
  if (!listing) notFound();

  // Calculate average rating
  const reviews: ListingReview[] = listing.vendor.reviews ?? [];
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      <Link href="/customer/browse" className="text-sm text-mp-charcoal underline">
        ← Back
      </Link>

      {/* Hero image */}
      {listing.photos?.[0] && (
        <div className="rounded-[var(--radius-mp-card)] overflow-hidden shadow-[var(--shadow-mp-card)]">
          <img src={listing.photos[0]} alt={listing.title} className="w-full h-64 object-cover" />
        </div>
      )}

      <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)] space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-mp-charcoal">{listing.title}</h1>
            <p className="text-sm text-mp-muted mt-1">{listing.vendor.businessName}</p>
          </div>
          <ShortlistButton listingId={listing.id} />
        </div>

        {/* Vendor info section */}
        <div className="border-t border-mp-border pt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <p className="text-mp-muted">Pricing</p>
            <p className="font-semibold text-mp-charcoal">
              {listing.priceMin ? `₹${listing.priceMin.toLocaleString()}` : "Contact for pricing"}
              {listing.priceMax ? ` - ₹${listing.priceMax.toLocaleString()}` : ""}
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

        {/* Rating section */}
        {avgRating > 0 && (
          <div className="border-t border-mp-border pt-4">
            <p className="text-sm font-semibold text-mp-charcoal mb-3">Customer Reviews</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-lg ${i < Math.floor(avgRating) ? 'text-mp-accent' : 'text-mp-muted'}`}>
                    ★
                  </span>
                ))}
              </span>
              <span className="text-sm text-mp-muted">{avgRating.toFixed(1)} based on {listing.vendor.reviews.length} reviews</span>
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
          </div>
        )}

        <p className="text-sm text-mp-charcoal whitespace-pre-wrap border-t border-mp-border pt-4">{listing.description}</p>
        <BookingRequestForm listingId={listing.id} />
      </div>
    </div>
  );
}
