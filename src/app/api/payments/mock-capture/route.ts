import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

/** Dev-only: mark latest pending payment as captured (when Razorpay mock). */
const bodySchema = z.object({ bookingId: z.string() });

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const payment = await prisma.payment.findFirst({
    where: {
      bookingId: parsed.data.bookingId,
      status: "PENDING",
      booking: { customerId: session.sub },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!payment) return NextResponse.json({ error: "No pending payment" }, { status: 404 });
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "CAPTURED", razorpayPaymentId: "mock_pay" },
  });
  return NextResponse.json({ ok: true });
}
