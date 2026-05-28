import { prisma } from "@/lib/prisma";
import { sendMsg91Flow } from "@/lib/sms/send";

// Short, human-readable form of a booking id for use in SMS bodies.
export function shortBookingId(id: string): string {
  return id.slice(-6).toUpperCase();
}

// Customer just created a booking request — alert the vendor.
export async function notifyVendorOfBooking(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      vendor: { select: { businessName: true, user: { select: { phone: true } } } },
    },
  });
  const phone = booking?.vendor.user.phone;
  if (!phone) return;
  await sendMsg91Flow(phone, process.env.MSG91_VENDOR_BOOKING_FLOW_ID, {
    name: booking.vendor.businessName,
    id: shortBookingId(booking.id),
  });
}

// Vendor accepted the customer's quote → booking is CONFIRMED. Tell the customer.
export async function notifyCustomerOfConfirmation(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      customer: {
        select: {
          phone: true,
          email: true,
          customerProfile: { select: { displayName: true } },
        },
      },
      listing: { select: { title: true } },
    },
  });
  const phone = booking?.customer.phone;
  if (!phone) return;
  const customerName =
    booking.customer.customerProfile?.displayName ||
    booking.customer.email.split("@")[0];
  await sendMsg91Flow(phone, process.env.MSG91_BOOKING_CONFIRMATION_FLOW_ID, {
    customer_name: customerName,
    service: booking.listing?.title ?? "your service",
    id: shortBookingId(booking.id),
  });
}
