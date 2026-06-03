import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import {
  commissionFromAmountPaise,
  createRazorpayOrder,
  RazorpayApiError,
} from "@/lib/payments/razorpay";
import { advancePaise, balancePaise } from "@/lib/payments/installments";

const bodySchema = z.object({
  bookingId: z.string(),
  kind: z.enum(["advance", "balance"]).default("advance"),
});

/**
 * Standard Web Checkout — step 1. Creates a Razorpay Order for a
 * vendor-confirmed booking amount and records a PENDING payment keyed by the
 * order id. Returns the order + publishable key id so the browser can open the
 * checkout.js modal. The key SECRET never leaves the server.
 */
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

  const booking = await prisma.booking.findFirst({
    where: { id: parsed.data.bookingId, customerId: session.sub },
    include: {
      payments: true,
      vendor: { select: { businessName: true } },
      customer: { select: { email: true, phone: true, customerProfile: true } },
    },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.amountPaise < 100) {
    return NextResponse.json(
      { error: "No confirmed amount yet — accept a vendor quote first." },
      { status: 400 },
    );
  }

  // Installment gating. The advance is the first 50%; the balance can only be
  // started once the advance is captured and is itself not yet captured.
  const kind = parsed.data.kind;
  const isPaid = (p: { status: string; kind: string }, k: string) =>
    p.kind === k && (p.status === "CAPTURED" || p.status === "AUTHORIZED");
  const advancePaid = booking.payments.some((p) => isPaid(p, "ADVANCE") || isPaid(p, "FULL"));
  const balancePaid = booking.payments.some((p) => isPaid(p, "BALANCE"));

  let installmentPaise: number;
  let paymentKind: "ADVANCE" | "BALANCE";
  let label: string;
  if (kind === "advance") {
    if (advancePaid) {
      return NextResponse.json({ error: "The advance is already paid." }, { status: 400 });
    }
    installmentPaise = advancePaise(booking.amountPaise);
    paymentKind = "ADVANCE";
    label = "50% advance";
  } else {
    if (!advancePaid) {
      return NextResponse.json({ error: "Pay the 50% advance first." }, { status: 400 });
    }
    if (balancePaid) {
      return NextResponse.json({ error: "The balance is already paid." }, { status: 400 });
    }
    installmentPaise = balancePaise(booking.amountPaise);
    paymentKind = "BALANCE";
    label = "balance";
  }

  let order;
  try {
    order = await createRazorpayOrder({
      amountPaise: installmentPaise,
      receipt: `${booking.id}-${paymentKind.toLowerCase()}`,
      notes: { bookingId: booking.id, kind: paymentKind },
    });
  } catch (e) {
    if (e instanceof RazorpayApiError && e.status === 401) {
      console.error("[create-order] Razorpay auth failed:", e.message);
      return NextResponse.json({ error: "Payment gateway authentication failed." }, { status: 401 });
    }
    console.error("[create-order] Razorpay error:", e);
    return NextResponse.json({ error: "Could not start payment." }, { status: 500 });
  }

  // Record/refresh a PENDING payment for this installment so the verify step
  // and webhook can find it. Reuses the same-kind PENDING row across retries so
  // advance and balance keep distinct rows/orders.
  const commissionPaise = commissionFromAmountPaise(installmentPaise);
  const pending = booking.payments.find((p) => p.status === "PENDING" && p.kind === paymentKind);
  if (pending) {
    await prisma.payment.update({
      where: { id: pending.id },
      data: { amountPaise: installmentPaise, commissionPaise, razorpayOrderId: order.orderId },
    });
  } else {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        razorpayOrderId: order.orderId,
        amountPaise: installmentPaise,
        commissionPaise,
        kind: paymentKind,
        status: "PENDING",
      },
    });
  }

  return NextResponse.json({
    orderId: order.orderId,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    name: booking.vendor.businessName,
    description: `MyPlanzo ${label} — ${booking.vendor.businessName}`,
    prefill: {
      name: booking.customer.customerProfile?.displayName ?? undefined,
      email: booking.customer.email ?? undefined,
      contact: booking.customer.phone ?? undefined,
    },
  });
}
