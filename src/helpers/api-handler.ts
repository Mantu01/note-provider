import { NextResponse, type NextRequest } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { ZodError } from "zod";
import { fail } from "./api-response";
import { requireAdmin, type AdminSession } from "./auth-guard";
import { AppError, duplicateKeyToAppError, isDuplicateKeyError } from "./errors";

export type RouteContext<P extends Record<string, string> = Record<string, string>> = {
  req: NextRequest;
  params: P;
  searchParams: URLSearchParams;
  ip: string | null;
  userAgent: string | null;
};

export type AdminRouteContext<P extends Record<string, string> = Record<string, string>> =
  RouteContext<P> & { admin: AdminSession };

type NextRouteArgs<P> = { params: Promise<P> } | undefined;

export function getClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return req.headers.get("x-real-ip");
}

export function parseZodError(err: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "form";
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}

function toAppError(error: unknown, defaultMessage = "Invalid input"): AppError {
  unstable_rethrow(error);

  if (error instanceof AppError) return error;

  if (error instanceof ZodError) {
    const fields = parseZodError(error);
    const firstMessage = error.issues[0]?.message ?? defaultMessage;
    return AppError.validation(fields, firstMessage);
  }

  if (isDuplicateKeyError(error)) return duplicateKeyToAppError(error);

  console.error("[api] error", error);
  return AppError.internal();
}

export function handler<P extends Record<string, string> = Record<string, string>>(
  fn: (ctx: RouteContext<P>) => Promise<NextResponse>,
  defaultMessage = "Invalid input",
) {
  return async (req: NextRequest, args: NextRouteArgs<P>): Promise<NextResponse> => {
    try {
      return await fn(await buildContext(req, args));
    } catch (error) {
      return fail(toAppError(error, defaultMessage));
    }
  };
}

export function adminHandler<P extends Record<string, string> = Record<string, string>>(
  fn: (ctx: AdminRouteContext<P>) => Promise<NextResponse>,
  defaultMessage = "Invalid input",
) {
  return async (req: NextRequest, args: NextRouteArgs<P>): Promise<NextResponse> => {
    try {
      const ctx = await buildContext<P>(req, args);
      const admin = await requireAdmin();
      return await fn({ ...ctx, admin });
    } catch (error) {
      return fail(toAppError(error, defaultMessage));
    }
  };
}

async function buildContext<P extends Record<string, string>>(
  req: NextRequest,
  args: NextRouteArgs<P>,
): Promise<RouteContext<P>> {
  const params = args?.params ? await args.params : ({} as P);
  return {
    req,
    params,
    searchParams: req.nextUrl.searchParams,
    ip: getClientIp(req),
    userAgent: req.headers.get("user-agent"),
  };
}
