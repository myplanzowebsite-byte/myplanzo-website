import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { createNotification } from "@/lib/notifications/notify";

// The vendor's only direct action on a pending booking is to decline it.
// To take the booking, the vendor sends a quote (see /api/bookings/[id]/quotes);
// the customer accepting that quote is what confirms the booking.
const bodySchema = z.object({
  action: z.literal("decline"),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["VENDOR"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const vendor = await prisma.vendorProfile.findUnique({ where: { userId: session.sub } });
  if (!vendor) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { id } = await ctx.params;
  const booking = await prisma.booking.findFirst({
    where: { id, vendorId: vendor.id, status: "PENDING" },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  void createNotification({
    userId: booking.customerId,
    type: "booking",
    title: "Booking declined",
    body: `${vendor.businessName} could not take this booking.`,
    link: `/customer/bookings/${id}`,
  }).catch((e) => console.error("[notify] booking declined:", e));

  return NextResponse.json({ booking: updated });
}
