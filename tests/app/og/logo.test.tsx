import { describe, it, expect, vi } from "vitest";

const mockImageResponse = vi.fn();

vi.mock("next/og", () => ({
  ImageResponse: function (...args: any[]) {
    mockImageResponse(...args);
    return args[0];
  },
}));

describe("OG Logo Route", () => {
  it("exports a GET function", async () => {
    const mod = await import("@/app/og/logo/route");
    expect(typeof mod.GET).toBe("function");
  });

  it("returns an ImageResponse", async () => {
    const mod = await import("@/app/og/logo/route");
    const request = new Request("http://localhost:3000/og/logo.png");
    const response = mod.GET(request as any);
    expect(response).toBeDefined();
    expect(mockImageResponse).toHaveBeenCalledOnce();
  });

  it("renders the brand name Notes Provider", async () => {
    const mod = await import("@/app/og/logo/route");
    const request = new Request("http://localhost:3000/og/logo.png");
    const response = mod.GET(request as any);
    const responseStr = JSON.stringify(response);
    expect(responseStr).toContain("Notes Provider");
  });

  it("renders the tagline", async () => {
    const mod = await import("@/app/og/logo/route");
    const request = new Request("http://localhost:3000/og/logo.png");
    const response = mod.GET(request as any);
    const responseStr = JSON.stringify(response);
    expect(responseStr).toContain("Premium study notes, instantly.");
  });

  it("renders the N logo character", async () => {
    const mod = await import("@/app/og/logo/route");
    const request = new Request("http://localhost:3000/og/logo.png");
    const response = mod.GET(request as any);
    const responseStr = JSON.stringify(response);
    expect(responseStr).toContain("N");
  });

  it("exports runtime as edge", async () => {
    const mod = await import("@/app/og/logo/route");
    expect(mod.runtime).toBe("edge");
  });

  it("exports contentType as image/png", async () => {
    const mod = await import("@/app/og/logo/route");
    expect(mod.contentType).toBe("image/png");
  });

  it("returns ImageResponse with width 1200 and height 630", async () => {
    const mod = await import("@/app/og/logo/route");
    const request = new Request("http://localhost:3000/og/logo.png");
    mod.GET(request as any);
    expect(mockImageResponse.mock.calls[0][1]).toEqual({ width: 1200, height: 630 });
  });
});
