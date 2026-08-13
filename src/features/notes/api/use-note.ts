"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { NoteDetailResponse } from "@/lib/types";

export function useNote(
  slug: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.notes.detail(slug),
    queryFn: () => apiClient<NoteDetailResponse>(`/notes/${slug}`),
    enabled: (options?.enabled ?? true) && Boolean(slug),
  });
}
