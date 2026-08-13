import { z } from "zod";
import { MIN_PAID_PRICE_PAISE, NOTE_LEVELS, NOTE_PRICING_TYPES, NOTE_VISIBILITIES } from "../constants";
import { rupeesToPaise } from "../format";

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid identifier");

export const uploadedFileSchema = z.object({
  url: z.url("Invalid file URL"),
  publicId: z.string().trim().min(1, "Missing file reference"),
  bytes: z.number().int().positive("Invalid file size"),
});

export const uploadedImageSchema = z.object({
  url: z.url("Invalid image URL"),
  publicId: z.string().trim().min(1, "Missing image reference"),
});

const tagsSchema = z
  .array(z.string().trim().min(1).max(40))
  .max(20, "At most 20 tags are allowed")
  .transform((tags) => Array.from(new Set(tags.map((tag) => tag.toLowerCase()))));

const priceRupeesSchema = z
  .number({ message: "Price is required" })
  .min(0, "Price cannot be negative")
  .max(1000000, "Price is too high");

export const noteBaseSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(160),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(5000),
  subject: z.string().trim().min(1, "Subject is required").max(120),
  subjectSlug: z.string().trim().min(1, "Subject is required").max(120),
  categoryId: objectIdSchema,
  level: z.enum(NOTE_LEVELS, { message: "Select a level" }),
  visibility: z.enum(NOTE_VISIBILITIES).default("public"),
  pricingType: z.enum(NOTE_PRICING_TYPES, { message: "Select a pricing type" }),
  price: priceRupeesSchema.default(0),
  compareAtPrice: priceRupeesSchema.nullable().default(null),
  tags: tagsSchema.default([]),
  isFeatured: z.boolean().default(false),
  pageCount: z.number().int().positive().max(20000).nullable().default(null),
  fullFile: uploadedFileSchema,
  previewFile: uploadedFileSchema.nullable().default(null),
  coverImage: uploadedImageSchema.nullable().default(null),
});

function refineNote(
  value: {
    pricingType?: "free" | "paid";
    price?: number;
    compareAtPrice?: number | null;
    fullFile?: { url: string } | null;
    previewFile?: { url: string } | null;
  },
  ctx: z.RefinementCtx,
) {
  if (value.pricingType === "free") {
    if (!value.fullFile) {
      ctx.addIssue({
        code: "custom",
        path: ["fullFile"],
        message: "Please upload the full study note PDF document for free download",
      });
    }
  } else if (value.pricingType === "paid") {
    const pricePaise = rupeesToPaise(value.price ?? 0);
    if (pricePaise < MIN_PAID_PRICE_PAISE) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Paid notes must cost at least ₹1",
      });
    }
    if (!value.previewFile && !value.fullFile) {
      ctx.addIssue({
        code: "custom",
        path: ["previewFile"],
        message: "Please upload the sample preview PDF for this paid note",
      });
    }
    if (
      value.compareAtPrice !== null &&
      value.compareAtPrice !== undefined &&
      rupeesToPaise(value.compareAtPrice) <= pricePaise
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["compareAtPrice"],
        message: "Compare-at price must be higher than the sale price",
      });
    }
  }
}

export const createNoteSchema = noteBaseSchema.superRefine(refineNote);

export const updateNoteSchema = noteBaseSchema.partial().superRefine((value, ctx) => {
  if (value.pricingType === "paid" || value.fullFile !== undefined) refineNote(value, ctx);
  if (Object.keys(value).length === 0) {
    ctx.addIssue({ code: "custom", path: [], message: "Nothing to update" });
  }
});

export type CreateNoteInput = z.input<typeof createNoteSchema>;
export type CreateNotePayload = z.output<typeof createNoteSchema>;
export type UpdateNoteInput = z.input<typeof updateNoteSchema>;
export type UpdateNotePayload = z.output<typeof updateNoteSchema>;
