import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

const postSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional(),
  comment: z.string().trim().max(2000).optional(),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;

  const json = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const booking = await prisma.booking.findFirst({
    where: { id, customerId: session.sub },
    include: { review: true },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "You can only review completed bookings." },
      { status: 400 },
    );
  }
  if (booking.review) {
    return NextResponse.json({ error: "You already reviewed this booking." }, { status: 409 });
  }

  await prisma.review.create({
    data: {
      bookingId: booking.id,
      vendorId: booking.vendorId,
      customerId: session.sub,
      rating: parsed.data.rating,
      title: parsed.data.title || null,
      comment: parsed.data.comment || null,
    },
  });

  return NextResponse.json({ ok: true });
}
