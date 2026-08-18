import { describe, it, expect } from "vitest";
import { TERMS_AND_CONDITIONS, PRIVACY_POLICY } from "@/lib/policies";

describe("policies", () => {
  it("TERMS_AND_CONDITIONS contains key legal terms", () => {
    expect(TERMS_AND_CONDITIONS).toContain("personal");
    expect(TERMS_AND_CONDITIONS).toContain("non-commercial");
    expect(TERMS_AND_CONDITIONS).toContain("distribute");
    expect(TERMS_AND_CONDITIONS).toContain("modify");
    expect(TERMS_AND_CONDITIONS).toContain("resell");
    expect(TERMS_AND_CONDITIONS).toContain("All sales are final");
  });

  it("PRIVACY_POLICY contains key privacy statements", () => {
    expect(PRIVACY_POLICY).toContain("privacy");
    expect(PRIVACY_POLICY).toContain("collect");
    expect(PRIVACY_POLICY).toContain("transactions");
    expect(PRIVACY_POLICY).toContain("sell");
    expect(PRIVACY_POLICY).toContain("third parties");
  });

  it("TERMS_AND_CONDITIONS is a non-empty string", () => {
    expect(typeof TERMS_AND_CONDITIONS).toBe("string");
    expect(TERMS_AND_CONDITIONS.length).toBeGreaterThan(100);
  });

  it("PRIVACY_POLICY is a non-empty string", () => {
    expect(typeof PRIVACY_POLICY).toBe("string");
    expect(PRIVACY_POLICY.length).toBeGreaterThan(100);
  });
});
