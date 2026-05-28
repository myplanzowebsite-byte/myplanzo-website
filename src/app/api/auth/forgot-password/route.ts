import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { issueOtp } from "@/lib/auth/otp";

const bodySchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  let devOtp: string | undefined;
  // Always email; SMS in addition if the account has a verified phone.
  // Google-only sign-ups without a phone can still recover via email.
  if (user) {
    devOtp = await issueOtp({
      phone: user.phone,
      email: user.email,
      purpose: "reset",
      userId: user.id,
    });
  }
  return NextResponse.json({
    message:
      "If an account exists for that email, an OTP has been sent to the registered mobile number and email.",
    ...(process.env.NODE_ENV === "development" && user
      ? { devEmail: user.email, devPhone: user.phone, devOtp }
      : {}),
  });
}
