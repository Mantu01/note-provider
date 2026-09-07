"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient, buildQueryString } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { FiltersResponse, NoteDetailResponse, NotesQuery, PaginatedData, PublicNote } from "@/lib/types";
import { keepPreviousData } from "@tanstack/react-query";

export function useFilters() {
  return useQuery({ queryKey: queryKeys.filters, queryFn: () => apiClient<FiltersResponse>("/filters") });
}

export function useNotes(params: NotesQuery) {
  return useQuery({
    queryKey: queryKeys.notes.list(params),
    queryFn: () => apiClient<PaginatedData<PublicNote>>(`/notes${buildQueryString(params)}`),
    placeholderData: keepPreviousData,
  });
}

export function useNote(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.notes.detail(slug),
    queryFn: () => apiClient<{ note: PublicNote; relatedNotes: PublicNote[]; groups: import("@/lib/types").PublicGroup[] }>(`/notes/${slug}`),
    enabled: (options?.enabled ?? true) && Boolean(slug),
  });
}
