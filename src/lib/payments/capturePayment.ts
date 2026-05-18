import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications/notify";

type CaptureResult =
  | { ok: false; reason: "not_found" }
  | { ok: true; alreadyCaptured: boolean; bookingId: string };

/**
 * The single chokepoint for marking a payment captured. Idempotent: a
 * second call for an already-captured payment is a harmless no-op. Called by
 * both the Razorpay webhook (source of truth) and the callback route (UX
 * return + dev fallback). Does NOT change booking status — "paid" is derived
 * from `Payment.status`, never stored on the booking.
 */
export async function capturePayment(params: {
  paymentLinkId: string;
  paymentId: string;
}): Promise<CaptureResult> {
  const payment = await prisma.payment.findFirst({
    where: { razorpayOrderId: params.paymentLinkId },
    include: { booking: { include: { vendor: { select: { userId: true } } } } },
  });
  if (!payment) return { ok: false, reason: "not_found" };

  if (payment.status === "CAPTURED") {
    return { ok: true, alreadyCaptured: true, bookingId: payment.bookingId };
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "CAPTURED", razorpayPaymentId: params.paymentId },
  });

  void createNotification({
    userId: payment.booking.vendor.userId,
    type: "payment",
    title: "Payment received",
    body: `A customer paid ₹${new Intl.NumberFormat("en-IN").format(
      payment.amountPaise / 100,
    )} for their booking.`,
    link: "/vendor/bookings",
  }).catch((e) => console.error("[notify] payment captured:", e));

  return { ok: true, alreadyCaptured: false, bookingId: payment.bookingId };
}
