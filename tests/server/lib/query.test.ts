import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  parsePagination,
  parseArrayParam,
  parseBooleanParam,
  parseNumberParam,
  buildPagination,
  escapeRegex,
  resolveCategoryIds,
  buildNoteFilter,
  buildNoteSort,
  buildOrderFilter,
  buildOrderSort,
} from "../../../src/server/lib/query";
import { Types } from "mongoose";

vi.mock("../../../src/lib/constants", () => ({
  DEFAULT_PAGE_LIMIT: 12,
  MAX_PAGE_LIMIT: 48,
}));

describe("parsePagination", () => {
  it("returns defaults when no params present", () => {
    const sp = new URLSearchParams();
    const result = parsePagination(sp);
    expect(result).toEqual({ page: 1, limit: 12, skip: 0 });
  });

  it("parses valid page and limit", () => {
    const sp = new URLSearchParams("page=3&limit=20");
    const result = parsePagination(sp);
    expect(result.page).toBe(3);
    expect(result.limit).toBe(20);
    expect(result.skip).toBe(40);
  });

  it("uses custom defaultLimit", () => {
    const sp = new URLSearchParams();
    const result = parsePagination(sp, 25);
    expect(result.limit).toBe(25);
    expect(result.skip).toBe(0);
  });

  it("clamps limit to MAX_PAGE_LIMIT", () => {
    const sp = new URLSearchParams("page=1&limit=100");
    const result = parsePagination(sp);
    expect(result.limit).toBe(48);
  });

  it("defaults page to 1 when negative", () => {
    const sp = new URLSearchParams("page=-1&limit=10");
    const result = parsePagination(sp);
    expect(result.page).toBe(1);
  });

  it("defaults page to 1 when zero", () => {
    const sp = new URLSearchParams("page=0");
    const result = parsePagination(sp);
    expect(result.page).toBe(1);
  });

  it("defaults page to 1 when non-numeric", () => {
    const sp = new URLSearchParams("page=abc");
    const result = parsePagination(sp);
    expect(result.page).toBe(1);
  });

  it("defaults limit to defaultLimit when non-numeric", () => {
    const sp = new URLSearchParams("limit=xyz");
    const result = parsePagination(sp);
    expect(result.limit).toBe(12);
  });

  it("defaults limit to defaultLimit when negative", () => {
    const sp = new URLSearchParams("limit=-5");
    const result = parsePagination(sp);
    expect(result.limit).toBe(12);
  });

  it("floors page and limit values", () => {
    const sp = new URLSearchParams("page=2.9&limit=15.7");
    const result = parsePagination(sp);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(15);
    expect(result.skip).toBe(15);
  });

  it("handles limit of exactly MAX_PAGE_LIMIT", () => {
    const sp = new URLSearchParams("limit=48");
    const result = parsePagination(sp);
    expect(result.limit).toBe(48);
  });
});

describe("parseArrayParam", () => {
  it("returns empty array when key not present", () => {
    const sp = new URLSearchParams();
    expect(parseArrayParam(sp, "category")).toEqual([]);
  });

  it("parses single value", () => {
    const sp = new URLSearchParams("category=web-dev");
    expect(parseArrayParam(sp, "category")).toEqual(["web-dev"]);
  });

  it("parses comma-separated values", () => {
    const sp = new URLSearchParams("category=web-dev,dsa");
    expect(parseArrayParam(sp, "category")).toEqual(["web-dev", "dsa"]);
  });

  it("trims whitespace from values", () => {
    const sp = new URLSearchParams("category= web-dev , dsa ");
    expect(parseArrayParam(sp, "category")).toEqual(["web-dev", "dsa"]);
  });

  it("filters out empty values", () => {
    const sp = new URLSearchParams("category=web-dev,,dsa");
    expect(parseArrayParam(sp, "category")).toEqual(["web-dev", "dsa"]);
  });

  it("deduplicates values", () => {
    const sp = new URLSearchParams("category=web-dev&category=web-dev");
    expect(parseArrayParam(sp, "category")).toEqual(["web-dev"]);
  });

  it("handles multiple same keys", () => {
    const sp = new URLSearchParams();
    sp.append("category", "web-dev,dsa");
    sp.append("category", "dsa,basics");
    expect(parseArrayParam(sp, "category")).toEqual(["web-dev", "dsa", "basics"]);
  });

  it("handles empty string values", () => {
    const sp = new URLSearchParams("category=");
    expect(parseArrayParam(sp, "category")).toEqual([]);
  });
});

