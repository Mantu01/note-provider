import { handler } from "@/server/lib/api-handler";
import { fail, ok } from "@/server/lib/api-response";
import { AppError } from "@/server/lib/errors";
import { getOrderByNumber } from "@/server/services/order.service";
import { enforceRateLimit } from "@/server/lib/rate-limit";

export const runtime = "nodejs";

export const GET = handler(async (ctx) => {
  enforceRateLimit("orderLookup", ctx.ip, { limit: 20, windowMs: 60000 });

  const orderNumber = ctx.searchParams.get("orderNumber")?.trim();
  if (!orderNumber) {
    throw AppError.validation({ orderNumber: "Please enter an order number" }, "Order number is required");
  }

  const order = await getOrderByNumber(orderNumber.toUpperCase());
  if (!order) {
    throw AppError.notFound("Order");
  }

  return ok({
    orderId: order._id.toString(),
    orderNumber: order.orderNumber,
  });
});

export const POST = handler(async (ctx) => {
  enforceRateLimit("orderLookup", ctx.ip, { limit: 20, windowMs: 60000 });

  const body = await ctx.req.json();
  const orderNumber = (body?.orderNumber ?? "").trim();
  if (!orderNumber) {
    throw AppError.validation({ orderNumber: "Please enter an order number" }, "Order number is required");
  }

  const order = await getOrderByNumber(orderNumber.toUpperCase());
  if (!order) {
    throw AppError.notFound("Order");
  }

  return ok({
    orderId: order._id.toString(),
    orderNumber: order.orderNumber,
  });
});
