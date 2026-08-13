"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { AdminCategory } from "@/lib/types";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/lib/schemas/category.schema";
import { toast } from "sonner";

export function useAdminCategories() {
  return useQuery({
    queryKey: queryKeys.admin.categories,
    queryFn: () => apiClient<{ items: AdminCategory[] }>("/admin/categories"),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryInput) =>
      apiClient<AdminCategory>("/admin/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (cat) => {
      toast.success(`Created category "${cat.name}"`);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category");
    },
  });
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCategoryInput) =>
      apiClient<AdminCategory>(`/admin/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (cat) => {
      toast.success(`Updated category "${cat.name}"`);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient<{ deleted?: true; refused?: true; conflictMessage?: string }>(`/admin/categories/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (res) => {
      if (res.refused) {
        toast.error(res.conflictMessage || "Category is in use and cannot be deleted");
      } else {
        toast.success("Deleted category");
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories });
        queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });
}
