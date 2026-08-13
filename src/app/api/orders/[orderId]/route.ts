import { handler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { AppError } from "@/server/lib/errors";
import { Order } from "@/server/db/models/order.model";
import { toPublicOrder } from "@/server/mappers/order.mapper";

export const runtime = "nodejs";

export const GET = handler(async (ctx) => {
  const { orderId } = await ctx.params;

  const order = await Order.findById(orderId).lean().exec();
  if (!order) throw AppError.notFound("Order");

  const res = ok(toPublicOrder(order));
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
});
