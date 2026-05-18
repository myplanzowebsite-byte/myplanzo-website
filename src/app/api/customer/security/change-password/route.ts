import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { consumeOtp } from "@/lib/auth/otp";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

const bodySchema = z.object({
  otp: z.string().length(6),
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  const { session, error } = await requireSession();
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // OTP for a password change goes to the user's current number.
  const otpOk = await consumeOtp(user.phone, "security", parsed.data.otp);
  if (!otpOk) {
    return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
  }
  const pwOk = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!pwOk) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });
  return NextResponse.json({ ok: true });
}
