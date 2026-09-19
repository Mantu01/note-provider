import { adminHandler } from "@/helpers/api-handler";
import { fail, ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { toAdminNote } from "@/helpers/mappers/note.mapper";
import { createNoteSchema, toGoogleDriveDownloadUrl } from "@/schemas/note.schema";
import { rupeesToPaise } from "@/lib/format";
import { uniqueSlug } from "@/helpers/slug";
import { parsePagination, buildPagination } from "@/helpers/query";

export const GET = adminHandler(async (ctx) => {
  const { page, limit, skip } = parsePagination(ctx.searchParams, 20);

  const [items, total] = await Promise.all([
    prisma.note.findMany({ include: { category: true }, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.note.count(),
  ]);

  return ok({
    items: items.map(toAdminNote),
    pagination: buildPagination(total, page, limit),
  });
});

export const POST = adminHandler(async (ctx) => {
  const body = await ctx.req.json();
  const parsed = createNoteSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fields[path]) fields[path] = issue.message;
    }
    return fail(AppError.validation(fields));
  }

  const { admin } = ctx;
  const input = parsed.data;

  const compareAtPricePaise = input.compareAtPrice ? rupeesToPaise(input.compareAtPrice) : null;
  const slug = await uniqueSlug("note", input.title);

  const fullFileUrl = input.fullFile?.url ?? (input.fullFileUrl ? toGoogleDriveDownloadUrl(input.fullFileUrl) : "");

  const createdDoc = await prisma.note.create({
    data: {
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      level: input.level,
      visibility: input.visibility,
      pricingType: input.pricingType,
      price: rupeesToPaise(input.price),
      compareAtPrice: compareAtPricePaise,
      tags: input.tags,
      isFeatured: input.isFeatured,
      pageCount: input.pageCount,
      fullFileUrl,
      previewFileUrl: input.previewFile?.url ?? null,
      coverImageUrl: input.coverImage?.url ?? null,
      slug,
      createdBy: admin.id,
      updatedBy: admin.id,
    },
    include: { category: true },
  });

  return ok(toAdminNote(createdDoc));
});
