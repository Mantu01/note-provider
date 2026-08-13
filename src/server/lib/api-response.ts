import { NextResponse } from "next/server";
import type { ApiFailure, ApiSuccess, PaginatedData, Pagination } from "@/lib/types";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";
import { AppError } from "./errors";

export function ok<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function okPaginated<T>(
  items: T[],
  pagination: Pagination,
  status = 200,
): NextResponse<ApiSuccess<PaginatedData<T>>> {
  return NextResponse.json({ success: true, data: { items, pagination } }, { status });
}

export function fail(error: AppError): NextResponse<ApiFailure> {
  const body: ApiFailure = {
    success: false as false,
    error: {
      code: error.code,
      message: error.message,
      ...(error.fields ? { fields: error.fields } : {}),
    },
  };

  const response = NextResponse.json(body, { status: error.status });

  if (error.code === "UNAUTHORIZED" || error.status === 401) {
    response.cookies.delete(ADMIN_SESSION_COOKIE);
  }

  return response;
}

