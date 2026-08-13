"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider><QueryProvider><NuqsAdapter>{children}</NuqsAdapter><Toaster richColors closeButton position="top-right" /></QueryProvider></ThemeProvider>;
}
