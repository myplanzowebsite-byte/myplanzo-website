import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { createNotification } from "@/lib/notifications/notify";

/**
 * Vendor marks the event finished. Allowed only while the event is IN_PROGRESS
 * (arrival OTP already verified). Advances both the fine-grained stage and the
 * coarse BookingStatus to COMPLETED — the latter is what lights up the existing
 * customer review flow — and bumps the vendor's completed-events counter.
 */
export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["VENDOR"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { vendor: { select: { id: true, userId: true } } },
  });
  if (!booking || booking.vendor.userId !== session.sub) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.stage === "COMPLETED") {
    return NextResponse.json({ error: "This event is already completed." }, { status: 400 });
  }
  if (booking.stage !== "IN_PROGRESS") {
    return NextResponse.json(
      { error: "Confirm the customer's arrival OTP before completing the event." },
      { status: 400 },
    );
  }

  await prisma.$transaction([
    prisma.booking.update({
      where: { id },
      data: { stage: "COMPLETED", status: "COMPLETED" },
    }),
    prisma.vendorProfile.update({
      where: { id: booking.vendor.id },
      data: { eventsCompleted: { increment: 1 } },
    }),
  ]);

  void createNotification({
    userId: booking.customerId,
    type: "booking",
    title: "Event completed",
    body: "Your vendor marked the event as complete. We'd love your review!",
    link: `/customer/bookings/${id}/review`,
  }).catch((e) => console.error("[notify] event completed:", e));

  return NextResponse.json({ ok: true, stage: "COMPLETED" });
}
