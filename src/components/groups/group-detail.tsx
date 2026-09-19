"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, Layers, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";
import { GroupCard } from "@/components/shared/group-card";
import { NoteCard } from "@/components/shared/note-card";
import { GroupDetailSkeleton } from "@/components/shared/shimmer-loader";
import { MarkdownPreview } from "@/components/shared/md-preview";
import { PriceTag } from "@/components/shared/price-tag";
import { useGroup } from "@/hooks/useGroups";
import { formatPrice } from "@/lib/format";

export function GroupDetailPage({ slug }: { slug: string }) {
  const query = useGroup(slug);

  if (query.isPending) {
    return <GroupDetailSkeleton />;
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState
          message="This bundle is unavailable."
          onRetry={() => query.refetch()}
        />
      </div>
    );
  }

  const { group, relatedGroups } = query.data;
  const individualValue = group.notes.reduce(
    (total, note) => total + note.price,
    0,
  );
  const savings = individualValue - group.price;
  const savingsPercent = individualValue > 0 ? Math.round((savings / individualValue) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-5 lg:px-8" data-testid="group-content">
      <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-[11px] text-muted-foreground sm:mb-5 sm:text-xs">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span aria-hidden="true" className="text-muted-foreground/40">/</span>
        <Link href="/groups" className="hover:text-foreground">Bundles</Link>
        <span aria-hidden="true" className="text-muted-foreground/40">/</span>
        <span className="font-medium text-foreground truncate">{group.name}</span>
      </nav>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] sm:gap-6">
        <article className="space-y-4 sm:space-y-5">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/50 bg-muted/20 shadow-sm">
            {group.coverImageUrl ? (
              <Image
                src={group.coverImageUrl}
                loading="eager"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <FileText aria-hidden="true" className="size-12" />
                <span className="text-xs font-medium uppercase tracking-widest">Bundle cover</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-accent sm:text-[10px]">
              {group.category.name} bundle
            </p>
            <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
              {group.name}
            </h1>
            {group.description ? (
              <MarkdownPreview markdown={group.description} className="text-xs leading-relaxed sm:text-sm" />
            ) : null}
          </div>

          <div className="border-t border-border/40 pt-4 sm:pt-5">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <h2 className="font-heading text-sm font-bold tracking-tight sm:text-base">
                {group.noteCount} notes included
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground border border-border/50 sm:px-3 sm:text-xs">
                <Layers aria-hidden="true" className="size-3" />
                Complete pack
              </span>
            </div>
            <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
              {group.notes.map((note) => (
                <NoteCard key={note.id} note={note} variant="compact" />
              ))}
            </div>
          </div>
        </article>

        <aside className="lg:sticky lg:top-16 lg:self-start space-y-3 sm:space-y-4">
          <Card className="rounded-xl border border-border bg-card shadow-lg">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-sm font-bold sm:text-base">Get this bundle</CardTitle>
              <CardDescription className="text-[11px] sm:text-xs">
                {group.noteCount} notes · {group.category.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <PriceTag price={group.price} priceLabel={group.priceLabel} compareAtPrice={group.compareAtPrice} size="large" />

              {savings > 0 && (
                <div className="rounded-xl border border-success/20 bg-success/5 p-2.5 flex items-center gap-2 sm:p-3">
                  <TrendingUp aria-hidden="true" className="size-3.5 shrink-0 text-success sm:size-4" />
                  <div>
                    <p className="text-xs font-bold text-success sm:text-sm">Save {savingsPercent}%</p>
                    <p className="text-[10px] text-muted-foreground">
                      Individual value: <span className="line-through text-muted-foreground">{formatPrice(individualValue)}</span>
                    </p>
                  </div>
                </div>
              )}

              <Button
                render={<Link href={`/checkout/${group.slug}?itemType=group`} />}
                className="w-full rounded-xl bg-accent font-semibold text-accent-foreground shadow-md"
                size="lg"
              >
                Buy this bundle
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </Button>

              <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
                Delivered within 4–6 hours after payment confirmation.
              </p>

              <div className="flex items-center justify-center gap-2 border-t border-border/50 pt-3 text-[10px] text-muted-foreground sm:pt-4">
                <span>Secure payment</span>
                <span aria-hidden="true" className="text-muted-foreground/30">·</span>
                <span>Original content</span>
                <span aria-hidden="true" className="text-muted-foreground/30">·</span>
                <span>No spam</span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {relatedGroups.length > 0 && (
        <section className="mt-8 border-t border-border/40 pt-6 sm:mt-10 sm:pt-8">
          <h2 className="mb-3 font-heading text-base font-bold tracking-tight sm:mb-4 sm:text-lg">More bundles you might like</h2>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedGroups.map((related) => (
              <GroupCard key={related.id} group={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
