import { Order } from "@/server/db/models/order.model";
import { adminHandler, type AdminRouteContext } from "@/server/lib/api-handler";
import { fail, ok } from "@/server/lib/api-response";
import { AppError } from "@/server/lib/errors";
import { toAdminOrder } from "@/server/mappers/order.mapper";
import { fulfillOrder, deleteOrder } from "@/server/services/order.service";
import { updateOrderSchema } from "@/lib/schemas/admin.schema";
import { Types } from "mongoose";

export const runtime = "nodejs";

function toServiceContext(ctx: AdminRouteContext): Parameters<typeof fulfillOrder>[2] {
  return {
    ip: ctx.ip,
    userAgent: ctx.userAgent,
    admin: { _id: new Types.ObjectId(ctx.admin.id), isHead: ctx.admin.isHead, name: ctx.admin.name, email: ctx.admin.email } as any,
  } as Parameters<typeof fulfillOrder>[2];
}

export const GET = adminHandler(async (ctx) => {
  const { id } = await ctx.params;
  const order = await Order.findById(id).lean().exec();
  if (!order) {
    throw AppError.notFound("Order not found");
  }
  return ok(toAdminOrder(order));
});

export const PATCH = adminHandler(async (ctx) => {
  const { id } = await ctx.params;
  const body = await ctx.req.json();
  const parsed = updateOrderSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fields[key]) fields[key] = issue.message;
    }
    return fail(AppError.validation(fields, parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const updated = await fulfillOrder(id, parsed.data, toServiceContext(ctx));
  return ok(toAdminOrder(updated));
});

export const DELETE = adminHandler(async (ctx) => {
  if (!ctx.admin.isHead) {
    throw AppError.forbidden("Only head admin can perform delete operations");
  }

  const { id } = await ctx.params;
  await deleteOrder(id, toServiceContext(ctx));
  return ok({ deleted: true });
});
