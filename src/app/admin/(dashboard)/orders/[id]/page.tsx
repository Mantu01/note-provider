"use client";


import { Suspense } from "react";
import { use } from "react";
import { OrderDetailView } from "@/components/admin/orders/order-detail-view";

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
