import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { clearSessionCookie } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";

/**
 * Vendor account deletion. Mirrors the customer flow: scrub PII, disable
 * login, archive listings, but keep Booking/Payment history so customer
 * receipts and platform financials stay intact.
 */
export async function DELETE() {
  const { session, error } = await requireSession(["VENDOR"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const id = session.sub;
  const scrambled = await hashPassword(randomBytes(24).toString("hex"));

  await prisma.serviceListing.updateMany({
    where: { vendor: { userId: id } },
    data: { status: "ARCHIVED" },
  });

  await prisma.vendorProfile.updateMany({
    where: { userId: id },
    data: {
      description: null,
      location: null,
      photoUrl: null,
      coverImageUrl: null,
      portfolioUrls: [],
      verificationStatus: "REJECTED",
    },
  });

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

  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
