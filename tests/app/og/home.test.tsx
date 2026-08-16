import { describe, it, expect, vi, beforeEach } from "vitest";

const mockImageResponse = vi.fn();

vi.mock("next/og", () => ({
  ImageResponse: function (...args: any[]) {
    mockImageResponse(...args);
    return args[0];
  },
}));

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return {
    ...actual,
    usePathname: vi.fn(() => "/"),
  };
});

describe("OG Home Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports a GET function", async () => {
    const mod = await import("@/app/og/home/route");
    expect(typeof mod.GET).toBe("function");
  });

  it("returns an ImageResponse with width 1200 and height 630", async () => {
    const mod = await import("@/app/og/home/route");
    const request = new Request("http://localhost:3000/og/home.png");
    const response = mod.GET(request as any);
    expect(response).toBeDefined();
    expect(mockImageResponse).toHaveBeenCalledOnce();
  });

  it("uses default title when no search param is provided", async () => {
    const mod = await import("@/app/og/home/route");
    const request = new Request("http://localhost:3000/og/home.png");
    mod.GET(request as any);
    const imageResponseArg = mockImageResponse.mock.calls[0][0];
    const jsxStr = JSON.stringify(imageResponseArg);
    expect(jsxStr).toContain('"Notes Provider"');
  });

  it("uses custom title from search params", async () => {
    const mod = await import("@/app/og/home/route");
    const request = new Request("http://localhost:3000/og/home.png?title=My+Custom+Title");
    mod.GET(request as any);
    const imageResponseArg = mockImageResponse.mock.calls[0][0];
    const jsxStr = JSON.stringify(imageResponseArg);
    expect(jsxStr).toContain('"My Custom Title"');
  });

  it("uses default tagline when no search param is provided", async () => {
    const mod = await import("@/app/og/home/route");
    const request = new Request("http://localhost:3000/og/home.png");
    mod.GET(request as any);
    const imageResponseArg = mockImageResponse.mock.calls[0][0];
    const allText = JSON.stringify(imageResponseArg);
    expect(allText).toContain("Premium study notes, instantly.");
  });

  it("uses custom tagline from search params", async () => {
    const mod = await import("@/app/og/home/route");
    const request = new Request("http://localhost:3000/og/home.png?tagline=Custom+Tagline");
    mod.GET(request as any);
    const imageResponseArg = mockImageResponse.mock.calls[0][0];
    const allText = JSON.stringify(imageResponseArg);
    expect(allText).toContain("Custom Tagline");
  });

  it("exports runtime as edge", async () => {
    const mod = await import("@/app/og/home/route");
    expect(mod.runtime).toBe("edge");
  });

  it("exports contentType as image/png", async () => {
    const mod = await import("@/app/og/home/route");
    expect(mod.contentType).toBe("image/png");
  });
});
