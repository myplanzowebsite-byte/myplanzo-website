import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { issueOtp, isMockSms } from "@/lib/auth/otp";

// Issues an OTP for a sensitive account change.
// - No `phone` → OTP goes to the user's current number (re-verify identity,
//   used for password change).
// - `phone` given → OTP goes to that new number (proves ownership, used for
//   the phone-number change).
const bodySchema = z.object({
  phone: z.string().trim().min(10).max(20).optional(),
});

export async function POST(req: Request) {
  const { session, error } = await requireSession();
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const json = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(json ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const target = parsed.data.phone ?? user.phone;
  if (parsed.data.phone && parsed.data.phone !== user.phone) {
    const taken = await prisma.user.findUnique({ where: { phone: parsed.data.phone } });
    if (taken) {
      return NextResponse.json({ error: "That number is already in use." }, { status: 409 });
    }
  }

  await prisma.otpCode.updateMany({
    where: { phone: target, purpose: "security", consumed: false },
    data: { consumed: true },
  });
  const otp = await issueOtp(target, "security", user.id);

  return NextResponse.json({ ok: true, ...(isMockSms() ? { devOtp: otp } : {}) });
}
