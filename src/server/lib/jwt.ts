import { SignJWT, jwtVerify } from "jose";
import { ADMIN_SESSION_MAX_AGE_SECONDS } from "@/lib/constants";
import { AppError } from "./errors";

export type AdminTokenPayload = { sub: string; email: string; name: string; isHead: boolean };

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw AppError.internal("Authentication is not configured");
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(payload: AdminTokenPayload): Promise<string> {
  return new SignJWT({ email: payload.email, name: payload.name, isHead: payload.isHead })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    if (!payload.sub || typeof payload.email !== "string" || typeof payload.name !== "string") {
      throw AppError.unauthorized();
    }
    return { sub: payload.sub, email: payload.email, name: payload.name, isHead: Boolean(payload.isHead) };
  } catch {
    throw AppError.unauthorized();
  }
}
