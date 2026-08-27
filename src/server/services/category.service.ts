import { Types } from "mongoose";
import { Category, type CategoryDoc } from "../db/models/category.model";
import { Note } from "../db/models/note.model";
import { Group } from "../db/models/group.model";
import { logActivity } from "./activity.service";
import type { RouteContext } from "../lib/api-handler";
import type { Admin, AdminDoc } from "../db/models/admin.model";
import { AppError } from "../lib/errors";
import { uniqueSlug } from "../lib/slug";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/lib/schemas/category.schema";

export async function listActiveCategories(): Promise<CategoryDoc[]> {
  return Category.find({ isActive: true }).sort({ order: 1, name: 1 }).lean().exec();
}

export async function getCategoryById(id: string): Promise<CategoryDoc | null> {
  return Category.findById(id).lean().exec();
}

export async function getCategoryBySlug(slug: string): Promise<CategoryDoc | null> {
  return Category.findOne({ slug, isActive: true }).lean().exec();
}

export async function getCategoryWithNoteCount(categoryId: string): Promise<{ category: CategoryDoc; noteCount: number }> {
  const category = await Category.findById(categoryId).lean().exec();
  if (!category) throw AppError.notFound("Category");
  const noteCount = await Note.countDocuments({ category: categoryId, visibility: "public" });
  return { category, noteCount };
}

export async function getCategoryCounts(): Promise<Array<{ categoryId: string; noteCount: number }>> {
  const results = await Note.aggregate<{ _id: Types.ObjectId; noteCount: number }>([
    { $match: { visibility: "public" } },
    { $group: { _id: "$category", noteCount: { $sum: 1 } } },
  ]);
  return results.map((r) => ({ categoryId: r._id.toString(), noteCount: r.noteCount }));
}

export async function createCategory(
  input: CreateCategoryInput,
  ctx: RouteContext & { admin: AdminDoc },
): Promise<CategoryDoc> {
  const slug = await uniqueSlug(Category, input.name);

  const doc = await Category.create({
    ...input,
    slug,
    createdBy: new Types.ObjectId(String(ctx.admin._id)),
    updatedBy: new Types.ObjectId(String(ctx.admin._id)),
  });

  await logActivity({
    adminId: ctx.admin._id.toString(),
    action: "category.create",
    description: `Created category "${input.name}"`,
    targetType: "category",
    targetId: doc._id.toString(),
    targetLabel: input.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return doc;
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
  ctx: RouteContext & { admin: AdminDoc },
): Promise<CategoryDoc> {
  const existing = await Category.findById(id).lean().exec();
  if (!existing) throw AppError.notFound("Category");

  const updates: Record<string, unknown> = { updatedBy: new Types.ObjectId(String(ctx.admin._id)) };
  if (input.name !== undefined) updates.name = input.name;
  if (input.description !== undefined) updates.description = input.description;
  if (input.icon !== undefined) updates.icon = input.icon;
  if (input.order !== undefined) updates.order = input.order;
  if (input.isActive !== undefined) updates.isActive = input.isActive;

  const updated = await Category.findByIdAndUpdate(id, updates, { new: true }).lean().exec();
  if (!updated) throw AppError.internal("Failed to update category");

  await logActivity({
    adminId: ctx.admin._id.toString(),
    action: "category.update",
    description: `Updated category "${updated.name}"`,
    targetType: "category",
    targetId: id,
    targetLabel: updated.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return updated;
}

export async function deleteCategory(
  id: string,
  ctx: RouteContext & { admin: AdminDoc },
): Promise<{ refused?: boolean; conflictMessage?: string }> {
  const category = await Category.findById(id).lean().exec();
  if (!category) throw AppError.notFound("Category");

  const [noteCount, groupCount] = await Promise.all([
    Note.countDocuments({ category: id, visibility: { $in: ["public", "private"] } }),
    Group.countDocuments({ category: id, visibility: { $in: ["public", "private"] } }),
  ]);
  const total = noteCount + groupCount;

  if (total > 0) {
    const parts: string[] = [];
    if (noteCount > 0) parts.push(`${noteCount} note${noteCount !== 1 ? "s" : ""}`);
    if (groupCount > 0) parts.push(`${groupCount} group${groupCount !== 1 ? "s" : ""}`);

    await logActivity({
      adminId: ctx.admin._id.toString(),
      action: "category.delete",
      description: `Attempted to delete category "${category.name}" (refused)`,
      targetType: "category",
      targetId: id,
      targetLabel: category.name,
      metadata: { refused: true, noteCount, groupCount },
      ip: ctx.ip,
      userAgent: ctx.userAgent,
    });

    return { refused: true, conflictMessage: `${parts.join(" and ")} still use this category. Reassign them first.` };
  }

  await Category.findByIdAndDelete(id).exec();

  await logActivity({
    adminId: ctx.admin._id.toString(),
    action: "category.delete",
    description: `Deleted category "${category.name}"`,
    targetType: "category",
    targetId: id,
    targetLabel: category.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return { refused: false };
}
