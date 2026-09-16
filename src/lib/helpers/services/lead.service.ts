import { prisma } from "../db";

export async function listOrders(
  where: Record<string, unknown>,
  orderBy: Record<string, "asc" | "desc">,
  skip: number,
  limit: number,
): Promise<{ items: import("@prisma/client").Order[]; total: number; summary: import("@/lib/types").OrderSummary }> {
  const [items, total] = await Promise.all([
    prisma.order.findMany({ where, orderBy, skip, take: limit }),
    prisma.order.count({ where }),
  ]);

  const paidOrders = items.filter((o: { paymentStatus: string }) => o.paymentStatus === "paid");
  const pendingFulfillment = paidOrders.filter((o: { fulfillmentStatus: string }) => o.fulfillmentStatus === "pending");
  const failedOrders = items.filter((o: { paymentStatus: string }) => o.paymentStatus === "failed");
  const totalRevenuePaise = paidOrders.reduce((sum: number, o: { amount: number }) => sum + o.amount, 0);

  const summary = {
    totalRevenuePaise,
    paidCount: paidOrders.length,
    pendingFulfillmentCount: pendingFulfillment.length,
    failedCount: failedOrders.length,
  };

  return { items, total, summary };
}

export async function exportOrders(where: Record<string, unknown>): Promise<import("@prisma/client").Order[]> {
  return prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, take: 10000 });
}

export async function getLeadCount(): Promise<number> {
  return prisma.order.count({ where: { paymentStatus: { in: ["created", "paid", "failed"] } } });
}

export async function getTodayLeadCount(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return prisma.order.count({ where: { paymentStatus: { in: ["created", "paid", "failed"] }, createdAt: { gte: today } } });
}
