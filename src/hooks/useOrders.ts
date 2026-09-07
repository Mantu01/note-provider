"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { PublicOrder } from "@/lib/types";

export type OrderLookupResponse = {
  orderId: string;
  orderNumber: string;
};

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: () => apiClient<PublicOrder>(`/orders/${orderId}`),
    refetchInterval: (query) => {
      const isCreated = query.state.data?.paymentStatus === "created";
      const updateCount = query.state.dataUpdateCount;
      if (isCreated && updateCount < 60) return 4000;
      return false;
    },
  });
}

export function useOrderLookup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderNumber: string) =>
      apiClient<OrderLookupResponse>("/orders/lookup", {
        method: "POST",
        body: JSON.stringify({ orderNumber }),
      }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.order(data.orderId) });
    },
  });
}
