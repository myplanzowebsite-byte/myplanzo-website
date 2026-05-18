import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { BookingChat } from "@/components/customer/BookingChat";
import { ChecklistSection } from "@/components/customer/ChecklistSection";
import { CancelBookingButton } from "@/components/customer/CancelBookingButton";
import { RaiseDisputeButton } from "@/components/customer/RaiseDisputeButton";

export default async function CustomerBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await readSession();
  if (!session || session.role !== "CUSTOMER") redirect("/login");
  const { id } = await params;
  const booking = await prisma.booking.findFirst({
    where: { id, customerId: session.sub },
    include: {
      vendor: true,
      payments: true,
      review: true,
      disputes: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!booking) notFound();

  return (
    <div className="space-y-6">
      <Link href="/customer/bookings" className="text-sm underline">
        ← Bookings
      </Link>
      <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)] space-y-2">
        <div className="flex flex-wrap justify-between gap-2">
          <h1 className="text-xl font-semibold">{booking.vendor.businessName}</h1>
          <span className="text-sm text-mp-muted">{booking.status}</span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{booking.eventDetails}</p>
        <p className="text-sm text-mp-muted">
          {booking.amountPaise > 0
            ? `Amount: ₹${(booking.amountPaise / 100).toFixed(2)}`
            : "Awaiting a quote from the vendor."}
        </p>
        {(() => {
          const paid = booking.payments.some(
            (p) => p.status === "CAPTURED" || p.status === "AUTHORIZED",
          );
          if (booking.amountPaise > 0 && paid) {
            return (
              <p className="rounded-md border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-700">
                Paid — booking confirmed.
              </p>
            );
          }
          if (booking.amountPaise > 0) {
            return (
              <Link
                href={`/customer/checkout/${booking.id}`}
                className="inline-block rounded-md bg-mp-charcoal px-4 py-2 text-sm font-medium text-mp-panel transition-colors hover:bg-mp-accent"
              >
                Proceed to checkout →
              </Link>
            );
          }
          return null;
        })()}
        {booking.status === "COMPLETED" && (
          <Link
            href={`/customer/bookings/${booking.id}/review`}
            className="inline-block rounded-md bg-mp-charcoal px-4 py-2 text-sm font-medium text-mp-panel transition-colors hover:bg-mp-accent"
          >
            {booking.review ? "View your review" : "Rate this vendor →"}
          </Link>
        )}
        {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
          <div className="pt-2">
            <CancelBookingButton
              bookingId={booking.id}
              isPaid={booking.payments.some((p) => p.status === "CAPTURED")}
            />
          </div>
        )}
        {booking.status === "CANCELLED" && booking.cancellationReason && (
          <p className="rounded-md border border-mp-border bg-mp-warm px-3 py-2 text-sm text-mp-charcoal">
            Cancelled — {booking.cancellationReason}
          </p>
        )}

        {/* Disputes */}
        {booking.disputes.length > 0 ? (
          <div className="space-y-1 border-t border-mp-border pt-2">
            {booking.disputes.map((d) => (
              <div key={d.id} className="rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm">
                <p className="flex justify-between">
                  <span className="font-medium text-mp-charcoal">Dispute</span>
                  <span className="text-xs text-mp-muted">{d.status}</span>
                </p>
                <p className="mt-0.5 text-mp-muted">{d.reason}</p>
                {d.resolution && (
                  <p className="mt-1 text-xs text-mp-charcoal">
                    <span className="font-medium">Resolution:</span> {d.resolution}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          (booking.status === "CONFIRMED" || booking.status === "COMPLETED") && (
            <div className="border-t border-mp-border pt-2">
              <RaiseDisputeButton bookingId={booking.id} />
            </div>
          )
        )}
      </div>
      <ChecklistSection bookingId={booking.id} />
      <BookingChat bookingId={booking.id} currentUserId={session.sub} />
    </div>
  );
}
