"use client";

import { parseAsBoolean, useQueryStates } from "nuqs";
import Link from "next/link";
import { ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { FulfillmentDialog } from "@/features/admin/components/orders/fulfillment-dialog";
import { useAdminOrder } from "@/features/admin/api/use-admin-orders";
import { formatDateTime } from "@/lib/format";
import { toast } from "sonner";

export function OrderDetailView({ id }: { id: string }) {
  const { data: order, isLoading, isError } = useAdminOrder(id);
  const [{ edit: fulfillmentOpen }, setParams] = useQueryStates({
    edit: parseAsBoolean.withDefault(false),
  });

  const setFulfillmentOpen = (open: boolean) => setParams({ edit: open });

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-card" />;
  }

  if (isError || !order) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-destructive font-semibold">Order not found.</p>
        <Button render={<Link href="/admin/orders" />}>Back to Orders</Button>
      </div>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" render={<Link href="/admin/orders" />}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Order #{order.orderNumber}</h1>
              <StatusBadge status={order.paymentStatus} type="payment" />
              <StatusBadge status={order.fulfillmentStatus} type="fulfillment" />
            </div>
            <p className="text-sm text-muted-foreground">Submitted on {formatDateTime(order.createdAt)}</p>
          </div>
        </div>
        <Button onClick={() => setFulfillmentOpen(true)}>
          Update Fulfillment Status
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Item Purchased</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-foreground text-lg">{order.itemTitle}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Item Type: {order.itemType}
                  </p>
                </div>
                <span className="text-xl font-bold text-primary">{order.amountLabel}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Buyer Delivery Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Full Name</p>
                  <p className="font-medium text-foreground">{order.buyerFull?.fullName || order.buyer?.fullName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Social Platform</p>
                  <p className="font-medium text-primary capitalize">{order.buyerFull?.socialPlatform}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Social Handle / Delivery Target</p>
                <div className="mt-1 flex items-center gap-2">
                  <code className="rounded bg-muted px-2.5 py-1 text-sm font-mono font-bold text-foreground">
                    {order.buyerFull?.socialHandle}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(order.buyerFull?.socialHandle || "", "handle")}
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Razorpay Order ID</span>
                <p className="font-mono text-xs text-foreground mt-0.5">{order.razorpayOrderId}</p>
              </div>
              {order.razorpayPaymentId && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Payment ID</span>
                  <p className="font-mono text-xs text-foreground mt-0.5">{order.razorpayPaymentId}</p>
                </div>
              )}
              {order.paymentMethod && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Method</span>
                  <p className="font-medium text-foreground uppercase mt-0.5">{order.paymentMethod}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {order.adminNote && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Internal Admin Note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground italic bg-muted/30 p-3 rounded-xl border border-border">
                  &quot;{order.adminNote}&quot;
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <FulfillmentDialog
        open={fulfillmentOpen}
        onOpenChange={setFulfillmentOpen}
        order={order}
      />
    </div>
  );
}
