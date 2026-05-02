import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

export async function GET() {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const items = await prisma.shortlistEntry.findMany({
    where: { userId: session.sub },
    include: { listing: { include: { vendor: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ items });
}

const bodySchema = z.object({
  listingId: z.string(),
});

export async function POST(req: Request) {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const listing = await prisma.serviceListing.findFirst({
    where: {
      id: parsed.data.listingId,
      status: "ACTIVE",
      vendor: { verificationStatus: "ACTIVE" },
    },
  });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  await prisma.shortlistEntry.upsert({
    where: { userId_listingId: { userId: session.sub, listingId: listing.id } },
    create: { userId: session.sub, listingId: listing.id },
    update: {},
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId");
  if (!listingId) return NextResponse.json({ error: "listingId required" }, { status: 400 });
  await prisma.shortlistEntry.deleteMany({
    where: { userId: session.sub, listingId },
  });
  return NextResponse.json({ ok: true });
}
