import { adminHandler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { AdminActivity } from "@/server/db/models/admin-activity.model";
import { toAdminActivity } from "@/server/mappers/activity.mapper";
import { parsePagination, buildPagination } from "@/server/lib/query";

export const runtime = "nodejs";

export const GET = adminHandler(async (ctx) => {
  const { page, limit, skip } = parsePagination(ctx.searchParams, 50);

  const filter: Record<string, unknown> = {};

  const adminId = ctx.searchParams.get("adminId");
  if (adminId) filter.admin = adminId;

  const action = ctx.searchParams.get("action");
  if (action) filter.action = action;

  const targetType = ctx.searchParams.get("targetType");
  if (targetType) filter.targetType = targetType;

  const q = ctx.searchParams.get("q")?.trim();
  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [
      { description: regex },
      { targetLabel: regex },
      { ipAddress: regex },
    ];
  }

  const from = ctx.searchParams.get("from");
  const to = ctx.searchParams.get("to");
  if (from || to) {
    const createdAtFilter: Record<string, Date> = {};
    if (from) createdAtFilter.$gte = new Date(from);
    if (to) createdAtFilter.$lte = new Date(to);
    filter.createdAt = createdAtFilter;
  }

  const [items, total] = await Promise.all([
    AdminActivity.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("admin", "name email")
      .lean()
      .exec(),
    AdminActivity.countDocuments(filter).exec(),
  ]);

  const res = ok({
    items: items.map(toAdminActivity),
    pagination: buildPagination(total, page, limit),
  });
  res.headers.set("Cache-Control", "public, max-age=60, s-maxage=60");
  return res;
});
