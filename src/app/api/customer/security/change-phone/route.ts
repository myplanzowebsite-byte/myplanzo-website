import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { consumeOtp } from "@/lib/auth/otp";

const bodySchema = z.object({
  otp: z.string().length(6),
  newPhone: z.string().trim().min(10).max(20),
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

  // OTP for a phone change is sent to (and verified against) the NEW number.
  const otpOk = await consumeOtp(parsed.data.newPhone, "security", parsed.data.otp);
  if (!otpOk) {
    return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
  }

  const taken = await prisma.user.findUnique({ where: { phone: parsed.data.newPhone } });
  if (taken && taken.id !== user.id) {
    return NextResponse.json({ error: "That number is already in use." }, { status: 409 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { phone: parsed.data.newPhone, phoneVerified: true },
  });
  return NextResponse.json({ ok: true });
}
