import { adminHandler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { prisma } from "@/helpers/db";
import { toAdminProfile } from "@/helpers/mappers/admin.mapper";

export const runtime = "nodejs";

export const GET = adminHandler(async () => {
  const admins = await prisma.admin.findMany({ select: { id: true, name: true, email: true, isHead: true, lastLoginAt: true, createdAt: true }, orderBy: { createdAt: "asc" } });
  return ok(admins.map(toAdminProfile));
});
