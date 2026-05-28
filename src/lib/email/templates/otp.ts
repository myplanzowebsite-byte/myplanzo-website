import type { SendEmailInput } from "@/lib/email/send";

// Returns the subject / text / html for a given OTP purpose. Kept here so
// the mailer doesn't grow purpose-specific branching.
export function otpEmail(purpose: string, code: string): Omit<SendEmailInput, "to"> {
  if (purpose === "reset") {
    return {
      subject: `Your MyPlanzo password reset code: ${code}`,
      text: `Your MyPlanzo password reset OTP is ${code}. Valid for 10 minutes. Do not share with anyone.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#222;">
          <h2 style="margin:0 0 16px;">Password reset</h2>
          <p>Use this code to reset your MyPlanzo password:</p>
          <p style="font-size:28px;font-weight:700;letter-spacing:4px;background:#f5f5f5;padding:12px 16px;border-radius:8px;text-align:center;">${code}</p>
          <p>This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <p style="color:#666;font-size:12px;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
          <p style="color:#666;font-size:12px;">— Team MyPlanzo</p>
        </div>`,
    };
  }
  return {
    subject: `Your MyPlanzo verification code: ${code}`,
    text: `Your MyPlanzo verification code is ${code}. Valid for 5 minutes.`,
  };
}
