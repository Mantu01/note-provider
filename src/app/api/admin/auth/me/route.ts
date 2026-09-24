import { adminHandler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";

export const GET = adminHandler(async (ctx) => {
  const admin = await prisma.admin.findUnique({ where: { id: ctx.admin.id }, select: { id: true, name: true, email: true, isActive: true, isHead: true } });
  if (!admin) throw AppError.unauthorized();
  return ok({ id: admin.id, name: admin.name, email: admin.email, isHead: Boolean(admin.isHead), lastLoginAt: null, createdAt: "" });
});
