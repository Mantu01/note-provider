"use client";

import Link from "next/link";
import { Download, FileText, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/error-state";
import { GroupCard } from "@/components/shared/group-card";
import { NoteCard } from "@/components/shared/note-card";
import { ShimmerLoader } from "@/components/shared/shimmer-loader";
import { PdfPreviewDialog } from "@/components/shared/pdf-preview-dialog";
import { PriceTag } from "@/components/shared/price-tag";
import { StatusBadge } from "@/components/shared/status-badge";
import { useDownloadFile } from "@/hooks/use-download-file";
import { useNote } from "@/features/notes/api/use-note";

export function NoteDetailPage({ slug }: { slug: string }) {
  const query = useNote(slug);
  const { download, isDownloading } = useDownloadFile();

  if (query.isPending) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <ShimmerLoader className="h-3.5 w-40" />
          <ShimmerLoader className="h-48 w-full rounded-xl" />
          <ShimmerLoader className="h-5 w-3/4" />
          <ShimmerLoader className="h-3.5 w-full" />
          <ShimmerLoader className="h-3.5 w-2/3" />
        </div>
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          message="This note is unavailable or may have been removed."
          onRetry={() => query.refetch()}
        />
      </div>
    );
  }

  const { note, groups, relatedNotes } = query.data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-3 text-[10px] text-muted-foreground">
        <Link href="/" className="text-muted-foreground">Home</Link>
        <span className="mx-1 text-muted-foreground/50">/</span>
        <Link href="/notes" className="text-muted-foreground">Notes</Link>
        <span className="mx-1 text-muted-foreground/50">/</span>
        <span className="font-medium text-foreground">{note.title}</span>
      </nav>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="space-y-4">
          <div className="relative aspect-[19/8] w-full overflow-hidden rounded-xl border border-border/50 bg-muted/30">
            {note.coverImageUrl ? (
              <img
                src={note.coverImageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-primary/20">
                <span className="text-[10px] font-medium">Study Note Document</span>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="h-4 rounded-full px-1.5 text-[9px] font-medium">
                {note.category.name}
              </Badge>
              <StatusBadge type="level" value={note.level} />
              {note.pricingType === "paid" && (
                <Badge variant="secondary" className="h-4 rounded-full bg-accent/15 px-1.5 text-[9px] font-medium text-accent-foreground">
                  Premium
                </Badge>
              )}
            </div>

            <h1 className="font-heading text-xl font-bold tracking-tight md:text-2xl">
              {note.title}
            </h1>

            <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-[10px] text-muted-foreground">
              {note.pageCount ? <span>{note.pageCount} pages</span> : null}
              {note.pageCount && note.fileSizeLabel ? <span className="text-muted-foreground/50">·</span> : null}
              {note.fileSizeLabel ? <span>{note.fileSizeLabel}</span> : null}
              <span className="text-muted-foreground/50">·</span>
              <span>{note.downloadCount} downloads</span>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              {note.description}
            </p>

            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[9px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </article>

        <aside className="lg:sticky lg:top-14 lg:self-start">
          <Card className="rounded-xl border border-border/50">
            <CardContent className="space-y-3 p-3">
              <PriceTag price={note.price} priceLabel={note.priceLabel} compareAtPrice={note.compareAtPrice} size="large" />

              {note.pricingType === "free" ? (
                <>
                  <PdfPreviewDialog
                    url={`/api/notes/${note.slug}/preview?mode=view`}
                    filename={`${note.slug}-preview.pdf`}
                  />
                  <Button
                    className="w-full rounded-lg"
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
                      "Preparing…"
                    ) : (
                      <>
                        <Download aria-hidden="true" className="mr-1.5 size-3.5" />
                        Download PDF
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="rounded-lg border border-border/50 bg-muted/20 p-2.5">
                    <Lock aria-hidden="true" className="mb-1 size-3.5 text-primary" />
                    <p className="text-xs font-semibold">Full notes locked</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
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
                    className="w-full rounded-lg"
                  >
                    Buy now — {note.priceLabel}
                  </Button>
                  <p className="text-center text-[9px] leading-relaxed text-muted-foreground">
                    Instant download after payment.
                  </p>
                </>
              )}

              <div className="flex items-center justify-center gap-1.5 border-t border-border/50 pt-2.5 text-[9px] text-muted-foreground">
                <ShieldCheck aria-hidden="true" className="size-2.5 text-primary shrink-0" />
                <span>Secure payment · Original content · No spam</span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {groups.length > 0 && (
        <section className="mt-8 border-t border-border/40 pt-6">
          <h2 className="mb-3 font-heading text-sm font-bold tracking-tight">Also in these bundles</h2>
          <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      )}

      {relatedNotes.length > 0 && (
        <section className="mt-8 border-t border-border/40 pt-6">
          <h2 className="mb-3 font-heading text-sm font-bold tracking-tight">Related notes</h2>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedNotes.map((related) => (
              <NoteCard key={related.id} note={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
