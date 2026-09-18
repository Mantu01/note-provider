import { adminHandler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { prisma } from "@/helpers/db";
import { toAdminOrder } from "@/helpers/mappers/order.mapper";
import { parsePagination, buildPagination, buildOrderFilter, buildOrderSort } from "@/helpers/query";

export const GET = adminHandler(async (ctx) => {
  const { page, limit, skip } = parsePagination(ctx.searchParams, 15);
  const query = {
    q: ctx.searchParams.get("q") || undefined,
    paymentStatus: (ctx.searchParams.get("paymentStatus") as "created" | "paid" | "failed") || undefined,
    fulfillmentStatus: (ctx.searchParams.get("fulfillmentStatus") as "pending" | "completed" | "cancelled") || undefined,
    itemType: (ctx.searchParams.get("itemType") as "note" | "group") || undefined,
    from: ctx.searchParams.get("from") || undefined,
    to: ctx.searchParams.get("to") || undefined,
    sort: (ctx.searchParams.get("sort") as "newest" | "oldest" | "amount_desc" | "amount_asc") || "newest",
  };

  const filter = buildOrderFilter(query);
  const sort = buildOrderSort(query.sort);

  const [items, total] = await Promise.all([
    prisma.order.findMany({ where: filter.where as any, orderBy: sort as any, skip, take: limit }),
    prisma.order.count({ where: filter.where as any }),
  ]);

  const res = ok({ items: items.map(toAdminOrder), pagination: buildPagination(total, page, limit) });
  res.headers.set("Cache-Control", "private, no-store");
  return res;
});
