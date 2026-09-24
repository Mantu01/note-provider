import { adminHandler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { toAdminOrder } from "@/helpers/mappers/order.mapper";
import { deleteOrder } from "@/helpers/services/order.service";

export const GET = adminHandler(async (ctx) => {
  const { id } = await ctx.params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw AppError.notFound("Order");
  return ok(toAdminOrder(order));
});

export const DELETE = adminHandler(async (ctx) => {
  if (!ctx.admin.isHead) throw AppError.forbidden("Only head admin can perform delete operations");
  const { id } = await ctx.params;
  await deleteOrder(id);
  return ok({ deleted: true });
});
