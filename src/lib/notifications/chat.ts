import { prisma } from "@/lib/prisma";
import { sendSms, appUrl } from "@/lib/sms/send";
import type { UserRole } from "@prisma/client";

// If the previous message in this booking was also from the same sender and
// arrived within this window, we skip the SMS. The receiver was already
// notified about the active thread; back-to-back messages would be spam.
const THROTTLE_MS = 10 * 60 * 1000;

type NotifyInput = {
  bookingId: string;
  newMessageId: string;
  senderId: string;
  receiverId: string;
  receiverRole: UserRole;
};

export async function notifyNewMessage(input: NotifyInput): Promise<void> {
  const { bookingId, newMessageId, senderId, receiverId, receiverRole } = input;

  // Throttle: skip when the previous message in this booking is from the same
  // sender within THROTTLE_MS — they're typing in a burst, no need to re-page.
  const prev = await prisma.message.findFirst({
    where: { bookingId, id: { not: newMessageId } },
    orderBy: { createdAt: "desc" },
    select: { senderId: true, createdAt: true },
  });
  if (
    prev &&
    prev.senderId === senderId &&
    Date.now() - prev.createdAt.getTime() < THROTTLE_MS
  ) {
    return;
  }

  const [receiver, sender, booking] = await Promise.all([
    prisma.user.findUnique({
      where: { id: receiverId },
      select: { phone: true, customerProfile: { select: { displayName: true } }, vendorProfile: { select: { businessName: true } } },
    }),
    prisma.user.findUnique({
      where: { id: senderId },
      select: { customerProfile: { select: { displayName: true } }, vendorProfile: { select: { businessName: true } } },
    }),
    prisma.booking.findUnique({ where: { id: bookingId }, select: { id: true } }),
  ]);

  if (!receiver?.phone || !booking) return;

  const senderName =
    sender?.vendorProfile?.businessName || sender?.customerProfile?.displayName || "someone";

  const path = receiverRole === "VENDOR" ? `/vendor/bookings/${bookingId}` : `/customer/bookings/${bookingId}`;
  const url = `${appUrl()}${path}`;

  const body = `New message from ${senderName} on MyPlanzo. Reply: ${url}`;

  await sendSms(receiver.phone, body);
}
