"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FileText, Lock, ShieldCheck, Clock, BookOpen, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/error-state";
import { GroupCard } from "@/components/shared/group-card";
import { NoteCard } from "@/components/shared/note-card";
import { ShimmerLoader } from "@/components/shared/shimmer-loader";
import { PriceTag } from "@/components/shared/price-tag";
import { StatusBadge } from "@/components/shared/status-badge";
import { PdfPreviewDialog } from "@/components/shared/pdf-preview-dialog";
import { LevelBadge, PricingBadge } from "@/components/shared/badges";
import { useDownloadFile } from "@/hooks/use-download-file";
import { useNote } from "@/features/notes/api/use-note";

export function NoteDetailPage({ slug }: { slug: string }) {
  const query = useNote(slug);
  const { download, isDownloading } = useDownloadFile();

  if (query.isPending) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <ShimmerLoader className="h-3 w-32 rounded" />
          <ShimmerLoader className="h-56 w-full rounded-2xl" />
          <ShimmerLoader className="h-5 w-3/4 rounded" />
          <ShimmerLoader className="h-3 w-full rounded" />
          <ShimmerLoader className="h-3 w-2/3 rounded" />
        </div>
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState
          message="This note is unavailable or may have been removed."
          onRetry={() => query.refetch()}
        />
      </div>
    );
  }

  const { note, groups, relatedNotes } = query.data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 paper-bg">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span aria-hidden="true" className="text-muted-foreground/40">/</span>
        <Link href="/notes" className="hover:text-foreground transition-colors">Notes</Link>
        <span aria-hidden="true" className="text-muted-foreground/40">/</span>
        <span className="font-medium text-foreground truncate">{note.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <article className="space-y-6">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/50 bg-muted/20 shadow-sm torn-paper paper-card-green">
            {note.coverImageUrl ? (
              <Image
                src={note.coverImageUrl}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <FileText aria-hidden="true" className="size-12" />
                <span className="text-xs font-medium uppercase tracking-widest">Study Note Document</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-5 items-center rounded-full bg-secondary px-2.5 text-xs font-semibold text-secondary-foreground border border-border/50">
                {note.category.name}
              </span>
              <LevelBadge level={note.level} />
              <PricingBadge pricingType={note.pricingType} />
            </div>

            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {note.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {note.pageCount && (
                <span className="inline-flex items-center gap-1">
                  <BookOpen aria-hidden="true" className="size-3.5" />
                  {note.pageCount} pages
                </span>
              )}
              {note.pageCount && note.fileSizeLabel && (
                <span className="text-muted-foreground/40">\</span>
              )}
              {note.fileSizeLabel && (
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck aria-hidden="true" className="size-3.5" />
                  {note.fileSizeLabel}
                </span>
              )}
              <span className="text-muted-foreground/40">\</span>
              <span className="inline-flex items-center gap-1">
                <Clock aria-hidden="true" className="size-3.5" />
                {note.downloadCount} downloads
              </span>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {note.description}
            </p>

            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px] font-medium">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </article>

        <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
          <Card className="rounded-xl border border-border bg-card torn-paper shadow-lg paper-card-orange">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Get this note</CardTitle>
              <CardDescription className="text-xs">
                {note.pricingType === "free" ? "Download instantly — completely free." : "Pay once, own it forever."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PriceTag price={note.price} priceLabel={note.priceLabel} compareAtPrice={note.compareAtPrice} size="large" />

              <PdfPreviewDialog
                url={`/api/notes/${note.slug}/preview?mode=view`}
                filename={`${note.slug}-preview.pdf`}
              />

              {note.pricingType === "free" ? (
                <Button
                  className="w-full rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow"
                  size="lg"
                  disabled={isDownloading}
                  onClick={() =>
                    download({
                      url: `/api/notes/${note.slug}/download`,
                      filename: `${note.slug}.pdf`,
                    })
                  }
                >
                  {isDownloading ? (
                    <><Clock aria-hidden="true" className="mr-2 size-4 animate-spin" />Preparing…</>
                  ) : (
                    <><Download aria-hidden="true" className="mr-2 size-4" />Download PDF</>
                  )}
                </Button>
              ) : (
                <>
                  <div className="rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-3.5">
                    <Lock aria-hidden="true" className="mb-2 size-4 text-brand-orange" />
                    <p className="text-xs font-bold text-foreground">Full notes locked</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                      Preview below, then buy for instant access.
                    </p>
                  </div>

                  <Button
                    render={<Link href={`/checkout/${note.slug}`} />}
                    size="lg"
                    className="w-full rounded-xl font-semibold shadow-md bg-brand-orange text-white hover:bg-brand-orange/90 transition-colors"
                  >
                    Buy now — {note.priceLabel}
                  </Button>
                  <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
                    Instant download after payment. Secure checkout via Razorpay.
                  </p>
                </>
              )}

              <div className="flex flex-col items-center gap-2 border-t border-border/50 pt-4 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck aria-hidden="true" className="size-3 text-success" />
                    Secure payment
                  </span>
                  <span className="text-muted-foreground/30">\</span>
                  <span className="inline-flex items-center gap-1">
                    <Lock aria-hidden="true" className="size-3 text-brand-orange" />
                    Original content
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {groups.length > 0 && (
        <section className="mt-12 border-t border-border/40 pt-10">
          <h2 className="mb-5 font-heading text-lg font-bold tracking-tight">Also available in these bundles</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      )}

      {relatedNotes.length > 0 && (
        <section className="mt-12 border-t border-border/40 pt-10">
          <h2 className="mb-5 font-heading text-lg font-bold tracking-tight">Related notes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedNotes.map((related) => (
              <NoteCard key={related.id} note={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
