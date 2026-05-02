import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

const createSchema = z.object({
  listingId: z.string(),
  eventDate: z.string().datetime().optional(),
  eventDetails: z.string().min(4),
  amountPaise: z.number().int().positive(),
});

export async function POST(req: Request) {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const listing = await prisma.serviceListing.findFirst({
    where: {
      id: parsed.data.listingId,
      status: "ACTIVE",
      vendor: { verificationStatus: "ACTIVE" },
    },
    include: { vendor: true },
  });
  if (!listing) return NextResponse.json({ error: "Listing not available" }, { status: 404 });

  const booking = await prisma.booking.create({
    data: {
      customerId: session.sub,
      vendorId: listing.vendorId,
      listingId: listing.id,
      status: "PENDING",
      eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : null,
      eventDetails: parsed.data.eventDetails,
      amountPaise: parsed.data.amountPaise,
    },
  });
  return NextResponse.json({ booking });
}

export async function GET(req: Request) {
  const { session, error } = await requireSession(["CUSTOMER", "VENDOR", "ADMIN", "SUBADMIN"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope");

  if (session.role === "CUSTOMER") {
    const bookings = await prisma.booking.findMany({
      where: { customerId: session.sub },
      include: { vendor: true, listing: true, payments: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ bookings });
  }

  if (session.role === "VENDOR") {
    const vendor = await prisma.vendorProfile.findUnique({ where: { userId: session.sub } });
    if (!vendor) return NextResponse.json({ bookings: [] });
    const bookings = await prisma.booking.findMany({
      where: { vendorId: vendor.id, ...(scope === "pending" ? { status: "PENDING" } : {}) },
      include: { customer: { select: { email: true, id: true } }, listing: true, payments: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ bookings });
  }

  const bookings = await prisma.booking.findMany({
    include: {
      customer: { select: { email: true, id: true } },
      vendor: true,
      listing: true,
      payments: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ bookings });
}
