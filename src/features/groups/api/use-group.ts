"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { GroupDetailResponse } from "@/lib/types";

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
