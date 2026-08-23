import { adminHandler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { Order } from "@/server/db/models/order.model";
import { toAdminLead } from "@/server/mappers/order.mapper";
import { parsePagination, buildPagination, buildOrderFilter, buildOrderSort } from "@/server/lib/query";

export const runtime = "nodejs";

export const GET = adminHandler(async (ctx) => {
  const { page, limit, skip } = parsePagination(ctx.searchParams, 20);
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
    Order.find(filter).sort(sort).skip(skip).limit(limit).lean().exec(),
    Order.countDocuments(filter).exec(),
  ]);

  const res = ok({
    items: items.map(toAdminLead),
    pagination: buildPagination(total, page, limit),
  });
  res.headers.set("Cache-Control", "public, max-age=30, s-maxage=30");
  return res;
});
