import { adminHandler } from "@/helpers/api-handler";
import { fail, ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { toAdminOrder } from "@/helpers/mappers/order.mapper";
import { fulfillOrder, deleteOrder } from "@/helpers/services/order.service";
import { updateOrderSchema } from "@/lib/schemas/admin.schema";

export const runtime = "nodejs";

export function toServiceContext(ctx: any) {
  return {
    ip: ctx.ip,
    userAgent: ctx.userAgent,
    admin: { id: ctx.admin.id, name: ctx.admin.name, email: ctx.admin.email, isHead: ctx.admin.isHead },
  };
}

export const GET = adminHandler(async (ctx) => {
  const { id } = await ctx.params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw AppError.notFound("Order not found");
  return ok(toAdminOrder(order));
});

export const PATCH = adminHandler(async (ctx) => {
  const [{ id }, body] = await Promise.all([ctx.params, ctx.req.json()]);
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw AppError.notFound("Order not found");
  const parsed = updateOrderSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fields[key]) fields[key] = issue.message;
    }
    return fail(AppError.validation(fields, parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const updated = await fulfillOrder(id, parsed.data, toServiceContext(ctx as any));
  return ok(toAdminOrder(updated));
});

export const DELETE = adminHandler(async (ctx) => {
  if (!ctx.admin.isHead) throw AppError.forbidden("Only head admin can perform delete operations");
  const { id } = await ctx.params;
  await deleteOrder(id, toServiceContext(ctx as any));
  return ok({ deleted: true });
});
