import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const booking = await prisma.booking.findFirst({
    where: { id, customerId: session.sub },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const items = await prisma.eventChecklistItem.findMany({
    where: { bookingId: id },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ items });
}

const postSchema = z.object({
  title: z.string().min(1),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const booking = await prisma.booking.findFirst({
    where: { id, customerId: session.sub },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const json = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const count = await prisma.eventChecklistItem.count({ where: { bookingId: id } });
  const item = await prisma.eventChecklistItem.create({
    data: { bookingId: id, title: parsed.data.title, sortOrder: count },
  });
  return NextResponse.json({ item });
}
