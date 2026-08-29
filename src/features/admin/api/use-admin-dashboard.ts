"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { DashboardStats } from "@/lib/types";

export function useDashboard() {
  return useQuery({ queryKey: queryKeys.admin.dashboard, queryFn: () => apiClient<DashboardStats>("/admin/dashboard") });
}
