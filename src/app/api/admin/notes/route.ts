import { z } from "zod";
import { handler, adminHandler } from "@/server/lib/api-handler";
import { connectDb } from "@/server/db/connect";
import { fail, ok } from "@/server/lib/api-response";
import { AppError } from "@/server/lib/errors";
import { Note } from "@/server/db/models/note.model";
import { Category } from "@/server/db/models/category.model";
import { logActivity } from "@/server/services/activity.service";
import { destroyAsset } from "@/server/lib/cloudinary";
import { toPublicNote, toAdminNote } from "@/server/mappers/note.mapper";
import { createNoteSchema, updateNoteSchema } from "@/lib/schemas/note.schema";
import { rupeesToPaise } from "@/lib/format";
import { uniqueSlug } from "@/server/lib/slug";
import { MIN_PAID_PRICE_PAISE } from "@/lib/constants";

export const runtime = "nodejs";

export const GET = adminHandler(async (ctx) => {
  const page = Number(ctx.searchParams.get("page")) || 1;
  const limit = Number(ctx.searchParams.get("limit")) || 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Note.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("category").populate("createdBy", "_id name").lean().exec(),
    Note.countDocuments().exec(),
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
    throw AppError.validation({ price: "Paid notes must cost at least ₹1" });
  }

  const categoryDoc = await Category.findById(input.categoryId).lean().exec();
  if (!categoryDoc) throw AppError.notFound("Category");

  const matchingSubject = (categoryDoc.subjects || []).find((s) => s.slug === input.subjectSlug);
  if (!matchingSubject) {
    throw AppError.validation({ subjectSlug: "Selected subject does not belong to the chosen category" });
  }

  const baseSlug = uniqueSlug(Note, input.title);
  const slug = await baseSlug;

  const createdDoc = await Note.create({
    title: input.title,
    description: input.description,
    subject: matchingSubject.name,
    subjectSlug: matchingSubject.slug,
    category: input.categoryId,
    level: input.level,
    visibility: input.visibility,
    pricingType: input.pricingType,
    price: pricePaise,
    compareAtPrice: compareAtPricePaise,
    tags: input.tags,
    isFeatured: input.isFeatured,
    pageCount: input.pageCount,
    fullFileUrl: input.fullFile.url,
    fullFilePublicId: input.fullFile.publicId,
    fullFileBytes: input.fullFile.bytes,
    previewFileUrl: input.previewFile?.url ?? null,
    previewFilePublicId: input.previewFile?.publicId ?? null,
    previewFileBytes: input.previewFile?.bytes ?? null,
    coverImageUrl: input.coverImage?.url ?? null,
    coverImagePublicId: input.coverImage?.publicId ?? null,
    slug,
    createdBy: admin.id,
    updatedBy: admin.id,
  });

  const doc = await Note.findById(createdDoc._id).populate("category").populate("createdBy", "_id name").lean().exec();

  await logActivity({
    adminId: admin.id,
    action: "note.create",
    description: `Created note "${input.title}"`,
    targetType: "note",
    targetId: createdDoc._id.toString(),
    targetLabel: input.title,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return ok(toAdminNote(doc ?? createdDoc.toJSON()));
});
