import { z } from "zod";

export const subjectInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Subject name is required").max(100),
  slug: z.string().trim().min(1).max(100).optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const categoryBaseSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  description: z.string().trim().max(300, "Description must be at most 300 characters").nullable().default(null),
  icon: z.string().trim().max(60).nullable().default(null),
  order: z.number().int().min(0).max(9999).default(0),
  isActive: z.boolean().default(true),
  subjects: z.array(subjectInputSchema).default([]),
});

export const createCategorySchema = categoryBaseSchema;

export const updateCategorySchema = categoryBaseSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "Nothing to update" },
);

export type SubjectInput = z.input<typeof subjectInputSchema>;
export type CreateCategoryInput = z.input<typeof createCategorySchema>;
export type CreateCategoryPayload = z.output<typeof createCategorySchema>;
export type UpdateCategoryInput = z.input<typeof updateCategorySchema>;
export type UpdateCategoryPayload = z.output<typeof updateCategorySchema>;
