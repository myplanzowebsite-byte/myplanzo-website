import { describe, it, expect } from "vitest";
import { healthPayload } from "./health";

describe("healthPayload", () => {
  it("returns ok true and service name", () => {
    const body = healthPayload();
    expect(body.ok).toBe(true);
    expect(body.service).toBe("myplanzo-web");
  });
});
