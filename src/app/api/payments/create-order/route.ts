import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { commissionFromAmountPaise, createRazorpayOrder } from "@/lib/payments/razorpay";

const bodySchema = z.object({
  bookingId: z.string(),
});

export async function POST(req: Request) {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const booking = await prisma.booking.findFirst({
    where: {
      id: parsed.data.bookingId,
      customerId: session.sub,
      status: "PENDING",
    },
    include: { payments: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not payable" }, { status: 400 });
  }
  const existing = booking.payments.find((p) => p.status === "CAPTURED" || p.status === "AUTHORIZED");
  if (existing) {
    return NextResponse.json({ error: "Already paid" }, { status: 400 });
  }

  const commissionPaise = commissionFromAmountPaise(booking.amountPaise);
  const pending = booking.payments.find((p) => p.status === "PENDING");
  const order = await createRazorpayOrder({
    bookingId: booking.id,
    amountPaise: booking.amountPaise,
    receipt: booking.id.slice(0, 12),
  });

  if (pending) {
    await prisma.payment.update({
      where: { id: pending.id },
      data: { razorpayOrderId: order.orderId, commissionPaise },
    });
  } else {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        razorpayOrderId: order.orderId,
        amountPaise: booking.amountPaise,
        commissionPaise,
        status: "PENDING",
      },
    });
  }

  return NextResponse.json({
    orderId: order.orderId,
    amount: order.amount,
    currency: order.currency,
    keyId: order.keyId,
    mode: order.mode,
    commissionPaise,
  });
}
