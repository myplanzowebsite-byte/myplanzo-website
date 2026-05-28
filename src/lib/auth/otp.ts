import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { isMockSms, sendMsg91Flow } from "@/lib/sms/send";

export { isMockSms };

const OTP_TTL_MS = 5 * 60 * 1000;

// Each purpose maps to its own DLT-approved MSG91 flow. Login/register reuse
// the generic "MyPlanzo" template; password reset has its own template with
// a 10-minute validity wording.
function flowIdForPurpose(purpose: string): string | undefined {
  if (purpose === "reset") return process.env.MSG91_PASSWORD_RESET_FLOW_ID;
  return process.env.MSG91_OTP_FLOW_ID;
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

  // Delivery only — we already generated and stored the code above. The OTP
  // wording lives in the DLT-approved template behind MSG91_OTP_FLOW_ID.
  await sendMsg91Flow(phone, flowIdForPurpose(purpose), { OTP: code });

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
