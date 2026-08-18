import { describe, it, expect } from "vitest";

describe("PublicHomePage", () => {
  it("exists as a route", async () => {
    const mod = await import("@/app/(public)/page");
    expect(mod).toBeDefined();
  });
});
