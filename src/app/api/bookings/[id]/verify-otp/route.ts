import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { createNotification } from "@/lib/notifications/notify";

const bodySchema = z.object({ code: z.string().trim().min(4).max(8) });

/** Constant-time compare so a wrong code can't be guessed by timing. */
function codesMatch(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

/**
 * Vendor enters the arrival OTP the customer received once the booking is fully
 * paid. A correct code confirms arrival / service commencement: the booking
 * moves to IN_PROGRESS and `otpVerifiedAt` is stamped.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["VENDOR"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { vendor: { select: { userId: true } } },
  });
  if (!booking || booking.vendor.userId !== session.sub) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.stage === "IN_PROGRESS" || booking.stage === "COMPLETED") {
    return NextResponse.json({ error: "Arrival is already confirmed." }, { status: 400 });
  }
  if (booking.stage !== "ADVANCE_PAID" || !booking.arrivalOtp) {
    return NextResponse.json(
      { error: "The customer hasn't completed payment yet." },
      { status: 400 },
    );
  }
  if (!codesMatch(parsed.data.code, booking.arrivalOtp)) {
    return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 400 });
  }

  await prisma.booking.update({
    where: { id },
    data: { stage: "IN_PROGRESS", otpVerifiedAt: new Date() },
  });

  void createNotification({
    userId: booking.customerId,
    type: "booking",
    title: "Your event has started",
    body: "Your vendor confirmed their arrival — the event is now in progress.",
    link: `/customer/bookings/${id}`,
  }).catch((e) => console.error("[notify] otp verified:", e));

  return NextResponse.json({ ok: true, stage: "IN_PROGRESS" });
}
