import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { createNotification } from "@/lib/notifications/notify";

// Returns the booking only if the session user is a participant (its customer
// or its vendor). Also resolves the caller's vendorProfile id when relevant.
async function authorizeBooking(bookingId: string, userId: string, role: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { vendor: { select: { id: true, userId: true } } },
  });
  if (!booking) return { booking: null, isCustomer: false, isVendor: false };
  const isCustomer = booking.customerId === userId;
  const isVendor = role === "VENDOR" && booking.vendor.userId === userId;
  return { booking, isCustomer, isVendor };
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["CUSTOMER", "VENDOR"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const { booking, isCustomer, isVendor } = await authorizeBooking(id, session.sub, session.role);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!isCustomer && !isVendor) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const quotes = await prisma.quote.findMany({
    where: { bookingId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ quotes });
}

const postSchema = z.object({
  amountPaise: z.number().int().positive().max(100_000_000),
  note: z.string().trim().max(1000).optional(),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["VENDOR"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const { booking, isVendor } = await authorizeBooking(id, session.sub, session.role);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!isVendor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (booking.status !== "PENDING") {
    return NextResponse.json(
      { error: "Quotes can only be sent while the booking is pending." },
      { status: 400 },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const quote = await prisma.quote.create({
    data: {
      bookingId: id,
      vendorId: booking.vendor.id,
      amountPaise: parsed.data.amountPaise,
      note: parsed.data.note || null,
    },
  });

  void createNotification({
    userId: booking.customerId,
    type: "quote",
    title: "New quote received",
    body: `You received a quote of ₹${new Intl.NumberFormat("en-IN").format(
      quote.amountPaise / 100,
    )}.`,
    link: `/customer/messages/${id}`,
  }).catch((e) => console.error("[notify] quote sent:", e));

  return NextResponse.json({ quote });
}
