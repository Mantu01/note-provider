import { adminHandler } from "@/helpers/api-handler";
import { fail, ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { toAdminCategory } from "@/helpers/mappers/category.mapper";
import { updateCategorySchema } from "@/schemas/category.schema";
import { slugify } from "@/helpers/slug";

export const PATCH = adminHandler(async (ctx) => {
  const [{ id }, body] = await Promise.all([ctx.params, ctx.req.json()]);
  const parsed = updateCategorySchema.safeParse(body);
  if (!parsed.success) return fail(AppError.validation());

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound("Category");

  const updates: Record<string, unknown> = { updatedBy: ctx.admin.id };
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.description !== undefined) updates.description = parsed.data.description;
  if (parsed.data.icon !== undefined) updates.icon = parsed.data.icon;
  if (parsed.data.order !== undefined) updates.order = parsed.data.order;
  if (parsed.data.isActive !== undefined) updates.isActive = parsed.data.isActive;

  if (parsed.data.subjects !== undefined) {
    const newSubjects = parsed.data.subjects.map((sub: any, idx: number) => {
      const slug = sub.slug ? slugify(sub.slug) : slugify(sub.name);
      return { ...sub, slug, order: sub.order ?? idx, isActive: sub.isActive !== false };
    });
    updates.subjects = newSubjects;
  }

  const [updated, noteCount, groupCount] = await Promise.all([
    prisma.category.update({ where: { id }, data: updates as any }),
    prisma.note.count({ where: { categoryId: id } }),
    prisma.group.count({ where: { categoryId: id } }),
  ]);
  return ok(toAdminCategory(updated, noteCount, groupCount));
});

export const DELETE = adminHandler(async (ctx) => {
  if (!ctx.admin.isHead) throw AppError.forbidden("Only head admin can perform delete operations");

  const { id } = await ctx.params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw AppError.notFound("Category");

  const [noteCount, groupCount] = await Promise.all([
    prisma.note.count({ where: { categoryId: id } }),
    prisma.group.count({ where: { categoryId: id } }),
  ]);
  const total = noteCount + groupCount;

  if (total > 0) {
    const parts: string[] = [];
    if (noteCount > 0) parts.push(`${noteCount} note${noteCount !== 1 ? "s" : ""}`);
    if (groupCount > 0) parts.push(`${groupCount} group${groupCount !== 1 ? "s" : ""}`);
    return ok({ refused: true, conflictMessage: `${parts.join(" and ")} still use this category. Reassign them first.` });
  }

  await prisma.category.delete({ where: { id } });
  return ok({ deleted: true });
});
