import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/** Minimal webhook: mark payment captured when signature valid (extend for production idempotency). */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  if (secret && signature) {
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    if (expected !== signature) {
      return NextResponse.json({ error: "Bad signature" }, { status: 400 });
    }
  }
  let payload: { event?: string; payload?: { payment?: { entity?: { order_id?: string; id?: string } } } };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const orderId = payload.payload?.payment?.entity?.order_id;
  const payId = payload.payload?.payment?.entity?.id;
  if (!orderId) return NextResponse.json({ ok: true });

  const payment = await prisma.payment.findFirst({
    where: { razorpayOrderId: orderId },
  });
  if (!payment) return NextResponse.json({ ok: true });
  if (payment.status === "CAPTURED") return NextResponse.json({ ok: true });

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "CAPTURED",
      razorpayPaymentId: payId ?? payment.razorpayPaymentId,
    },
  });
  await prisma.booking.update({
    where: { id: payment.bookingId },
    data: { status: "CONFIRMED" },
  });
  return NextResponse.json({ ok: true });
}
