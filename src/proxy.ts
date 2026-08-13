import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";

const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
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
  const { pathname, search } = request.nextUrl;
  const isApiRoute = pathname.startsWith("/api/admin");

  if (PUBLIC_ADMIN_PATHS.some((path) => pathname === path)) {
    if (pathname === "/admin/login" && (await hasValidSession(request))) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (await hasValidSession(request)) return NextResponse.next();

  if (isApiRoute) return unauthorizedJson();

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const middleware = proxy;
export default proxy;

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
