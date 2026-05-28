// SMS delivery via MSG91's Flow API. India's DLT regime forbids free-form SMS:
// every message must use a pre-approved content template, registered on the DLT
// portal and wired to an MSG91 "Flow" (the Flow ID is what we send here). We
// only ever pass the variable values — the wording lives in the approved flow.

export function isMockSms(): boolean {
  return process.env.SMS_PROVIDER !== "live";
}

const MSG91_FLOW_URL = "https://control.msg91.com/api/v5/flow/";

/** Normalise an Indian number to MSG91's `91XXXXXXXXXX` form (no `+`). */
function toMsg91Mobile(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

/**
 * Sends one DLT-compliant SMS through an MSG91 Flow.
 *
 * @param flowId    MSG91 Flow ID for the approved template (per-message-type).
 * @param variables Values for the flow's variables, e.g. `{ var1: "123456" }`.
 *                  Keys must match the variable names set up in the MSG91 flow.
 */
export async function sendMsg91Flow(
  phone: string,
  flowId: string | undefined,
  variables: Record<string, string>,
): Promise<{ ok: boolean }> {
  if (!phone) return { ok: false };

  if (isMockSms()) {
    console.info(`[SMS mock] to ${phone} via flow ${flowId ?? "—"}:`, variables);
    return { ok: true };
  }

  const authkey = process.env.MSG91_AUTH_KEY;
  if (!authkey) {
    console.error("[SMS] MSG91_AUTH_KEY not set but SMS_PROVIDER=live");
    return { ok: false };
  }
  if (!flowId) {
    console.error("[SMS] MSG91 flow not configured — skipping send");
    return { ok: false };
  }

  const body = {
    template_id: flowId,
    sender: process.env.MSG91_SENDER_ID,
    short_url: "0",
    recipients: [{ mobiles: toMsg91Mobile(phone), ...variables }],
  };

  try {
    const res = await fetch(MSG91_FLOW_URL, {
      method: "POST",
      headers: {
        authkey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.type !== "success") {
      console.error("[SMS] MSG91 send failed:", data);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[SMS] MSG91 request error:", err);
    return { ok: false };
  }
}

export function appUrl(): string {
  return process.env.APP_URL || "https://myplanzo.com";
}
