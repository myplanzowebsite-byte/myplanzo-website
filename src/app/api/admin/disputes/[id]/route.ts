import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { createNotification } from "@/lib/notifications/notify";

const bodySchema = z.object({
  status: z.enum(["RESOLVED", "REJECTED"]),
  resolution: z.string().trim().min(4).max(2000),
  // Optional admin override of the booking outcome.
  overrideBookingStatus: z.enum(["CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["ADMIN", "SUBADMIN"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const dispute = await prisma.dispute.findUnique({ where: { id } });
  if (!dispute) return NextResponse.json({ error: "Dispute not found" }, { status: 404 });

  await prisma.dispute.update({
    where: { id },
    data: {
      status: parsed.data.status,
      resolution: parsed.data.resolution,
      resolvedAt: new Date(),
    },
  });

  if (parsed.data.overrideBookingStatus) {
    await prisma.booking.update({
      where: { id: dispute.bookingId },
      data: { status: parsed.data.overrideBookingStatus },
    });
  }

  void createNotification({
    userId: dispute.raisedById,
    type: "system",
    title: `Dispute ${parsed.data.status.toLowerCase()}`,
    body: parsed.data.resolution,
    link: `/customer/bookings/${dispute.bookingId}`,
  }).catch((e) => console.error("[notify] dispute resolved:", e));

  return NextResponse.json({ ok: true });
}
