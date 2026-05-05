import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";

const OTP_TTL_MS = 5 * 60 * 1000;

function randomDigits(len: number) {
  let s = "";
  for (let i = 0; i < len; i++) s += randomInt(0, 10).toString();
  return s;
}

export async function issueOtp(phone: string, purpose: string, userId?: string) {
  const code = randomDigits(6);
  await prisma.otpCode.create({
    data: {
      phone,
      code,
      purpose,
      userId,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });
  if (process.env.SMS_PROVIDER === "mock" || !process.env.SMS_PROVIDER) {
    console.info(`[SMS mock] OTP for ${phone} (${purpose}): ${code}`);
  }
  return code;
}

export async function consumeOtp(phone: string, purpose: string, code: string) {
  const result = await prisma.otpCode.updateMany({
    where: {
      phone,
      purpose,
      consumed: false,
      code,
      expiresAt: { gt: new Date() },
    },
    data: { consumed: true },
  });
  return result.count > 0;
}
