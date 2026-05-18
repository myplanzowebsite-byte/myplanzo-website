import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { ReviewForm } from "./ReviewForm";

export default async function PostEventReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await readSession();
  const { id } = await params;
  if (!session || session.role !== "CUSTOMER") {
    redirect(`/login?next=/customer/bookings/${id}/review`);
  }

  const booking = await prisma.booking.findFirst({
    where: { id, customerId: session.sub },
    include: { vendor: true, review: true },
  });
  if (!booking) notFound();

  return (
    <div className="space-y-6">
      <Link href={`/customer/bookings/${id}`} className="text-sm underline">
        ← Back to booking
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-mp-charcoal">Rate your experience</h1>
        <p className="text-sm text-mp-muted mt-1">
          {booking.vendor.businessName}
        </p>
      </div>

      {booking.status !== "COMPLETED" ? (
        <p className="rounded-md border border-mp-border bg-mp-warm px-4 py-3 text-sm text-mp-charcoal">
          This booking is <strong>{booking.status}</strong>. You can leave a review once the
          event is marked completed.
        </p>
      ) : booking.review ? (
        <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
          <p className="text-sm font-semibold text-mp-charcoal mb-2">
            You rated this vendor
            <span className="ml-2 text-mp-accent">
              {"★".repeat(booking.review.rating)}
              {"☆".repeat(5 - booking.review.rating)}
            </span>
          </p>
          {booking.review.title && (
            <p className="text-sm font-medium text-mp-charcoal">{booking.review.title}</p>
          )}
          {booking.review.comment && (
            <p className="text-sm text-mp-muted mt-1">{booking.review.comment}</p>
          )}
        </div>
      ) : (
        <ReviewForm bookingId={booking.id} />
      )}
    </div>
  );
}
