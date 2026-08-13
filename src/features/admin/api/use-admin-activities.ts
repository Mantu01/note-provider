"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient, buildQueryString } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { AdminActivity, PaginatedData } from "@/lib/types";

export function useAdminActivities(params: {
  page?: number;
  limit?: number;
  adminId?: string;
  action?: string;
  targetType?: string;
  q?: string;
  from?: string;
  to?: string;
} = {}) {
  return useQuery({
    queryKey: queryKeys.admin.activities(params),
    queryFn: () => apiClient<PaginatedData<AdminActivity>>(`/admin/activities${buildQueryString(params)}`),
  });
}
