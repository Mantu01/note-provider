import { adminHandler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { prisma } from "@/helpers/db";
import { toAdminGroup } from "@/helpers/mappers/group.mapper";
import { parsePagination, buildPagination } from "@/helpers/query";


export const GET = adminHandler(async (ctx) => {
  const { page, limit, skip } = parsePagination(ctx.searchParams, 20);

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
    pagination: buildPagination(total, page, limit),
  });
});
