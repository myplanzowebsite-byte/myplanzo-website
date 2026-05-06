import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { issueOtp, isMockSms } from "@/lib/auth/otp";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  mode: z.enum(["password", "otp"]).optional().default("password"),
});

/** Password step: for CUSTOMER/VENDOR require SMS OTP after password (contract). Admins log in directly. */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.isBlocked) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (user.role === "ADMIN" || user.role === "SUBADMIN") {
    const { createSessionToken, setSessionCookie } = await import("@/lib/auth/session");
    const token = await createSessionToken({
      sub: user.id,
      role: user.role,
      email: user.email,
    });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true, redirect: "/admin" });
  }

  if (!user.phoneVerified) {
    return NextResponse.json(
      { error: "Phone not verified — complete registration", code: "PHONE_UNVERIFIED" },
      { status: 403 },
    );
  }

  const otp = await issueOtp(user.phone, "login", user.id);

  return NextResponse.json({
    ok: true,
    next: "verify-otp",
    phone: user.phone,
    phoneHint: user.phone.slice(-4),
    ...(isMockSms() ? { devOtp: otp } : {}),
  });
}
