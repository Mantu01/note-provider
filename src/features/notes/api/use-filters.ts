"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { FiltersResponse } from "@/lib/types";

export function useFilters() {
  return useQuery({ queryKey: queryKeys.filters, queryFn: () => apiClient<FiltersResponse>("/filters") });
}
