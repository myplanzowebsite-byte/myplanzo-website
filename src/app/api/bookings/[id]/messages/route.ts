import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { listBookingMessages, sendBookingMessage } from "@/lib/messaging/messageService";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["CUSTOMER", "VENDOR"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const booking = await prisma.booking.findUnique({ where: { id }, include: { vendor: true } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const allowed =
    booking.customerId === session.sub ||
    (session.role === "VENDOR" &&
      (await prisma.vendorProfile.findUnique({ where: { userId: session.sub } }))?.id ===
        booking.vendorId);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const messages = await listBookingMessages(id);
  return NextResponse.json({ messages });
}

const postSchema = z.object({
  body: z.string().min(1).max(4000),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["CUSTOMER", "VENDOR"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { vendor: { include: { user: true } } },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const vendorUserId = booking.vendor.userId;
  const isCustomer = booking.customerId === session.sub;
  const isVendor = session.role === "VENDOR" && vendorUserId === session.sub;
  if (!isCustomer && !isVendor) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const senderId = session.sub;
  const receiverId = isCustomer ? vendorUserId : booking.customerId;
  const senderRole = session.role;
  const receiverRole = isCustomer ? "VENDOR" : "CUSTOMER";

  const msg = await sendBookingMessage({
    bookingId: id,
    senderId,
    receiverId,
    senderRole,
    receiverRole,
    body: parsed.data.body,
  });
  return NextResponse.json({ message: msg });
}
