"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import type { AdminOrder } from "@/lib/types";

export function RecentOrders({ orders }: { orders: AdminOrder[] }) {
  return (
    <Card className="rounded-2xl border border-border">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-base font-bold">Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" render={<Link href="/admin/orders" />}>
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="-mx-2 flex items-center justify-between gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-semibold text-foreground">
                      {order.orderNumber}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {order.buyer?.fullName || "Unknown buyer"} · {order.itemTitle}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2.5">
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {order.amountLabel}
                    </span>
                    <StatusBadge status={order.paymentStatus} type="payment" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
