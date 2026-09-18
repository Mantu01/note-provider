import { adminHandler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";

export const GET = adminHandler(async () => {
  const admins = await prisma.admin.findMany({ select: { id: true, name: true, email: true, isHead: true, lastLoginAt: true, createdAt: true }, orderBy: { createdAt: "asc" } });
  return ok(admins.map((a) => ({ id: a.id, name: a.name, email: a.email, isHead: a.isHead, lastLoginAt: a.lastLoginAt?.toISOString() ?? null, createdAt: a.createdAt.toISOString() })));
});
