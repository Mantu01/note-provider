"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CheckoutPage } from "@/features/checkout/components/checkout-page";

function CheckoutContent() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();

  return (
    <CheckoutPage
      slug={params.slug}
      itemType={searchParams.get("itemType") === "group" ? "group" : "note"}
    />
  );
}

export default function CheckoutRoute() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="h-96 animate-pulse rounded-3xl bg-muted" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
