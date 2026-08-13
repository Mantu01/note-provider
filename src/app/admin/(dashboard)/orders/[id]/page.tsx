"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { use } from "react";
import { OrderDetailView } from "@/features/admin/components/orders/order-detail-view";

function OrderDetailContent({ id }: { id: string }) {
  return <OrderDetailView id={id} />;
}

export default function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={null}>
      <OrderDetailContent id={id} />
    </Suspense>
  );
}
