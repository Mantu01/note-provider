"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";

export type OrderLookupResponse = {
  orderId: string;
  orderNumber: string;
};

export function useOrderLookup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderNumber: string) =>
      apiClient<OrderLookupResponse>("/orders/lookup", {
        method: "POST",
        body: JSON.stringify({ orderNumber }),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.order(data.orderId) });
    },
  });
}
