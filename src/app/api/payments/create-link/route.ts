import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { commissionFromAmountPaise, createRazorpayPaymentLink } from "@/lib/payments/razorpay";

const bodySchema = z.object({ bookingId: z.string() });

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
    where: { id: parsed.data.bookingId, customerId: session.sub },
    include: {
      payments: true,
      vendor: { select: { businessName: true } },
      customer: { select: { email: true, phone: true, customerProfile: true } },
    },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.amountPaise <= 0) {
    return NextResponse.json(
      { error: "No confirmed amount yet — accept a vendor quote first." },
      { status: 400 },
    );
  }
  if (booking.payments.some((p) => p.status === "CAPTURED" || p.status === "AUTHORIZED")) {
    return NextResponse.json({ error: "This booking is already paid." }, { status: 400 });
  }

  const link = await createRazorpayPaymentLink({
    bookingId: booking.id,
    amountPaise: booking.amountPaise,
    description: `MyPlanzo booking — ${booking.vendor.businessName}`,
    customerContact: {
      name: booking.customer.customerProfile?.displayName ?? undefined,
      email: booking.customer.email,
      phone: booking.customer.phone,
    },
  });

  const commissionPaise = commissionFromAmountPaise(booking.amountPaise);
  const pending = booking.payments.find((p) => p.status === "PENDING");
  if (pending) {
    await prisma.payment.update({
      where: { id: pending.id },
      data: { amountPaise: booking.amountPaise, commissionPaise, razorpayOrderId: link.paymentLinkId },
    });
  } else {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        razorpayOrderId: link.paymentLinkId,
        amountPaise: booking.amountPaise,
        commissionPaise,
        status: "PENDING",
      },
    });
  }

  return NextResponse.json({ url: link.shortUrl });
}
