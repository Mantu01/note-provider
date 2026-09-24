"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  CircleAlert,
  Download,
  FileCheck2,
  FileText,
  Info,
  Loader2,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/copy-button";
import { ErrorState } from "@/components/shared/error-state";
import { OrderStatusSkeleton } from "@/components/shared/shimmer-loader";
import { useOrder } from "@/hooks/useOrders";
import { useDownloadFile } from "@/hooks/use-download-file";
import { formatDateTime } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";

const DOWNLOAD_WINDOW_MS = 15 * 60 * 1000;

type OrderNote = { id: string; title: string; slug: string; coverImageUrl: string | null };

function CountdownTimer({ paidAt }: { paidAt: Date }) {
  const [display, setDisplay] = useState(() => formatMs(paidAt));

  useEffect(() => {
    const tick = () => setDisplay(formatMs(paidAt));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [paidAt]);

  function formatMs(date: Date): string {
    const msLeft = Math.max(0, DOWNLOAD_WINDOW_MS - (Date.now() - date.getTime()));
    const totalSec = Math.floor(msLeft / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <span className="font-mono text-xs font-semibold tabular-nums" aria-live="polite">
      {display}
    </span>
  );
}

function StatusBanner({ isFresh, remainingMs, isDownloaded, paidAt }: { isFresh: boolean; remainingMs: number; isDownloaded: boolean; paidAt: Date | null }) {
  if (isFresh && remainingMs > 0 && paidAt) {
    return (
      <Card className="mt-5 rounded-xl border-success/30 bg-success/5 shadow-sm">
        <CardContent className="flex items-start gap-3 p-4 sm:p-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-success/20 bg-success/10 text-success">
            <ShieldCheck aria-hidden="true" className="size-4" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-bold text-foreground">Download session active</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You can download now. Your link expires in{" "}
              <CountdownTimer paidAt={paidAt} />.
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              After this session, each download link works once to prevent unauthorized sharing.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isDownloaded) {
    return (
      <Card className="mt-5 rounded-xl border-destructive/30 bg-destructive/5 shadow-sm">
        <CardContent className="flex items-start gap-3 p-4 sm:p-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
            <TriangleAlert aria-hidden="true" className="size-4" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-bold text-foreground">Download already used</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The notes for this order were downloaded. For security, the download link works once after the initial session. Contact support if you lost the file.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-5 rounded-xl border-warning/40 bg-warning/5 shadow-sm">
      <CardContent className="flex items-start gap-3 p-4 sm:p-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-warning/30 bg-warning/15 text-warning-foreground">
          <Info aria-hidden="true" className="size-4" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="font-bold text-foreground">Single-use download notice</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Each download works once. Click a download button, save the PDF to your device, and keep it safe for future revision.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function NoteRow({
  note,
  canDownload,
  isDownloading,
  onDownload,
}: {
  note: OrderNote;
  canDownload: boolean;
  isDownloading: boolean;
  onDownload: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-muted/40 sm:size-14">
          {note.coverImageUrl ? (
            <Image src={note.coverImageUrl} alt={note.title} fill sizes="56px" className="object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-linear-to-br from-primary/8 to-transparent text-primary/25">
              <FileText aria-hidden="true" className="size-6" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{note.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">PDF study note</p>
        </div>
      </div>

      <Button
        onClick={onDownload}
        disabled={!canDownload || isDownloading}
        size="sm"
        className={cn(
          "h-11 w-full rounded-lg px-4 text-xs font-semibold sm:h-10 sm:w-auto",
          canDownload && "bg-accent text-accent-foreground hover:bg-accent/90",
        )}
        variant={canDownload ? "default" : "outline"}
      >
        {isDownloading ? (
          <>
            <Loader2 aria-hidden="true" className="mr-1.5 size-3.5 animate-spin" />
            Preparing…
          </>
        ) : canDownload ? (
          <>
            <Download aria-hidden="true" className="mr-1.5 size-3.5" />
            Download
          </>
        ) : (
          <>
            <FileCheck2 aria-hidden="true" className="mr-1.5 size-3.5" />
            Downloaded
          </>
        )}
      </Button>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right font-medium text-foreground">{children}</dd>
    </div>
  );
}

export function OrderStatusPage({ orderId }: { orderId: string }) {
  const query = useOrder(orderId);
  const queryClient = useQueryClient();
  const { download, isDownloading, variables: activeNoteSlug } = useDownloadFile();

  if (query.isPending) return <OrderStatusSkeleton />;

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
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <Loader2 aria-hidden="true" className="mx-auto size-10 animate-spin text-accent" />
        <h1 className="mt-5 text-lg font-bold tracking-tight sm:text-xl">Confirming your payment…</h1>
        <p className="mt-2 text-sm text-muted-foreground">This usually takes a few seconds. Do not close this page.</p>
      </div>
    );
  }

  if (order.paymentStatus === "failed") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10">
          <CircleAlert aria-hidden="true" className="size-8 text-destructive" />
        </div>
        <h1 className="mt-5 text-lg font-bold tracking-tight sm:text-xl">Payment failed</h1>
        <p className="mt-2 text-sm text-muted-foreground">No money was deducted, or your bank will reverse the hold automatically.</p>
        <Button
          render={
            <Link href={`/checkout/${order.itemSlug}${order.itemType === "group" ? "?itemType=group" : ""}`} />
          }
          className="mt-5 rounded-full bg-accent text-accent-foreground"
        >
          Try again
        </Button>
      </div>
    );
  }

  const isFresh = Boolean(order.paidAt && Date.now() - new Date(order.paidAt).getTime() < DOWNLOAD_WINDOW_MS);
  const paidAtDate = order.paidAt ? new Date(order.paidAt) : null;
  const remainingMs = (isFresh && paidAtDate) ? DOWNLOAD_WINDOW_MS - (Date.now() - paidAtDate.getTime()) : 0;
  const canDownload = !order.isDownloaded;
  const notesList: OrderNote[] =
    order.notes && order.notes.length > 0
      ? order.notes
      : [{ id: order.id, title: order.itemTitle, slug: order.itemSlug, coverImageUrl: order.coverImageUrl }];

  const handleDownload = (note: OrderNote) => {
    download(
      {
        url: `/api/notes/${note.slug}/download?orderId=${order.id}`,
        filename: `${note.slug}.pdf`,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.order(order.id) });
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-success/20 bg-success/10">
          <CheckCircle2 aria-hidden="true" className="size-8 text-success" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Payment verified</p>
          <h1 className="mt-1 font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            <span className="brand-gradient-text">Payment successful</span>
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs font-semibold shadow-sm">
          <span>Order #{order.orderNumber}</span>
          <CopyButton value={order.orderNumber} label="Copy order number" />
        </div>
      </div>

      <StatusBanner isFresh={isFresh} remainingMs={remainingMs} isDownloaded={order.isDownloaded} paidAt={paidAtDate} />

      <Card className="mt-5 rounded-xl border-border shadow-sm">
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-bold">
                {order.itemType === "group" ? "Bundle contents" : "Your note"}
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {order.itemType === "group"
                  ? `${notesList.length} note${notesList.length === 1 ? "" : "s"} included in this bundle`
                  : "Ready to download and save"}
              </p>
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
              {order.itemType === "group" ? "Bundle" : "Single note"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-border/60 p-0">
          {notesList.map((note) => (
            <NoteRow
              key={note.id || note.slug}
              note={note}
              canDownload={canDownload}
              isDownloading={isDownloading && activeNoteSlug?.url === `/api/notes/${note.slug}/download?orderId=${order.id}`}
              onDownload={() => handleDownload(note)}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="mt-5 rounded-xl border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold">Order details</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <dl className="space-y-2 text-xs">
            <DetailRow label="Order number">
              <span className="inline-flex items-center gap-1.5 font-mono font-semibold">
                {order.orderNumber}
                <CopyButton value={order.orderNumber} />
              </span>
            </DetailRow>
            <DetailRow label="Item">
              <span className="line-clamp-1 font-semibold">{order.itemTitle}</span>
            </DetailRow>
            <DetailRow label="Amount paid">
              <span className="font-bold">{order.amountLabel}</span>
            </DetailRow>
            <DetailRow label="Placed">
              <span>{formatDateTime(order.createdAt)}</span>
            </DetailRow>
            <DetailRow label="Paid">
              <span>{order.paidAt ? formatDateTime(order.paidAt) : "—"}</span>
            </DetailRow>
            <DetailRow label="Download status">
              <span className={cn("font-semibold", order.isDownloaded ? "text-success" : "text-foreground")}>
                {order.isDownloaded ? "Downloaded" : "Available"}
              </span>
            </DetailRow>
          </dl>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button render={<Link href="/order/track" />} variant="outline" size="sm" className="rounded-full text-xs">
          Track another order
        </Button>
        <Button render={<Link href="/notes" />} size="sm" className="rounded-full bg-accent text-xs text-accent-foreground">
          Browse notes
        </Button>
        <Button render={<Link href="/contact" />} variant="outline" size="sm" className="rounded-full text-xs">
          Need help
        </Button>
      </div>
    </div>
  );
}
