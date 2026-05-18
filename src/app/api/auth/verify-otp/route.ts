import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { consumeOtp } from "@/lib/auth/otp";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

const bodySchema = z.object({
  phone: z.string().min(8),
  code: z.string().length(6),
  purpose: z.enum(["register", "login"]).default("register"),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { phone, code, purpose } = parsed.data;

  const ok = await consumeOtp(phone, purpose, code);
  if (!ok) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (purpose === "register") {
    await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: true },
    });
  }

  const token = await createSessionToken({
    sub: user.id,
    role: user.role,
    email: user.email,
  });
  await setSessionCookie(token);

  let redirect = "/customer";
  if (user.role === "VENDOR") redirect = "/vendor";
  if (user.role === "ADMIN" || user.role === "SUBADMIN") redirect = "/admin";
  // New customers land on the welcome / preferences screen.
  if (purpose === "register" && user.role === "CUSTOMER") redirect = "/welcome";

  return NextResponse.json({ ok: true, redirect });
}
