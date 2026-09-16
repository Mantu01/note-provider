import { prisma } from "../db";
import { AppError } from "../errors";

export async function getAllAdmins(): Promise<Array<{ id: string; name: string; email: string; isHead: boolean; lastLoginAt: Date | null; createdAt: Date }>> {
  return prisma.admin.findMany({ select: { id: true, name: true, email: true, isHead: true, lastLoginAt: true, createdAt: true }, orderBy: { createdAt: "asc" } });
}

export async function getAdminById(id: string): Promise<{ id: string; name: string; email: string; isHead: boolean; lastLoginAt: Date | null; createdAt: Date } | null> {
  return prisma.admin.findUnique({ where: { id }, select: { id: true, name: true, email: true, isHead: true, lastLoginAt: true, createdAt: true } });
}

export async function getAdminByEmail(email: string): Promise<{ id: string; name: string; email: string; isHead: boolean; lastLoginAt: Date | null; createdAt: Date } | null> {
  return prisma.admin.findUnique({ where: { email: email.toLowerCase() }, select: { id: true, name: true, email: true, isHead: true, lastLoginAt: true, createdAt: true } });
}

export async function createAdmin(input: { name: string; email: string; passwordHash: string }): Promise<import("@prisma/client").Admin> {
  return prisma.admin.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
    },
  });
}

export async function updateLastLogin(adminId: string): Promise<void> {
  await prisma.admin.update({ where: { id: adminId }, data: { lastLoginAt: new Date() } });
}
