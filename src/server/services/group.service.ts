import { Types } from "mongoose";
import { Group, type GroupDoc } from "../db/models/group.model";
import { Note } from "../db/models/note.model";
import { logActivity } from "./activity.service";
import type { RouteContext } from "../lib/api-handler";
import type { AdminDoc } from "../db/models/admin.model";
import { AppError } from "../lib/errors";
import { uniqueSlug } from "../lib/slug";
import { rupeesToPaise } from "@/lib/format";
import { MIN_PAID_PRICE_PAISE } from "@/lib/constants";
import type { CreateGroupInput, UpdateGroupInput } from "@/lib/schemas/group.schema";

import { validateNoteIdsExist } from "../lib/note-validation";

export async function listGroups(
  filter: Record<string, unknown>,
  skip: number,
  limit: number,
): Promise<{ items: GroupDoc[]; total: number }> {
  const [items, total] = await Promise.all([
    Group.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("category")
      .populate({ path: "notes", populate: { path: "category" } })
      .lean()
      .exec(),
    Group.countDocuments(filter).exec(),
  ]);
  return { items, total };
}

export async function getGroupBySlug(slug: string): Promise<GroupDoc | null> {
  return Group.findOne({ slug, visibility: "public" })
    .populate("category")
    .populate({ path: "notes", populate: { path: "category" } })
    .lean()
    .exec();
}

export async function getGroupById(id: string): Promise<GroupDoc | null> {
  return Group.findById(id)
    .populate("category")
    .populate({ path: "notes", populate: { path: "category" } })
    .lean()
    .exec();
}

export async function createGroup(
  input: CreateGroupInput,
  ctx: RouteContext & { admin: AdminDoc },
): Promise<GroupDoc> {
  const pricePaise = rupeesToPaise(Number(input.price));

  if (pricePaise < MIN_PAID_PRICE_PAISE) {
    throw AppError.validation({ price: `Price must be at least ₹${(MIN_PAID_PRICE_PAISE / 100).toFixed(2)}` });
  }

  const noteIds = input.noteIds.filter((id: string) => id.trim());
  const uniqueIds = Array.from(new Set(noteIds));

  await validateNoteIdsExist(uniqueIds);

  const slug = await uniqueSlug(Group, input.name);

  const doc = await Group.create({
    ...input,
    price: pricePaise,
    slug,
    notes: uniqueIds,
    createdBy: new Types.ObjectId(String(ctx.admin._id)),
    updatedBy: new Types.ObjectId(String(ctx.admin._id)),
  });

  await logActivity({
    adminId: ctx.admin._id.toString(),
    action: "group.create",
    description: `Created group "${input.name}" with ${uniqueIds.length} notes`,
    targetType: "group",
    targetId: doc._id.toString(),
    targetLabel: input.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return doc;
}

export async function updateGroup(
  id: string,
  input: UpdateGroupInput,
  ctx: RouteContext & { admin: AdminDoc },
): Promise<GroupDoc> {
  const existing = await Group.findById(id).lean().exec();
  if (!existing) throw AppError.notFound("Group");

  if (input.noteIds !== undefined) {
    const noteIds = input.noteIds.filter((n) => n.trim());
    const uniqueIds = Array.from(new Set(noteIds));
    await validateNoteIdsExist(uniqueIds);
  }

  const updates: Record<string, unknown> = { updatedBy: new Types.ObjectId(String(ctx.admin._id)) };
  if (input.name !== undefined) updates.name = input.name;
  if (input.description !== undefined) updates.description = input.description;
  if (input.categoryId !== undefined) updates.category = input.categoryId;
  if (input.price !== undefined) updates.price = rupeesToPaise(Number(input.price));
  if (input.compareAtPrice !== undefined) updates.compareAtPrice = input.compareAtPrice ? rupeesToPaise(input.compareAtPrice) : null;
  if (input.noteIds !== undefined) updates.notes = input.noteIds.filter((n) => n.trim());
  if (input.coverImage !== undefined && input.coverImage) {
    updates.coverImageUrl = input.coverImage.url;
    updates.coverImagePublicId = input.coverImage.publicId;
  }
  if (input.visibility !== undefined) updates.visibility = input.visibility;
  if (input.isFeatured !== undefined) updates.isFeatured = input.isFeatured;

  const updated = await Group.findByIdAndUpdate(id, updates, { new: true }).lean().exec();
  if (!updated) throw AppError.internal("Failed to update group");

  await logActivity({
    adminId: ctx.admin._id.toString(),
    action: "group.update",
    description: `Updated group "${updated.name}"`,
    targetType: "group",
    targetId: id,
    targetLabel: updated.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return updated;
}

export async function deleteGroup(
  id: string,
  ctx: RouteContext & { admin: AdminDoc },
): Promise<{ deleted: true }> {
  const group = await Group.findById(id).lean().exec();
  if (!group) throw AppError.notFound("Group");

  await Group.findByIdAndDelete(id).exec();

  await logActivity({
    adminId: ctx.admin._id.toString(),
    action: "group.delete",
    description: `Deleted group "${group.name}"`,
    targetType: "group",
    targetId: id,
    targetLabel: group.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return { deleted: true };
}

export async function getRelatedGroups(categoryId: string, groupId: string, limit: number): Promise<GroupDoc[]> {
  return Group.find({ _id: { $ne: groupId }, category: categoryId, visibility: "public" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("category")
    .populate({ path: "notes", populate: { path: "category" } })
    .lean()
    .exec();
}

export async function getFeaturedGroups(limit: number): Promise<GroupDoc[]> {
  return Group.find({ isFeatured: true, visibility: "public" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("category")
    .populate({ path: "notes", populate: { path: "category" } })
    .lean()
    .exec();
}

