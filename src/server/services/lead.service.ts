import { Order, type OrderDoc } from "../db/models/order.model";


export async function listOrders(
  filter: Record<string, unknown>,
  sort: Record<string, import("mongoose").SortOrder>,
  skip: number,
  limit: number,
): Promise<{ items: OrderDoc[]; total: number; summary: import("@/lib/types").OrderSummary }> {
  const [items, total] = await Promise.all([
    Order.find(filter).sort(sort).skip(skip).limit(limit).lean().exec(),
    Order.countDocuments(filter).exec(),
  ]);

  const paidOrders = items.filter((o) => o.paymentStatus === "paid");
  const pendingFulfillment = paidOrders.filter((o) => o.fulfillmentStatus === "pending");
  const failedOrders = items.filter((o) => o.paymentStatus === "failed");
  const totalRevenuePaise = paidOrders.reduce((sum, o) => sum + o.amount, 0);

  const summary = {
    totalRevenuePaise,
    paidCount: paidOrders.length,
    pendingFulfillmentCount: pendingFulfillment.length,
    failedCount: failedOrders.length,
  };

  return { items, total, summary };
}

export async function exportOrders(
  filter: Record<string, unknown>,
): Promise<OrderDoc[]> {
  return Order.find(filter).sort({ createdAt: -1 }).limit(10000).lean().exec();
}

export async function getLeadCount(): Promise<number> {
  return Order.countDocuments({ paymentStatus: { $in: ["created", "paid", "failed"] } }).exec();
}

export async function getTodayLeadCount(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Order.countDocuments({
    paymentStatus: { $in: ["created", "paid", "failed"] },
    createdAt: { $gte: today },
  }).exec();
}