describe("parseBooleanParam", () => {
  it("returns undefined when key not present", () => {
    const sp = new URLSearchParams();
    expect(parseBooleanParam(sp, "featured")).toBeUndefined();
  });

  it("returns true for 'true'", () => {
    const sp = new URLSearchParams("featured=true");
    expect(parseBooleanParam(sp, "featured")).toBe(true);
  });

  it("returns true for '1'", () => {
    const sp = new URLSearchParams("featured=1");
    expect(parseBooleanParam(sp, "featured")).toBe(true);
  });

  it("returns false for 'false'", () => {
    const sp = new URLSearchParams("featured=false");
    expect(parseBooleanParam(sp, "featured")).toBe(false);
  });

  it("returns false for '0'", () => {
    const sp = new URLSearchParams("featured=0");
    expect(parseBooleanParam(sp, "featured")).toBe(false);
  });

  it("returns false for arbitrary string", () => {
    const sp = new URLSearchParams("featured=yes");
    expect(parseBooleanParam(sp, "featured")).toBe(false);
  });
});

describe("parseNumberParam", () => {
  it("returns undefined when key not present", () => {
    const sp = new URLSearchParams();
    expect(parseNumberParam(sp, "minPrice")).toBeUndefined();
  });

  it("returns undefined when value is empty string", () => {
    const sp = new URLSearchParams("minPrice=");
    expect(parseNumberParam(sp, "minPrice")).toBeUndefined();
  });

  it("returns number for valid integer", () => {
    const sp = new URLSearchParams("minPrice=500");
    expect(parseNumberParam(sp, "minPrice")).toBe(500);
  });

  it("returns number for valid float", () => {
    const sp = new URLSearchParams("minPrice=299.99");
    expect(parseNumberParam(sp, "minPrice")).toBe(299.99);
  });

  it("returns undefined for non-numeric string", () => {
    const sp = new URLSearchParams("minPrice=abc");
    expect(parseNumberParam(sp, "minPrice")).toBeUndefined();
  });

  it("handles whitespace", () => {
    const sp = new URLSearchParams("minPrice= 100 ");
    expect(parseNumberParam(sp, "minPrice")).toBe(100);
  });

  it("returns undefined for NaN", () => {
    const sp = new URLSearchParams("minPrice=NaN");
    expect(parseNumberParam(sp, "minPrice")).toBeUndefined();
  });
});

describe("buildPagination", () => {
  it("returns basic pagination", () => {
    const result = buildPagination(100, 1, 10);
    expect(result).toEqual({ page: 1, limit: 10, total: 100, totalPages: 10, hasNext: true, hasPrev: false });
  });

  it("calculates totalPages correctly", () => {
    const result = buildPagination(25, 10, 10);
    expect(result.totalPages).toBe(3);
  });

  it("sets hasNext to false on last page", () => {
    const result = buildPagination(100, 10, 10);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  it("sets hasPrev to false on first page", () => {
    const result = buildPagination(100, 1, 10);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrev).toBe(false);
  });

  it("returns at least 1 totalPages", () => {
    const result = buildPagination(0, 1, 10);
    expect(result.totalPages).toBe(1);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(false);
  });

  it("handles large total", () => {
    const result = buildPagination(1000, 1, 12);
    expect(result.totalPages).toBe(84);
    expect(result.hasNext).toBe(true);
  });
});

describe("escapeRegex", () => {
  it("returns string unchanged when no special chars", () => {
    expect(escapeRegex("hello")).toBe("hello");
  });

  it("escapes regex special characters", () => {
    expect(escapeRegex("hello.world")).toBe("hello\\.world");
  });

  it("escapes brackets", () => {
    expect(escapeRegex("a[b]c")).toBe("a\\[b\\]c");
  });

  it("escapes parentheses", () => {
    expect(escapeRegex("foo(bar)")).toBe("foo\\(bar\\)");
  });

  it("escapes plus and asterisk", () => {
    expect(escapeRegex("a+b*c")).toBe("a\\+b\\*c");
  });

  it("escapes question mark and caret", () => {
    expect(escapeRegex("^foo$")).toBe("\\^foo\\$");
  });

  it("escapes pipe and braces", () => {
    expect(escapeRegex("a|b{c}")).toBe("a\\|b\\{c\\}");
  });

  it("escapes backslash", () => {
    expect(escapeRegex("a\\b")).toBe("a\\\\b");
  });

  it("handles empty string", () => {
    expect(escapeRegex("")).toBe("");
  });
});

describe("resolveCategoryIds", () => {
  it("returns empty array when slugs is empty", async () => {
    const mockModel = { find: vi.fn() };
    const result = await resolveCategoryIds(mockModel as any, []);
    expect(result).toEqual([]);
    expect(mockModel.find).not.toHaveBeenCalled();
  });

  it("queries categories by slug and returns their ids", async () => {
    const mockModel = {
      find: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([
          { _id: "cat1" },
          { _id: "cat2" },
        ]),
      }),
    };

    const result = await resolveCategoryIds(mockModel as any, ["web-dev", "dsa"]);
    expect(mockModel.find).toHaveBeenCalledWith({ slug: { $in: ["web-dev", "dsa"] } });
    expect(result).toHaveLength(2);
  });

  it("returns empty array when no categories match slugs", async () => {
    const mockModel = {
      find: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      }),
    };

    const result = await resolveCategoryIds(mockModel as any, ["nonexistent"]);
    expect(result).toEqual([]);
  });

  it("maps category _id to ObjectId", async () => {
    const mockModel = {
      find: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([{ _id: "507f1f77bcf86cd799439011" }]),
      }),
    };

    const result = await resolveCategoryIds(mockModel as any, ["web-dev"]);
    expect((result[0] as any).toString()).toBe("507f1f77bcf86cd799439011");
  });
});

