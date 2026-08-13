"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiClient, buildQueryString } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { NotesQuery, PaginatedData, PublicNote } from "@/lib/types";

export function useNotes(params: NotesQuery) {
  return useQuery({ queryKey: queryKeys.notes.list(params), queryFn: () => apiClient<PaginatedData<PublicNote>>(`/notes${buildQueryString(params)}`), placeholderData: keepPreviousData });
}
