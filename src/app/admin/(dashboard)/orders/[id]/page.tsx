"use client";

import { Suspense, use } from "react";
import { OrderDetailView } from "@/components/admin/orders/order-detail-view";

export default function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <Suspense fallback={null}>
      <OrderDetailView id={id} />
    </Suspense>
  );
}
