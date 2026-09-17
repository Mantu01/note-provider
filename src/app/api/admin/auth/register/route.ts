import { handler } from "@/helpers/api-handler";
import { fail, ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { hashPassword } from "@/helpers/password";
import { signAdminToken } from "@/helpers/jwt";
import { setAdminSessionCookie } from "@/helpers/auth-guard";
import { adminRegisterSchema } from "@/schemas/admin.schema";
import { enforceRateLimit } from "@/helpers/rate-limit";
import { toAdminProfile } from "@/helpers/mappers/admin.mapper";


export const POST = handler(async (ctx) => {
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

  const existing = await prisma.admin.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (existing) throw AppError.conflict("An account with this email already exists");

  const isHead = parsed.data.isHead ?? false;
  const passwordHash = await hashPassword(parsed.data.password);

  const admin = await prisma.admin.create({
    data: { name: parsed.data.name, email: parsed.data.email.toLowerCase(), passwordHash, isHead },
  });

  const token = await signAdminToken({ sub: admin.id, email: admin.email, name: admin.name, isHead: Boolean(admin.isHead) });
  await setAdminSessionCookie(token);

  const res = ok({ admin: toAdminProfile({ ...admin, passwordHash: undefined }), token });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
});
