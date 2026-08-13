"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient, buildQueryString } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { AdminLead, PaginatedData } from "@/lib/types";

export function useAdminLeads(params: {
  page?: number;
  limit?: number;
  q?: string;
  socialPlatform?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  from?: string;
  to?: string;
} = {}) {
  return useQuery({
    queryKey: queryKeys.admin.leads(params),
    queryFn: () => apiClient<PaginatedData<AdminLead>>(`/admin/leads${buildQueryString(params)}`),
  });
}
