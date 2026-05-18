import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { createNotification } from "@/lib/notifications/notify";

const bodySchema = z.object({
  reason: z.string().trim().min(8).max(2000),
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
    return NextResponse.json(
      { error: "Please describe the issue (at least 8 characters)." },
      { status: 400 },
    );
  }

  const booking = await prisma.booking.findFirst({
    where: { id, customerId: session.sub },
    include: { vendor: { select: { userId: true } }, disputes: { where: { status: "OPEN" } } },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.disputes.length > 0) {
    return NextResponse.json(
      { error: "There's already an open dispute on this booking." },
      { status: 409 },
    );
  }

  await prisma.dispute.create({
    data: { bookingId: id, raisedById: session.sub, reason: parsed.data.reason },
  });

  void createNotification({
    userId: booking.vendor.userId,
    type: "system",
    title: "Dispute raised",
    body: "A customer raised a dispute on one of your bookings. The MyPlanzo team will review it.",
    link: "/vendor/bookings",
  }).catch((e) => console.error("[notify] dispute raised:", e));

  return NextResponse.json({ ok: true });
}
