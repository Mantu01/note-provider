"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { AdminProfile } from "@/lib/types";

export function useAdminProfile() {
  return useQuery({ queryKey: queryKeys.admin.me, queryFn: () => apiClient<AdminProfile>("/admin/auth/me") });
}

export function useAdminLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => apiClient<AdminProfile>("/admin/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
  });
}

export function useAdminLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient("/admin/auth/logout", { method: "POST" }),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
