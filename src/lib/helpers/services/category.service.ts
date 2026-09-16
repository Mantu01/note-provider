import { prisma } from "../db";
import { AppError } from "../errors";
import { uniqueSlug } from "../slug";
import type { RouteContext } from "../api-handler";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/lib/schemas/category.schema";

export async function listActiveCategories(): Promise<import("@prisma/client").Category[]> {
  return prisma.category.findMany({ where: { isActive: true }, orderBy: { order: "asc", name: "asc" } });
}

export async function getCategoryById(id: string): Promise<import("@prisma/client").Category | null> {
  return prisma.category.findUnique({ where: { id } });
}

export async function getCategoryBySlug(slug: string): Promise<import("@prisma/client").Category | null> {
  return prisma.category.findFirst({ where: { slug, isActive: true } });
}

export async function getCategoryWithNoteCount(categoryId: string): Promise<{ category: import("@prisma/client").Category; noteCount: number }> {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) throw AppError.notFound("Category");
  const noteCount = await prisma.note.count({ where: { categoryId, visibility: "public" } });
  return { category, noteCount };
}

export async function getCategoryCounts(): Promise<Array<{ categoryId: string; noteCount: number }>> {
  const results = await prisma.note.groupBy({
    by: ["categoryId"],
    where: { visibility: "public" },
    _count: true,
  });
  return results.map((r: { categoryId: string; _count: number }) => ({ categoryId: r.categoryId, noteCount: r._count }));
}

export async function createCategory(
  input: CreateCategoryInput,
  ctx: RouteContext & { admin: { id: string; name: string; email: string; isHead: boolean } },
): Promise<import("@prisma/client").Category> {
  const slug = await uniqueSlug("category", input.name);

  return prisma.category.create({
    data: {
      ...input,
      slug,
      createdBy: ctx.admin.id,
      updatedBy: ctx.admin.id,
    },
  });
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
  ctx: RouteContext & { admin: { id: string; name: string; email: string; isHead: boolean } },
): Promise<import("@prisma/client").Category> {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound("Category");

  const updates: Record<string, unknown> = { updatedBy: ctx.admin.id };

  if (input.name !== undefined) updates.name = input.name;
  if (input.description !== undefined) updates.description = input.description;
  if (input.icon !== undefined) updates.icon = input.icon;
  if (input.order !== undefined) updates.order = input.order;
  if (input.isActive !== undefined) updates.isActive = input.isActive;

  return prisma.category.update({ where: { id }, data: updates as Parameters<typeof prisma.category.update>[0]["data"] });
}

export async function deleteCategory(
  id: string,
  _ctx: RouteContext & { admin: { id: string; name: string; email: string; isHead: boolean } },
): Promise<{ refused?: boolean; conflictMessage?: string }> {
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
    return { refused: true, conflictMessage: `${parts.join(" and ")} still use this category. Reassign them first.` };
  }

  await prisma.category.delete({ where: { id } });
  return { refused: false };
}
