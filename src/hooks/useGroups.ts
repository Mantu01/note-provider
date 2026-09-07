"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient, buildQueryString } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { GroupDetailResponse, GroupsQuery, PaginatedData, PublicGroup } from "@/lib/types";
import { keepPreviousData } from "@tanstack/react-query";

export function useGroups(params: GroupsQuery = {}) {
  return useQuery({
    queryKey: queryKeys.groups.list(params),
    queryFn: () => apiClient<PaginatedData<PublicGroup>>(`/groups${buildQueryString(params)}`),
    placeholderData: keepPreviousData,
  });
}

export function useGroup(
  slug: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.groups.detail(slug),
    queryFn: () => apiClient<GroupDetailResponse>(`/groups/${slug}`),
    enabled: (options?.enabled ?? true) && Boolean(slug),
  });
}
