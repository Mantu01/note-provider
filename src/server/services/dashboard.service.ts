import { Order, type OrderDoc } from "../db/models/order.model";
import { Note } from "../db/models/note.model";
import { Group } from "../db/models/group.model";
import { Category } from "../db/models/category.model";
import { AdminActivity } from "../db/models/admin-activity.model";

export async function getDashboardStats(): Promise<import("@/lib/types").DashboardStats> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalRevenue,
    todayRevenue,
    last30DaysRevenue,
    totalOrders,
    paidOrders,
    failedOrders,
    pendingFulfillment,
    completedOrders,
    todayOrders,
    totalNotes,
    freeNotes,
    paidNotes,
    totalGroups,
    totalCategories,
    happyLearners,
    revenueSeries,
    topNotes,
    categoryBreakdown,
    recentOrders,
    recentActivities,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).then(([r]) => r?.total ?? 0),
    Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).then(([r]) => r?.total ?? 0),
    Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).then(([r]) => r?.total ?? 0),
    Order.countDocuments().exec(),
    Order.countDocuments({ paymentStatus: "paid" }).exec(),
    Order.countDocuments({ paymentStatus: "failed" }).exec(),
    Order.countDocuments({ paymentStatus: "paid", fulfillmentStatus: "pending" }).exec(),
    Order.countDocuments({ paymentStatus: "paid", fulfillmentStatus: "completed" }).exec(),
    Order.countDocuments({ createdAt: { $gte: today } }).exec(),
    Note.countDocuments().exec(),
    Note.countDocuments({ pricingType: "free" }).exec(),
    Note.countDocuments({ pricingType: "paid" }).exec(),
    Group.countDocuments().exec(),
    Category.countDocuments().exec(),
    Order.countDocuments({ paymentStatus: "paid" }).exec(),
    generateRevenueSeries(thirtyDaysAgo),
    getTopNotes(),
    getCategoryBreakdown(),
    Order.find().sort({ createdAt: -1 }).limit(10).lean<OrderDoc>().exec(),
    AdminActivity.find().sort({ createdAt: -1 }).limit(10).lean().exec(),
  ]);

  return {
    revenue: {
      totalPaise: totalRevenue,
      totalLabel: formatPaise(totalRevenue),
      todayPaise: todayRevenue,
      todayLabel: formatPaise(todayRevenue),
      last30DaysPaise: last30DaysRevenue,
      last30DaysLabel: formatPaise(last30DaysRevenue),
    },
    orders: {
      total: totalOrders,
      paid: paidOrders,
      failed: failedOrders,
      pendingFulfillment: pendingFulfillment,
      completed: completedOrders,
      today: todayOrders,
    },
    catalog: {
      totalNotes,
      freeNotes,
      paidNotes,
      totalGroups,
      totalCategories,
    },
    leads: { total: happyLearners, today: todayOrders },
    revenueSeries,
    topNotes,
    categoryBreakdown,
    recentOrders: recentOrders as unknown as import("@/lib/types").AdminOrder[],
    recentActivities: recentActivities as unknown as import("@/lib/types").AdminActivity[],
  };
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function generateRevenueSeries(from: Date): Promise<Array<{ date: string; revenuePaise: number; orders: number }>> {
  const aggregated = await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        createdAt: { $gte: from },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: "+05:30",
          },
        },
        revenuePaise: { $sum: "$amount" },
        orders: { $sum: 1 },
      },
    },
  ]);

  const map = new Map<string, { revenuePaise: number; orders: number }>();
  for (const item of aggregated) {
    if (item._id) {
      map.set(item._id, { revenuePaise: item.revenuePaise, orders: item.orders });
    }
  }

  const series: Array<{ date: string; revenuePaise: number; orders: number }> = [];
  const current = new Date(from);
  const now = new Date();

  while (current <= now) {
    const dateStr = toDateKey(current);
    const data = map.get(dateStr) ?? { revenuePaise: 0, orders: 0 };
    series.push({ date: dateStr, revenuePaise: data.revenuePaise, orders: data.orders });
    current.setDate(current.getDate() + 1);
  }

  return series;
}

async function getTopNotes(): Promise<Array<{ id: string; title: string; slug: string; purchaseCount: number; revenuePaise: number; revenueLabel: string }>> {
  return Note.find({}, { _id: 1, title: 1, slug: 1, purchaseCount: 1, revenuePaise: 1 })
    .sort({ purchaseCount: -1, revenuePaise: -1 })
    .limit(5)
    .lean()
    .then((notes) =>
      notes.map((n) => ({
        id: n._id.toString(),
        title: n.title,
        slug: n.slug,
        purchaseCount: n.purchaseCount,
        revenuePaise: n.revenuePaise,
        revenueLabel: formatPaise(n.revenuePaise),
      })),
    );
}

async function getCategoryBreakdown(): Promise<Array<{ name: string; noteCount: number; revenuePaise: number }>> {
  return Note.aggregate([
    { $group: { _id: "$category", noteCount: { $sum: 1 }, revenuePaise: { $sum: "$revenuePaise" } } },
    { $sort: { noteCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $project: {
        name: "$category.name",
        noteCount: 1,
        revenuePaise: 1,
      },
    },
  ]).then((results) =>
    results.map((r) => ({
      name: r.name,
      noteCount: r.noteCount,
      revenuePaise: r.revenuePaise,
    })),
  );
}

function formatPaise(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}
