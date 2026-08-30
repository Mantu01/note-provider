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
    queryFn: async () => {
      const qs = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) qs.set(key, String(value));
      }
      const url = `/admin/activities${qs.toString() ? `?${qs.toString()}` : ""}`;
      return apiClient<PaginatedData<AdminActivity>>(url);
    },
    staleTime: 1000 * 60 * 2,
  });
}
