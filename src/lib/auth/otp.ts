import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { isMockSms, sendMsg91Flow } from "@/lib/sms/send";
import { sendEmail } from "@/lib/email/send";
import { otpEmail } from "@/lib/email/templates/otp";

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

export type IssueOtpInput = {
  phone?: string | null;
  email?: string | null;
  purpose: string;
  userId?: string;
};

export async function issueOtp(input: IssueOtpInput): Promise<string> {
  const { phone, email, purpose, userId } = input;
  if (!phone && !email) {
    throw new Error("issueOtp requires at least one of phone/email");
  }
  const code = randomDigits(6);

  await prisma.otpCode.create({
    data: {
      phone: phone ?? null,
      email: email ?? null,
      code,
      purpose,
      userId,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  // SMS delivery. The OTP wording lives in the DLT-approved template behind
  // the matching MSG91 flow ID; we only pass the code.
  if (phone) {
    if (isMockSms()) {
      console.info(`[SMS mock] OTP for ${phone} (${purpose}): ${code}`);
    } else {
      await sendMsg91Flow(phone, flowIdForPurpose(purpose), { OTP: code });
    }
  }

  // Email delivery — runs alongside SMS for the reset flow, and is a safe
  // no-op (mock log) in dev.
  if (email) {
    await sendEmail({ to: email, ...otpEmail(purpose, code) });
  }

  return code;
}

// Verifies an OTP by either phone or email — the column the identifier matches
// is irrelevant to callers. Used by both phone-keyed flows (login, register)
// and the new dual-channel reset flow.
export async function consumeOtp(identifier: string, purpose: string, code: string) {
  const result = await prisma.otpCode.updateMany({
    where: {
      purpose,
      consumed: false,
      code,
      expiresAt: { gt: new Date() },
      OR: [{ phone: identifier }, { email: identifier }],
    },
    data: { consumed: true },
  });
  return result.count > 0;
}
