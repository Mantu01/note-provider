import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";
import { connectDb } from "../db/connect";
import { fail } from "./api-response";
import { requireAdmin, requireHeadAdmin, type AdminSession } from "./auth-guard";
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

function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fields[key]) fields[key] = issue.message;
    }
    const firstMessage = error.issues[0]?.message ?? "Please check the highlighted fields";
    return AppError.validation(fields, firstMessage);
  }

  if (isDuplicateKeyError(error)) return duplicateKeyToAppError(error);

  console.error("[api] error", error);
  return AppError.internal();
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

export function handler<P extends Record<string, string> = Record<string, string>>(
  fn: (ctx: RouteContext<P>) => Promise<NextResponse>,
) {
  return async (req: NextRequest, args: NextRouteArgs<P>): Promise<NextResponse> => {
    try {
      await connectDb();
      return await fn(await buildContext(req, args));
    } catch (error) {
      return fail(toAppError(error));
    }
  };
}

export function adminHandler<P extends Record<string, string> = Record<string, string>>(
  fn: (ctx: AdminRouteContext<P>) => Promise<NextResponse>,
) {
  return async (req: NextRequest, args: NextRouteArgs<P>): Promise<NextResponse> => {
    try {
      await connectDb();
      const ctx = await buildContext<P>(req, args);
      const admin = await requireAdmin();
      return await fn({ ...ctx, admin });
    } catch (error) {
      return fail(toAppError(error));
    }
  };
}

export function headAdminHandler<P extends Record<string, string> = Record<string, string>>(
  fn: (ctx: AdminRouteContext<P>) => Promise<NextResponse>,
) {
  return async (req: NextRequest, args: NextRouteArgs<P>): Promise<NextResponse> => {
    try {
      await connectDb();
      const ctx = await buildContext<P>(req, args);
      const admin = await requireHeadAdmin();
      return await fn({ ...ctx, admin });
    } catch (error) {
      return fail(toAppError(error));
    }
  };
}
