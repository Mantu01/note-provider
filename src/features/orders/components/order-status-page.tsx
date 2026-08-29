"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, CircleAlert, Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/copy-button";
import { ErrorState } from "@/components/shared/error-state";
import { useOrder } from "@/features/orders/api/use-order";
import { useDownloadFile } from "@/hooks/use-download-file";
import { formatDateTime } from "@/lib/format";

export function OrderStatusPage({ orderId }: { orderId: string }) {
  const query = useOrder(orderId);
  const { download, isDownloading } = useDownloadFile();

  if (query.isPending) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground">Loading order…</p>
        </div>
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
        <div className="mx-auto size-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <h1 className="mt-5 text-xl font-bold tracking-tight">Confirming your payment…</h1>
        <p className="mt-2 text-sm text-muted-foreground">This usually takes a few seconds. Do not close this page.</p>
      </div>
    );
  }

  if (order.paymentStatus === "failed") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
          <CircleAlert aria-hidden="true" className="size-8 text-destructive" />
        </div>
        <h1 className="mt-5 text-xl font-bold tracking-tight">Payment failed</h1>
        <p className="mt-2 text-sm text-muted-foreground">No money was deducted, or your bank will process any reversal.</p>
        <Button render={<Link href={`/checkout/${order.itemSlug}${order.itemType === "group" ? "?itemType=group" : ""}`} />} className="mt-5 rounded-full">
          Try again
        </Button>
      </div>
    );
  }

  const isCompleted = order.fulfillmentStatus === "completed";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* Success header */}
      <div className="text-center space-y-3">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-success/10">
          <CheckCircle2 aria-hidden="true" className="size-8 text-success" />
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary">
            Payment received
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">
            <span className="brand-gradient-text">Payment successful</span>
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-mono font-semibold shadow-sm">
          <span>Order #{order.orderNumber}</span>
          <CopyButton value={order.orderNumber} label="Copy order number" />
        </div>
      </div>

      {/* Cover image */}
      {order.coverImageUrl && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border/50 bg-muted/20 shadow-md">
          <Image
            src={order.coverImageUrl}
            alt={`Cover for ${order.itemTitle}`}
            width={600}
            height={160}
            className="h-44 w-full object-cover"
          />
        </div>
      )}

      {/* Status card */}
      <Card className="mt-6 rounded-2xl border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              {isCompleted ? (
                <CheckCircle2 aria-hidden="true" className="size-5 text-primary" />
              ) : (
                <Lock aria-hidden="true" className="size-5 text-warning-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold">{isCompleted ? "Notes ready for download!" : "Order status: Pending Approval"}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {isCompleted
                  ? <>Your notes for <strong className="text-foreground">{order.itemTitle}</strong> are ready below.</>
                  : <>We&apos;ll review and send <strong className="text-foreground">{order.itemTitle}</strong> shortly.</>}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download section */}
      {isCompleted && (
        <Card className="mt-4 rounded-2xl border-success/20 bg-success/5 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-success/10">
                <Download aria-hidden="true" className="size-6 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">Download your notes</p>
                <p className="text-xs text-muted-foreground">Click below to get your PDF</p>
              </div>
              {order.itemType === "note" && (
                <Button
                  onClick={() => download({ url: `/api/notes/${order.itemSlug}/download?orderId=${order.id}`, filename: `${order.itemSlug}.pdf` })}
                  disabled={isDownloading}
                  size="sm"
                  className="rounded-full"
                >
                  {isDownloading ? "Preparing…" : "Download PDF"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Details grid */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Order details */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold">Order details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0">
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Order ID</dt>
                <dd className="font-mono font-semibold flex items-center gap-1.5">
                  <span>{order.orderNumber}</span>
                  <CopyButton value={order.orderNumber} />
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Item</dt>
                <dd className="font-semibold text-right max-w-[60%] truncate">{order.itemTitle}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Amount</dt>
                <dd className="font-bold">{order.amountLabel}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Placed</dt>
                <dd className="font-medium">{formatDateTime(order.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Paid</dt>
                <dd className="font-medium">{order.paidAt ? formatDateTime(order.paidAt) : "—"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Delivery timeline */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold">Delivery timeline</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ol className="space-y-3 text-xs">
              <li className="flex items-center justify-between">
                <span className="font-medium">Payment received</span>
                <CheckCircle2 aria-hidden="true" className="size-4 text-success shrink-0" />
              </li>
              {isCompleted ? (
                <>
                  <li className="flex items-center justify-between">
                    <span className="font-medium">Notes delivered</span>
                    <CheckCircle2 aria-hidden="true" className="size-4 text-success shrink-0" />
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-medium">Download now</span>
                    <Download aria-hidden="true" className="size-4 text-primary shrink-0" />
                  </li>
                </>
              ) : (
                <li className="flex items-center justify-between">
                  <span className="font-medium">Admin review & approval</span>
                  <div className="flex items-center gap-1.5">
                    <Lock aria-hidden="true" className="size-3 text-warning-foreground" />
                    <span className="text-[9px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Pending</span>
                  </div>
                </li>
              )}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button render={<Link href="/order/track" />} variant="outline" size="sm" className="rounded-full">
          Track another
        </Button>
        <Button render={<Link href="/notes" />} size="sm" className="rounded-full">
          Browse notes
        </Button>
        <Button render={<Link href="/contact" />} variant="outline" size="sm" className="rounded-full">
          Support
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => query.refetch()} className="rounded-full">
          Refresh
        </Button>
      </div>
    </div>
  );
}
