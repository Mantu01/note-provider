import { adminHandler } from "@/helpers/api-handler";
import { fail, ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { destroyAsset } from "@/helpers/cloudinary";
import { toAdminNote } from "@/helpers/mappers/note.mapper";
import { updateNoteSchema } from "@/schemas/note.schema";
import { rupeesToPaise } from "@/lib/format";

export const GET = adminHandler(async (ctx) => {
  const { id } = await ctx.params;
  const note = await prisma.note.findUnique({ where: { id }, include: { category: true } });
  if (!note) throw AppError.notFound("Note");
  return ok(toAdminNote(note));
});

export const PATCH = adminHandler(async (ctx) => {
  const [{ id }, body] = await Promise.all([ctx.params, ctx.req.json()]);
  const parsed = updateNoteSchema.safeParse(body);
  if (!parsed.success) return fail(AppError.validation());
  const existing = await prisma.note.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound("Note");

  const input = parsed.data;
  const updates: Record<string, unknown> = { updatedBy: ctx.admin.id };

  if (input.title !== undefined) updates.title = input.title;
  if (input.description !== undefined) updates.description = input.description;
  if (input.categoryId !== undefined) {
    const categoryDoc = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!categoryDoc) throw AppError.notFound("Category");
    updates.categoryId = input.categoryId;
  }
  if (input.level !== undefined) updates.level = input.level;
  if (input.visibility !== undefined) updates.visibility = input.visibility;
  if (input.pricingType !== undefined) updates.pricingType = input.pricingType;
  if (input.price !== undefined) updates.price = rupeesToPaise(input.price);
  if (input.compareAtPrice !== undefined) updates.compareAtPrice = input.compareAtPrice ? rupeesToPaise(input.compareAtPrice) : null;
  if (input.tags !== undefined) updates.tags = input.tags;
  if (input.isFeatured !== undefined) updates.isFeatured = input.isFeatured;
  if (input.pageCount !== undefined) updates.pageCount = input.pageCount;

  if (input.fullFile !== undefined && input.fullFile) {
    updates.fullFileUrl = input.fullFile.url;
    updates.pdfSource = input.fullFile.source;
    if (input.fullFile.source === "upload") {
      updates.fullFilePublicId = input.fullFile.publicId;
      updates.fullFileBytes = input.fullFile.bytes;
      updates.drivePdfUrl = null;
    } else {
      updates.fullFilePublicId = null;
      updates.fullFileBytes = 0;
      updates.drivePdfUrl = input.fullFile.url;
    }
  }
  if (input.previewFile !== undefined) {
    if (input.previewFile) {
      updates.previewFileUrl = input.previewFile.url;
      if (input.previewFile.source === "upload") {
        updates.previewFilePublicId = input.previewFile.publicId;
        updates.previewFileBytes = input.previewFile.bytes;
      } else {
        updates.previewFilePublicId = null;
        updates.previewFileBytes = null;
      }
    } else {
      updates.previewFileUrl = null;
      updates.previewFilePublicId = null;
      updates.previewFileBytes = null;
    }
  }
  if (input.coverImage !== undefined && input.coverImage) {
    updates.coverImageUrl = input.coverImage.url;
    updates.coverImagePublicId = input.coverImage.publicId;
  }

  const oldPricingType = existing.pricingType;
  const newPricingType = input.pricingType ?? oldPricingType;

  if (oldPricingType === "paid" && newPricingType === "free") {
    updates.price = 0;
    updates.compareAtPrice = null;
    if (existing.previewFilePublicId) {
      await destroyAsset(existing.previewFilePublicId, "raw", "upload");
      updates.previewFileUrl = null;
      updates.previewFilePublicId = null;
      updates.previewFileBytes = null;
    }
  }

  const updated = await prisma.note.update({ where: { id }, data: updates as any, include: { category: true } });

  if (input.fullFile?.source === "upload" && input.fullFile.publicId && input.fullFile.publicId !== existing.fullFilePublicId) {
    if (existing.fullFilePublicId) await destroyAsset(existing.fullFilePublicId, "raw", "authenticated");
  }
  if (input.previewFile?.source === "upload" && input.previewFile.publicId && input.previewFile.publicId !== existing.previewFilePublicId) {
    if (existing.previewFilePublicId) await destroyAsset(String(existing.previewFilePublicId), "raw", "upload");
  }
  if (input.coverImage?.publicId && input.coverImage.publicId !== existing.coverImagePublicId) {
    await destroyAsset(String(existing.coverImagePublicId), "image", "upload");
  }

  return ok(toAdminNote(updated));
});

export const DELETE = adminHandler(async (ctx) => {
  const { id } = await ctx.params;
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw AppError.notFound("Note");

  const isCreator = Boolean(note.createdBy && note.createdBy === ctx.admin.id);
  if (!ctx.admin.isHead && !isCreator) throw AppError.forbidden("Only the Head Admin or creator can delete this note.");

  const groupsWithNote = await prisma.group.findMany({ where: { noteGroups: { some: { noteId: id } } } });

  const affectedGroups: Array<{ id: string; name: string; slug: string; hiddenBecauseEmpty: boolean }> = [];
  await Promise.all(groupsWithNote.map(async (group) => {
    const remainingNotes = await prisma.note.findMany({ where: { noteGroups: { some: { groupId: group.id } }, NOT: { id } } });
    if (remainingNotes.length === 0) {
      await prisma.group.update({ where: { id: group.id }, data: { visibility: "private" } });
      affectedGroups.push({ id: group.id, name: group.name, slug: group.slug, hiddenBecauseEmpty: true });
    } else {
      await prisma.noteGroup.deleteMany({ where: { groupId: group.id } });
      await prisma.noteGroup.createMany({ data: remainingNotes.map((n) => ({ groupId: group.id, noteId: n.id })) });
    }
  }));

  if (note.fullFilePublicId) await destroyAsset(note.fullFilePublicId, "raw", "authenticated");
  if (note.previewFilePublicId) await destroyAsset(note.previewFilePublicId, "raw", "upload");
  if (note.coverImagePublicId) await destroyAsset(note.coverImagePublicId, "image", "upload");

  await prisma.note.delete({ where: { id } });

  return ok({ deleted: true, affectedGroups });
});
