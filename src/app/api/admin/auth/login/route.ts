import { handler } from "@/helpers/api-handler";
import { fail, ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { verifyPassword } from "@/helpers/password";
import { signAdminToken } from "@/helpers/jwt";
import { setAdminSessionCookie } from "@/helpers/auth-guard";
import { adminLoginSchema } from "@/lib/schemas/admin.schema";
import { enforceRateLimit } from "@/helpers/rate-limit";
import { toAdminProfile } from "@/helpers/mappers/admin.mapper";

export const runtime = "nodejs";

export const POST = handler(async (ctx) => {
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

  const admin = await prisma.admin.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!admin) throw AppError.unauthorized("Invalid email or password");

  const valid = await verifyPassword(parsed.data.password, admin.passwordHash);
  if (!valid) throw AppError.unauthorized("Invalid email or password");

  await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });

  const token = await signAdminToken({ sub: admin.id, email: admin.email, name: admin.name, isHead: Boolean(admin.isHead) });
  await setAdminSessionCookie(token);

  const adminProfile = toAdminProfile({ ...admin, passwordHash: undefined });
  const res = ok({ admin: adminProfile, token });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
});
