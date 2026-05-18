import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { clearSessionCookie } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";

/**
 * Account deletion (DPDP right to erasure). Implemented as anonymise + block
 * rather than a hard delete: the customer's PII is scrubbed and login is
 * disabled, but Booking/Payment rows are kept so vendor earnings and
 * financial/audit records stay intact.
 */
export async function DELETE() {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const id = session.sub;
  const scrambled = await hashPassword(randomBytes(24).toString("hex"));

  await prisma.user.update({
    where: { id },
    data: {
      email: `deleted-${id}@deleted.invalid`,
      phone: `deleted-${id}`,
      passwordHash: scrambled,
      isBlocked: true,
      phoneVerified: false,
      deletedAt: new Date(),
    },
  });
  await prisma.customerProfile.updateMany({
    where: { userId: id },
    data: {
      displayName: null,
      photoUrl: null,
      preferences: Prisma.JsonNull,
      notificationPrefs: Prisma.JsonNull,
    },
  });

  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
