import { adminHandler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { prisma } from "@/helpers/db";
import { AppError } from "@/helpers/errors";
import { toAdminCategory } from "@/helpers/mappers/category.mapper";
import { createCategorySchema } from "@/schemas/category.schema";
import { uniqueSlug } from "@/helpers/slug";

export const runtime = "nodejs";

export const GET = adminHandler(async () => {
  const items = await prisma.category.findMany({ orderBy: { order: "asc", name: "asc" } });

  const categoriesWithCounts = await Promise.all(
    items.map(async (cat) => {
      const [noteCount, groupCount] = await Promise.all([
        prisma.note.count({ where: { categoryId: cat.id } }),
        prisma.group.count({ where: { categoryId: cat.id } }),
      ]);
      return toAdminCategory({ ...cat, noteCount, groupCount }, noteCount, groupCount);
    }),
  );

  return ok({ items: categoriesWithCounts });
});

export const POST = adminHandler(async (ctx) => {
  const body = await ctx.req.json();
  const parsed = createCategorySchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      fields[key] = issue.message;
    }
    throw AppError.validation(fields);
  }

  const slug = await uniqueSlug("category", parsed.data.name);

  const doc = await prisma.category.create({
    data: {
      ...parsed.data,
      slug,
      createdBy: ctx.admin.id,
      updatedBy: ctx.admin.id,
    },
  });

  return ok(toAdminCategory(doc, 0, 0));
});
