"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiClient, buildQueryString } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { GroupsQuery, PaginatedData, PublicGroup } from "@/lib/types";

export function useGroups(params: GroupsQuery = {}) {
  return useQuery({ queryKey: queryKeys.groups.list(params), queryFn: () => apiClient<PaginatedData<PublicGroup>>(`/groups${buildQueryString(params)}`), placeholderData: keepPreviousData });
}
