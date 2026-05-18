import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

export async function GET() {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const events = await prisma.event.findMany({
    where: { customerId: session.sub },
    include: { _count: { select: { bookings: true } } },
    orderBy: { eventDate: "asc" },
  });
  return NextResponse.json({ events });
}

const postSchema = z.object({
  name: z.string().trim().min(1).max(160),
  eventType: z.string().trim().max(120).optional(),
  eventDate: z.string().datetime().optional(),
});

export async function POST(req: Request) {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const event = await prisma.event.create({
    data: {
      customerId: session.sub,
      name: parsed.data.name,
      eventType: parsed.data.eventType || null,
      eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : null,
    },
  });
  return NextResponse.json({ event });
}
