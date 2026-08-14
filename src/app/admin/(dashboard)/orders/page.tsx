"use client";

import { Suspense } from "react";
import { OrdersTable } from "@/features/admin/components/orders/orders-table";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders & Fulfillment</h1>
      </div>
      <Suspense fallback={null}><OrdersTable /></Suspense>
    </div>
  );
}
