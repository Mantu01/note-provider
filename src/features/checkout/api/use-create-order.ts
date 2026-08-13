"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CheckoutOrderResponse, PurchaseItemType, SocialPlatform } from "@/lib/types";

export type CreateOrderInput = { itemType: PurchaseItemType; itemSlug: string; fullName: string; socialPlatform: SocialPlatform; socialHandle: string; consentAccepted: true };

export function useCreateOrder() {
  return useMutation({ mutationFn: (input: CreateOrderInput) => apiClient<CheckoutOrderResponse>("/orders", { method: "POST", body: JSON.stringify(input) }) });
}
