"use client";

import Link from "next/link";
import { CheckCircle2, CircleAlert, Clock3, Mail, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/copy-button";
import { ErrorState } from "@/components/shared/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { useOrder } from "@/features/orders/api/use-order";
import { formatDateTime } from "@/lib/format";

export function OrderStatusPage({ orderId }: { orderId: string }) {
  const query = useOrder(orderId);

  if (query.isPending) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Clock3 aria-label="Loading order status" className="size-9 animate-spin text-primary" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <ErrorState message="We could not load this order." onRetry={() => query.refetch()} />
      </div>
    );
  }

  const order = query.data;

  if (order.paymentStatus === "created") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <Clock3 aria-hidden="true" className="mx-auto size-12 animate-spin text-primary" />
        <h1 className="mt-6 text-3xl font-bold">Confirming your payment…</h1>
        <p className="mt-3 text-muted-foreground">This usually takes a few seconds. Do not close this page.</p>
      </div>
    );
  }

  if (order.paymentStatus === "failed") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <CircleAlert aria-hidden="true" className="mx-auto size-12 text-destructive" />
        <h1 className="mt-6 text-3xl font-bold">Payment failed</h1>
        <p className="mt-3 text-muted-foreground">No money was deducted, or your bank will process any reversal.</p>
        <Button
          render={
            <Link
              href={`/checkout/${order.itemSlug}${order.itemType === "group" ? "?itemType=group" : ""}`}
            />
          }
          className="mt-6"
        >
          Try again
        </Button>
      </div>
    );
  }

  const isCompleted = order.fulfillmentStatus === "completed";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <CheckCircle2 aria-hidden="true" className="mx-auto size-14 text-success" />
        <p className="mt-5 text-sm font-semibold tracking-wide text-primary uppercase">
          Payment received
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          <span className="brand-gradient-text">Payment successful</span>
        </h1>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium shadow-sm">
          <span>Order #{order.orderNumber}</span>
          <CopyButton value={order.orderNumber} label="Copy order number" />
        </div>
      </div>

      <Card className="mt-8 rounded-3xl border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">
                {isCompleted ? "Notes delivered!" : "Order status: Pending Approval"}
              </p>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {isCompleted ? (
                  <>Your notes for <strong className="text-foreground">{order.itemTitle}</strong> have been sent to <strong className="text-foreground">{order.buyer.socialHandleMasked}</strong>.</>
                ) : (
                  <>We&apos;ll review and send <strong className="text-foreground">{order.itemTitle}</strong> to <strong className="text-foreground">{order.buyer.socialHandleMasked}</strong> within 4–6 hours.</>
                )}
              </p>
            </div>
            <StatusBadge type="fulfillment" value={order.fulfillmentStatus} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Card className="rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Order details</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Order ID</dt>
                <dd className="font-mono text-right font-medium flex items-center gap-1">
                  <span>{order.orderNumber}</span>
                  <CopyButton value={order.orderNumber} />
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Item</dt>
                <dd className="text-right font-medium">{order.itemTitle}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Amount</dt>
                <dd className="font-medium">{order.amountLabel}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Placed</dt>
                <dd className="font-medium">{formatDateTime(order.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="font-medium">{order.buyer.socialHandleMasked}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Delivery timeline</h2>
            <ol className="space-y-4 text-sm">
              <li className="flex items-center justify-between">
                <span className="font-medium">Payment received</span>
                <CheckCircle2 aria-hidden="true" className="size-4 text-success shrink-0" />
              </li>
              <li className="flex items-center justify-between">
                <span className="font-medium">Admin review & approval</span>
                <StatusBadge type="fulfillment" value={order.fulfillmentStatus} />
              </li>
              <li className="flex items-center justify-between">
                <span className="font-medium">Delivered to handle</span>
                <span className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded">Within 4–6 hours</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button render={<Link href="/order/track" />} variant="outline">
          <Search aria-hidden="true" className="mr-2 size-4" />
          Track another order
        </Button>
        <Button render={<Link href="/notes" />}>Browse more notes</Button>
        <Button render={<Link href="/contact" />} variant="outline">
          <Mail aria-hidden="true" className="mr-2 size-4" />
          Contact support
        </Button>
        <Button type="button" variant="ghost" onClick={() => query.refetch()}>
          <RefreshCw aria-hidden="true" className="mr-2 size-4" />
          Refresh status
        </Button>
      </div>
    </div>
  );
}
