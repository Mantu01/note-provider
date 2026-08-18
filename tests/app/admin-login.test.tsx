import { describe, it, expect } from "vitest";
import AdminLoginPage from "@/app/admin/login/page";
import { render } from "@testing-library/react";

describe("AdminLoginPage", () => {
  it("renders nothing (server component placeholder)", () => {
    const { container } = render(<AdminLoginPage />);
    expect(container.innerHTML).toBe("");
  });

  it("exports metadata with noindex robots", async () => {
    const mod = await import("@/app/admin/login/page");
    expect(mod.metadata).toBeDefined();
    expect((mod.metadata as any)?.robots?.index).toBe(false);
    expect((mod.metadata as any)?.robots?.follow).toBe(false);
  });
});
