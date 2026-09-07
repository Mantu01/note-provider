"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, buildQueryString } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type {
  AdminAuthResponse,
  AdminCategory,
  AdminGroup,
  AdminLead,
  AdminNote,
  AdminOrder,
  AdminProfile,
  DashboardStats,
  PaginatedData,
  UploadKind,
  UploadResponse,
} from "@/lib/types";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/lib/schemas/category.schema";
import type { CreateGroupInput, UpdateGroupInput } from "@/lib/schemas/group.schema";
import type { CreateNoteInput, UpdateNoteInput } from "@/lib/schemas/note.schema";
import type { UpdateOrderPayload } from "@/lib/schemas/admin.schema";
import { toast } from "sonner";

// ─── auth ─────────────────────────────────────────────────────────────────────

export function useAdminProfile() {
  return useQuery({ queryKey: queryKeys.admin.me, queryFn: () => apiClient<AdminProfile>("/admin/auth/me") });
}

export function useAdminLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiClient<AdminAuthResponse>("/admin/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.me });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
  });
}

export function useAdminLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient("/admin/auth/logout", { method: "POST" }),
    onSuccess: () => {
      qc.clear();
    },
  });
}

// ─── dashboard ────────────────────────────────────────────────────────────────

export function useDashboard() {
  return useQuery({ queryKey: queryKeys.admin.dashboard, queryFn: () => apiClient<DashboardStats>("/admin/dashboard") });
}

// ─── categories ───────────────────────────────────────────────────────────────

export function useAdminCategories() {
  return useQuery({
    queryKey: queryKeys.admin.categories,
    queryFn: () => apiClient<{ items: AdminCategory[] }>("/admin/categories"),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryInput) =>
      apiClient<AdminCategory>("/admin/categories", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: (cat) => {
      toast.success(`Created category "${cat.name}"`);
      qc.invalidateQueries({ queryKey: queryKeys.admin.categories });
      qc.invalidateQueries({ queryKey: queryKeys.categories });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to create category"),
  });
}

export function useUpdateCategory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCategoryInput) =>
      apiClient<AdminCategory>(`/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: (cat) => {
      toast.success(`Updated category "${cat.name}"`);
      qc.invalidateQueries({ queryKey: queryKeys.admin.categories });
      qc.invalidateQueries({ queryKey: queryKeys.categories });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to update category"),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
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
        qc.invalidateQueries({ queryKey: queryKeys.admin.categories });
        qc.invalidateQueries({ queryKey: queryKeys.categories });
      }
    },
    onError: (error: Error) => toast.error(error.message || "Failed to delete category"),
  });
}

// ─── groups ───────────────────────────────────────────────────────────────────

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
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGroupInput) =>
      apiClient<AdminGroup>("/admin/groups", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: (group) => {
      toast.success(`Created bundle "${group.name}"`);
      qc.invalidateQueries({ queryKey: queryKeys.admin.groups.all });
      qc.invalidateQueries({ queryKey: queryKeys.groups.all });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to create bundle"),
  });
}

export function useUpdateGroup(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGroupInput) =>
      apiClient<AdminGroup>(`/admin/groups/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: (group) => {
      toast.success(`Updated bundle "${group.name}"`);
      qc.invalidateQueries({ queryKey: queryKeys.admin.groups.all });
      qc.invalidateQueries({ queryKey: queryKeys.admin.groups.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.groups.all });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to update bundle"),
  });
}

export function useDeleteGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient<{ deleted: true }>(`/admin/groups/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Deleted bundle");
      qc.invalidateQueries({ queryKey: queryKeys.admin.groups.all });
      qc.invalidateQueries({ queryKey: queryKeys.groups.all });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to delete bundle"),
  });
}

// ─── notes ────────────────────────────────────────────────────────────────────

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
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNoteInput) =>
      apiClient<AdminNote>("/admin/notes", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: (note) => {
      toast.success(`Created note "${note.title}"`);
      qc.invalidateQueries({ queryKey: queryKeys.admin.notes.all });
      qc.invalidateQueries({ queryKey: queryKeys.notes.all });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to create note"),
  });
}

export function useUpdateNote(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateNoteInput) =>
      apiClient<AdminNote>(`/admin/notes/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: (note) => {
      toast.success(`Updated note "${note.title}"`);
      qc.invalidateQueries({ queryKey: queryKeys.admin.notes.all });
      qc.invalidateQueries({ queryKey: queryKeys.admin.notes.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.notes.all });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to update note"),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient<{ deleted: true }>(`/admin/notes/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Deleted note");
      qc.invalidateQueries({ queryKey: queryKeys.admin.notes.all });
      qc.invalidateQueries({ queryKey: queryKeys.admin.groups.all });
      qc.invalidateQueries({ queryKey: queryKeys.notes.all });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to delete note"),
  });
}

// ─── orders ───────────────────────────────────────────────────────────────────

export function useAdminOrders(params: {
  page?: number;
  limit?: number;
  q?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  itemType?: string;
  from?: string;
  to?: string;
  sort?: string;
} = {}) {
  return useQuery({
    queryKey: queryKeys.admin.orders.list(params),
    queryFn: () => apiClient<PaginatedData<AdminOrder>>(`/admin/orders${buildQueryString(params)}`),
  });
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.orders.detail(id),
    queryFn: () => apiClient<AdminOrder>(`/admin/orders/${id}`),
    enabled: Boolean(id),
  });
}

export function useUpdateOrderFulfillment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateOrderPayload) =>
      apiClient<AdminOrder>(`/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: (order) => {
      toast.success(`Updated order #${order.orderNumber}`);
      qc.invalidateQueries({ queryKey: queryKeys.admin.orders.all });
      qc.invalidateQueries({ queryKey: queryKeys.admin.orders.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to update order"),
  });
}

// ─── leads ────────────────────────────────────────────────────────────────────

export function useAdminLeads(params: {
  page?: number;
  limit?: number;
  q?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  from?: string;
  to?: string;
} = {}) {
  return useQuery({
    queryKey: queryKeys.admin.leads(params),
    queryFn: () => apiClient<PaginatedData<AdminLead>>(`/admin/leads${buildQueryString(params)}`),
    staleTime: 1000 * 60 * 2,
  });
}

// ─── uploads ──────────────────────────────────────────────────────────────────

export function useFileUpload() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, kind }: { file: File; kind: UploadKind }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", kind);
      return apiClient<UploadResponse>("/admin/uploads", { method: "POST", body: formData });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.notes.all });
    },
    onError: (error: Error) => toast.error(error.message || "File upload failed"),
  });
}

export function useDeleteUpload() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ publicId, resourceType }: { publicId: string; resourceType: "raw" | "image" }) =>
      apiClient<{ deleted: true }>("/admin/uploads", {
        method: "DELETE",
        body: JSON.stringify({ publicId, resourceType }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.notes.all });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to remove file"),
  });
}
