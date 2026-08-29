"use client";

import { useParams, useSearchParams } from "next/navigation";
import { CheckoutPage } from "@/features/checkout/components/checkout-page";

export default function CheckoutContent() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();

  return (
    <CheckoutPage
      slug={params.slug}
      itemType={searchParams.get("itemType") === "group" ? "group" : "note"}
    />
  );
}
