import { z } from "zod";
import { MIN_PAID_PRICE_PAISE, NOTE_VISIBILITIES } from "../constants";
import { rupeesToPaise } from "../format";
import { objectIdSchema, uploadedImageSchema } from "./note.schema";

const priceRupeesSchema = z
  .number({ message: "Price is required" })
  .min(0, "Price cannot be negative")
  .max(1000000, "Price is too high");

export const groupBaseSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(160),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(5000),
  categoryId: objectIdSchema,
  price: priceRupeesSchema,
  compareAtPrice: priceRupeesSchema.nullable().default(null),
  noteIds: z
    .array(objectIdSchema)
    .min(1, "Select at least one note")
    .max(200, "A group can hold at most 200 notes"),
  coverImage: uploadedImageSchema.nullable().default(null),
  visibility: z.enum(NOTE_VISIBILITIES).default("public"),
  isFeatured: z.boolean().default(false),
});

function refineGroup(
  value: { price?: number; compareAtPrice?: number | null; noteIds?: string[] },
  ctx: z.RefinementCtx,
) {
  if (value.price !== undefined && rupeesToPaise(value.price) < MIN_PAID_PRICE_PAISE) {
    ctx.addIssue({ code: "custom", path: ["price"], message: "Groups must cost at least ₹1" });
  }
  if (
    value.price !== undefined &&
    value.compareAtPrice !== null &&
    value.compareAtPrice !== undefined &&
    rupeesToPaise(value.compareAtPrice) <= rupeesToPaise(value.price)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["compareAtPrice"],
      message: "Compare-at price must be higher than the price",
    });
  }
  if (value.noteIds && new Set(value.noteIds).size !== value.noteIds.length) {
    ctx.addIssue({ code: "custom", path: ["noteIds"], message: "Duplicate notes are not allowed" });
  }
}

export const createGroupSchema = groupBaseSchema.superRefine(refineGroup);

export const updateGroupSchema = groupBaseSchema.partial().superRefine((value, ctx) => {
  refineGroup(value, ctx);
  if (Object.keys(value).length === 0) {
    ctx.addIssue({ code: "custom", path: [], message: "Nothing to update" });
  }
});

export type CreateGroupInput = z.input<typeof createGroupSchema>;
export type CreateGroupPayload = z.output<typeof createGroupSchema>;
export type UpdateGroupInput = z.input<typeof updateGroupSchema>;
export type UpdateGroupPayload = z.output<typeof updateGroupSchema>;
