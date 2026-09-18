import { handler } from "@/helpers/api-handler";
import { fail, ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { hashPassword } from "@/helpers/password";
import { signAdminToken } from "@/helpers/jwt";
import { setAdminSessionCookie } from "@/helpers/auth-guard";
import { adminRegisterSchema } from "@/schemas/admin.schema";
import { enforceRateLimit } from "@/helpers/rate-limit";

export const POST = handler(async (ctx) => {
  enforceRateLimit("adminRegister", ctx.ip, { limit: 10, windowMs: 3600000 });

  const secret = ctx.req.headers.get("x-admin-register-secret");
  if (secret !== process.env.ADMIN_REGISTER_SECRET) {
    return fail(AppError.forbidden("Access denied"));
  }

  const body = await ctx.req.json();
  const parsed = adminRegisterSchema.safeParse(body);
  if (!parsed.success) return fail(AppError.validation());

  const existing = await prisma.admin.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (existing) throw AppError.conflict("An account with this email already exists");

  const isHead = parsed.data.isHead ?? false;
  const passwordHash = await hashPassword(parsed.data.password);

  const admin = await prisma.admin.create({
    data: { name: parsed.data.name, email: parsed.data.email.toLowerCase(), passwordHash, isHead },
  });

  const token = await signAdminToken({ sub: admin.id, email: admin.email, name: admin.name, isHead: Boolean(admin.isHead) });
  await setAdminSessionCookie(token);

  const res = ok({ admin: { id: admin.id, name: admin.name, email: admin.email, isHead: Boolean(admin.isHead), lastLoginAt: admin.lastLoginAt?.toISOString() ?? null, createdAt: admin.createdAt.toISOString() }, token });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}, "Invalid registration data");
