import { NextResponse } from "next/server";
import crypto from "crypto";
import { capturePayment } from "@/lib/payments/capturePayment";

/**
 * Razorpay webhook — the source of truth for payment capture. Fires
 * server-to-server regardless of what the customer's browser does.
 * Handles the `payment_link.paid` event. Idempotent via capturePayment().
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
      payment?: { entity?: { id?: string } };
    };
  };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.event === "payment_link.paid") {
    const paymentLinkId = payload.payload?.payment_link?.entity?.id;
    const paymentId = payload.payload?.payment?.entity?.id;
    if (paymentLinkId && paymentId) {
      await capturePayment({ paymentLinkId, paymentId });
    }
  }

  // Always 200 for handled/ignored events so Razorpay doesn't retry forever.
  return NextResponse.json({ ok: true });
}
