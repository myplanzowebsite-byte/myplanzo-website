import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { createRazorpayRefund } from "@/lib/payments/razorpay";
import { createNotification } from "@/lib/notifications/notify";

// Configurable cancellation window: a booking cannot be cancelled within this
// many hours of the event date.
const CANCELLATION_CUTOFF_HOURS = 24;

const bodySchema = z.object({
  reason: z.string().trim().min(4).max(1000),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "A cancellation reason is required." }, { status: 400 });
  }

  const booking = await prisma.booking.findFirst({
    where: { id, customerId: session.sub },
    include: { payments: true, vendor: { select: { businessName: true, userId: true } } },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: `A ${booking.status.toLowerCase()} booking cannot be cancelled.` },
      { status: 400 },
    );
  }
  if (booking.eventDate) {
    const hoursToEvent = (booking.eventDate.getTime() - Date.now()) / 3_600_000;
    if (hoursToEvent < CANCELLATION_CUTOFF_HOURS) {
      return NextResponse.json(
        {
          error: `Bookings can't be cancelled within ${CANCELLATION_CUTOFF_HOURS} hours of the event. Contact support.`,
        },
        { status: 400 },
      );
    }
  }

  // Refund a captured payment before cancelling. If the gateway rejects the
  // refund, abort — leave the booking intact so it can be retried.
  const captured = booking.payments.find((p) => p.status === "CAPTURED");
  let refunded = false;
  if (captured?.razorpayPaymentId) {
    try {
      await createRazorpayRefund(captured.razorpayPaymentId);
    } catch (e) {
      console.error("[cancel] refund failed:", e);
      return NextResponse.json(
        { error: "Refund could not be processed. Please try again or contact support." },
        { status: 502 },
      );
    }
    await prisma.payment.update({
      where: { id: captured.id },
      data: { status: "REFUNDED" },
    });
    refunded = true;
  }

  await prisma.booking.update({
    where: { id },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      cancellationReason: parsed.data.reason,
    },
  });

  void createNotification({
    userId: booking.vendor.userId,
    type: "booking",
    title: "Booking cancelled",
    body: refunded
      ? "A customer cancelled a paid booking — the payment has been refunded."
      : "A customer cancelled a booking.",
    link: "/vendor/bookings",
  }).catch((e) => console.error("[notify] booking cancelled:", e));

  return NextResponse.json({ ok: true, refunded });
}
