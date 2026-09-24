"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { CopyButton } from "@/components/shared/copy-button";
import { AdminOrderDetailSkeleton } from "@/components/shared/shimmer-loader";
import { useAdminOrder } from "@/hooks/useAdmin";
import { formatDateTime } from "@/lib/format";

export function OrderDetailView({ id }: { id: string }) {
  const { data: order, isLoading, isError } = useAdminOrder(id);

  if (isLoading) return <AdminOrderDetailSkeleton />;
  if (isError || !order)
    return (
      <div className="space-y-4 p-8 text-center">
        <p className="font-semibold text-destructive">Order not found.</p>
        <Button render={<Link href="/admin/orders" />}>Back to Orders</Button>
      </div>
    );

  const publicUrl = order.itemType === "group" ? `/groups/${order.itemSlug}` : `/notes/${order.itemSlug}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            render={<Link href="/admin/orders" />}
            aria-label="Back to orders list"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Order #{order.orderNumber}</h1>
              <StatusBadge status={order.paymentStatus} type="payment" />
              {order.isDownloaded && (
                <StatusBadge status="downloaded" className="border-accent bg-accent/10 text-accent-foreground" />
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Placed on {formatDateTime(order.createdAt)}</p>
          </div>
        </div>
        <Button variant="outline" render={<a href={publicUrl} target="_blank" rel="noopener noreferrer" />}>
          <ExternalLink aria-hidden="true" className="mr-2 size-4" />
          {order.itemType === "group" ? "Open Bundle" : "Open Note"}
        </Button>
      </div>

      {order.coverImageUrl && (
        <div className="max-w-md overflow-hidden rounded-xl border border-border bg-muted/20 shadow-sm">
          <Image
            src={order.coverImageUrl}
            alt={`Cover for ${order.itemTitle}`}
            width={448}
            height={252}
            sizes="448px"
            className="h-48 w-full object-cover"
          />
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-foreground">{order.itemTitle}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                    Type: {order.itemType} · ID: <span className="font-mono">{order.item.id}</span>
                  </p>
                </div>
                <span className="shrink-0 text-xl font-bold text-primary">{order.amountLabel}</span>
              </div>
              <div className="my-3 h-px bg-border/60" />
              <div className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Buyer Name</p>
                  <p className="mt-0.5 font-medium text-foreground">{order.buyerFull.fullName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Terms Consent</p>
                  <p className="mt-0.5 font-medium text-foreground">
                    {order.buyerFull.consentAccepted ? "Accepted" : "Not accepted"}
                  </p>
                </div>
                {order.buyerFull.ipAddress && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">IP Address</p>
                    <p className="mt-0.5 font-mono text-xs text-foreground">{order.buyerFull.ipAddress}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Device</p>
                  <p className="mt-0.5 break-all font-mono text-xs text-foreground">
                    {order.buyerFull.userAgent ?? "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <dl>
                {[
                  { label: "Razorpay Order ID", value: order.razorpayOrderId },
                  { label: "Razorpay Payment ID", value: order.razorpayPaymentId },
                  { label: "Payment Method", value: order.paymentMethod },
                  { label: "Amount", value: order.amountLabel },
                  { label: "Currency", value: order.currency },
                  { label: "Failure Reason", value: order.failureReason },
                ]
                  .filter((row) => row.value)
                  .map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-4 border-b border-border/40 py-2 last:border-0">
                      <dt className="shrink-0 text-muted-foreground">{label}</dt>
                      <dd className="max-w-[60%] truncate text-right font-mono text-xs">{value}</dd>
                    </div>
                  ))}
              </dl>
              <div className="my-2 h-px bg-border/60" />
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                {[
                  { label: "Created At", value: formatDateTime(order.createdAt) },
                  { label: "Paid At", value: order.paidAt ? formatDateTime(order.paidAt) : "—" },
                  { label: "Updated At", value: formatDateTime(order.updatedAt) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
                    <p className="mt-0.5 text-xs text-foreground">{value}</p>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-20 rounded-2xl border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Order Number</p>
                <div className="mt-1 flex items-center gap-2">
                  <code className="rounded-lg bg-muted px-2 py-1 font-mono text-xs font-semibold">
                    {order.orderNumber}
                  </code>
                  <CopyButton value={order.orderNumber} label="Copy order number" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Order ID</p>
                <code className="mt-0.5 block break-all font-mono text-xs text-muted-foreground">{order.id}</code>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Download Status</p>
                <p className="mt-0.5 text-sm font-medium">
                  {order.isDownloaded ? "Downloaded" : "Not yet downloaded"}
                </p>
              </div>
              {order.item.noteIds.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Notes in Bundle</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {order.item.noteIds.length} note{order.item.noteIds.length === 1 ? "" : "s"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
