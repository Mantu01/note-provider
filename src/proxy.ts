import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";

const PUBLIC_ADMIN_PATHS = [
  "/api/admin/auth/login",
  "/api/admin/auth/register",
  "/api/webhooks/razorpay"
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

function setSecurityHeaders(response: NextResponse): void {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.jsdelivr.net https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: res.cloudinary.com yt3.ggpht.com",
      "connect-src 'self' https://api.razorpay.com https://eapi.razorpay.com",
      "frame-src https://checkout.razorpay.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );
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

  const response = await hasValidSession(request) ? NextResponse.next() : isApiRoute ? unauthorizedJson() : NextResponse.redirect(new URL("/", request.url));

  setSecurityHeaders(response);

  return response;
}

export const middleware = proxy;
export default proxy;

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
