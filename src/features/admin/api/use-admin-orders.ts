"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, buildQueryString } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { AdminOrder, PaginatedData } from "@/lib/types";
import type { UpdateOrderPayload } from "@/lib/schemas/admin.schema";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateOrderPayload) =>
      apiClient<AdminOrder>(`/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (order) => {
      toast.success(`Updated order #${order.orderNumber}`);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order");
    },
  });
}
