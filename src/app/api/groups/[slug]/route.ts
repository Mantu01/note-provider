import { handler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { toPublicGroup } from "@/helpers/mappers/group.mapper";

export const GET = handler(async (ctx) => {
  const { slug } = await ctx.params;

  const group = await prisma.group.findFirst({
    where: { slug, visibility: "public" },
    include: {
      category: true,
      noteGroups: { where: { note: { visibility: "public" } }, include: { note: true } },
    },
  });
  if (!group) throw AppError.notFound("Group");

  const relatedGroups = await prisma.group.findMany({
    where: { id: { not: group.id }, categoryId: group.categoryId, visibility: "public" },
    include: {
      category: true,
      noteGroups: { where: { note: { visibility: "public" } }, include: { note: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return ok({ group: toPublicGroup(group), relatedGroups: relatedGroups.map(toPublicGroup) });
});
