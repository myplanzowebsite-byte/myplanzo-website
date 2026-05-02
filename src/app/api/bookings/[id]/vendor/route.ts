import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

const bodySchema = z.object({
  action: z.enum(["accept", "decline"]),
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
  const nextStatus = parsed.data.action === "accept" ? "CONFIRMED" : "CANCELLED";
  const updated = await prisma.booking.update({
    where: { id },
    data: { status: nextStatus },
  });
  return NextResponse.json({ booking: updated });
}
