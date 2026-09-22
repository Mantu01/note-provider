"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Download, FileText, Lock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/error-state";
import { GroupCard } from "@/components/shared/group-card";
import { NoteCard } from "@/components/shared/note-card";
import { NoteDetailSkeleton } from "@/components/shared/shimmer-loader";
import { PriceTag } from "@/components/shared/price-tag";
import { PdfPreviewDialog } from "@/components/shared/pdf-preview-dialog";
import { MarkdownPreview } from "@/components/shared/md-preview";
import { LevelBadge, PricingBadge } from "@/components/shared/badges";
import { useDownloadFile } from "@/hooks/use-download-file";
import { useNote } from "@/hooks/useNotes";
import { cn } from "@/lib/utils";

function PurchaseActions({
  slug,
  pricingType,
  priceLabel,
  className,
}: {
  slug: string;
  pricingType: string;
  priceLabel: string;
  className?: string;
}) {
  const { download, isDownloading } = useDownloadFile();

  if (pricingType !== "free") {
    return (
      <Button
        render={<Link href={`/checkout/${slug}`} />}
        size="lg"
        className={cn(
          "h-11 w-full rounded-xl bg-accent font-semibold text-accent-foreground shadow-md transition-colors hover:bg-accent/90",
          className,
        )}
      >
        Buy now — {priceLabel}
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      disabled={isDownloading}
      className={cn(
        "h-11 w-full rounded-xl font-semibold shadow-md transition-shadow hover:shadow-lg",
        className,
      )}
      onClick={() =>
        download({
          url: `/api/notes/${slug}/download`,
          filename: `${slug}.pdf`,
        })
      }
    >
      {isDownloading ? (
        <>
          <Clock aria-hidden="true" className="mr-2 size-4 animate-spin" />
          Preparing…
        </>
      ) : (
        <>
          <Download aria-hidden="true" className="mr-2 size-4" />
          Download PDF
        </>
      )}
    </Button>
  );
}

function MobilePurchaseBar({
  slug,
  pricingType,
  price,
  priceLabel,
  compareAtPrice,
}: {
  slug: string;
  pricingType: string;
  price: number;
  priceLabel: string;
  compareAtPrice: number | null;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 shadow-[0_-8px_24px_-16px_rgba(0,0,0,0.35)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:px-4">
        <div className="min-w-0">
          <PriceTag price={price} priceLabel={priceLabel} compareAtPrice={compareAtPrice} />
          <p className="text-[10px] font-medium text-muted-foreground">
            {pricingType === "free" ? "Free instant download" : "Instant access after payment"}
          </p>
        </div>
        <PurchaseActions
          slug={slug}
          pricingType={pricingType}
          priceLabel={priceLabel}
          className="ml-auto w-auto shrink-0 px-5 sm:px-6"
        />
      </div>
    </div>
  );
}

export function NoteDetailPage({ slug }: { slug: string }) {
  const query = useNote(slug);

  if (query.isPending) {
    return <NoteDetailSkeleton />;
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 sm:py-10">
        <ErrorState
          message="This note is unavailable or may have been removed."
          onRetry={() => query.refetch()}
        />
      </div>
    );
  }

  const { note, groups, relatedNotes } = query.data;

  return (
    <div
      className="mx-auto max-w-7xl px-3 pt-2 pb-24 sm:px-4 sm:pt-4 lg:pb-10"
      data-testid="note-content"
    >
      <div className="mb-3 flex items-center gap-2 sm:mb-5">
        <Button
          render={<Link href="/notes" />}
          variant="outline"
          size="icon-sm"
          aria-label="Back to notes"
          className="size-9 shrink-0 rounded-lg lg:hidden"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
        </Button>

        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground sm:text-sm"
        >
          <Link href="/" className="shrink-0 hover:text-foreground">
            Home
          </Link>
          <span aria-hidden="true" className="shrink-0 text-muted-foreground/40">
            /
          </span>
          <Link href="/notes" className="shrink-0 hover:text-foreground">
            Notes
          </Link>
          <span aria-hidden="true" className="shrink-0 text-muted-foreground/40">
            /
          </span>
          <span className="truncate font-medium text-foreground">{note.title}</span>
        </nav>
      </div>

      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="min-w-0 space-y-3 sm:space-y-4">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/50 bg-muted/20 shadow-sm sm:aspect-[2/1]">
            {note.coverImageUrl ? (
              <Image
                src={note.coverImageUrl}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/5 to-transparent text-primary/20">
                <FileText aria-hidden="true" className="size-10 sm:size-12" />
                <span className="text-xs font-medium uppercase tracking-widest">Study note document</span>
              </div>
            )}
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Badge variant="secondary" className="rounded-full font-semibold">
                {note.category.name}
              </Badge>
              <LevelBadge level={note.level} />
              <PricingBadge pricingType={note.pricingType} />
            </div>

            <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
              {note.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-sm">
              {note.pageCount && (
                <>
                  <span className="inline-flex items-center gap-1">
                    <Clock aria-hidden="true" className="size-3.5" />
                    {note.pageCount} pages
                  </span>
                  <span aria-hidden="true" className="text-muted-foreground/40">
                    ·
                  </span>
                </>
              )}
              <span className="inline-flex items-center gap-1">
                <FileText aria-hidden="true" className="size-3.5" />
                {note.downloadCount} downloads
              </span>
            </div>

            {note.description ? (
              <MarkdownPreview markdown={note.description} className="text-sm leading-relaxed" />
            ) : null}

            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[11px] font-medium">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </article>

        <aside className="space-y-3 sm:space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card className="rounded-2xl border border-border bg-card shadow-lg">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-base font-bold">Get this note</CardTitle>
              <CardDescription className="text-xs">
                {note.pricingType === "free"
                  ? "Download instantly — completely free."
                  : "Pay once, own it forever."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <PriceTag
                price={note.price}
                priceLabel={note.priceLabel}
                compareAtPrice={note.compareAtPrice}
                size="large"
              />

              {note.previewFileUrl && (
                <PdfPreviewDialog
                  previewUrl={note.previewFileUrl}
                  filename={`${note.slug}-preview.pdf`}
                />
              )}

              {note.pricingType === "free" ? (
                <PurchaseActions slug={note.slug} pricingType="free" priceLabel={note.priceLabel} />
              ) : (
                <>
                  <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 sm:p-3.5">
                    <Lock aria-hidden="true" className="mb-2 size-4 text-accent" />
                    <p className="text-xs font-bold text-foreground">Full notes locked</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                      Preview below, then buy for instant access.
                    </p>
                  </div>

                  <PurchaseActions
                    slug={note.slug}
                    pricingType="paid"
                    priceLabel={note.priceLabel}
                  />
                  <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                    Instant download after payment. Secure checkout via Razorpay.
                  </p>
                </>
              )}

              <div className="flex items-center justify-center gap-2 border-t border-border/50 pt-3 text-[11px] text-muted-foreground sm:pt-4">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck aria-hidden="true" className="size-3 text-success" />
                  Secure payment
                </span>
                <span aria-hidden="true" className="text-muted-foreground/30">
                  ·
                </span>
                <span className="inline-flex items-center gap-1">
                  <Lock aria-hidden="true" className="size-3 text-accent" />
                  Original content
                </span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {groups.length > 0 && (
        <section className="mt-8 border-t border-border/40 pt-6 sm:mt-10 sm:pt-8">
          <h2 className="mb-4 font-heading text-lg font-bold tracking-tight sm:mb-5 sm:text-xl">
            Also available in these bundles
          </h2>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      )}

      {relatedNotes.length > 0 && (
        <section className="mt-8 border-t border-border/40 pt-6 sm:mt-10 sm:pt-8">
          <h2 className="mb-4 font-heading text-lg font-bold tracking-tight sm:mb-5 sm:text-xl">
            Related notes
          </h2>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedNotes.map((related) => (
              <NoteCard key={related.id} note={related} />
            ))}
          </div>
        </section>
      )}

      <MobilePurchaseBar
        slug={note.slug}
        pricingType={note.pricingType}
        price={note.price}
        priceLabel={note.priceLabel}
        compareAtPrice={note.compareAtPrice}
      />
    </div>
  );
}
