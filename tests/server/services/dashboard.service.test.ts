import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDashboardStats } from "../../../src/server/services/dashboard.service";
import * as OrderModel from "../../../src/server/db/models/order.model";
import * as NoteModel from "../../../src/server/db/models/note.model";
import * as GroupModel from "../../../src/server/db/models/group.model";
import * as CategoryModel from "../../../src/server/db/models/category.model";
import * as AdminActivityModel from "../../../src/server/db/models/admin-activity.model";

vi.mock("../../../src/server/db/models/order.model", () => ({
  Order: {
    aggregate: vi.fn(),
    countDocuments: vi.fn(),
    find: vi.fn(),
  },
}));

vi.mock("../../../src/server/db/models/note.model", () => ({
  Note: {
    countDocuments: vi.fn(),
    find: vi.fn(),
    aggregate: vi.fn(),
  },
}));

vi.mock("../../../src/server/db/models/group.model", () => ({
  Group: {
    countDocuments: vi.fn(),
  },
}));

vi.mock("../../../src/server/db/models/category.model", () => ({
  Category: {
    countDocuments: vi.fn(),
  },
}));

vi.mock("../../../src/server/db/models/admin-activity.model", () => ({
  AdminActivity: {
    find: vi.fn(),
  },
}));

const makeQueryChain = (results: any[]) => {
  let trackedResults = results;
  const execFn = vi.fn().mockResolvedValue(trackedResults);
  const chain: any = {
    sort: vi.fn().mockReturnThis(),
    limit: vi.fn((n: number) => {
      trackedResults = results.slice(0, n);
      execFn.mockResolvedValue(trackedResults);
      return chain;
    }),
    populate: vi.fn().mockReturnThis(),
    lean: vi.fn().mockReturnThis(),
    exec: execFn,
  };
  chain.then = (cb: any) => cb(trackedResults);
  return chain;
};

const makeCountQuery = (value: number) => ({
  exec: vi.fn().mockResolvedValue(value),
});

