// General-purpose SMS sender. OTP keeps its own provider path because the
// provider's /api/otp.php endpoint has OTP-specific semantics; everything
// else (booking notifications, chat alerts, etc.) goes through here.

export function isMockSms(): boolean {
  return process.env.SMS_PROVIDER !== "live";
}

export async function sendSms(phone: string, message: string): Promise<{ ok: boolean }> {
  if (!phone) return { ok: false };

  if (isMockSms()) {
    console.info(`[SMS mock] to ${phone}: ${message}`);
    return { ok: true };
  }

  const authkey = process.env.SMS_AUTH_KEY;
  if (!authkey) {
    console.error("[SMS] SMS_AUTH_KEY not set but SMS_PROVIDER=live");
    return { ok: false };
  }

  const sender = process.env.SMS_SENDER_ID || "MYPLNZ";
  const mobile = phone.replace(/^\+/, "");
  const url =
    `http://sms.startmessaging.in/api/sendhttp.php` +
    `?authkey=${encodeURIComponent(authkey)}` +
    `&mobiles=${encodeURIComponent(mobile)}` +
    `&message=${encodeURIComponent(message)}` +
    `&sender=${encodeURIComponent(sender)}` +
    `&route=4&country=91`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    // The provider returns either a numeric request id (success) or JSON with type=error.
    if (!res.ok || /error|invalid/i.test(text)) {
      console.error("[SMS] send failed:", text);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[SMS] request error:", err);
    return { ok: false };
  }
}

export function appUrl(): string {
  return process.env.APP_URL || "https://myplanzo.com";
}
