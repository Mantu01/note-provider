"use client";

import { useParams, useSearchParams } from "next/navigation";
import { CheckoutPage } from "@/components/checkout/checkout-page";

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
