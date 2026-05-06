import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { issueOtp, isMockSms } from "@/lib/auth/otp";

const bodySchema = z.object({
  phone: z.string().min(10),
  purpose: z.enum(["register", "login", "reset"]).optional().default("login"),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { phone, purpose } = parsed.data;

  try {
    // Mark all unconsumed OTPs for this phone as consumed
    await prisma.otpCode.updateMany({
      where: {
        phone,
        purpose,
        consumed: false,
      },
      data: { consumed: true },
    });

    // Issue new OTP
    const otp = await issueOtp(phone, purpose);

    return NextResponse.json({
      ok: true,
      message: "OTP sent",
      ...(isMockSms() ? { devOtp: otp } : {}),
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({ error: "Failed to resend OTP" }, { status: 500 });
  }
}
