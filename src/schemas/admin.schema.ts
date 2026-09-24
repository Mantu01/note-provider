import { z } from "zod";

export const adminRegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[a-zA-Z]/, "Password must contain a letter")
    .regex(/\d/, "Password must contain a number"),
  isHead: z.boolean().optional(),
});

export const adminLoginSchema = z.object({
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required").max(128),
});

export type AdminRegisterInput = z.input<typeof adminRegisterSchema>;
export type AdminRegisterPayload = z.output<typeof adminRegisterSchema>;
export type AdminLoginInput = z.input<typeof adminLoginSchema>;
export type AdminLoginPayload = z.output<typeof adminLoginSchema>;
