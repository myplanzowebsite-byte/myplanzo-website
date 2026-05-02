import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

const patchSchema = z.object({
  done: z.boolean().optional(),
  title: z.string().min(1).optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string; itemId: string }> },
) {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id, itemId } = await ctx.params;
  const booking = await prisma.booking.findFirst({
    where: { id, customerId: session.sub },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const item = await prisma.eventChecklistItem.findFirst({
    where: { id: itemId, bookingId: id },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const updated = await prisma.eventChecklistItem.update({
    where: { id: itemId },
    data: parsed.data,
  });
  return NextResponse.json({ item: updated });
}
