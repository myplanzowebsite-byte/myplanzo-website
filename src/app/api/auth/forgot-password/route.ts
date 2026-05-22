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
  // Google-only accounts may not have a phone yet — nothing to send an OTP to.
  if (user?.phone) {
    devOtp = await issueOtp(user.phone, "reset", user.id);
  }
  return NextResponse.json({
    message:
      "If an account exists for that email, an OTP was sent to the registered mobile number.",
    ...(process.env.NODE_ENV === "development" && user?.phone
      ? { devPhone: user.phone, devOtp }
      : {}),
  });
}
