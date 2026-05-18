import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentLinkSignature } from "@/lib/payments/razorpay";
import { capturePayment } from "@/lib/payments/capturePayment";

/**
 * Razorpay Payment Link `callback_url` target. Razorpay redirects the
 * customer's browser here (GET) after payment. This route verifies the
 * signature, captures the payment (dev fallback for the webhook), then
 * redirects the customer back into the app.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const paymentId = sp.get("razorpay_payment_id") ?? "";
  const paymentLinkId = sp.get("razorpay_payment_link_id") ?? "";
  const referenceId = sp.get("razorpay_payment_link_reference_id") ?? "";
  const status = sp.get("razorpay_payment_link_status") ?? "";
  const signature = sp.get("razorpay_signature") ?? "";

  const base = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;
  const fallback = `${base}/customer/bookings`;

  if (!paymentId || !paymentLinkId || !signature) {
    return NextResponse.redirect(fallback);
  }

  const valid = verifyPaymentLinkSignature({
    paymentLinkId,
    referenceId,
    status,
    paymentId,
    signature,
  });
  if (!valid || status !== "paid") {
    return NextResponse.redirect(fallback);
  }

  const result = await capturePayment({ paymentLinkId, paymentId });
  if (!result.ok) {
    return NextResponse.redirect(fallback);
  }
  return NextResponse.redirect(`${base}/customer/checkout/${result.bookingId}`);
}
