"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { CheckoutOrderResponse, PurchaseItemType } from "@/lib/types";
import type { CreateOrderPayload } from "@/schemas/checkout.schema";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderPayload) =>
      apiClient<CheckoutOrderResponse>("/orders", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.home });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to create order"),
  });
}
