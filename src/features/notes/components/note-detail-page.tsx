import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Lock, ShieldCheck } from "lucide-react";
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
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <ShimmerLoader className="h-4 w-48" />
          <ShimmerLoader className="h-56 w-full rounded-2xl" />
          <ShimmerLoader className="h-6 w-3/4" />
          <ShimmerLoader className="h-4 w-full" />
          <ShimmerLoader className="h-4 w-2/3" />
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
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link href="/" className="text-muted-foreground">Home</Link>
        <span className="mx-1.5 text-muted-foreground/50">/</span>
        <Link href="/notes" className="text-muted-foreground">Notes</Link>
        <span className="mx-1.5 text-muted-foreground/50">/</span>
        <span className="font-medium text-foreground">{note.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="space-y-5">
          <div className="relative aspect-[19/8] w-full overflow-hidden rounded-xl border border-border/60 bg-muted/40">
            {note.coverImageUrl ? (
              <Image
                src={note.coverImageUrl}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-primary/30">
                <span className="text-xs font-medium">Study Note Document</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="h-5 rounded-full px-2 text-[10px] font-medium">
                {note.category.name}
              </Badge>
              <StatusBadge type="level" value={note.level} />
              {note.pricingType === "paid" && (
                <Badge variant="secondary" className="h-5 rounded-full bg-accent/15 px-2 text-[10px] font-medium text-accent-foreground">
                  Premium
                </Badge>
              )}
            </div>

            <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
              {note.title}
            </h1>

            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {note.pageCount ? <span>{note.pageCount} pages</span> : null}
              {note.pageCount && note.fileSizeLabel ? <span className="text-muted-foreground/50">·</span> : null}
              {note.fileSizeLabel ? <span>{note.fileSizeLabel}</span> : null}
              <span className="text-muted-foreground/50">·</span>
              <span>{note.downloadCount} downloads</span>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {note.description}
            </p>

            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </article>

        <aside className="lg:sticky lg:top-16 lg:self-start">
          <Card className="rounded-xl border border-border/60">
            <CardContent className="space-y-4 p-4">
              <PriceTag price={note.price} priceLabel={note.priceLabel} compareAtPrice={note.compareAtPrice} size="large" />

              {note.pricingType === "free" ? (
                <>
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
                        <Download aria-hidden="true" className="mr-2 size-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                  <p className="text-center text-[10px] text-muted-foreground">
                    No sign-up required. Instant download.
                  </p>
                </>
              ) : (
                <>
                  <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                    <Lock aria-hidden="true" className="mb-1.5 size-4 text-primary" />
                    <p className="text-sm font-semibold">Full notes locked</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Review the preview, then buy to receive your complete notes.
                    </p>
                  </div>

                  {note.hasPreview && (
                    <PdfPreviewDialog
                      url={`/api/notes/${note.slug}/preview?mode=view`}
                      filename={`${note.slug}-preview.pdf`}
                    />
                  )}

                  <Button
                    render={<Link href={`/checkout/${note.slug}`} />}
                    size="lg"
                    className="w-full rounded-lg"
                  >
                    Buy now — {note.priceLabel}
                  </Button>
                  <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
                    Delivered to your Instagram, WhatsApp, or email within 4–6 hours.
                  </p>
                </>
              )}

              <div className="flex items-center justify-center gap-1.5 border-t border-border/60 pt-3 text-[10px] text-muted-foreground">
                <ShieldCheck aria-hidden="true" className="size-3 text-primary shrink-0" />
                <span>Secure payment · Original content · No spam</span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {groups.length > 0 && (
        <section className="mt-10 border-t border-border/40 pt-8">
          <h2 className="mb-4 font-heading text-base font-bold tracking-tight">Also in these bundles</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      )}

      {relatedNotes.length > 0 && (
        <section className="mt-10 border-t border-border/40 pt-8">
          <h2 className="mb-4 font-heading text-base font-bold tracking-tight">Related notes</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedNotes.map((related) => (
              <NoteCard key={related.id} note={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
