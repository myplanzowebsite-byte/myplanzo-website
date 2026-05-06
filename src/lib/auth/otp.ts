import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";

const OTP_TTL_MS = 5 * 60 * 1000;

export function isMockSms(): boolean {
  return process.env.SMS_PROVIDER !== "live";
}

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

  if (isMockSms()) {
    console.info(`[SMS mock] OTP for ${phone} (${purpose}): ${code}`);
    return code;
  }

  const authkey = process.env.SMS_AUTH_KEY;
  if (!authkey) {
    console.error("[SMS] SMS_AUTH_KEY not set but SMS_PROVIDER=live");
    return code;
  }

  const mobile = phone.replace(/^\+/, "");
  const message = encodeURIComponent(`Your MyPlanzo OTP is ${code}. Valid for 5 minutes.`);
  const url = `http://sms.startmessaging.in/api/otp.php?authkey=${authkey}&mobile=${mobile}&message=${message}&otp=${code}&otp_length=6&otp_expiry=5`;

  try {
    const res = await fetch(url);
    const data = await res.json().catch(() => ({}));
    if (data.type !== "success") {
      console.error("[SMS] send failed:", data);
    }
  } catch (err) {
    console.error("[SMS] request error:", err);
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
