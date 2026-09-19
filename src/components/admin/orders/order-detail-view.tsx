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
  if (isError || !order) return (
    <div className="p-8 text-center space-y-4">
      <p className="text-destructive font-semibold">Order not found.</p>
      <Button render={<Link href="/admin/orders" />}>Back to Orders</Button>
    </div>
  );

  const publicUrl = order.itemType === "group" ? `/groups/${order.itemSlug}` : `/notes/${order.itemSlug}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" render={<Link href="/admin/orders" />} aria-label="Back to orders list">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">Order #{order.orderNumber}</h1>
              <StatusBadge status={order.paymentStatus} type="payment" />
              {order.isDownloaded && (
                <StatusBadge status="downloaded" className="border-accent bg-accent/10 text-accent-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Placed on {formatDateTime(order.createdAt)}</p>
          </div>
        </div>
        <Button
          variant="outline"
          render={<a href={publicUrl} target="_blank" rel="noopener noreferrer" />}
        >
          <ExternalLink className="mr-2 size-4" />
          {order.itemType === "group" ? "Open Bundle" : "Open Note"}
        </Button>
      </div>

      {order.coverImageUrl && (
        <div className="overflow-hidden rounded-xl border border-border bg-muted/20 shadow-sm max-w-md">
          <Image
            src={order.coverImageUrl}
            alt={`Cover for ${order.itemTitle}`}
            width={400}
            height={224}
            className="h-48 w-full object-cover"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-foreground text-lg">{order.itemTitle}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                    Type: {order.itemType} &middot; ID: <span className="font-mono">{order.item.id}</span>
                  </p>
                </div>
                <span className="text-xl font-bold text-primary shrink-0">{order.amountLabel}</span>
              </div>
              <div className="h-px bg-border/60 my-3" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Buyer Name</p>
                  <p className="font-medium text-foreground mt-0.5">{order.buyerFull.fullName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Email Consent</p>
                  <p className="font-medium text-foreground mt-0.5">{order.buyerFull.consentAccepted ? "Accepted" : "Not accepted"}</p>
                </div>
                {order.buyerFull.ipAddress && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">IP Address</p>
                    <p className="font-mono text-xs text-foreground mt-0.5">{order.buyerFull.ipAddress}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">User Agent</p>
                  <p className="font-mono text-xs text-foreground mt-0.5 break-all">{order.buyerFull.userAgent ?? "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { label: "Razorpay Order ID", value: order.razorpayOrderId },
                { label: "Razorpay Payment ID", value: order.razorpayPaymentId },
                { label: "Payment Method", value: order.paymentMethod },
                { label: "Amount", value: order.amountLabel },
                { label: "Currency", value: order.currency },
                { label: "Failure Reason", value: order.failureReason },
              ].map(({ label, value }) => value && (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground shrink-0">{label}</dt>
                  <dd className="font-mono text-right truncate max-w-[60%]">{value}</dd>
                </div>
              ))}
              <div className="h-px bg-border/60 my-2" />
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  { label: "Created At", value: formatDateTime(order.createdAt) },
                  { label: "Paid At", value: order.paidAt ? formatDateTime(order.paidAt) : "—" },
                  { label: "Updated At", value: order.updatedAt },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">{label}</p>
                    <p className="text-xs text-foreground mt-0.5">{value}</p>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/80 sticky top-20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Order Number</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs font-mono font-semibold bg-muted px-2 py-1 rounded-lg">{order.orderNumber}</code>
                  <CopyButton value={order.orderNumber} label="Copy order number" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Order ID</p>
                <code className="text-xs font-mono text-muted-foreground mt-0.5 block break-all">{order.id}</code>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Download Status</p>
                <p className="text-sm font-medium mt-0.5">{order.isDownloaded ? "Downloaded" : "Not yet downloaded"}</p>
              </div>
              {order.item.noteIds.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Notes in Group</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.item.noteIds.length} note(s)</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
