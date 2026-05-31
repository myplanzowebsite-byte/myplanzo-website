import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { formatINR } from "@/lib/format";
import { CheckoutClient } from "./CheckoutClient";
import { PixelEvent } from "@/components/PixelEvent";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paid?: string }>;
}) {
  const session = await readSession();
  const { id } = await params;
  const { paid: justPaid } = await searchParams;
  if (!session || session.role !== "CUSTOMER") {
    redirect(`/login?next=/customer/checkout/${id}`);
  }

  const booking = await prisma.booking.findFirst({
    where: { id, customerId: session.sub },
    include: { vendor: { select: { businessName: true } }, payments: true },
  });
  if (!booking) notFound();

  const paid = booking.payments.some((p) => p.status === "CAPTURED" || p.status === "AUTHORIZED");
  const amount = booking.amountPaise;

  return (
    <div className="space-y-6">
      <Link href={`/customer/bookings/${id}`} className="text-sm underline">
        ← Back to booking
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-mp-charcoal">Checkout</h1>
        <p className="text-sm text-mp-muted mt-1">{booking.vendor.businessName}</p>
      </div>

      <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)] space-y-4">
        <div className="flex items-baseline justify-between border-b border-mp-border pb-4">
          <span className="text-sm text-mp-muted">Vendor-confirmed amount</span>
          <span className="text-2xl font-semibold text-mp-charcoal">
            {amount > 0 ? formatINR(amount / 100) : "—"}
          </span>
        </div>

        {paid ? (
          <>
            {/* Fire the Purchase pixel only on the fresh post-payment redirect. */}
            {justPaid === "1" && (
              <PixelEvent
                event="Purchase"
                params={{
                  content_type: "product",
                  content_ids: [booking.id],
                  value: amount / 100,
                  currency: "INR",
                }}
              />
            )}
            <p className="rounded-md border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700">
              Payment received. Your booking is confirmed.
            </p>
          </>
        ) : amount <= 0 ? (
          <p className="rounded-md border border-mp-border bg-mp-warm px-4 py-3 text-sm text-mp-charcoal">
            No confirmed amount yet. Accept a vendor quote from your messages to proceed to
            payment.
          </p>
        ) : (
          <CheckoutClient bookingId={booking.id} />
        )}

        <p className="text-xs text-mp-text3">
          Payments are processed securely by Razorpay. MyPlanzo never stores your card or UPI
          details.
        </p>
      </div>
    </div>
  );
}
