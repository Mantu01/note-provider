"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, buildQueryString } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { AdminGroup, PaginatedData } from "@/lib/types";
import type { CreateGroupInput, UpdateGroupInput } from "@/lib/schemas/group.schema";
import { toast } from "sonner";

export function useAdminGroups(params: { page?: number; limit?: number; q?: string } = {}) {
  return useQuery({
    queryKey: queryKeys.admin.groups.list(params),
    queryFn: () => apiClient<PaginatedData<AdminGroup>>(`/admin/groups${buildQueryString(params)}`),
  });
}

export function useAdminGroup(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.groups.detail(id),
    queryFn: () => apiClient<AdminGroup>(`/admin/groups/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGroupInput) =>
      apiClient<AdminGroup>("/admin/groups", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (group) => {
      toast.success(`Created bundle "${group.name}"`);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.groups.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create bundle");
    },
  });
}

export function useUpdateGroup(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGroupInput) =>
      apiClient<AdminGroup>(`/admin/groups/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (group) => {
      toast.success(`Updated bundle "${group.name}"`);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.groups.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.groups.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update bundle");
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient<{ deleted: true }>(`/admin/groups/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Deleted bundle");
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.groups.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete bundle");
    },
  });
}
