import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_SECONDS } from "@/lib/constants";
import { Admin } from "../db/models/admin.model";
import { AppError } from "./errors";
import { verifyAdminToken } from "./jwt";

export type AdminSession = { id: string; name: string; email: string; isHead: boolean };

export async function requireAdmin(): Promise<AdminSession> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) throw AppError.unauthorized();

  const payload = await verifyAdminToken(token);
  const admin = await Admin.findById(payload.sub).select("name email isActive isHead").lean();
  if (!admin || !admin.isActive) throw AppError.unauthorized();

  return { id: String(admin._id), name: admin.name, email: admin.email, isHead: Boolean(admin.isHead) };
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

export async function getOptionalAdmin(): Promise<AdminSession | null> {
  try {
    return await requireAdmin();
  } catch {
    return null;
  }
}
