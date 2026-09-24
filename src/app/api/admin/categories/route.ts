import { adminHandler } from "@/helpers/api-handler";
import { fail, ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { createCategorySchema } from "@/schemas/category.schema";
import { uniqueSlug } from "@/helpers/slug";

export const GET = adminHandler(async () => {
  const items = await prisma.category.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });

  const [noteCounts, groupCounts] = await Promise.all([
    prisma.note.groupBy({ by: ["categoryId"], where: {}, _count: true }),
    prisma.group.groupBy({ by: ["categoryId"], where: {}, _count: true }),
  ]);
  const noteMap = new Map(noteCounts.map((c) => [c.categoryId, c._count]));
  const groupMap = new Map(groupCounts.map((c) => [c.categoryId, c._count]));

  return ok({ items: items.map((cat) => ({
    id: cat.id, name: cat.name, slug: cat.slug, description: cat.description, icon: cat.icon,
    subjects: Array.isArray(cat.subjects) ? cat.subjects : [],
    noteCount: noteMap.get(cat.id) ?? 0, groupCount: groupMap.get(cat.id) ?? 0,
    order: cat.order, isActive: cat.isActive,
    createdAt: cat.createdAt.toISOString(), updatedAt: cat.updatedAt.toISOString(),
  })) });
});

export const POST = adminHandler(async (ctx) => {
  const body = await ctx.req.json();
  const parsed = createCategorySchema.safeParse(body);
  if (!parsed.success) return fail(AppError.validation());

  const slug = await uniqueSlug("category", parsed.data.name);

  const doc = await prisma.category.create({
    data: {
      ...parsed.data,
      slug,
      createdBy: ctx.admin.id,
      updatedBy: ctx.admin.id,
    },
  });

  return ok({ id: doc.id, name: doc.name, slug: doc.slug, description: doc.description, icon: doc.icon, subjects: [], noteCount: 0, groupCount: 0, order: doc.order, isActive: doc.isActive, createdAt: doc.createdAt.toISOString(), updatedAt: doc.updatedAt.toISOString() });
});
