import { z } from "zod";
import { NOTE_LEVELS, NOTE_PRICING_TYPES, NOTE_VISIBILITIES } from "@/lib/constants";
import { rupeesToPaise } from "@/lib/format";

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Invalid identifier");

export const fileUploadSchema = z.object({
  url: z.string().url("Invalid file URL"),
  publicId: z.string().trim().optional().default(""),
  bytes: z.number().int().nonnegative().optional().default(0),
}).nullable();

export const imageUploadSchema = z.object({
  url: z.string().url("Invalid image URL"),
  publicId: z.string().trim().optional().default(""),
}).nullable();

const tagsSchema = z
  .array(z.string().trim().min(1).max(40))
  .max(20, "At most 20 tags are allowed")
  .transform((tags) => Array.from(new Set(tags.map((tag) => tag.toLowerCase()))));

export const priceRupeesSchema = z
  .number({ message: "Price is required" })
  .min(0, "Price cannot be negative")
  .max(1000000, "Price is too high");

export function isGoogleDriveUrl(url: string): boolean {
  return /^(https?:\/\/)?(drive\.google\.com|docs\.google\.com)\/(?:file\/d\/|open\?id=|uc\?id=)?[a-zA-Z0-9_-]+/.test(url);
}

export function toGoogleDriveDownloadUrl(url: string): string {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)|\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/);
  const id = match ? (match[1] || match[2] || match[3]) : null;
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
}

export function toGoogleDrivePreviewUrl(url: string): string {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)|\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/);
  const id = match ? (match[1] || match[2] || match[3]) : null;
  return id ? `https://drive.google.com/file/d/${id}/preview` : url;
}

export const noteBaseSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(160),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(5000),
  categoryId: objectIdSchema,
  level: z.enum(NOTE_LEVELS, { message: "Select a level" }),
  visibility: z.enum(NOTE_VISIBILITIES).default("public"),
  pricingType: z.enum(NOTE_PRICING_TYPES, { message: "Select a pricing type" }),
  price: priceRupeesSchema.default(0),
  compareAtPrice: priceRupeesSchema.nullable().default(null),
  tags: tagsSchema.default([]),
  isFeatured: z.boolean().default(false),
  pageCount: z.number().int().positive().max(20000).nullable().default(null),
  fullFile: fileUploadSchema.optional().nullable(),
  fullFileUrl: z.string().trim().url("Enter a valid URL").optional().nullable(),
  previewFile: fileUploadSchema,
  coverImage: imageUploadSchema,
});

function refineNote(
  value: {
    pricingType?: "free" | "paid";
    price?: number;
    compareAtPrice?: number | null;
    fullFile?: { url: string } | null;
    fullFileUrl?: string | null;
    previewFile?: { url: string } | null;
    coverImage?: { url: string } | null;
  },
  ctx: z.RefinementCtx,
) {
  const hasUploadedFull = !!value.fullFile?.url;
  const hasDriveUrl = !!value.fullFileUrl && value.fullFileUrl.trim().length > 0;

  if (!hasUploadedFull && !hasDriveUrl) {
    ctx.addIssue({
      code: "custom",
      path: ["fullFile"],
      message: "Please provide the full study note via file upload or Google Drive URL",
    });
  }

  if (hasDriveUrl && !isGoogleDriveUrl(value.fullFileUrl!)) {
    ctx.addIssue({
      code: "custom",
      path: ["fullFileUrl"],
      message: "Please enter a valid Google Drive file URL",
    });
  }

  if (!value.previewFile) {
    ctx.addIssue({
      code: "custom",
      path: ["previewFile"],
      message: "Please upload a sample preview PDF",
    });
  }

  if (!value.coverImage) {
    ctx.addIssue({
      code: "custom",
      path: ["coverImage"],
      message: "Please upload a cover image",
    });
  }

  if (value.pricingType === "paid") {
    const pricePaise = rupeesToPaise(value.price ?? 0);
    if (pricePaise < 100) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Paid notes must cost at least ₹1",
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
  if (value.pricingType === "paid" || value.fullFile !== undefined || value.fullFileUrl !== undefined) {
    refineNote(value, ctx);
  }
  if (Object.keys(value).length === 0) {
    ctx.addIssue({ code: "custom", path: [], message: "Nothing to update" });
  }
});

export type CreateNoteInput = z.input<typeof createNoteSchema>;
export type CreateNotePayload = z.output<typeof createNoteSchema>;
export type UpdateNoteInput = z.input<typeof updateNoteSchema>;
export type UpdateNotePayload = z.output<typeof updateNoteSchema>;
