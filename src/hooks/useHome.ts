"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { HomeResponse } from "@/lib/types";

export function useHome() {
  return useQuery({ queryKey: queryKeys.home, queryFn: () => apiClient<HomeResponse>("/home") });
}
