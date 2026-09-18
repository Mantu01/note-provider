import { adminHandler } from "@/helpers/api-handler";
import { fail, ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { toAdminGroup } from "@/helpers/mappers/group.mapper";
import { updateGroupSchema } from "@/schemas/group.schema";
import { rupeesToPaise } from "@/lib/format";
import { validateNoteIdsExist } from "@/helpers/note-validation";

export const GET = adminHandler(async (ctx) => {
  const { id } = await ctx.params;
  const group = await prisma.group.findUnique({ where: { id }, include: { category: true } as any });
  if (!group) throw AppError.notFound("Group");
  return ok(toAdminGroup(group));
});

export const PATCH = adminHandler(async (ctx) => {
  const [{ id }, body] = await Promise.all([ctx.params, ctx.req.json()]);
  const parsed = updateGroupSchema.safeParse(body);
  if (!parsed.success) return fail(AppError.validation());

  const { admin } = ctx;
  const existing = await prisma.group.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound("Group");

  const input = parsed.data;

  if (input.noteIds !== undefined) {
    const noteIds = input.noteIds.filter((n: string) => n.trim());
    const uniqueIds = Array.from(new Set(noteIds));
    await validateNoteIdsExist(uniqueIds);
  }

  const updates: Record<string, unknown> = { updatedBy: admin.id };
  if (input.name !== undefined) updates.name = input.name;
  if (input.description !== undefined) updates.description = input.description;
  if (input.categoryId !== undefined) updates.categoryId = input.categoryId;
  if (input.price !== undefined) updates.price = rupeesToPaise(input.price);
  if (input.compareAtPrice !== undefined) updates.compareAtPrice = input.compareAtPrice ? rupeesToPaise(input.compareAtPrice) : null;
  if (input.coverImage !== undefined && input.coverImage) {
    updates.coverImageUrl = input.coverImage.url;
    updates.coverImagePublicId = input.coverImage.publicId;
  }
  if (input.visibility !== undefined) updates.visibility = input.visibility;
  if (input.isFeatured !== undefined) updates.isFeatured = input.isFeatured;

  if (input.noteIds !== undefined) {
    const noteIds = input.noteIds.filter((n: string) => n.trim());
    const uniqueIds = Array.from(new Set(noteIds));
    await prisma.noteGroup.deleteMany({ where: { groupId: id } });
    updates.noteGroups = { create: uniqueIds.map((noteId: string) => ({ noteId })) };
  }

  const updated = await prisma.group.update({ where: { id }, data: updates as any, include: { category: true } as any });
  return ok(toAdminGroup(updated));
});

export const DELETE = adminHandler(async (ctx) => {
  const { id } = await ctx.params;
  const group = await prisma.group.findUnique({ where: { id } });
  if (!group) throw AppError.notFound("Group");

  const isCreator = Boolean(group.createdBy && group.createdBy === ctx.admin.id);
  if (!ctx.admin.isHead && !isCreator) throw AppError.forbidden("Only the Head Admin or creator can delete this bundle.");

  await prisma.group.delete({ where: { id } });
  return ok({ deleted: true });
});
