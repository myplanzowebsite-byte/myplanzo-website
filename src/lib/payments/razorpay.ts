const COMMISSION_BPS = 1500; // 15.00%

export function commissionFromAmountPaise(amountPaise: number) {
  return Math.floor((amountPaise * COMMISSION_BPS) / 10000);
}

/** Create order — real Razorpay when keys set; otherwise dev mock. */
export async function createRazorpayOrder(params: {
  bookingId: string;
  amountPaise: number;
  receipt: string;
}) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return {
      mode: "mock" as const,
      orderId: `mock_order_${params.bookingId}`,
      amount: params.amountPaise,
      currency: "INR",
      keyId: "",
    };
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
      notes: { bookingId: params.bookingId },
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Razorpay order failed: ${t}`);
  }
  const data = (await res.json()) as { id: string; amount: number; currency: string };
  return {
    mode: "live" as const,
    orderId: data.id,
    amount: data.amount,
    currency: data.currency,
    keyId,
  };
}