describe("buildNoteFilter", () => {
  it("returns empty filter for empty query with publicOnly", () => {
    const result = buildNoteFilter({ category: [], level: [], tags: [], sort: "newest" as const } as any, { publicOnly: true });
    expect(result.visibility).toBe("public");
  });

  it("adds visibility from query when not publicOnly", () => {
    const result = buildNoteFilter({ category: [], level: [], tags: [], sort: "newest" as const } as any, { publicOnly: false });
    expect(result.visibility).toBeUndefined();
  });

  it("overrides visibility with publicOnly over query visibility", () => {
    const result = buildNoteFilter({ category: [], visibility: "private" as any, level: [], tags: [], sort: "newest" as const } as any, { publicOnly: true });
    expect(result.visibility).toBe("public");
  });

  it("adds category filter when categoryIds provided", () => {
    const catId = new Types.ObjectId();
    const result = buildNoteFilter({ category: [], level: [], tags: [], sort: "newest" as const } as any, { publicOnly: true, categoryIds: [catId] });
    expect(result.category).toEqual({ $in: [catId] });
  });

  it("does not add category filter when categoryIds is empty", () => {
    const result = buildNoteFilter({ category: [], level: [], tags: [], sort: "newest" as const } as any, { publicOnly: true, categoryIds: [] });
    expect(result.category).toBeUndefined();
  });

  it("does not add category filter when categoryIds is undefined", () => {
    const result = buildNoteFilter({ category: [], level: [], tags: [], sort: "newest" as const } as any, { publicOnly: true });
    expect(result.category).toBeUndefined();
  });

  it("adds level filter", () => {
    const result = buildNoteFilter({ category: [], level: ["basics", "intermediate"], tags: [], sort: "newest" as const } as any, { publicOnly: false });
    expect(result.level).toEqual({ $in: ["basics", "intermediate"] });
  });

  it("lowercases tags in filter", () => {
    const result = buildNoteFilter({ category: [], level: [], tags: ["React", "Node"], sort: "newest" as const } as any, { publicOnly: false });
    expect(result.tags).toEqual({ $in: ["react", "node"] });
  });

  it("adds pricingType filter", () => {
    const result = buildNoteFilter({ category: [], level: [], tags: [], pricing: "paid", sort: "newest" as const } as any, { publicOnly: false });
    expect(result.pricingType).toBe("paid");
  });

  it("adds isFeatured filter when true", () => {
    const result = buildNoteFilter({ category: [], level: [], tags: [], featured: true, sort: "newest" as const } as any, { publicOnly: false });
    expect(result.isFeatured).toBe(true);
  });

  it("adds isFeatured filter when false", () => {
    const result = buildNoteFilter({ category: [], level: [], tags: [], featured: false, sort: "newest" as const } as any, { publicOnly: false });
    expect(result.isFeatured).toBe(false);
  });

  it("adds price range filter with min and max", () => {
    const result = buildNoteFilter({ category: [], level: [], tags: [], minPrice: 100, maxPrice: 500, sort: "newest" as const } as any, { publicOnly: false });
    expect(result.price).toEqual({ $gte: 10000, $lte: 50000 });
  });

  it("adds price range filter with only min", () => {
    const result = buildNoteFilter({ category: [], level: [], tags: [], minPrice: 100, sort: "newest" as const } as any, { publicOnly: false });
    expect(result.price).toEqual({ $gte: 10000 });
  });

  it("adds price range filter with only max", () => {
    const result = buildNoteFilter({ category: [], level: [], tags: [], maxPrice: 500, sort: "newest" as const } as any, { publicOnly: false });
    expect(result.price).toEqual({ $lte: 50000 });
  });

  it("adds search filter with regex pattern", () => {
    const result = buildNoteFilter({ category: [], level: [], tags: [], q: "react", sort: "newest" as const } as any, { publicOnly: false }) as any;
    expect(result.$or).toEqual([
      { title: expect.any(RegExp) },
      { tags: expect.any(RegExp) },
    ]);
    expect((result.$or as any)[0].title.source).toBe("react");
    expect((result.$or as any)[0].title.flags).toContain("i");
  });

  it("escapes special characters in search query", () => {
    const result = buildNoteFilter({ category: [], level: [], tags: [], q: "react.js", sort: "newest" as const } as any, { publicOnly: false }) as any;
    expect((result as any).$or[0].title.source).toBe("react\\.js");
    expect((result as any).$or[0].title.flags).toContain("i");
  });

  it("does not add search filter when q is empty", () => {
    const result = buildNoteFilter({ category: [], level: [], tags: [], q: "", sort: "newest" as const } as any, { publicOnly: false });
    expect(result.$or).toBeUndefined();
  });
});

