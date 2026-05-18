import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const event = await prisma.event.findFirst({
    where: { id, customerId: session.sub },
  });
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  // Bookings keep existing — the relation is SetNull on delete.
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
