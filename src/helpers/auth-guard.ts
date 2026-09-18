import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_SECONDS } from "@/lib/constants";
import { prisma } from "./db";
import { AppError } from "./errors";
import { verifyAdminToken } from "./jwt";

export type AdminSession = { id: string; name: string; email: string; isHead: boolean };

export async function requireAdmin(): Promise<AdminSession> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) throw AppError.unauthorized();

  const payload = await verifyAdminToken(token);
  const admin = await prisma.admin.findUnique({
    where: { id: payload.sub },
    select: { id: true, name: true, email: true, isActive: true, isHead: true },
  });
  if (!admin || !admin.isActive) throw AppError.unauthorized();

  return { id: admin.id, name: admin.name, email: admin.email, isHead: Boolean(admin.isHead) };
}

export async function requireHeadAdmin(): Promise<AdminSession> {
  const session = await requireAdmin();
  if (!session.isHead) throw AppError.forbidden("Only head admin can perform delete operations");
  return session;
}

export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}


