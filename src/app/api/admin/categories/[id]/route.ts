import { adminHandler } from "@/server/lib/api-handler";
import { fail, ok } from "@/server/lib/api-response";
import { AppError } from "@/server/lib/errors";
import { Category } from "@/server/db/models/category.model";
import { Note } from "@/server/db/models/note.model";
import { Group } from "@/server/db/models/group.model";
import { logActivity } from "@/server/services/activity.service";
import { toAdminCategory } from "@/server/mappers/category.mapper";
import { updateCategorySchema } from "@/lib/schemas/category.schema";
import { slugify } from "@/server/lib/slug";

export const runtime = "nodejs";

export const PATCH = adminHandler(async (ctx) => {
  const { id } = await ctx.params;
  const body = await ctx.req.json();
  const parsed = updateCategorySchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fields[key]) fields[key] = issue.message;
    }
    return fail(AppError.validation(fields, parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const { admin } = ctx;
  const existing = await Category.findById(id).lean().exec();
  if (!existing) throw AppError.notFound("Category");

  const updates: Record<string, unknown> = { updatedBy: admin.id };
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.description !== undefined) updates.description = parsed.data.description;
  if (parsed.data.icon !== undefined) updates.icon = parsed.data.icon;
  if (parsed.data.order !== undefined) updates.order = parsed.data.order;
  if (parsed.data.isActive !== undefined) updates.isActive = parsed.data.isActive;

  if (parsed.data.subjects !== undefined) {
    const newSubjects = parsed.data.subjects.map((sub, idx) => {
      const slug = sub.slug ? slugify(sub.slug) : slugify(sub.name);
      return {
        ...sub,
        slug,
        order: sub.order ?? idx,
        isActive: sub.isActive !== false,
      };
    });

    updates.subjects = newSubjects;
  }

  const updated = await Category.findByIdAndUpdate(id, updates, { new: true }).lean().exec();
  if (!updated) throw AppError.internal("Failed to update category");

  const [noteCount, groupCount] = await Promise.all([
    Note.countDocuments({ category: id }).exec(),
    Group.countDocuments({ category: id }).exec(),
  ]);

  await logActivity({
    adminId: admin.id,
    action: "category.update",
    description: `Updated category "${updated.name}"`,
    targetType: "category",
    targetId: id,
    targetLabel: updated.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return ok(toAdminCategory(updated, noteCount, groupCount));
});

export const DELETE = adminHandler(async (ctx) => {
  const { id } = await ctx.params;
  const { admin } = ctx;
  if (!admin.isHead) {
    throw AppError.forbidden("Only head admin can perform delete operations");
  }

  const category = await Category.findById(id).lean().exec();
  if (!category) throw AppError.notFound("Category");

  const noteCount = await Note.countDocuments({ category: id }).exec();
  const groupCount = await Group.countDocuments({ category: id }).exec();
  const total = noteCount + groupCount;

  if (total > 0) {
    const parts: string[] = [];
    if (noteCount > 0) parts.push(`${noteCount} note${noteCount !== 1 ? "s" : ""}`);
    if (groupCount > 0) parts.push(`${groupCount} group${groupCount !== 1 ? "s" : ""}`);

    await logActivity({
      adminId: admin.id,
      action: "category.delete",
      description: `Attempted to delete category "${category.name}" (refused)`,
      targetType: "category",
      targetId: id,
      targetLabel: category.name,
      metadata: { refused: true, noteCount, groupCount },
      ip: ctx.ip,
      userAgent: ctx.userAgent,
    });

    return ok({ refused: true, conflictMessage: `${parts.join(" and ")} still use this category. Reassign them first.` });
  }

  await Category.findByIdAndDelete(id).exec();

  await logActivity({
    adminId: admin.id,
    action: "category.delete",
    description: `Deleted category "${category.name}"`,
    targetType: "category",
    targetId: id,
    targetLabel: category.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return ok({ deleted: true });
});
