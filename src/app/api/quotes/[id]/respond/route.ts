import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { createNotification } from "@/lib/notifications/notify";

const bodySchema = z.object({
  action: z.enum(["accept", "decline"]),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      booking: { select: { id: true, customerId: true, status: true } },
      vendor: { select: { userId: true } },
    },
  });
  if (!quote || quote.booking.customerId !== session.sub) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }
  if (quote.status !== "PENDING") {
    return NextResponse.json({ error: "This quote was already answered." }, { status: 409 });
  }

  if (parsed.data.action === "decline") {
    await prisma.quote.update({
      where: { id },
      data: { status: "DECLINED", respondedAt: new Date() },
    });
    void createNotification({
      userId: quote.vendor.userId,
      type: "quote",
      title: "Quote declined",
      body: "The customer declined your quote.",
      link: `/vendor/messages/${quote.bookingId}`,
    }).catch((e) => console.error("[notify] quote declined:", e));
    return NextResponse.json({ ok: true, status: "DECLINED" });
  }

  // Accept: lock in the vendor-confirmed amount on the booking and supersede
  // any other pending quotes for the same booking.
  await prisma.$transaction([
    prisma.quote.update({
      where: { id },
      data: { status: "ACCEPTED", respondedAt: new Date() },
    }),
    prisma.quote.updateMany({
      where: { bookingId: quote.bookingId, status: "PENDING", id: { not: id } },
      data: { status: "DECLINED", respondedAt: new Date() },
    }),
    prisma.booking.update({
      where: { id: quote.bookingId },
      // Accepting a quote = price agreed = booking confirmed.
      data: { amountPaise: quote.amountPaise, status: "CONFIRMED" },
    }),
  ]);

  void createNotification({
    userId: quote.vendor.userId,
    type: "quote",
    title: "Quote accepted",
    body: `The customer accepted your quote of ₹${new Intl.NumberFormat("en-IN").format(
      quote.amountPaise / 100,
    )}. Awaiting payment.`,
    link: `/vendor/messages/${quote.bookingId}`,
  }).catch((e) => console.error("[notify] quote accepted:", e));

  return NextResponse.json({
    ok: true,
    status: "ACCEPTED",
    checkoutUrl: `/customer/checkout/${quote.bookingId}`,
  });
}
