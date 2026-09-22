"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, CircleAlert, Download, FileText, Info, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/copy-button";
import { ErrorState } from "@/components/shared/error-state";
import { OrderStatusSkeleton } from "@/components/shared/shimmer-loader";
import { useOrder } from "@/hooks/useOrders";
import { useDownloadFile } from "@/hooks/use-download-file";
import { formatDateTime } from "@/lib/format";

export function OrderStatusPage({ orderId }: { orderId: string }) {
  const query = useOrder(orderId);
  const { download, isDownloading } = useDownloadFile();

  if (query.isPending) {
    return <OrderStatusSkeleton />;
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
        <div className="mx-auto size-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <h1 className="mt-5 text-xl font-bold tracking-tight">Confirming your payment…</h1>
        <p className="mt-2 text-sm text-muted-foreground">This usually takes a few seconds. Do not close this page.</p>
      </div>
    );
  }

  if (order.paymentStatus === "failed") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20">
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

  const isFresh = Boolean(order.paidAt && Date.now() - new Date(order.paidAt).getTime() < 15 * 60 * 1000);
  const notesList = order.notes && order.notes.length > 0
    ? order.notes
    : [{ id: order.id, title: order.itemTitle, slug: order.itemSlug, coverImageUrl: order.coverImageUrl }];

  const canDownload = isFresh || !order.isDownloaded;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="text-center space-y-3">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-success/10 border border-success/20">
          <CheckCircle2 aria-hidden="true" className="size-8 text-success" />
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-accent">
            Payment verified
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">
            <span className="brand-gradient-text">Payment successful</span>
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 font-mono text-xs font-semibold shadow-sm">
          <span>Order #{order.orderNumber}</span>
          <CopyButton value={order.orderNumber} label="Copy order number" />
        </div>
      </div>

      {isFresh ? (
        <Card className="mt-6 rounded-2xl border-success/30 bg-success/5 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-success/10 border border-success/20 text-success">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-foreground">Immediate Download Session Active</p>
                <p className="text-muted-foreground leading-relaxed">
                  You can download your notes unlimited times right now during this session.
                  If you leave or revisit this page later, note downloads will be restricted to a single download. Please save your files now.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : order.isDownloaded ? (
        <Card className="mt-6 rounded-2xl border-destructive/30 bg-destructive/5 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
                <AlertTriangle aria-hidden="true" className="size-5" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-foreground">Single-Use Download Used</p>
                <p className="text-muted-foreground leading-relaxed">
                  The notes for this order have already been downloaded. In accordance with our security policy, links can only be downloaded once after leaving the initial checkout session.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6 rounded-2xl border-warning/40 bg-warning/5 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-warning/15 border border-warning/30 text-warning-foreground">
                <Info aria-hidden="true" className="size-5" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-foreground">Single-Use Download Notice</p>
                <p className="text-muted-foreground leading-relaxed">
                  Each note below is clickable only once. Once clicked, it will not be downloadable again. Please make sure you directly save the PDF file to your device.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6">
        <Card className="rounded-2xl border border-border shadow-sm">
          <CardHeader className="border-b border-border/60 pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold">
                  {order.itemType === "group" ? "Bundle Notes" : "Purchased Note"}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {order.itemType === "group"
                    ? `${notesList.length} note${notesList.length === 1 ? "" : "s"} included in this bundle`
                    : "Your study material is ready for download"}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {order.itemType === "group" ? "Bundle" : "Single Note"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-border/60">
            {notesList.map((note) => (
              <div
                key={note.id || note.slug}
                className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-muted/40 sm:size-14">
                    {note.coverImageUrl ? (
                      <Image
                        src={note.coverImageUrl}
                        alt={note.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <FileText className="size-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{note.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">PDF Study Note</p>
                  </div>
                </div>

                <div className="shrink-0">
                  <Button
                    onClick={() =>
                      download({
                        url: `/api/notes/${note.slug}/download?orderId=${order.id}`,
                        filename: `${note.slug}.pdf`,
                      })
                    }
                    disabled={!canDownload || isDownloading}
                    size="sm"
                    className="h-11 w-full rounded-full px-4 sm:h-7 sm:w-auto"
                    variant={canDownload ? "default" : "outline"}
                  >
                    {isDownloading ? (
                      "Preparing…"
                    ) : canDownload ? (
                      <>
                        <Download aria-hidden="true" className="mr-1.5 size-4" />
                        Download PDF
                      </>
                    ) : (
                      "Downloaded"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="rounded-2xl border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold">Order Details</CardTitle>
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
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Download Status</dt>
                <dd className="font-medium">{order.isDownloaded ? "Downloaded" : "Available"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button render={<Link href="/order/track" />} variant="outline" size="sm" className="rounded-full">
          Track another
        </Button>
        <Button render={<Link href="/notes" />} size="sm" className="rounded-full bg-accent text-accent-foreground">
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
