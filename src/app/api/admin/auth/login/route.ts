import { handler } from "@/server/lib/api-handler";
import { connectDb } from "@/server/db/connect";
import { fail, ok } from "@/server/lib/api-response";
import { AppError } from "@/server/lib/errors";
import { Admin } from "@/server/db/models/admin.model";
import { verifyPassword } from "@/server/lib/password";
import { signAdminToken } from "@/server/lib/jwt";
import { setAdminSessionCookie } from "@/server/lib/auth-guard";
import { adminLoginSchema } from "@/lib/schemas/admin.schema";
import { logActivity } from "@/server/services/activity.service";
import { enforceRateLimit } from "@/server/lib/rate-limit";
import { toAdminProfile } from "@/server/mappers/activity.mapper";

export const runtime = "nodejs";

export const POST = handler(async (ctx) => {
  await connectDb();
  enforceRateLimit("adminLogin", ctx.ip, { limit: 5, windowMs: 600000 });

  const body = await ctx.req.json();
  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fields[key]) fields[key] = issue.message;
    }
    return fail(AppError.validation(fields, parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const admin = await Admin.findOne({ email: parsed.data.email.toLowerCase() }).select("+passwordHash").lean().exec();
  if (!admin) throw AppError.unauthorized("Invalid email or password");

  const valid = await verifyPassword(parsed.data.password, admin.passwordHash);
  if (!valid) throw AppError.unauthorized("Invalid email or password");

  await Admin.findByIdAndUpdate(admin._id, { lastLoginAt: new Date() }).exec();

  const token = await signAdminToken({ sub: admin._id.toString(), email: admin.email, name: admin.name, isHead: Boolean(admin.isHead) });
  await setAdminSessionCookie(token);

  await logActivity({
    adminId: admin._id.toString(),
    action: "admin.login",
    description: `Admin "${admin.name}" logged in`,
    targetType: "admin",
    targetId: admin._id.toString(),
    targetLabel: admin.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  const profile = { ...admin, passwordHash: undefined };
  const res = ok(toAdminProfile(profile));
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
});
