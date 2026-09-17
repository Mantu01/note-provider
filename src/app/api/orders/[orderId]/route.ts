import { handler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { toPublicOrder } from "@/helpers/mappers/order.mapper";


export const GET = handler(async (ctx) => {
  const { orderId } = await ctx.params;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw AppError.notFound("Order");

  const res = ok(toPublicOrder(order));
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
});
