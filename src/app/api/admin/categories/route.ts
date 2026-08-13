import { adminHandler } from "@/server/lib/api-handler";
import { fail, ok } from "@/server/lib/api-response";
import { Category } from "@/server/db/models/category.model";
import { Note } from "@/server/db/models/note.model";
import { Group } from "@/server/db/models/group.model";
import { logActivity } from "@/server/services/activity.service";
import { toAdminCategory } from "@/server/mappers/category.mapper";
import { createCategorySchema } from "@/lib/schemas/category.schema";
import { uniqueSlug } from "@/server/lib/slug";
import { AppError } from "@/server/lib/errors";

export const runtime = "nodejs";

export const GET = adminHandler(async (ctx) => {
  const [items, total] = await Promise.all([
    Category.find({}).sort({ order: 1, name: 1 }).lean().exec(),
    Category.countDocuments().exec(),
  ]);

  const categoriesWithCounts = await Promise.all(
    items.map(async (cat) => {
      const [noteCount, groupCount] = await Promise.all([
        Note.countDocuments({ category: cat._id.toString() }).exec(),
        Group.countDocuments({ category: cat._id.toString() }).exec(),
      ]);
      return toAdminCategory({ ...cat, noteCount, groupCount }, noteCount, groupCount);
    }),
  );

  return ok({
    items: categoriesWithCounts,
    pagination: { page: 1, limit: total, total, totalPages: 1, hasNext: false, hasPrev: false },
  });
});

export const POST = adminHandler(async (ctx) => {
  const body = await ctx.req.json();
  const parsed = createCategorySchema.safeParse(body);
  if (!parsed.success) {
    return fail(AppError.validation(parsed.error.flatten().fieldErrors as Record<string, string>, parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const { admin } = ctx;
  const input = parsed.data;

  const slug = await uniqueSlug(Category, input.name);

  const doc = await Category.create({
    ...input,
    slug,
    createdBy: admin.id,
    updatedBy: admin.id,
  });

  await logActivity({
    adminId: admin.id,
    action: "category.create",
    description: `Created category "${input.name}"`,
    targetType: "category",
    targetId: doc._id.toString(),
    targetLabel: input.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return ok(toAdminCategory(doc.toJSON(), 0, 0));
});
