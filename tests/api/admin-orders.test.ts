import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { Order } from "@/server/db/models/order.model";
import { toAdminOrder } from "@/server/mappers/order.mapper";
import { parsePagination, buildPagination, buildOrderFilter, buildOrderSort } from "@/server/lib/query";
import { requireAdmin } from "@/server/lib/auth-guard";

vi.mock("@/server/db/connect", () => ({ connectDB: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/server/db/models/order.model", () => ({
  Order: {
    find: vi.fn(),
    countDocuments: vi.fn(),
  },
}));
vi.mock("@/server/mappers/order.mapper", () => ({
  toAdminOrder: vi.fn((o: any) => o),
}));
vi.mock("@/server/lib/query", () => ({
  parsePagination: vi.fn(() => ({ page: 1, limit: 20, skip: 0 })),
  buildPagination: vi.fn(() => ({ page: 1, limit: 20, total: 0, totalPages: 1, hasNext: false, hasPrev: false })),
  buildOrderFilter: vi.fn(() => ({})),
  buildOrderSort: vi.fn(() => ({ createdAt: -1 })),
}));
vi.mock("@/server/lib/auth-guard", () => ({
  requireAdmin: vi.fn(),
}));

const ADMIN = { id: "a1", name: "Admin", email: "a@b.com", isHead: false };

function makeChain(val: unknown) {
  return {
    sort: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(val),
  };
}

function mockReq(method: string, path: string) {
  return new NextRequest(`http://localhost${path}`, { method });
}

describe("GET /api/admin/orders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ;(requireAdmin as any).mockResolvedValue(ADMIN);
    ;(Order.find as any).mockReturnValue(makeChain([]));
    ;(Order.countDocuments as any).mockReturnValue(makeChain(0));
    ;(parsePagination as any).mockReturnValue({ page: 1, limit: 20, skip: 0 });
    ;(buildOrderFilter as any).mockReturnValue({});
    ;(buildOrderSort as any).mockReturnValue({ createdAt: -1 });
    ;(buildPagination as any).mockReturnValue({ page: 1, limit: 20, total: 0, totalPages: 1, hasNext: false, hasPrev: false });
  });

  it("returns paginated orders with summary", async () => {
    const { GET } = await import("@/app/api/admin/orders/route");
    const res = await GET(mockReq("GET", "/api/admin/orders") as any, undefined);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.summary).toBeDefined();
    expect(json.data.pagination).toBeDefined();
    expect(json.data.items).toEqual([]);
  });

  it("computes revenue summary from paid orders", async () => {
    const orders = [
      { _id: "o1", paymentStatus: "paid", amount: 50000, fulfillmentStatus: "pending" },
      { _id: "o2", paymentStatus: "paid", amount: 30000, fulfillmentStatus: "completed" },
      { _id: "o3", paymentStatus: "failed", amount: 10000 },
    ];
    ;(Order.find as any).mockReturnValue(makeChain(orders));
    ;(Order.countDocuments as any).mockReturnValue(makeChain(3));
    ;(buildPagination as any).mockReturnValue({ page: 1, limit: 20, total: 3, totalPages: 1, hasNext: false, hasPrev: false });
    const { GET } = await import("@/app/api/admin/orders/route");
    const res = await GET(mockReq("GET", "/api/admin/orders") as any, undefined);
    const json = await res.json();
    expect(json.data.summary.totalRevenuePaise).toBe(80000);
    expect(json.data.summary.paidCount).toBe(2);
    expect(json.data.summary.pendingFulfillmentCount).toBe(1);
    expect(json.data.summary.failedCount).toBe(1);
  });

  it("returns zero summary when no orders exist", async () => {
    ;(Order.find as any).mockReturnValue(makeChain([]));
    const { GET } = await import("@/app/api/admin/orders/route");
    const res = await GET(mockReq("GET", "/api/admin/orders") as any, undefined);
    const json = await res.json();
    expect(json.data.summary.totalRevenuePaise).toBe(0);
    expect(json.data.summary.paidCount).toBe(0);
    expect(json.data.summary.failedCount).toBe(0);
  });

  it("uses parsePagination for page/limit/skip", async () => {
    ;(parsePagination as any).mockReturnValue({ page: 2, limit: 10, skip: 10 });
    ;(Order.find as any).mockReturnValue(makeChain([]));
    const { GET } = await import("@/app/api/admin/orders/route");
    await GET(mockReq("GET", "/api/admin/orders?page=2&limit=10") as any, undefined);
    expect(parsePagination).toHaveBeenCalledWith(expect.any(URLSearchParams), 20);
  });

  it("applies filter query via buildOrderFilter", async () => {
    ;(buildOrderFilter as any).mockReturnValue({ paymentStatus: "paid" });
    ;(Order.find as any).mockReturnValue(makeChain([]));
    const { GET } = await import("@/app/api/admin/orders/route");
    await GET(mockReq("GET", "/api/admin/orders?paymentStatus=paid") as any, undefined);
    expect(buildOrderFilter).toHaveBeenCalledWith(expect.objectContaining({ paymentStatus: "paid" }));
  });

  it("applies sort via buildOrderSort", async () => {
    ;(buildOrderSort as any).mockReturnValue({ amount: -1 });
    ;(Order.find as any).mockReturnValue(makeChain([]));
    const { GET } = await import("@/app/api/admin/orders/route");
    await GET(mockReq("GET", "/api/admin/orders?sort=amount_desc") as any, undefined);
    expect(buildOrderSort).toHaveBeenCalledWith("amount_desc");
  });

  it("sets cache control header", async () => {
    ;(Order.find as any).mockReturnValue(makeChain([]));
    const { GET } = await import("@/app/api/admin/orders/route");
    const res = await GET(mockReq("GET", "/api/admin/orders") as any, undefined);
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=30, s-maxage=30");
  });

  it("is protected by admin auth", async () => {
    ;(requireAdmin as any).mockResolvedValue(null);
    const { GET } = await import("@/app/api/admin/orders/route");
    const req = mockReq("GET", "/api/admin/orders");
    await GET(req as any, undefined);
    expect(requireAdmin).toHaveBeenCalled();
  });

  it("mappers orders through toAdminOrder", async () => {
    const orders = [{ _id: "o1", orderNumber: "NP-001" }];
    ;(Order.find as any).mockReturnValue(makeChain(orders));
    const { GET } = await import("@/app/api/admin/orders/route");
    await GET(mockReq("GET", "/api/admin/orders") as any, undefined);
    expect(toAdminOrder).toHaveBeenCalledWith(orders[0], 0, [orders[0]]);
  });
});
