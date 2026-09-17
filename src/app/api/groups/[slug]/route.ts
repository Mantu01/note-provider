import { handler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { toPublicGroup } from "@/helpers/mappers/group.mapper";


export const GET = handler(async (ctx) => {
  const { slug } = await ctx.params;

  const group = await prisma.group.findFirst({ where: { slug, visibility: "public" }, include: { category: true } } as any);
  if (!group) throw AppError.notFound("Group");

  const categoryId = group.categoryId;
  const groupId = group.id;

  const [relatedGroups, noteIds] = await Promise.all([
    prisma.group.findMany({ where: { id: { not: groupId }, categoryId, visibility: "public" }, include: { category: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.noteGroup.findMany({ where: { groupId }, select: { noteId: true } }),
  ]);
  const note = noteIds.length
    ? await prisma.note.findFirst({ where: { id: noteIds[0].noteId } })
    : null;

  return ok({ group: toPublicGroup(group), relatedGroups: relatedGroups.map(toPublicGroup), note: note ? { id: note.id, title: note.title, slug: note.slug } : null });
});
