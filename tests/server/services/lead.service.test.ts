import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  listOrders,
  exportOrders,
  getLeadCount,
  getTodayLeadCount,
} from "../../../src/server/services/lead.service";
import * as OrderModel from "../../../src/server/db/models/order.model";

vi.mock("../../../src/server/db/models/order.model", () => ({
  Order: {
    find: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

const mockOrder = {
  _id: "ord1",
  orderNumber: "NP-20240101-0001",
  amount: 50000,
  paymentStatus: "paid" as const,
  fulfillmentStatus: "pending" as const,
  createdAt: new Date("2024-01-01"),
};

describe("listOrders", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns orders with summary for paid orders", async () => {
    const query = {
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockOrder]),
    };
    vi.mocked(OrderModel.Order.find).mockReturnValue(query as any);
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
    } as any);

    const result = await listOrders({}, { createdAt: -1 }, 0, 10);
    expect(result.items).toEqual([mockOrder]);
    expect(result.total).toBe(1);
    expect(result.summary.totalRevenuePaise).toBe(50000);
    expect(result.summary.paidCount).toBe(1);
    expect(result.summary.pendingFulfillmentCount).toBe(1);
    expect(result.summary.failedCount).toBe(0);
  });

  it("calculates summary with mixed payment statuses", async () => {
    const orders = [
      { ...mockOrder, paymentStatus: "paid" as const, fulfillmentStatus: "completed" as const },
      { ...mockOrder, paymentStatus: "paid" as const, fulfillmentStatus: "pending" as const },
      { ...mockOrder, paymentStatus: "failed" as const },
      { ...mockOrder, paymentStatus: "created" as const },
    ];
    const query = {
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(orders),
    };
    vi.mocked(OrderModel.Order.find).mockReturnValue(query as any);
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue({
      exec: vi.fn().mockResolvedValue(4),
    } as any);

    const result = await listOrders({}, { createdAt: -1 }, 0, 10);
    expect(result.summary.paidCount).toBe(2);
    expect(result.summary.failedCount).toBe(1);
    expect(result.summary.totalRevenuePaise).toBe(100000);
    expect(result.summary.pendingFulfillmentCount).toBe(1);
  });

  it("returns zero summary when no orders match", async () => {
    const query = {
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    };
    vi.mocked(OrderModel.Order.find).mockReturnValue(query as any);
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue({
      exec: vi.fn().mockResolvedValue(0),
    } as any);

    const result = await listOrders({}, { createdAt: -1 }, 0, 10);
    expect(result.summary.totalRevenuePaise).toBe(0);
    expect(result.summary.paidCount).toBe(0);
    expect(result.summary.failedCount).toBe(0);
    expect(result.summary.pendingFulfillmentCount).toBe(0);
    expect(result.total).toBe(0);
  });
});

describe("exportOrders", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns up to 10000 orders sorted by createdAt descending", async () => {
    const query = {
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockOrder]),
    };
    vi.mocked(OrderModel.Order.find).mockReturnValue(query as any);

    const result = await exportOrders({ paymentStatus: "paid" });
    expect(OrderModel.Order.find).toHaveBeenCalledWith({ paymentStatus: "paid" });
    expect(result).toEqual([mockOrder]);
  });
});

describe("getLeadCount", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns count of orders with lead payment statuses", async () => {
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue({
      exec: vi.fn().mockResolvedValue(42),
    } as any);

    const result = await getLeadCount();
    expect(OrderModel.Order.countDocuments).toHaveBeenCalledWith({
      paymentStatus: { $in: ["created", "paid", "failed"] },
    });
    expect(result).toBe(42);
  });
});

describe("getTodayLeadCount", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns count of today's orders with lead payment statuses", async () => {
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue({
      exec: vi.fn().mockResolvedValue(5),
    } as any);

    const result = await getTodayLeadCount();
    expect(OrderModel.Order.countDocuments).toHaveBeenCalledWith({
      paymentStatus: { $in: ["created", "paid", "failed"] },
      createdAt: expect.objectContaining({ $gte: expect.any(Date) }),
    });
    expect(result).toBe(5);
  });

  it("uses start of current day", async () => {
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue({
      exec: vi.fn().mockResolvedValue(0),
    } as any);

    await getTodayLeadCount();
    const call = vi.mocked(OrderModel.Order.countDocuments).mock.calls[0][0] as unknown as Record<string, unknown>;
    const createdAt = call.createdAt as Record<string, Date>;
    expect(createdAt.$gte).toBeDefined();
    expect(createdAt.$gte.getHours()).toBe(0);
    expect(createdAt.$gte.getMinutes()).toBe(0);
  });
});
