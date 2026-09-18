import { adminHandler } from "@/helpers/api-handler";
import { fail, ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { toAdminOrder } from "@/helpers/mappers/order.mapper";
import { fulfillOrder, deleteOrder } from "@/helpers/services/order.service";
import { updateOrderSchema } from "@/schemas/admin.schema";

export const GET = adminHandler(async (ctx) => {
  const { id } = await ctx.params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw AppError.notFound("Order");
  return ok(toAdminOrder(order));
});

export const PATCH = adminHandler(async (ctx) => {
  const [{ id }, body] = await Promise.all([ctx.params, ctx.req.json()]);
  const parsed = updateOrderSchema.safeParse(body);
  if (!parsed.success) return fail(AppError.validation());
  const updated = await fulfillOrder(id, parsed.data, ctx.admin.id);
  return ok(toAdminOrder(updated));
});

export const DELETE = adminHandler(async (ctx) => {
  if (!ctx.admin.isHead) throw AppError.forbidden("Only head admin can perform delete operations");
  const { id } = await ctx.params;
  await deleteOrder(id);
  return ok({ deleted: true });
});
