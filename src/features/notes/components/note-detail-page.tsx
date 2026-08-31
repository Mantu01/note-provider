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
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/">Home</Link>
        <span aria-hidden="true" className="text-muted-foreground/40">/</span>
        <Link href="/notes">Notes</Link>
        <span aria-hidden="true" className="text-muted-foreground/40">/</span>
        <span className="font-medium text-foreground truncate">{note.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="space-y-5">
          <div className="relative aspect-[19/8] w-full overflow-hidden rounded-2xl border border-border/50 bg-muted/20 shadow-sm torn-paper">
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

          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="h-5 rounded-full px-2.5 text-xs font-semibold">
                {note.category.name}
              </Badge>
              <StatusBadge type="level" value={note.level} />
              {note.pricingType === "paid" && (
                <Badge variant="default" className="h-5 rounded-full bg-primary px-2.5 text-xs font-semibold text-primary-foreground">
                  Premium
                </Badge>
              )}
              {note.pricingType === "free" && (
                <Badge variant="default" className="h-5 rounded-full bg-success px-2.5 text-xs font-semibold text-success-foreground">
                  Free
                </Badge>
              )}
            </div>

            <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
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
                <span className="text-muted-foreground/40">·</span>
              )}
              {note.fileSizeLabel && (
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck aria-hidden="true" className="size-3.5" />
                  {note.fileSizeLabel}
                </span>
              )}
              <span className="text-muted-foreground/40">·</span>
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
          <Card className="rounded-2xl border border-border bg-card torn-paper shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Get this note</CardTitle>
              <CardDescription className="text-xs">
                {note.pricingType === "free" ? "Download instantly — completely free." : "Pay once, own it forever."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PriceTag price={note.price} priceLabel={note.priceLabel} compareAtPrice={note.compareAtPrice} size="large" />

              {note.pricingType === "free" ? (
                <>
                  <PdfPreviewDialog
                    url={`/api/notes/${note.slug}/preview?mode=view`}
                    filename={`${note.slug}-preview.pdf`}
                  />
                  <Button
                    className="w-full rounded-xl font-semibold shadow-md"
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
                </>
              ) : (
                <>
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5">
                    <Lock aria-hidden="true" className="mb-2 size-4 text-primary" />
                    <p className="text-xs font-bold">Full notes locked</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                      Preview below, then buy for instant access.
                    </p>
                  </div>

                  <PdfPreviewDialog
                    url={`/api/notes/${note.slug}/preview?mode=view`}
                    filename={`${note.slug}-preview.pdf`}
                  />

                  <Button
                    render={<Link href={`/checkout/${note.slug}`} />}
                    size="lg"
                    className="w-full rounded-xl font-semibold shadow-md bg-primary text-primary-foreground"
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
                  <span className="text-muted-foreground/30">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Lock aria-hidden="true" className="size-3 text-primary" />
                    Original content
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {groups.length > 0 && (
        <section className="mt-10 border-t border-border/40 pt-8">
          <h2 className="mb-4 font-heading text-lg font-bold tracking-tight">Also available in these bundles</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      )}

      {relatedNotes.length > 0 && (
        <section className="mt-10 border-t border-border/40 pt-8">
          <h2 className="mb-4 font-heading text-lg font-bold tracking-tight">Related notes</h2>
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
