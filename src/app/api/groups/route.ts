import { handler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { prisma } from "@/helpers/db";
import { toPublicGroup } from "@/helpers/mappers/group.mapper";
import { parsePagination, buildPagination } from "@/helpers/query";

export const GET = handler(async (ctx) => {
  const { page, limit, skip } = parsePagination(ctx.searchParams);

  const [items, total] = await Promise.all([
    prisma.group.findMany({
      where: { visibility: "public" },
      include: {
        category: true,
        noteGroups: { where: { note: { visibility: "public" } }, include: { note: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.group.count({ where: { visibility: "public" } }),
  ]);

  const res = ok({ items: items.map(toPublicGroup), pagination: buildPagination(total, page, limit) });
  res.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
  return res;
});
