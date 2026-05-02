import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { consumeOtp } from "@/lib/auth/otp";
import { hashPassword } from "@/lib/auth/password";

const bodySchema = z.object({
  phone: z.string().min(8),
  code: z.string().length(6),
  newPassword: z.string().min(8),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { phone, code, newPassword } = parsed.data;

  const ok = await consumeOtp(phone, "reset", code);
  if (!ok) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  return NextResponse.json({ ok: true });
}
