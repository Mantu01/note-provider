import { z } from "zod";
import { handler, adminHandler } from "@/helpers/api-handler";
import { fail, ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { destroyAsset } from "@/helpers/cloudinary";
import { toPublicNote, toAdminNote } from "@/helpers/mappers/note.mapper";
import { createNoteSchema, updateNoteSchema } from "@/lib/schemas/note.schema";
import { rupeesToPaise } from "@/lib/format";
import { uniqueSlug } from "@/helpers/slug";
import { MIN_PAID_PRICE_PAISE } from "@/lib/constants";

export const runtime = "nodejs";

export const GET = adminHandler(async (ctx) => {
  const page = Number(ctx.searchParams.get("page")) || 1;
  const limit = Number(ctx.searchParams.get("limit")) || 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.note.findMany({ include: { category: true }, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.note.count(),
  ]);

  return ok({
    items: items.map(toAdminNote),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrev: page > 1 },
  });
});

export const POST = adminHandler(async (ctx) => {
  const body = await ctx.req.json();
  const parsed = createNoteSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fields[key]) fields[key] = issue.message;
    }
    return fail(AppError.validation(fields, parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const { admin } = ctx;
  const input = parsed.data;

  const pricePaise = rupeesToPaise(input.price);
  const compareAtPricePaise = input.compareAtPrice ? rupeesToPaise(input.compareAtPrice) : null;

  if (input.pricingType === "paid" && pricePaise < MIN_PAID_PRICE_PAISE) {
    throw AppError.validation({ price: `Paid notes must cost at least ₹${(MIN_PAID_PRICE_PAISE / 100).toFixed(2)}` });
  }

  const categoryDoc = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!categoryDoc) throw AppError.notFound("Category");

  const slug = await uniqueSlug("note", input.title);

  const createdDoc = await prisma.note.create({
    data: {
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      level: input.level,
      visibility: input.visibility,
      pricingType: input.pricingType,
      price: pricePaise,
      compareAtPrice: compareAtPricePaise,
      tags: input.tags,
      isFeatured: input.isFeatured,
      pageCount: input.pageCount,
      fullFileUrl: input.fullFile.url,
      fullFilePublicId: input.fullFile.source === "upload" ? input.fullFile.publicId : null,
      fullFileBytes: input.fullFile.source === "upload" ? input.fullFile.bytes : 0,
      pdfSource: input.fullFile.source,
      drivePdfUrl: input.fullFile.source === "drive" ? input.fullFile.url : null,
      previewFileUrl: input.previewFile?.url ?? null,
      previewFilePublicId: input.previewFile && input.previewFile.source === "upload" ? input.previewFile.publicId : null,
      previewFileBytes: input.previewFile && input.previewFile.source === "upload" ? input.previewFile.bytes : null,
      coverImageUrl: input.coverImage?.url ?? null,
      coverImagePublicId: input.coverImage?.publicId ?? null,
      slug,
      createdBy: admin.id,
      updatedBy: admin.id,
    },
    include: { category: true },
  });

  return ok(toAdminNote(createdDoc));
});
