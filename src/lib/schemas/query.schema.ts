import { z } from "zod";
import {
  ADMIN_ACTIVITY_ACTIONS,
  FULFILLMENT_STATUSES,
  MAX_PAGE_LIMIT,
  NOTE_LEVELS,
  NOTE_PRICING_TYPES,
  NOTE_SORTS,
  NOTE_VISIBILITIES,
  ORDER_SORTS,
  PAYMENT_STATUSES,
  PURCHASE_ITEM_TYPES,
  SOCIAL_PLATFORMS,
} from "../constants";

const stringArray = z.array(z.string().trim().min(1)).default([]);

const isoDate = z
  .string()
  .trim()
  .refine((value) => !Number.isNaN(new Date(value).getTime()), "Invalid date")
  .transform((value) => new Date(value));

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_LIMIT).catch(MAX_PAGE_LIMIT),
});

export const noteQuerySchema = z.object({
  q: z.string().trim().min(1).max(120).optional(),
  category: stringArray,
  level: z.array(z.enum(NOTE_LEVELS)).default([]),
  pricing: z.enum(NOTE_PRICING_TYPES).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  tags: stringArray,
  sort: z.enum(NOTE_SORTS).catch("newest"),
  featured: z.boolean().optional(),
  visibility: z.enum(NOTE_VISIBILITIES).optional(),
});

export const orderQuerySchema = z.object({
  q: z.string().trim().min(1).max(120).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  fulfillmentStatus: z.enum(FULFILLMENT_STATUSES).optional(),
  itemType: z.enum(PURCHASE_ITEM_TYPES).optional(),
  from: isoDate.optional(),
  to: isoDate.optional(),
  sort: z.enum(ORDER_SORTS).catch("newest"),
});

export const leadQuerySchema = z.object({
  q: z.string().trim().min(1).max(120).optional(),
  socialPlatform: z.enum(SOCIAL_PLATFORMS).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  fulfillmentStatus: z.enum(FULFILLMENT_STATUSES).optional(),
  from: isoDate.optional(),
  to: isoDate.optional(),
});

export const activityQuerySchema = z.object({
  adminId: z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, "Invalid admin id")
    .optional(),
  action: z.enum(ADMIN_ACTIVITY_ACTIONS).optional(),
  from: isoDate.optional(),
  to: isoDate.optional(),
});

export type NoteQuery = z.output<typeof noteQuerySchema>;
export type OrderQuery = z.output<typeof orderQuerySchema>;
export type LeadQuery = z.output<typeof leadQuerySchema>;
export type ActivityQuery = z.output<typeof activityQuerySchema>;
