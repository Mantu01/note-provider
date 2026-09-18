"use client";

import { Suspense } from "react";
import { OrdersTable } from "@/components/admin/orders/orders-table";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">View and manage all customer orders.</p>
      </div>
      <Suspense fallback={null}>
        <OrdersTable />
      </Suspense>
    </div>
  );
}
