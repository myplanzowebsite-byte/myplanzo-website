import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMsg91Flow } from "@/lib/sms/send";
import { shortBookingId } from "@/lib/notifications/booking";

// Daily job: SMS customers whose CONFIRMED event is ~24 hours away.
// Guarded by Bearer CRON_SECRET — Vercel Cron passes this header automatically
// when the env var is set in the project settings.
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1-hour window around T-24h so a single daily run reliably catches each
  // booking exactly once. With a daily schedule, anything in [+23h, +25h] is
  // "tomorrow's event" from this run's perspective.
  const now = Date.now();
  const start = new Date(now + 23 * 60 * 60 * 1000);
  const end = new Date(now + 25 * 60 * 60 * 1000);

  const bookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      reminderSentAt: null,
      eventDate: { gte: start, lte: end },
    },
    select: {
      id: true,
      eventDate: true,
      vendor: { select: { businessName: true } },
      customer: {
        select: {
          phone: true,
          email: true,
          customerProfile: { select: { displayName: true } },
        },
      },
    },
  });

  let sent = 0;
  for (const b of bookings) {
    if (!b.customer.phone || !b.eventDate) continue;
    const customerName =
      b.customer.customerProfile?.displayName || b.customer.email.split("@")[0];
    const res = await sendMsg91Flow(
      b.customer.phone,
      process.env.MSG91_BOOKING_REMINDER_FLOW_ID,
      {
        customer_name: customerName,
        id: shortBookingId(b.id),
        date: b.eventDate.toLocaleDateString("en-IN"),
        name: b.vendor.businessName,
      },
    );
    if (res.ok) {
      await prisma.booking.update({
        where: { id: b.id },
        data: { reminderSentAt: new Date() },
      });
      sent++;
    }
  }

  return NextResponse.json({ scanned: bookings.length, sent });
}
