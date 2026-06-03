import crypto from "crypto";

const COMMISSION_BPS = 1500; // 15.00%

export function commissionFromAmountPaise(amountPaise: number) {
  return Math.floor((amountPaise * COMMISSION_BPS) / 10000);
}

/**
 * Verify a Razorpay Payment Link callback signature.
 * Razorpay signs `payment_link_id|payment_link_reference_id|payment_link_status|payment_id`
 * with HMAC-SHA256 using the key secret. Note this differs from the Orders
 * signature scheme (`order_id|payment_id`).
 */
export function verifyPaymentLinkSignature(params: {
  paymentLinkId: string;
  referenceId: string;
  status: string;
  paymentId: string;
  signature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(
      `${params.paymentLinkId}|${params.referenceId}|${params.status}|${params.paymentId}`,
    )
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(params.signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Error thrown by Razorpay API helpers, carrying the HTTP status so routes
 * can distinguish auth failures (401) from other gateway errors (500). */
export class RazorpayApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "RazorpayApiError";
    this.status = status;
  }
}

/**
 * Create a Razorpay Order for Standard Web Checkout (the in-page checkout.js
 * modal). Returns the order id the browser hands to the Razorpay modal. The
 * order id is later used as the lookup key for capture, mirroring how Payment
 * Links store their link id in `Payment.razorpayOrderId`.
 */
export async function createRazorpayOrder(params: {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys are not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)");
  }
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amountPaise,
      currency: "INR",
      receipt: params.receipt,
      notes: params.notes,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new RazorpayApiError(`Razorpay order failed: ${t}`, res.status);
  }
  const data = (await res.json()) as { id: string; amount: number; currency: string };
  return { orderId: data.id, amount: data.amount, currency: data.currency };
}

/**
 * Verify a Razorpay Standard Checkout success signature. The modal returns
 * `razorpay_order_id`, `razorpay_payment_id` and `razorpay_signature`; the
 * signature is HMAC-SHA256 of `order_id|payment_id` keyed by the secret. Note
 * this differs from the Payment Link scheme in verifyPaymentLinkSignature().
 */
export function verifyCheckoutSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(params.signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Issue a full refund for a captured Razorpay payment. Used when a paid
 * booking is cancelled. Throws if the gateway rejects the refund so the
 * caller can avoid marking the booking cancelled on a failed refund.
 */
export async function createRazorpayRefund(razorpayPaymentId: string) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys are not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)");
  }
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch(
    `https://api.razorpay.com/v1/payments/${razorpayPaymentId}/refund`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ speed: "normal" }),
    },
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Razorpay refund failed: ${t}`);
  }
  return (await res.json()) as { id: string; status: string };
}

/**
 * Create a hosted Razorpay Payment Link for a vendor-confirmed amount.
 * `callback_url` brings the customer's browser back to the app after payment.
 */
export async function createRazorpayPaymentLink(params: {
  bookingId: string;
  amountPaise: number;
  description: string;
  customerContact?: { name?: string; email?: string; phone?: string };
}) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys are not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)");
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/payment_links", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amountPaise,
      currency: "INR",
      description: params.description,
      customer: {
        name: params.customerContact?.name,
        email: params.customerContact?.email,
        contact: params.customerContact?.phone,
      },
      notify: { sms: false, email: false },
      notes: { bookingId: params.bookingId },
      callback_url: `${baseUrl}/api/payments/callback`,
      callback_method: "get",
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Razorpay payment link failed: ${t}`);
  }
  const data = (await res.json()) as { id: string; short_url: string };
  return { paymentLinkId: data.id, shortUrl: data.short_url };
}
