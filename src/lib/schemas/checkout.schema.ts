import { z } from "zod";
import { isValidSocialHandle } from "../format";
import type { SocialPlatform } from "../types";

export const checkoutSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Please enter your full name.")
      .max(80, "Name must be 80 characters or fewer.")
      .regex(/^[\p{L}\s.'-]+$/u, "Use letters, spaces, apostrophes, periods, or hyphens only."),
    socialPlatform: z.enum(["instagram", "whatsapp", "email"]),
    socialHandle: z.string().trim().min(1, "Please enter your delivery handle."),
    consentAccepted: z.boolean().refine((value) => value, "Please accept the terms and privacy policy."),
  })
  .superRefine((data, ctx) => {
    if (!isValidSocialHandle(data.socialPlatform as SocialPlatform, data.socialHandle)) {
      ctx.addIssue({
        code: "custom",
        path: ["socialHandle"],
        message: `Invalid handle format for ${data.socialPlatform}`,
      });
    }
  });

export type CheckoutValues = z.infer<typeof checkoutSchema>;
