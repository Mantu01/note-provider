import { handler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { toPublicNote } from "@/helpers/mappers/note.mapper";
import { toPublicGroup } from "@/helpers/mappers/group.mapper";

export const runtime = "nodejs";
export const revalidate = 600;

export const GET = handler(async (ctx) => {
  const { slug } = await ctx.params;

  const note = await prisma.note.findFirst({ where: { slug, visibility: "public" }, include: { category: true } });
  if (!note) throw AppError.notFound("Note");

  const [relatedNotes, groups] = await Promise.all([
    prisma.note.findMany({ where: { id: { not: note.id }, categoryId: note.categoryId, visibility: "public" }, include: { category: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.group.findMany({ where: { noteGroups: { some: { noteId: note.id } }, visibility: "public" }, include: { category: true } }),
  ]);

  return ok({
    note: toPublicNote(note),
    relatedNotes: relatedNotes.map(toPublicNote),
    groups: groups.map(toPublicGroup),
  });
});
