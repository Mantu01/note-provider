import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Name must be 80 characters or fewer.")
    .regex(/^[\p{L}\s.'-]+$/u, "Use letters, spaces, apostrophes, periods, or hyphens only."),
  consentAccepted: z.boolean().refine((value) => value, "Please accept the terms and privacy policy."),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
