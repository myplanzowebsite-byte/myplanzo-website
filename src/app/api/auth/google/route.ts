import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyGoogleIdToken } from "@/lib/auth/google";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

const bodySchema = z.object({
  credential: z.string().min(1),
  // Optional post-login destination; only honoured for customers and must be a
  // same-site path (leading "/", no "//" protocol-relative escape).
  next: z.string().optional(),
});

function safeNext(next: string | undefined): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}

/**
 * Google Identity Services sign-in.
 *
 * The browser sends the GIS ID token ("credential"); we verify it, then find or
 * create a CUSTOMER account and issue the same `mp_session` cookie used by the
 * password flow. Google accounts start with no phone — `phoneVerified` stays
 * false until the customer adds one (enforced at booking time).
 */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const identity = await verifyGoogleIdToken(parsed.data.credential);
  if (!identity) {
    return NextResponse.json({ error: "Could not verify Google sign-in" }, { status: 401 });
  }
  if (!identity.emailVerified) {
    return NextResponse.json(
      { error: "Your Google email is not verified" },
      { status: 401 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email: identity.email } });

  if (existing) {
    if (existing.isBlocked || existing.deletedAt) {
      return NextResponse.json({ error: "This account is unavailable" }, { status: 403 });
    }
    // Link the Google identity to the existing account on first Google sign-in.
    if (!existing.googleId) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { googleId: identity.sub },
      });
    }
    const token = await createSessionToken({
      sub: existing.id,
      role: existing.role,
      email: existing.email,
    });
    await setSessionCookie(token);
    const redirect =
      existing.role === "VENDOR"
        ? "/vendor"
        : existing.role === "ADMIN" || existing.role === "SUBADMIN"
          ? "/admin"
          : (safeNext(parsed.data.next) ?? "/customer");
    return NextResponse.json({ ok: true, redirect });
  }

  const user = await prisma.user.create({
    data: {
      email: identity.email,
      googleId: identity.sub,
      role: "CUSTOMER",
      phoneVerified: false,
      // Signing up via Google constitutes acceptance of the T&C / Privacy Policy.
      termsAcceptedAt: new Date(),
      customerProfile: {
        create: {
          displayName: identity.name ?? identity.email.split("@")[0],
          photoUrl: identity.picture,
        },
      },
    },
  });

  const token = await createSessionToken({
    sub: user.id,
    role: user.role,
    email: user.email,
  });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true, redirect: "/welcome" });
}
