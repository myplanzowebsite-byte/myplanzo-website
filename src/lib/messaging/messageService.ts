import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type SendMessageInput = {
  bookingId: string;
  senderId: string;
  receiverId: string;
  senderRole: UserRole;
  receiverRole: UserRole;
  body: string;
  channel?: string;
};

/** Abstraction for future WhatsAppChannel — MVP uses DB + REST polling. */
export async function sendBookingMessage(input: SendMessageInput) {
  const { bookingId, senderId, receiverId, senderRole, receiverRole, body, channel } = input;
  return prisma.message.create({
    data: {
      bookingId,
      senderId,
      receiverId,
      senderRole,
      receiverRole,
      channel: channel ?? "web",
      body: body.trim(),
    },
  });
}

export async function listBookingMessages(bookingId: string) {
  return prisma.message.findMany({
    where: { bookingId },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, email: true } } },
  });
}
