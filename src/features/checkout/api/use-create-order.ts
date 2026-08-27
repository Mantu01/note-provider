import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { CheckoutOrderResponse, PurchaseItemType } from "@/lib/types";

export type CreateOrderInput = { itemType: PurchaseItemType; itemSlug: string; fullName: string; consentAccepted: true };

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => apiClient<CheckoutOrderResponse>("/orders", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.home });
    },
  });
}
