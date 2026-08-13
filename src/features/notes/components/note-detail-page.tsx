"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/error-state";
import { GroupCard } from "@/components/shared/group-card";
import { NoteCard } from "@/components/shared/note-card";
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
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-96 animate-pulse rounded-3xl bg-muted" />
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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="px-2">/</span>
        <Link href="/notes" className="hover:text-foreground">
          Notes
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground font-medium">{note.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <article className="min-w-0 space-y-7">
          {note.coverImageUrl ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border shadow-sm brand-gradient-soft">
              <Image
                src={note.coverImageUrl}
                alt={`Cover for ${note.title}`}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[16/9] rounded-3xl brand-gradient-soft shadow-sm flex items-center justify-center text-primary/40">
              <span className="text-sm font-medium">Study Note Document</span>
            </div>
          )}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{note.category.name}</Badge>
              <StatusBadge type="level" value={note.level} />
            </div>

            <h1 className="font-heading text-3xl font-bold tracking-tight md:text-5xl">
              {note.title}
            </h1>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>{note.pageCount ? `${note.pageCount} pages` : "Study resource"}</span>
              {note.fileSizeLabel ? <span>• {note.fileSizeLabel}</span> : null}
              <span>• {note.downloadCount} downloads</span>
            </div>

            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
              {note.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {note.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="rounded-3xl border shadow-sm">
            <CardContent className="space-y-5 p-6">
              <PriceTag
                price={note.price}
                priceLabel={note.priceLabel}
                compareAtPrice={note.compareAtPrice}
                size="large"
              />

              {note.pricingType === "free" ? (
                <>
                  <Button
                    className="w-full"
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
                  <p className="text-center text-sm text-muted-foreground">
                    No sign-up required. Instant download.
                  </p>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border bg-muted/50 p-4">
                    <Lock aria-hidden="true" className="mb-2 size-5 text-primary" />
                    <p className="font-semibold">Full notes locked</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Review the preview, then buy to receive your complete notes.
                    </p>
                  </div>

                  {note.hasPreview ? (
                    <PdfPreviewDialog
                      url={`/api/notes/${note.slug}/preview?mode=view`}
                      filename={`${note.slug}-preview.pdf`}
                    />
                  ) : null}

                  <Button
                    render={<Link href={`/checkout/${note.slug}`} />}
                    size="lg"
                    className="w-full"
                  >
                    Buy now — {note.priceLabel}
                  </Button>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Delivered to your Instagram, WhatsApp, or email within 4–6 hours of payment.
                  </p>
                </>
              )}

              <div className="flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
                <ShieldCheck aria-hidden="true" className="size-4 text-primary shrink-0" />
                <span>Secure payment · Original content · No spam</span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {groups.length ? (
        <section className="mt-16 border-t pt-12">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Also in these bundles</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      ) : null}

      {relatedNotes.length ? (
        <section className="mt-16 border-t pt-12">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Related notes</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedNotes.map((related) => (
              <NoteCard key={related.id} note={related} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
