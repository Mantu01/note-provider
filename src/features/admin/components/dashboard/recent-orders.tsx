"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import type { AdminOrder } from "@/lib/types";

export function RecentOrders({ orders }: { orders: AdminOrder[] }) {
  return (
    <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold">Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" render={<Link href="/admin/orders" />}>
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">No recent orders yet.</p>
          ) : (
            orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-foreground">#{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{order.buyer?.fullName} ({order.itemTitle})</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{order.amountLabel}</span>
                  <StatusBadge status={order.paymentStatus} type="payment" />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
