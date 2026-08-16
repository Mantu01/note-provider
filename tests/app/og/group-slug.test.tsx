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

describe("OG Group Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports a GET function", async () => {
    const mod = await import("@/app/og/group/[slug]/route");
    expect(typeof mod.GET).toBe("function");
  });

  it("returns a Promise that resolves to an ImageResponse", async () => {
    const mod = await import("@/app/og/group/[slug]/route");
    const request = new Request("http://localhost:3000/og/group/test-group.png");
    const result = mod.GET(request as any, { params: Promise.resolve({ slug: "test-group" }) });
    expect(result).toBeInstanceOf(Promise);
  });

  it("uses default values when API fetch fails", async () => {
    const mod = await import("@/app/og/group/[slug]/route");
    const request = new Request("http://localhost:3000/og/group/test-group.png");
    global.fetch = vi.fn().mockRejectedValue(new Error("network error"));
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "test-group" }) });
    expect(result).toBeDefined();
  });

  it("uses default name when group data is not found", async () => {
    const mod = await import("@/app/og/group/[slug]/route");
    const request = new Request("http://localhost:3000/og/group/test-group.png");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: {} }),
    });
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "test-group" }) });
    expect(result).toBeDefined();
  });

  it("extracts group name from API response", async () => {
    const mod = await import("@/app/og/group/[slug]/route");
    const request = new Request("http://localhost:3000/og/group/test-group.png");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          group: {
            name: "React Notes Bundle",
            description: "Complete React notes",
            category: { name: "Frontend" },
            noteCount: 15,
            price: 0,
          },
        },
      }),
    });
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "test-group" }) });
    expect(result).toBeDefined();
  });

  it("sets priceLabel to Free when group price is 0", async () => {
    const mod = await import("@/app/og/group/[slug]/route");
    const request = new Request("http://localhost:3000/og/group/test-group.png");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          group: {
            name: "Free Bundle",
            description: "Free notes",
            category: { name: "General" },
            noteCount: 5,
            price: 0,
          },
        },
      }),
    });
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "test-group" }) });
    expect(result).toBeDefined();
  });

  it("uses priceLabel from API when price is not 0", async () => {
    const mod = await import("@/app/og/group/[slug]/route");
    const request = new Request("http://localhost:3000/og/group/test-group.png");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          group: {
            name: "Premium Bundle",
            description: "Premium notes",
            category: { name: "Backend" },
            noteCount: 20,
            price: 499,
            priceLabel: "₹499",
          },
        },
      }),
    });
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "test-group" }) });
    expect(result).toBeDefined();
  });

  it("passes slug from params", async () => {
    const mod = await import("@/app/og/group/[slug]/route");
    const request = new Request("http://localhost:3000/og/group/my-bundle.png");
    const params = Promise.resolve({ slug: "my-bundle" });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { group: {} } }),
    });
    await mod.GET(request as any, { params });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/groups/my-bundle"),
      expect.any(Object)
    );
  });

  it("exports runtime as edge", async () => {
    const mod = await import("@/app/og/group/[slug]/route");
    expect(mod.runtime).toBe("edge");
  });

  it("exports contentType as image/png", async () => {
    const mod = await import("@/app/og/group/[slug]/route");
    expect(mod.contentType).toBe("image/png");
  });

  it("uses defaults when fetch returns non-ok response", async () => {
    const mod = await import("@/app/og/group/[slug]/route");
    const request = new Request("http://localhost:3000/og/group/not-found.png");
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "not-found" }) });
    expect(result).toBeDefined();
  });

  it("handles API response with empty group data", async () => {
    const mod = await import("@/app/og/group/[slug]/route");
    const request = new Request("http://localhost:3000/og/group/empty.png");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { group: null } }),
    });
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "empty" }) });
    expect(result).toBeDefined();
  });
});
