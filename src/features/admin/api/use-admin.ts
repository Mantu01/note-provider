"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { AdminProfile, DashboardStats } from "@/lib/types";

export function useAdminProfile() {
  return useQuery({ queryKey: queryKeys.admin.me, queryFn: () => apiClient<AdminProfile>("/admin/auth/me") });
}

export function useDashboard() {
  return useQuery({ queryKey: queryKeys.admin.dashboard, queryFn: () => apiClient<DashboardStats>("/admin/dashboard") });
}

export function useAdminLogin() {
  return useMutation({ mutationFn: ({ email, password }: { email: string; password: string }) => apiClient<AdminProfile>("/admin/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }) });
}

export function useAdminLogout() {
  return useMutation({
    mutationFn: () => apiClient("/admin/auth/logout", { method: "POST" }),
  });
}