describe("buildNoteSort", () => {
  it("returns newest sort by default", () => {
    expect(buildNoteSort("newest")).toEqual({ createdAt: -1 });
  });

  it("returns oldest sort", () => {
    expect(buildNoteSort("oldest")).toEqual({ createdAt: 1 });
  });

  it("returns price_asc sort", () => {
    expect(buildNoteSort("price_asc")).toEqual({ price: 1, createdAt: -1 });
  });

  it("returns price_desc sort", () => {
    expect(buildNoteSort("price_desc")).toEqual({ price: -1, createdAt: -1 });
  });

  it("returns popular sort", () => {
    expect(buildNoteSort("popular")).toEqual({ purchaseCount: -1, downloadCount: -1, createdAt: -1 });
  });

  it("returns title_asc sort", () => {
    expect(buildNoteSort("title_asc")).toEqual({ title: 1 });
  });

  it("falls back to newest for unknown sort value", () => {
    expect(buildNoteSort("unknown" as any)).toEqual({ createdAt: -1 });
  });
});

describe("buildOrderFilter", () => {
  it("returns empty filter for empty query", () => {
    const result = buildOrderFilter({} as any);
    expect(result).toEqual({});
  });

  it("adds paymentStatus filter", () => {
    const result = buildOrderFilter({ paymentStatus: "paid", sort: "newest" as const } as any);
    expect(result.paymentStatus).toBe("paid");
  });

  it("adds fulfillmentStatus filter", () => {
    const result = buildOrderFilter({ fulfillmentStatus: "completed", sort: "newest" as const } as any);
    expect(result.fulfillmentStatus).toBe("completed");
  });

  it("adds itemType filter", () => {
    const result = buildOrderFilter({ itemType: "note", sort: "newest" as const } as any);
    expect(result.itemType).toBe("note");
  });

  it("adds createdAt date range filter", () => {
    const from = new Date("2024-01-01");
    const to = new Date("2024-12-31");
    const result = buildOrderFilter({ from, to, sort: "newest" as const } as any);
    expect(result.createdAt).toEqual({ $gte: from, $lte: to });
  });

  it("adds only $gte when only from is provided", () => {
    const from = new Date("2024-01-01");
    const result = buildOrderFilter({ from, sort: "newest" as const } as any);
    expect(result.createdAt).toEqual({ $gte: from });
  });

  it("adds only $lte when only to is provided", () => {
    const to = new Date("2024-12-31");
    const result = buildOrderFilter({ to, sort: "newest" as const } as any);
    expect(result.createdAt).toEqual({ $lte: to });
  });

  it("adds search filter with regex pattern", () => {
    const result = buildOrderFilter({ q: "react", sort: "newest" as const } as any);
    expect(result.$or).toBeDefined();
    expect(result.$or).toHaveLength(3);
    expect((result.$or![0] as any).orderNumber.source).toBe("react");
    expect((result.$or![0] as any).orderNumber.flags).toContain("i");
  });

  it("combines multiple filters", () => {
    const result = buildOrderFilter({ paymentStatus: "paid", itemType: "note", from: "2024-01-01T00:00:00Z", sort: "newest" as const } as any);
    expect(result.paymentStatus).toBe("paid");
    expect(result.itemType).toBe("note");
    expect(result.createdAt).toEqual({ $gte: "2024-01-01T00:00:00Z" });
  });
});

describe("buildOrderSort", () => {
  it("returns newest sort by default", () => {
    expect(buildOrderSort("newest")).toEqual({ createdAt: -1 });
  });

  it("returns oldest sort", () => {
    expect(buildOrderSort("oldest")).toEqual({ createdAt: 1 });
  });

  it("returns amount_desc sort", () => {
    expect(buildOrderSort("amount_desc")).toEqual({ amount: -1, createdAt: -1 });
  });

  it("returns amount_asc sort", () => {
    expect(buildOrderSort("amount_asc")).toEqual({ amount: 1, createdAt: -1 });
  });

  it("falls back to newest for unknown sort value", () => {
    expect(buildOrderSort("unknown" as any)).toEqual({ createdAt: -1 });
  });
});
