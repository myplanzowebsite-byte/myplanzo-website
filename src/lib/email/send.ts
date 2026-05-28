// Transactional email via SMTP (Gmail/Workspace) using nodemailer. Mirrors
// the shape of src/lib/sms/send.ts so callers feel symmetric.

import nodemailer, { type Transporter } from "nodemailer";

export function isMockEmail(): boolean {
  return process.env.EMAIL_PROVIDER !== "live";
}

let transporterCache: Transporter | null = null;
function getTransporter(): Transporter {
  if (transporterCache) return transporterCache;
  transporterCache = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false, // STARTTLS upgrade on 587
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporterCache;
}

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail(opts: SendEmailInput): Promise<{ ok: boolean }> {
  if (!opts.to) return { ok: false };

  if (isMockEmail()) {
    console.info(`[Email mock] to ${opts.to}: ${opts.subject}\n${opts.text}`);
    return { ok: true };
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("[Email] SMTP_* env vars not set but EMAIL_PROVIDER=live");
    return { ok: false };
  }

  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || '"MyPlanzo" <noreply@myplanzo.com>',
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
    return { ok: true };
  } catch (err) {
    console.error("[Email] send failed:", err);
    return { ok: false };
  }
}
