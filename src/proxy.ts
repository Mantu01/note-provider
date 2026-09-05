import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";

const PUBLIC_ADMIN_PATHS = [
  "/api/admin/auth/login",
  "/api/admin/auth/register",
];

function unauthorizedJson(): NextResponse {
  const res = NextResponse.json(
    {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Your session has expired. Please log in again.",
      },
    },
    { status: 401 },
  );
  res.cookies.delete(ADMIN_SESSION_COOKIE);
  return res;
}

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith("/api/admin");

  if (PUBLIC_ADMIN_PATHS.some((path) => pathname === path)) {
    return NextResponse.next();
  }

  if (await hasValidSession(request)) return NextResponse.next();

  if (isApiRoute) return unauthorizedJson();

  // There is no login page — admins authenticate by pasting the session token
  // (returned by the login/register APIs) into the browser as the session cookie.
  return NextResponse.redirect(new URL("/", request.url));
}

export const middleware = proxy;
export default proxy;

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
