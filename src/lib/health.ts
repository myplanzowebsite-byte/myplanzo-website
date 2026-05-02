export function healthPayload() {
  return { ok: true as const, service: "myplanzo-web" };
}
