"use client";

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, type ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster, toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import { ThemeProvider } from "@/providers/theme-provider";

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    const queryCache = new QueryCache({
      onError: (error) => {
        if (error instanceof ApiError && error.code === "UNAUTHORIZED") {
          toast.error("Your session expired. Please log in again.");
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

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster richColors closeButton position="top-right" />
      </QueryProvider>
    </ThemeProvider>
  );
}
