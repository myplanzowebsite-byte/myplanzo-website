import { prisma } from "@/lib/prisma";

export type NotificationType =
  | "quote"
  | "booking"
  | "payment"
  | "message"
  | "reminder"
  | "system";

/**
 * Persist an in-app notification for a user. Best-effort: callers should not
 * block their main flow on this — wrap in `void … .catch()` where latency
 * matters.
 */
export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
}) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      link: input.link ?? null,
    },
  });
}
