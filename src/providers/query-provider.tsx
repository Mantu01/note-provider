"use client";

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    const queryCache = new QueryCache({
      onError: (error) => {
        if (error instanceof ApiError && error.code === "UNAUTHORIZED") {
          toast.error("Your session expired. Please log in again.");
          document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          queryCache.clear();
          if (typeof window !== "undefined" && window.location.pathname !== "/admin/login") {
            window.location.assign("/admin/login");
          }
        }
      },
    });
    return new QueryClient({
      queryCache,
      defaultOptions: {
        queries: {
          staleTime: 60_000,
          gcTime: 300_000,
          refetchOnWindowFocus: false,
          retry: (failureCount, error) => !(error instanceof ApiError && error.status >= 400 && error.status < 500) && failureCount < 2,
        },
        mutations: { onError: (error) => toast.error(getErrorMessage(error)) },
      },
    });
  }, []);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
