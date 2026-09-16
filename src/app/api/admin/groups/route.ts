import { adminHandler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { prisma } from "@/helpers/db";
import { toAdminGroup } from "@/helpers/mappers/group.mapper";

export const runtime = "nodejs";

export const GET = adminHandler(async (ctx) => {
  const page = Number(ctx.searchParams.get("page")) || 1;
  const limit = Number(ctx.searchParams.get("limit")) || 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.group.findMany({
      include: { category: true } as any,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.group.count(),
  ]);

  return ok({
    items: items.map(toAdminGroup),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrev: page > 1 },
  });
});
