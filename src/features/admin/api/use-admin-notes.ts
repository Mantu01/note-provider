"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, buildQueryString } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { AdminNote, PaginatedData } from "@/lib/types";
import type { CreateNoteInput, UpdateNoteInput } from "@/lib/schemas/note.schema";
import { toast } from "sonner";

export function useAdminNotes(params: { page?: number; limit?: number; q?: string } = {}) {
  return useQuery({
    queryKey: queryKeys.admin.notes.list(params),
    queryFn: () => apiClient<PaginatedData<AdminNote>>(`/admin/notes${buildQueryString(params)}`),
  });
}

export function useAdminNote(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.notes.detail(id),
    queryFn: () => apiClient<AdminNote>(`/admin/notes/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNoteInput) =>
      apiClient<AdminNote>("/admin/notes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (note) => {
      toast.success(`Created note "${note.title}"`);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.notes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create note");
    },
  });
}

export function useUpdateNote(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateNoteInput) =>
      apiClient<AdminNote>(`/admin/notes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (note) => {
      toast.success(`Updated note "${note.title}"`);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.notes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.notes.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update note");
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient<{ deleted: true }>(`/admin/notes/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Deleted note");
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.notes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.groups.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete note");
    },
  });
}