describe("getDashboardStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns full dashboard stats structure", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockImplementation(() => Promise.resolve([]) as any);
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();

    expect(result).toMatchObject({
      revenue: {
        totalPaise: expect.any(Number),
        totalLabel: expect.any(String),
        todayPaise: expect.any(Number),
        todayLabel: expect.any(String),
        last30DaysPaise: expect.any(Number),
        last30DaysLabel: expect.any(String),
      },
      orders: {
        total: expect.any(Number),
        paid: expect.any(Number),
        failed: expect.any(Number),
        pendingFulfillment: expect.any(Number),
        completed: expect.any(Number),
        today: expect.any(Number),
      },
      catalog: {
        totalNotes: expect.any(Number),
        freeNotes: expect.any(Number),
        paidNotes: expect.any(Number),
        totalGroups: expect.any(Number),
        totalCategories: expect.any(Number),
      },
      leads: {
        total: expect.any(Number),
        today: expect.any(Number),
      },
      revenueSeries: expect.any(Array),
      topNotes: expect.any(Array),
      categoryBreakdown: expect.any(Array),
      recentOrders: expect.any(Array),
      recentActivities: expect.any(Array),
    });
  });

  it("handles zero revenue from aggregates", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();

    expect(result.revenue.totalPaise).toBe(0);
    expect(result.revenue.totalLabel).toBe("₹0.00");
    expect(result.orders.total).toBe(0);
    expect(result.catalog.totalNotes).toBe(0);
    expect(result.revenueSeries).toEqual(expect.any(Array));
    expect(result.topNotes).toEqual([]);
    expect(result.categoryBreakdown).toEqual([]);
  });

  it("generates revenue series with date range", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockImplementation((pipeline: any[]) => {
      if (pipeline[0]?.$match?.createdAt?.$gte && pipeline[1]?.$group?._id?.$dateToString) {
        return Promise.resolve([
          { _id: "2024-01-10", revenuePaise: 10000, orders: 2 },
          { _id: "2024-01-12", revenuePaise: 20000, orders: 4 },
        ]);
      }
      return Promise.resolve([]) as any;
    });

    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();

    expect(result.revenueSeries.length).toBeGreaterThan(0);
    expect(result.revenueSeries[0]).toHaveProperty("date");
    expect(result.revenueSeries[0]).toHaveProperty("revenuePaise");
    expect(result.revenueSeries[0]).toHaveProperty("orders");
  });

  it("fills gaps in revenue series with zero values", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockImplementation(
      ((pipeline: any[]) => {
        if (pipeline[0]?.$match?.createdAt?.$gte && pipeline[1]?.$group?._id?.$dateToString) {
          return Promise.resolve([
            { _id: "2024-01-01", revenuePaise: 5000, orders: 1 },
            { _id: "2024-01-03", revenuePaise: 10000, orders: 2 },
          ]);
        }
        return Promise.resolve([]) as any;
      }) as any,
    );

    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();

    const dates = result.revenueSeries.map((s: { date: string }) => s.date);
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      expect(diffDays).toBe(1);
    }
  });

  it("returns top notes sorted by purchaseCount descending", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);

    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([
      { _id: "n1", title: "React Advanced", slug: "react-adv", purchaseCount: 150, revenuePaise: 750000 },
      { _id: "n2", title: "Node Basics", slug: "node-basics", purchaseCount: 100, revenuePaise: 500000 },
    ]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();

    expect(result.topNotes).toHaveLength(2);
    expect(result.topNotes[0].purchaseCount).toBe(150);
    expect(result.topNotes[0].revenueLabel).toBe("₹7500.00");
    expect(result.topNotes[1].revenueLabel).toBe("₹5000.00");
  });

  it("returns category breakdown with lookup results", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);

    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([
      { name: "Web Development", noteCount: 15, revenuePaise: 300000 },
      { name: "DSA", noteCount: 10, revenuePaise: 200000 },
    ]);

    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();

    expect(result.categoryBreakdown).toHaveLength(2);
    expect(result.categoryBreakdown[0].name).toBe("Web Development");
    expect(result.categoryBreakdown[0].noteCount).toBe(15);
    expect(result.categoryBreakdown[0].revenuePaise).toBe(300000);
  });

  it("returns recent orders sorted by createdAt descending", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);

    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([
      { _id: "ord1", orderNumber: "NP-001", amount: 50000 },
      { _id: "ord2", orderNumber: "NP-002", amount: 30000 },
    ]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();

    expect(result.recentOrders).toHaveLength(2);
    expect(result.recentOrders[0].orderNumber).toBe("NP-001");
  });

  it("returns recent activities", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);

    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([
      { action: "note.create", description: "Created note" },
    ]) as any);

    const result = await getDashboardStats();

    expect(result.recentActivities).toHaveLength(1);
    expect(result.recentActivities[0].action).toBe("note.create");
  });

  it("formats revenue labels correctly", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockImplementation(({ $match }: any) => {
      const isSeriesCall = $match?.createdAt?.$gte && $match.paymentStatus === "paid";
      if (isSeriesCall) {
        return Promise.resolve([]) as any;
      }
      return Promise.resolve([{ _id: null, total: 1234567 }]) as any;
    }) as any;
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();

    expect(result.revenue.totalLabel).toBe("₹12345.67");
  });

  it("sets leads.total equal to paid orders count", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.countDocuments).mockImplementation(() => makeCountQuery(8) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();
    expect(result.leads.total).toBe(8);
  });

  it("sets today orders correctly", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.countDocuments).mockImplementation(() => makeCountQuery(3) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();
    expect(result.orders.today).toBe(3);
    expect(result.leads.today).toBe(3);
  });

  it("handles aggregate returning undefined gracefully", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockImplementation((((pipeline: any[]) => {
      if (pipeline[0]?.$match?.paymentStatus === "paid" && !pipeline[0]?.$match?.createdAt) {
        return Promise.resolve([undefined]);
      }
      if (pipeline[0]?.$match?.createdAt?.$gte && pipeline[1]?.$group?._id?.$dateToString) {
        return Promise.resolve([]);
      }
      return Promise.resolve([]);
    }) as any));
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();
    expect(result.revenue.totalPaise).toBe(0);
  });

  it("includes category breakdown limited to 5 items", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);

    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([
      { name: "Cat A", noteCount: 10, revenuePaise: 50000 },
      { name: "Cat B", noteCount: 8, revenuePaise: 40000 },
      { name: "Cat C", noteCount: 6, revenuePaise: 30000 },
      { name: "Cat D", noteCount: 4, revenuePaise: 20000 },
      { name: "Cat E", noteCount: 2, revenuePaise: 10000 },
    ]);

    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();
    expect(result.categoryBreakdown).toHaveLength(5);
  });

  it("handles empty database state", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();

    expect(result.revenue.totalPaise).toBe(0);
    expect(result.revenue.todayPaise).toBe(0);
    expect(result.revenue.last30DaysPaise).toBe(0);
    expect(result.orders.total).toBe(0);
    expect(result.orders.paid).toBe(0);
    expect(result.orders.failed).toBe(0);
    expect(result.orders.pendingFulfillment).toBe(0);
    expect(result.orders.completed).toBe(0);
    expect(result.orders.today).toBe(0);
    expect(result.catalog.totalNotes).toBe(0);
    expect(result.catalog.freeNotes).toBe(0);
    expect(result.catalog.paidNotes).toBe(0);
    expect(result.catalog.totalGroups).toBe(0);
    expect(result.catalog.totalCategories).toBe(0);
    expect(result.leads.total).toBe(0);
    expect(result.leads.today).toBe(0);
    expect(result.revenueSeries.length).toBeGreaterThan(0);
    expect(result.topNotes).toEqual([]);
    expect(result.categoryBreakdown).toEqual([]);
    expect(result.recentOrders).toEqual([]);
    expect(result.recentActivities).toEqual([]);
  });

  it("returns top notes with valid revenue labels", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);

    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([
      { _id: "n1", title: "React", slug: "react", purchaseCount: 50, revenuePaise: 25000 },
    ]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();

    expect(result.topNotes).toHaveLength(1);
    expect(result.topNotes[0].title).toBe("React");
    expect(result.topNotes[0].slug).toBe("react");
    expect(result.topNotes[0].purchaseCount).toBe(50);
    expect(result.topNotes[0].revenueLabel).toBe("₹250.00");
    expect(typeof result.topNotes[0].id).toBe("string");
  });

  it("returns recent orders with proper ordering", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);

    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([
      { _id: "ord2", orderNumber: "NP-LATER", amount: 40000, createdAt: new Date("2024-06-01") },
      { _id: "ord1", orderNumber: "NP-EARLIER", amount: 20000, createdAt: new Date("2024-01-01") },
    ]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();

    expect(result.recentOrders).toHaveLength(2);
    expect(result.recentOrders[0].orderNumber).toBe("NP-LATER");
    expect(result.recentOrders[1].orderNumber).toBe("NP-EARLIER");
  });

  it("returns recent activities with proper sorting", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);

    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([
      { action: "order.fulfill", description: "Fulfilled order" },
      { action: "note.create", description: "Created note" },
    ]) as any);

    const result = await getDashboardStats();

    expect(result.recentActivities).toHaveLength(2);
    expect(result.recentActivities[0].action).toBe("order.fulfill");
    expect(result.recentActivities[1].action).toBe("note.create");
  });

  it("limits recent orders to 10 items", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const manyOrders = Array.from({ length: 15 }, (_, i) => ({
      _id: `ord${i}`,
      orderNumber: `NP-${i}`,
      amount: 1000,
    }));
    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain(manyOrders) as any);

    const result = await getDashboardStats();
    expect(result.recentOrders).toHaveLength(10);
  });

  it("covers free/paid note counts separately", async () => {
    vi.mocked(OrderModel.Order.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.countDocuments).mockImplementation(() => makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.countDocuments).mockImplementation(() => makeCountQuery(30) as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(CategoryModel.Category.countDocuments).mockReturnValue(makeCountQuery(0) as any);
    vi.mocked(NoteModel.Note.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);
    vi.mocked(OrderModel.Order.find).mockReturnValue(makeQueryChain([]) as any);
    vi.mocked(AdminActivityModel.AdminActivity.find).mockReturnValue(makeQueryChain([]) as any);

    const result = await getDashboardStats();
    expect(result.catalog.totalNotes).toBe(30);
  });
});
