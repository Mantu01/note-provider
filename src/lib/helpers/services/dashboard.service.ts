import { prisma } from "../db";

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function generateRevenueSeries(from: Date): Promise<Array<{ date: string; revenuePaise: number; orders: number }>> {
  const rows = await prisma.$queryRawUnsafe(
    `SELECT DATE_TRUNC('day', "createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::date AS day,
            SUM(amount) AS revenue_paise,
            COUNT(*) AS orders
     FROM "Order"
     WHERE "paymentStatus" = 'paid' AND "createdAt" >= $1
     GROUP BY day
     ORDER BY day`,
    from,
  ) as Array<{ day: string; revenue_paise: number; orders: number }>;

  const map = new Map(rows.map((r) => [r.day, { revenuePaise: Number(r.revenue_paise), orders: Number(r.orders) }]));

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
  const notes = await prisma.note.findMany({
    select: { id: true, title: true, slug: true, purchaseCount: true, revenuePaise: true },
    orderBy: { purchaseCount: "desc", revenuePaise: "desc" },
    take: 5,
  });
  return notes.map((n) => ({ ...n, revenueLabel: `₹${(n.revenuePaise / 100).toFixed(2)}` }));
}

async function getCategoryBreakdown(): Promise<Array<{ name: string; noteCount: number; revenuePaise: number }>> {
  const rows = await prisma.$queryRawUnsafe(
    `SELECT c."name", COUNT(n.id) AS "noteCount", COALESCE(SUM(n."revenuePaise"), 0) AS "revenuePaise"
     FROM "Note" n
     JOIN "Category" c ON n."categoryId" = c.id
     GROUP BY c.id, c."name"
     ORDER BY "noteCount" DESC
     LIMIT 5`,
  ) as Array<{ name: string; noteCount: bigint; revenuePaise: bigint }>;

  return rows.map((r) => ({ name: r.name, noteCount: Number(r.noteCount), revenuePaise: Number(r.revenuePaise) }));
}

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
  ] = await Promise.all([
    prisma.order.aggregate({ where: { paymentStatus: "paid" }, _sum: { amount: true } }).then((r) => r._sum.amount ?? 0),
    prisma.order.aggregate({ where: { paymentStatus: "paid", createdAt: { gte: today } }, _sum: { amount: true } }).then((r) => r._sum.amount ?? 0),
    prisma.order.aggregate({ where: { paymentStatus: "paid", createdAt: { gte: thirtyDaysAgo } }, _sum: { amount: true } }).then((r) => r._sum.amount ?? 0),
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: "paid" } }),
    prisma.order.count({ where: { paymentStatus: "failed" } }),
    prisma.order.count({ where: { paymentStatus: "paid", fulfillmentStatus: "pending" } }),
    prisma.order.count({ where: { paymentStatus: "paid", fulfillmentStatus: "completed" } }),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.note.count(),
    prisma.note.count({ where: { pricingType: "free" } }),
    prisma.note.count({ where: { pricingType: "paid" } }),
    prisma.group.count(),
    prisma.category.count(),
    prisma.order.count({ where: { paymentStatus: "paid" } }),
    generateRevenueSeries(thirtyDaysAgo),
    getTopNotes(),
    getCategoryBreakdown(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  return {
    revenue: {
      totalPaise: totalRevenue,
      totalLabel: `₹${(totalRevenue / 100).toFixed(2)}`,
      todayPaise: todayRevenue,
      todayLabel: `₹${(todayRevenue / 100).toFixed(2)}`,
      last30DaysPaise: last30DaysRevenue,
      last30DaysLabel: `₹${(last30DaysRevenue / 100).toFixed(2)}`,
    },
    orders: {
      total: totalOrders,
      paid: paidOrders,
      failed: failedOrders,
      pendingFulfillment,
      completed: completedOrders,
      today: todayOrders,
    },
    catalog: { totalNotes, freeNotes, paidNotes, totalGroups, totalCategories },
    leads: { total: happyLearners, today: todayOrders },
    revenueSeries,
    topNotes,
    categoryBreakdown,
    recentOrders: recentOrders as unknown as import("@/lib/types").AdminOrder[],
  };
}
