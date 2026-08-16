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
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground">Loading order…</p>
        </div>
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <ErrorState message="We could not load this order." onRetry={() => query.refetch()} />
      </div>
    );
  }

  const order = query.data;

  if (order.paymentStatus === "created") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <h1 className="mt-4 text-xl font-bold">Confirming your payment…</h1>
        <p className="mt-1.5 text-xs text-muted-foreground">This usually takes a few seconds. Do not close this page.</p>
      </div>
    );
  }

  if (order.paymentStatus === "failed") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <CircleAlert aria-hidden="true" className="mx-auto size-8 text-destructive" />
        <h1 className="mt-4 text-xl font-bold">Payment failed</h1>
        <p className="mt-1.5 text-xs text-muted-foreground">No money was deducted, or your bank will process any reversal.</p>
        <Button
          render={
            <Link
              href={`/checkout/${order.itemSlug}${order.itemType === "group" ? "?itemType=group" : ""}`}
            />
          }
          className="mt-4"
        >
          Try again
        </Button>
      </div>
    );
  }

  const isCompleted = order.fulfillmentStatus === "completed";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 aria-hidden="true" className="size-6 text-success" />
        </div>
        <p className="mt-3 text-[10px] font-semibold tracking-wide text-primary uppercase">
          Payment received
        </p>
        <h1 className="mt-1 text-xl font-bold tracking-tight">
          <span className="brand-gradient-text">Payment successful</span>
        </h1>
        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-0.5 text-[10px] font-medium">
          <span>Order #{order.orderNumber}</span>
          <CopyButton value={order.orderNumber} label="Copy order number" />
        </div>
      </div>

      <Card className="mt-5 rounded-xl border-primary/20 bg-primary/5">
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold">
                {isCompleted ? "Notes delivered!" : "Order status: Pending Approval"}
              </p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
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

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <Card className="rounded-xl">
          <CardContent className="p-3 space-y-2.5">
            <h2 className="text-xs font-semibold border-b pb-1.5">Order details</h2>
            <dl className="space-y-1.5 text-[10px]">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Order ID</dt>
                <dd className="font-mono text-right font-medium flex items-center gap-1">
                  <span>{order.orderNumber}</span>
                  <CopyButton value={order.orderNumber} />
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Item</dt>
                <dd className="text-right font-medium">{order.itemTitle}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Amount</dt>
                <dd className="font-medium">{order.amountLabel}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Placed</dt>
                <dd className="font-medium">{formatDateTime(order.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="font-medium">{order.buyer.socialHandleMasked}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-3 space-y-2.5">
            <h2 className="text-xs font-semibold border-b pb-1.5">Delivery timeline</h2>
            <ol className="space-y-2.5 text-[10px]">
              <li className="flex items-center justify-between">
                <span className="font-medium">Payment received</span>
                <CheckCircle2 aria-hidden="true" className="size-3 text-success shrink-0" />
              </li>
              <li className="flex items-center justify-between">
                <span className="font-medium">Admin review & approval</span>
                <StatusBadge type="fulfillment" value={order.fulfillmentStatus} />
              </li>
              <li className="flex items-center justify-between">
                <span className="font-medium">Delivered to handle</span>
                <span className="text-muted-foreground text-[9px] bg-muted px-1.5 py-0.5 rounded">Within 4–6 hours</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Button render={<Link href="/order/track" />} variant="outline" size="sm">
          <Search aria-hidden="true" className="mr-1 size-3" />
          Track another
        </Button>
        <Button render={<Link href="/notes" />} size="sm">
          Browse notes
        </Button>
        <Button render={<Link href="/contact" />} variant="outline" size="sm">
          <Mail aria-hidden="true" className="mr-1 size-3" />
          Support
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => query.refetch()}>
          <RefreshCw aria-hidden="true" className="mr-1 size-3" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
