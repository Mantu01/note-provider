"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export type OrderLookupResponse = {
  orderId: string;
  orderNumber: string;
};

export function useOrderLookup() {
  return useMutation({
    mutationFn: (orderNumber: string) =>
      apiClient<OrderLookupResponse>("/orders/lookup", {
        method: "POST",
        body: JSON.stringify({ orderNumber }),
      }),
  });
}
