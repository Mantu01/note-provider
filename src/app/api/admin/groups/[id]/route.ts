import { adminHandler } from "@/server/lib/api-handler";
import { fail, ok } from "@/server/lib/api-response";
import { AppError } from "@/server/lib/errors";
import { Group } from "@/server/db/models/group.model";
import { Note } from "@/server/db/models/note.model";
import { logActivity } from "@/server/services/activity.service";
import { toAdminGroup } from "@/server/mappers/group.mapper";
import { updateGroupSchema } from "@/lib/schemas/group.schema";
import { rupeesToPaise } from "@/lib/format";
import { Types } from "mongoose";
import { validateNoteIdsExist } from "@/server/lib/note-validation";

export const runtime = "nodejs";

export const GET = adminHandler(async (ctx) => {
  const { id } = await ctx.params;
  const group = await Group.findById(id)
    .populate("category")
    .populate("createdBy", "_id name")
    .populate({ path: "notes", populate: { path: "category" } })
    .lean()
    .exec();
  if (!group) throw AppError.notFound("Group");
  return ok(toAdminGroup(group));
});

export const PATCH = adminHandler(async (ctx) => {
  const { id } = await ctx.params;
  const body = await ctx.req.json();
  const parsed = updateGroupSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fields[key]) fields[key] = issue.message;
    }
    return fail(AppError.validation(fields, parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const { admin } = ctx;
  const existing = await Group.findById(id).lean().exec();
  if (!existing) throw AppError.notFound("Group");

  const input = parsed.data;

  if (input.noteIds !== undefined) {
    const noteIds = input.noteIds.filter((n) => n.trim());
    const uniqueIds = Array.from(new Set(noteIds));

    await validateNoteIdsExist(uniqueIds);
  }

  const updates: Record<string, unknown> = { updatedBy: admin.id };
  if (input.name !== undefined) updates.name = input.name;
  if (input.description !== undefined) updates.description = input.description;
  if (input.categoryId !== undefined) updates.category = input.categoryId;
  if (input.price !== undefined) updates.price = rupeesToPaise(input.price);
  if (input.compareAtPrice !== undefined) updates.compareAtPrice = input.compareAtPrice ? rupeesToPaise(input.compareAtPrice) : null;
  if (input.noteIds !== undefined) updates.notes = input.noteIds.filter((n) => n.trim());
  if (input.coverImage !== undefined && input.coverImage) {
    updates.coverImageUrl = input.coverImage.url;
    updates.coverImagePublicId = input.coverImage.publicId;
  }
  if (input.visibility !== undefined) updates.visibility = input.visibility;
  if (input.isFeatured !== undefined) updates.isFeatured = input.isFeatured;

  await Group.findByIdAndUpdate(id, updates, { new: true }).exec();
  const updated = await Group.findById(id)
    .populate("category")
    .populate("createdBy", "_id name")
    .populate({ path: "notes", populate: { path: "category" } })
    .lean()
    .exec();

  if (!updated) throw AppError.internal("Failed to update group");

  await logActivity({
    adminId: admin.id,
    action: "group.update",
    description: `Updated group "${updated.name}"`,
    targetType: "group",
    targetId: id,
    targetLabel: updated.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return ok(toAdminGroup(updated));
});

export const DELETE = adminHandler(async (ctx) => {
  const { admin } = ctx;
  const { id } = await ctx.params;
  const group = await Group.findById(id).lean().exec();
  if (!group) throw AppError.notFound("Group");

  const creatorId = group.createdBy ? group.createdBy.toString() : null;
  const isCreator = Boolean(creatorId && creatorId === admin.id);
  const canDelete = admin.isHead || isCreator;

  if (!canDelete) {
    throw AppError.forbidden("Only the Head Admin or creator of this bundle can delete it.");
  }

  await Group.findByIdAndDelete(id).exec();

  await logActivity({
    adminId: admin.id,
    action: "group.delete",
    description: `Deleted group "${group.name}"`,
    targetType: "group",
    targetId: id,
    targetLabel: group.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return ok({ deleted: true });
});
