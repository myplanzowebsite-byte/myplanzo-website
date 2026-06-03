import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { verifyCheckoutSignature } from "@/lib/payments/razorpay";
import { capturePayment } from "@/lib/payments/capturePayment";

const bodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

/**
 * Standard Web Checkout — step 3. Verifies the modal's success signature
 * (HMAC of order_id|payment_id) and, only if it matches AND the order belongs
 * to a payment row for the signed-in customer, captures the payment. A
 * mismatch returns 400 and never marks anything paid. Capture is idempotent
 * and shared with the webhook, which remains the server-to-server source of
 * truth.
 */
export async function POST(req: Request) {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const valid = verifyCheckoutSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });
  if (!valid) {
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }

  // The signature is authentic, but confirm this order was issued for a
  // booking owned by the caller before capturing — never trust the order id
  // from the browser alone.
  const payment = await prisma.payment.findFirst({
    where: { razorpayOrderId: razorpay_order_id, booking: { customerId: session.sub } },
    select: { bookingId: true },
  });
  if (!payment) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const result = await capturePayment({
    paymentLinkId: razorpay_order_id, // capturePayment looks up by razorpayOrderId
    paymentId: razorpay_payment_id,
  });
  if (!result.ok) {
    return NextResponse.json({ error: "Could not record payment" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, bookingId: result.bookingId });
}
