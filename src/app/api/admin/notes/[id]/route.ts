import { adminHandler } from "@/server/lib/api-handler";
import { fail, ok } from "@/server/lib/api-response";
import { AppError } from "@/server/lib/errors";
import { Note } from "@/server/db/models/note.model";
import { Group } from "@/server/db/models/group.model";
import { Category } from "@/server/db/models/category.model";
import { logActivity } from "@/server/services/activity.service";
import { destroyAsset } from "@/server/lib/cloudinary";
import { toAdminNote } from "@/server/mappers/note.mapper";
import { updateNoteSchema } from "@/lib/schemas/note.schema";
import { rupeesToPaise } from "@/lib/format";

export const runtime = "nodejs";

export const GET = adminHandler(async (ctx) => {
  const { id } = await ctx.params;
  const note = await Note.findById(id).populate("category").populate("createdBy", "_id name").lean().exec();
  if (!note) throw AppError.notFound("Note");
  return ok(toAdminNote(note));
});

export const PATCH = adminHandler(async (ctx) => {
  const { id } = await ctx.params;
  const body = await ctx.req.json();
  const parsed = updateNoteSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fields[key]) fields[key] = issue.message;
    }
    return fail(AppError.validation(fields, parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const { admin } = ctx;
  const existing = await Note.findById(id).lean().exec();
  if (!existing) throw AppError.notFound("Note");

  const input = parsed.data;
  const updates: Record<string, unknown> = { updatedBy: admin.id };

  if (input.title !== undefined) updates.title = input.title;
  if (input.description !== undefined) updates.description = input.description;

  if (input.categoryId !== undefined) {
    const targetCategory = input.categoryId;
    const categoryDoc = await Category.findById(targetCategory).lean().exec();
    if (!categoryDoc) throw AppError.notFound("Category");
    updates.category = targetCategory;
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

  await Note.findByIdAndUpdate(id, updates, { new: true }).exec();
  const updated = await Note.findById(id).populate("category").populate("createdBy", "_id name").lean().exec();
  if (!updated) throw AppError.internal("Failed to update note");

  if (input.fullFile?.source === "upload" && input.fullFile.publicId && input.fullFile.publicId !== existing.fullFilePublicId) {
    if (existing.fullFilePublicId) await destroyAsset(existing.fullFilePublicId, "raw", "authenticated");
  }
  if (input.previewFile?.source === "upload" && input.previewFile.publicId && input.previewFile.publicId !== existing.previewFilePublicId) {
    if (existing.previewFilePublicId) await destroyAsset(String(existing.previewFilePublicId), "raw", "upload");
  }
  if (input.coverImage?.publicId && input.coverImage.publicId !== existing.coverImagePublicId) {
    await destroyAsset(String(existing.coverImagePublicId), "image", "upload");
  }

  const changedFields = Object.keys(input).filter((key) => {
    const oldVal = (existing as Record<string, unknown>)[key];
    const newVal = (input as Record<string, unknown>)[key];
    return JSON.stringify(oldVal) !== JSON.stringify(newVal);
  });

  await logActivity({
    adminId: admin.id,
    action: "note.update",
    description: `Updated note "${updated.title}"`,
    targetType: "note",
    targetId: id,
    targetLabel: updated.title,
    metadata: { changedFields },
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return ok(toAdminNote(updated));
});

export const DELETE = adminHandler(async (ctx) => {
  const { admin } = ctx;
  const { id } = await ctx.params;
  const note = await Note.findById(id).lean().exec();
  if (!note) throw AppError.notFound("Note");

  const creatorId = note.createdBy ? note.createdBy.toString() : null;
  const isCreator = Boolean(creatorId && creatorId === admin.id);
  const canDelete = admin.isHead || isCreator;

  if (!canDelete) {
    throw AppError.forbidden("Only the Head Admin or the creator of this note can delete it.");
  }

  const groupIds = await Group.distinct("_id", { notes: id });
  const affectedGroups: Array<{ id: string; name: string; slug: string; hiddenBecauseEmpty: boolean }> = [];

  for (const groupId of groupIds) {
    const group = await Group.findById(groupId).lean().exec();
    if (!group) continue;

    const updatedNotes = (group.notes as unknown[]).map((n) => String(n)).filter((n) => n !== id);
    if (updatedNotes.length === 0) {
      await Group.findByIdAndUpdate(groupId, { visibility: "private" }).exec();
      affectedGroups.push({ id: group._id.toString(), name: group.name, slug: group.slug, hiddenBecauseEmpty: true });
    } else {
      await Group.findByIdAndUpdate(groupId, { notes: updatedNotes }).exec();
    }
  }

  if (note.fullFilePublicId) await destroyAsset(note.fullFilePublicId, "raw", "authenticated");
  if (note.previewFilePublicId) await destroyAsset(note.previewFilePublicId, "raw", "upload");
  if (note.coverImagePublicId) await destroyAsset(note.coverImagePublicId, "image", "upload");

  await Note.findByIdAndDelete(id).exec();

  await logActivity({
    adminId: admin.id,
    action: "note.delete",
    description: `Deleted note "${note.title}"`,
    targetType: "note",
    targetId: id,
    targetLabel: note.title,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return ok({ deleted: true, affectedGroups });
});
