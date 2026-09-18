import { prisma } from "../db";
import { formatPrice } from "@/lib/format";
import { toAdminOrder } from "../mappers/order.mapper";
import type { DashboardStats } from "@/lib/types";

const REVENUE_WINDOW_DAYS = 30;
const DAY_KEY_FORMAT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function toDateKey(date: Date): string {
  return DAY_KEY_FORMAT.format(date);
}

async function generateRevenueSeries(
  from: Date,
): Promise<Array<{ date: string; revenuePaise: number; orders: number }>> {
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT to_char("createdAt" AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS day,
            SUM(amount) AS revenue_paise,
            COUNT(*) AS orders
     FROM "Order"
     WHERE "paymentStatus" = 'paid' AND "createdAt" >= $1
     GROUP BY day
     ORDER BY day`,
    from,
  )) as Array<{ day: string; revenue_paise: number | bigint; orders: number | bigint }>;

  const totals = new Map(
    rows.map((row) => [
      row.day,
      { revenuePaise: Number(row.revenue_paise), orders: Number(row.orders) },
    ]),
  );

  const series: Array<{ date: string; revenuePaise: number; orders: number }> = [];
  const cursor = new Date(from);
  const today = new Date();

  while (cursor <= today) {
    const key = toDateKey(cursor);
    const entry = totals.get(key) ?? { revenuePaise: 0, orders: 0 };
    series.push({ date: key, revenuePaise: entry.revenuePaise, orders: entry.orders });
    cursor.setDate(cursor.getDate() + 1);
  }

  return series;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const windowStart = new Date(today);
  windowStart.setDate(windowStart.getDate() - (REVENUE_WINDOW_DAYS - 1));

  const [
    totalRevenue,
    todayRevenue,
    paidOrders,
    todayOrders,
    pendingFulfillment,
    totalNotes,
    freeNotes,
    paidNotes,
    revenueSeries,
    recentOrders,
  ] = await Promise.all([
    prisma.order
      .aggregate({ where: { paymentStatus: "paid" }, _sum: { amount: true } })
      .then((result) => result._sum.amount ?? 0),
    prisma.order
      .aggregate({ where: { paymentStatus: "paid", createdAt: { gte: today } }, _sum: { amount: true } })
      .then((result) => result._sum.amount ?? 0),
    prisma.order.count({ where: { paymentStatus: "paid" } }),
    prisma.order.count({ where: { paymentStatus: "paid", createdAt: { gte: today } } }),
    prisma.order.count({ where: { paymentStatus: "paid", fulfillmentStatus: "pending" } }),
    prisma.note.count({ where: { visibility: "public" } }),
    prisma.note.count({ where: { visibility: "public", pricingType: "free" } }),
    prisma.note.count({ where: { visibility: "public", pricingType: "paid" } }),
    generateRevenueSeries(windowStart),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { note: { select: { id: true } }, group: { select: { id: true } } },
    }),
  ]);

  return {
    revenue: {
      totalPaise: totalRevenue,
      totalLabel: formatPrice(totalRevenue),
      todayPaise: todayRevenue,
      todayLabel: formatPrice(todayRevenue),
    },
    orders: { paid: paidOrders, today: todayOrders, pendingFulfillment },
    catalog: { totalNotes, freeNotes, paidNotes },
    revenueSeries,
    recentOrders: recentOrders.map(toAdminOrder),
  };
}
