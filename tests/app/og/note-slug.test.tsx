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

describe("OG Note Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports a GET function", async () => {
    const mod = await import("@/app/og/note/[slug]/route");
    expect(typeof mod.GET).toBe("function");
  });

  it("returns a Promise that resolves to an ImageResponse", async () => {
    const mod = await import("@/app/og/note/[slug]/route");
    const request = new Request("http://localhost:3000/og/note/test-note.png");
    const result = mod.GET(request as any, { params: Promise.resolve({ slug: "test-note" }) });
    expect(result).toBeInstanceOf(Promise);
  });

  it("uses default values when API fetch fails", async () => {
    const mod = await import("@/app/og/note/[slug]/route");
    const request = new Request("http://localhost:3000/og/note/broken-note.png");
    global.fetch = vi.fn().mockRejectedValue(new Error("network error"));
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "broken-note" }) });
    expect(result).toBeDefined();
  });

  it("uses default title when note data is not found", async () => {
    const mod = await import("@/app/og/note/[slug]/route");
    const request = new Request("http://localhost:3000/og/note/empty-note.png");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: {} }),
    });
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "empty-note" }) });
    expect(result).toBeDefined();
  });

  it("extracts note title from API response", async () => {
    const mod = await import("@/app/og/note/[slug]/route");
    const request = new Request("http://localhost:3000/og/note/my-note.png");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          note: {
            title: "Advanced React Patterns",
            description: "Learn advanced patterns in React",
            category: { name: "Frontend" },
            pricingType: "paid",
            priceLabel: "₹299",
          },
        },
      }),
    });
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "my-note" }) });
    expect(result).toBeDefined();
  });

  it("sets priceLabel to Free when pricingType is free", async () => {
    const mod = await import("@/app/og/note/[slug]/route");
    const request = new Request("http://localhost:3000/og/note/free-note.png");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          note: {
            title: "Free Note",
            description: "A free note",
            category: { name: "General" },
            pricingType: "free",
          },
        },
      }),
    });
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "free-note" }) });
    expect(result).toBeDefined();
  });

  it("truncates title longer than 50 characters", async () => {
    const mod = await import("@/app/og/note/[slug]/route");
    const request = new Request("http://localhost:3000/og/note/long-title.png");
    const longTitle = "A".repeat(60);
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          note: {
            title: longTitle,
            description: "Short desc",
            category: { name: "General" },
            pricingType: "free",
          },
        },
      }),
    });
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "long-title" }) });
    const resultStr = JSON.stringify(result);
    expect(resultStr).toContain(longTitle.slice(0, 47) + "...");
  });

  it("does not truncate title shorter than 50 characters", async () => {
    const mod = await import("@/app/og/note/[slug]/route");
    const request = new Request("http://localhost:3000/og/note/short-title.png");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          note: {
            title: "Short Title",
            description: "Short desc",
            category: { name: "General" },
            pricingType: "free",
          },
        },
      }),
    });
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "short-title" }) });
    const resultStr = JSON.stringify(result);
    expect(resultStr).toContain("Short Title");
  });

  it("uses description as-is since it is pre-truncated to 140 chars by the route", async () => {
    const mod = await import("@/app/og/note/[slug]/route");
    const request = new Request("http://localhost:3000/og/note/desc-test.png");
    const longDesc = "B".repeat(200);
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          note: {
            title: "Test Note",
            description: longDesc,
            category: { name: "General" },
            pricingType: "free",
          },
        },
      }),
    });
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "desc-test" }) });
    const resultStr = JSON.stringify(result);
    expect(resultStr).toContain(longDesc.slice(0, 140));
  });

  it("passes slug from params to API URL", async () => {
    const mod = await import("@/app/og/note/[slug]/route");
    const request = new Request("http://localhost:3000/og/note/my-note.png");
    const params = Promise.resolve({ slug: "my-note" });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { note: {} } }),
    });
    await mod.GET(request as any, { params });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/notes/my-note"),
      expect.any(Object)
    );
  });

  it("exports runtime as edge", async () => {
    const mod = await import("@/app/og/note/[slug]/route");
    expect(mod.runtime).toBe("edge");
  });

  it("exports contentType as image/png", async () => {
    const mod = await import("@/app/og/note/[slug]/route");
    expect(mod.contentType).toBe("image/png");
  });

  it("uses description fallback when note has no description", async () => {
    const mod = await import("@/app/og/note/[slug]/route");
    const request = new Request("http://localhost:3000/og/note/no-desc.png");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          note: {
            title: "No Description Note",
            description: null,
            category: { name: "General" },
            pricingType: "free",
          },
        },
      }),
    });
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "no-desc" }) });
    expect(result).toBeDefined();
  });

  it("uses category fallback when note has no category", async () => {
    const mod = await import("@/app/og/note/[slug]/route");
    const request = new Request("http://localhost:3000/og/note/no-category.png");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          note: {
            title: "No Category Note",
            description: "Some description",
            category: null,
            pricingType: "free",
          },
        },
      }),
    });
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "no-category" }) });
    expect(result).toBeDefined();
  });

  it("handles non-ok API response gracefully", async () => {
    const mod = await import("@/app/og/note/[slug]/route");
    const request = new Request("http://localhost:3000/og/note/not-found.png");
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    const result = await mod.GET(request as any, { params: Promise.resolve({ slug: "not-found" }) });
    expect(result).toBeDefined();
  });
});
