import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

const patchSchema = z.object({
  eventId: z.string().nullable(),
});

// Link or unlink a booking to one of the customer's events.
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;

  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const booking = await prisma.booking.findFirst({
    where: { id, customerId: session.sub },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  if (parsed.data.eventId) {
    const event = await prisma.event.findFirst({
      where: { id: parsed.data.eventId, customerId: session.sub },
    });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  await prisma.booking.update({
    where: { id },
    data: { eventId: parsed.data.eventId },
  });
  return NextResponse.json({ ok: true });
}
