"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Download, FileText, Lock, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
          "h-10 w-full rounded-lg bg-accent text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90",
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
        "h-10 w-full rounded-lg text-sm font-semibold shadow-sm transition-shadow hover:shadow-md",
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
          <Clock aria-hidden="true" className="mr-2 size-3.5 animate-spin" />
          Preparing…
        </>
      ) : (
        <>
          <Download aria-hidden="true" className="mr-2 size-3.5" />
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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/95 shadow-lg backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4">
        <div className="min-w-0 flex-1">
          <PriceTag price={price} priceLabel={priceLabel} compareAtPrice={compareAtPrice} />
          <p className="text-[9px] font-medium text-muted-foreground">
            {pricingType === "free" ? "Free instant download" : "Instant access after payment"}
          </p>
        </div>
        <PurchaseActions
          slug={slug}
          pricingType={pricingType}
          priceLabel={priceLabel}
          className="h-9 shrink-0 px-4 text-sm"
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
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
        <ErrorState
          message="This note is unavailable or may have been removed."
          onRetry={() => query.refetch()}
        />
      </div>
    );
  }

  const { note, groups, relatedNotes } = query.data;

  return (
    <div className="mx-auto max-w-7xl px-3 pt-3 pb-24 sm:px-4 sm:pt-4 sm:pb-10 lg:px-6" data-testid="note-content">
      <div className="mb-2 flex items-center gap-2 sm:mb-3">
        <Button
          render={<Link href="/notes" />}
          variant="outline"
          size="icon-sm"
          aria-label="Back to notes"
          className="size-11 shrink-0 rounded-lg max-sm:hidden"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </Button>

        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1 text-[10px] text-muted-foreground sm:text-xs"
        >
          <Link href="/" className="shrink-0 hover:text-foreground">
            Home
          </Link>
          <span aria-hidden="true" className="shrink-0 text-muted-foreground/40">/</span>
          <Link href="/notes" className="shrink-0 hover:text-foreground">
            Notes
          </Link>
          <span aria-hidden="true" className="shrink-0 text-muted-foreground/40">/</span>
          <span className="truncate font-medium text-foreground">{note.title}</span>
        </nav>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="min-w-0 space-y-3 sm:space-y-4">
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-muted/20 shadow-sm">
            {note.coverImageUrl ? (
              <Image
                src={note.coverImageUrl}
                alt={note.title}
                width={800}
                height={500}
                className="h-auto w-full object-cover"
              />
            ) : (
              <div className="flex h-28 w-full flex-col items-center justify-center gap-1.5 bg-linear-to-br from-primary/5 to-transparent text-primary/20 sm:h-40 md:h-52">
                <FileText aria-hidden="true" className="size-7 sm:size-10" />
                <span className="text-[10px] font-semibold uppercase tracking-widest">Study note document</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="rounded-full text-[10px] font-semibold">
                {note.category.name}
              </Badge>
              <LevelBadge level={note.level} />
              <PricingBadge pricingType={note.pricingType} />
            </div>

            <h1 className="font-heading text-sm font-bold leading-tight text-foreground sm:text-base md:text-xl">
              {note.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground sm:text-xs">
              {note.pageCount && (
                <>
                  <span className="inline-flex items-center gap-1">
                    <Clock aria-hidden="true" className="size-3" />
                    {note.pageCount} pages
                  </span>
                  <span aria-hidden="true" className="text-muted-foreground/40">·</span>
                </>
              )}
              <span className="inline-flex items-center gap-1">
                <FileText aria-hidden="true" className="size-3" />
                {note.downloadCount} downloads
              </span>
            </div>

            {note.description ? (
              <MarkdownPreview markdown={note.description} className="text-xs leading-relaxed sm:text-sm" />
            ) : null}

            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[9px] font-medium">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </article>

        <aside className="space-y-2.5 sm:space-y-3 lg:sticky lg:top-14 lg:self-start">
          <Card className="rounded-xl border border-border bg-card shadow-sm">
            <CardHeader className="pb-2 sm:pb-2.5">
              <CardTitle className="text-xs font-bold sm:text-sm">Get this note</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs">
                {note.pricingType === "free"
                  ? "Download instantly — completely free."
                  : "Pay once, own it forever."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 sm:space-y-3">
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
                  <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
                    <Lock aria-hidden="true" className="mb-1.5 size-3.5 text-accent" />
                    <p className="text-[11px] font-bold text-foreground">Full notes locked</p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
                      Preview below, then buy for instant access.
                    </p>
                  </div>

                  <PurchaseActions
                    slug={note.slug}
                    pricingType="paid"
                    priceLabel={note.priceLabel}
                  />
                  <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
                    Instant download after payment. Secure checkout via Razorpay.
                  </p>
                </>
              )}

              <div className="flex items-center justify-center gap-1.5 border-t border-border/50 pt-2.5 text-[10px] text-muted-foreground sm:pt-3">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck aria-hidden="true" className="size-2.5 text-success" />
                  Secure payment
                </span>
                <span aria-hidden="true" className="text-muted-foreground/30">·</span>
                <span className="inline-flex items-center gap-1">
                  <Lock aria-hidden="true" className="size-2.5 text-accent" />
                  Original content
                </span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {groups.length > 0 && (
        <section className="mt-5 border-t border-border/40 pt-4 sm:mt-6 sm:pt-5">
          <h2 className="mb-2 font-heading text-xs font-bold tracking-tight sm:mb-2.5 sm:text-sm">
            Also available in bundles
          </h2>
          <div className="grid gap-2 sm:gap-2.5 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      )}

      {relatedNotes.length > 0 && (
        <section className="mt-5 border-t border-border/40 pt-4 sm:mt-6 sm:pt-5">
          <h2 className="mb-2 font-heading text-xs font-bold tracking-tight sm:mb-2.5 sm:text-sm">
            Related notes
          </h2>
          <div className="grid gap-2 sm:gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
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
