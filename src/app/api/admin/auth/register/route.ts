import { z } from "zod";
import { handler, adminHandler } from "@/server/lib/api-handler";
import { connectDb } from "@/server/db/connect";
import { fail, ok } from "@/server/lib/api-response";
import { AppError } from "@/server/lib/errors";
import { Admin } from "@/server/db/models/admin.model";
import { hashPassword, verifyPassword } from "@/server/lib/password";
import { signAdminToken } from "@/server/lib/jwt";
import { setAdminSessionCookie, clearAdminSessionCookie } from "@/server/lib/auth-guard";
import { adminRegisterSchema, adminLoginSchema } from "@/lib/schemas/admin.schema";
import { logActivity } from "@/server/services/activity.service";
import { enforceRateLimit } from "@/server/lib/rate-limit";
import { toAdminProfile } from "@/server/mappers/activity.mapper";

export const runtime = "nodejs";

export const POST = handler(async (ctx) => {
  await connectDb();
  enforceRateLimit("adminRegister", ctx.ip, { limit: 10, windowMs: 3600000 });

  const secret = ctx.req.headers.get("x-admin-register-secret");
  if (secret !== process.env.ADMIN_REGISTER_SECRET) {
    return fail(AppError.forbidden("Access denied"));
  }

  const body = await ctx.req.json();
  const parsed = adminRegisterSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fields[key]) fields[key] = issue.message;
    }
    return fail(AppError.validation(fields, parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const existing = await Admin.findOne({ email: parsed.data.email.toLowerCase() }).lean().exec();
  if (existing) throw AppError.conflict("An account with this email already exists");

  const isHead = parsed.data.isHead ?? false;

  const passwordHash = await hashPassword(parsed.data.password);
  const admin = await Admin.create({
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    passwordHash,
    isHead,
  });

  await logActivity({
    adminId: admin._id.toString(),
    action: "admin.register",
    description: `Registered admin "${admin.name}"`,
    targetType: "admin",
    targetId: admin._id.toString(),
    targetLabel: admin.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  const res = ok(toAdminProfile(admin.toJSON()));
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
});
