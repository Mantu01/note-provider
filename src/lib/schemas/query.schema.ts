import { z } from "zod";
import { NOTE_LEVELS, NOTE_SORTS, ORDER_SORTS } from "../constants";
import { DEFAULT_PAGE_LIMIT } from "../constants";

export const notesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(48).optional().default(DEFAULT_PAGE_LIMIT),
  q: z.string().trim().optional(),
  category: z.array(z.string()).optional(),
  level: z.array(z.enum(NOTE_LEVELS)).optional(),
  subject: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  pricing: z.enum(["free", "paid"]).optional(),
  minPrice: z.coerce.number().optional().nullable(),
  maxPrice: z.coerce.number().optional().nullable(),
  sort: z.enum(NOTE_SORTS).optional(),
  featured: z.coerce.boolean().optional(),
});

export const ordersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(48).optional().default(DEFAULT_PAGE_LIMIT),
  q: z.string().trim().optional(),
  paymentStatus: z.enum(["created", "paid", "failed"]).optional(),
  fulfillmentStatus: z.enum(["pending", "completed", "cancelled"]).optional(),
  itemType: z.enum(["note", "group"]).optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, "Invalid date format").optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, "Invalid date format").optional(),
  sort: z.enum(ORDER_SORTS).optional(),
});

export type NotesQuerySchema = z.infer<typeof notesQuerySchema>;
export type OrdersQuerySchema = z.infer<typeof ordersQuerySchema>;
