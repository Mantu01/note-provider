import type { ApiResult, ErrorCode } from "@/lib/types";

export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status: number,
    public readonly fields?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiClient<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`/api${path}`, { ...init, headers, credentials: "include" });
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new ApiError("INTERNAL_ERROR", `Request failed with status ${response.status}`, response.status);
  }
  if (!response.ok) {
    const payload = (await response.json()) as ApiResult<T>;
    if ("error" in payload && payload.error) {
      throw new ApiError(payload.error.code, payload.error.message, response.status, payload.error.fields);
    }
    throw new ApiError("INTERNAL_ERROR", `Request failed with status ${response.status}`, response.status);
  }
  const payload = (await response.json()) as ApiResult<T>;
  if (payload.success) return payload.data;
  if (response.ok) {
    throw new ApiError("INTERNAL_ERROR", payload.error?.message ?? "Unknown error", response.status, payload.error?.fields);
  }
  throw new ApiError(payload.error.code, payload.error.message, response.status, payload.error.fields);
}

export function buildQueryString(params: Record<string, string | number | boolean | readonly string[] | null | undefined>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      value.filter(Boolean).forEach((entry) => searchParams.append(key, entry));
    } else {
      searchParams.set(key, String(value));
    }
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
