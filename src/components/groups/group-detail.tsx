"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText, Layers, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/shared/error-state";
import { GroupCard } from "@/components/shared/group-card";
import { NoteCard } from "@/components/shared/note-card";
import { GroupDetailSkeleton } from "@/components/shared/shimmer-loader";
import { MarkdownPreview } from "@/components/shared/md-preview";
import { PriceTag } from "@/components/shared/price-tag";
import { useGroup } from "@/hooks/useGroups";
import { formatPrice } from "@/lib/format";

function MobilePurchaseBar({
  slug,
  price,
  priceLabel,
  compareAtPrice,
}: {
  slug: string;
  price: number;
  priceLabel: string;
  compareAtPrice: number | null;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 shadow-[0_-8px_24px_-16px_rgba(0,0,0,0.35)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:px-4">
        <div className="min-w-0">
          <PriceTag price={price} priceLabel={priceLabel} compareAtPrice={compareAtPrice} />
          <p className="text-[10px] font-medium text-muted-foreground">Complete pack · instant download</p>
        </div>
        <Button
          render={<Link href={`/checkout/${slug}?itemType=group`} />}
          className="ml-auto h-11 w-auto shrink-0 rounded-xl bg-accent px-5 font-semibold text-accent-foreground shadow-md sm:px-6"
        >
          Buy bundle
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function GroupDetailPage({ slug }: { slug: string }) {
  const query = useGroup(slug);

  if (query.isPending) {
    return <GroupDetailSkeleton />;
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 sm:py-10">
        <ErrorState message="This bundle is unavailable." onRetry={() => query.refetch()} />
      </div>
    );
  }

  const { group, relatedGroups } = query.data;
  const individualValue = group.notes.reduce((total, note) => total + note.price, 0);
  const savings = individualValue - group.price;
  const savingsPercent = individualValue > 0 ? Math.round((savings / individualValue) * 100) : 0;

  return (
    <div
      className="mx-auto max-w-7xl px-3 pt-2 pb-28 sm:px-4 sm:pt-4 lg:px-6 lg:pb-10"
      data-testid="group-content"
    >
      <div className="mb-3 flex items-center gap-2 sm:mb-5">
        <Button
          render={<Link href="/groups" />}
          variant="outline"
          size="icon-sm"
          aria-label="Back to bundles"
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
          <Link href="/groups" className="shrink-0 hover:text-foreground">
            Bundles
          </Link>
          <span aria-hidden="true" className="shrink-0 text-muted-foreground/40">
            /
          </span>
          <span className="truncate font-medium text-foreground">{group.name}</span>
        </nav>
      </div>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="min-w-0 space-y-3 sm:space-y-4">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/50 bg-muted/20 shadow-sm sm:aspect-[2/1]">
            {group.coverImageUrl ? (
              <Image
                src={group.coverImageUrl}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/5 to-transparent text-primary/20">
                <FileText aria-hidden="true" className="size-10 sm:size-12" />
                <span className="text-xs font-medium uppercase tracking-widest">Bundle cover</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <p className="text-[10px] font-bold tracking-[0.15em] text-accent uppercase sm:text-xs">
              {group.category.name} bundle
            </p>
            <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
              {group.name}
            </h1>
            {group.description ? (
              <MarkdownPreview
                markdown={group.description}
                className="text-sm leading-relaxed"
              />
            ) : null}
          </div>

          <div className="border-t border-border/40 pt-4 sm:pt-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4">
              <h2 className="font-heading text-base font-bold tracking-tight sm:text-lg">
                {group.noteCount} notes included
              </h2>
              <Badge variant="secondary" className="shrink-0 gap-1 rounded-full font-semibold">
                <Layers aria-hidden="true" className="size-3" />
                Complete pack
              </Badge>
            </div>
            <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
              {group.notes.map((note) => (
                <NoteCard key={note.id} note={note} variant="compact" />
              ))}
            </div>
          </div>
        </article>

        <aside className="space-y-3 sm:space-y-4 lg:sticky lg:top-16 lg:self-start">
          <Card className="rounded-2xl border border-border bg-card shadow-lg">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-base font-bold">Get this bundle</CardTitle>
              <CardDescription className="text-xs">
                {group.noteCount} notes · {group.category.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <PriceTag
                price={group.price}
                priceLabel={group.priceLabel}
                compareAtPrice={group.compareAtPrice}
                size="large"
              />

              {savings > 0 && (
                <div className="flex items-center gap-2.5 rounded-xl border border-success/20 bg-success/5 p-3">
                  <TrendingUp aria-hidden="true" className="size-4 shrink-0 text-success" />
                  <div>
                    <p className="text-sm font-bold text-success">Save {savingsPercent}%</p>
                    <p className="text-[11px] text-muted-foreground">
                      Individual value:{" "}
                      <span className="line-through">{formatPrice(individualValue)}</span>
                    </p>
                  </div>
                </div>
              )}

              <Button
                render={<Link href={`/checkout/${group.slug}?itemType=group`} />}
                className="h-11 w-full rounded-xl bg-accent font-semibold text-accent-foreground shadow-md transition-colors hover:bg-accent/90"
                size="lg"
              >
                Buy this bundle
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </Button>

              <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                Download your files instantly from the order confirmation page.
              </p>

              <div className="flex items-center justify-center gap-2 border-t border-border/50 pt-3 text-[11px] text-muted-foreground sm:pt-4">
                <span>Secure payment</span>
                <span aria-hidden="true" className="text-muted-foreground/30">
                  ·
                </span>
                <span>Original content</span>
                <span aria-hidden="true" className="text-muted-foreground/30">
                  ·
                </span>
                <span>No spam</span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {relatedGroups.length > 0 && (
        <section className="mt-8 border-t border-border/40 pt-6 sm:mt-10 sm:pt-8">
          <h2 className="mb-3 font-heading text-lg font-bold tracking-tight sm:mb-4 sm:text-xl">
            More bundles you might like
          </h2>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedGroups.map((related) => (
              <GroupCard key={related.id} group={related} />
            ))}
          </div>
        </section>
      )}

      <MobilePurchaseBar
        slug={group.slug}
        price={group.price}
        priceLabel={group.priceLabel}
        compareAtPrice={group.compareAtPrice}
      />
    </div>
  );
}
