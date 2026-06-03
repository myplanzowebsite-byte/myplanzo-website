import { NextResponse } from "next/server";
import crypto from "crypto";
import { capturePayment } from "@/lib/payments/capturePayment";

/**
 * Razorpay webhook — the source of truth for payment capture. Fires
 * server-to-server regardless of what the customer's browser does.
 * Handles `payment_link.paid` (Payment Links) and `order.paid` (Standard
 * Checkout). Idempotent via capturePayment(), which keys on the order/link id.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (secret) {
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    if (expected !== signature) {
      return NextResponse.json({ error: "Bad signature" }, { status: 400 });
    }
  }

  let payload: {
    event?: string;
    payload?: {
      payment_link?: { entity?: { id?: string } };
      order?: { entity?: { id?: string } };
      payment?: { entity?: { id?: string; order_id?: string } };
    };
  };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Payment Links flow.
  if (payload.event === "payment_link.paid") {
    const paymentLinkId = payload.payload?.payment_link?.entity?.id;
    const paymentId = payload.payload?.payment?.entity?.id;
    if (paymentLinkId && paymentId) {
      await capturePayment({ paymentLinkId, paymentId });
    }
  }

  // Standard Checkout (Orders) flow. `order.paid` carries both the order and
  // the payment; `payment.captured` carries the order id on the payment entity.
  if (payload.event === "order.paid" || payload.event === "payment.captured") {
    const orderId =
      payload.payload?.order?.entity?.id ?? payload.payload?.payment?.entity?.order_id;
    const paymentId = payload.payload?.payment?.entity?.id;
    if (orderId && paymentId) {
      await capturePayment({ paymentLinkId: orderId, paymentId });
    }
  }

  // Always 200 for handled/ignored events so Razorpay doesn't retry forever.
  return NextResponse.json({ ok: true });
}
