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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/95 shadow-lg backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4">
        <div className="min-w-0 flex-1">
          <PriceTag price={price} priceLabel={priceLabel} compareAtPrice={compareAtPrice} />
          <p className="text-[9px] font-medium text-muted-foreground">Complete pack · instant download</p>
        </div>
        <Button
          render={<Link href={`/checkout/${slug}?itemType=group`} />}
          className="h-9 shrink-0 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-sm"
        >
          Buy bundle
          <ArrowRight aria-hidden="true" className="size-3" />
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
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
        <ErrorState message="This bundle is unavailable." onRetry={() => query.refetch()} />
      </div>
    );
  }

  const { group, relatedGroups } = query.data;
  const individualValue = group.notes.reduce((total, note) => total + note.price, 0);
  const savings = individualValue - group.price;
  const savingsPercent = individualValue > 0 ? Math.round((savings / individualValue) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-3 pt-2 pb-20 sm:px-4 sm:pt-3 md:pb-10 lg:px-6" data-testid="group-content">
      <div className="mb-2 flex items-center gap-2 sm:mb-3">
        <Button
          render={<Link href="/groups" />}
          variant="outline"
          size="icon-sm"
          aria-label="Back to bundles"
          className="size-8 shrink-0 rounded-lg md:hidden"
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
          <Link href="/groups" className="shrink-0 hover:text-foreground">
            Bundles
          </Link>
          <span aria-hidden="true" className="shrink-0 text-muted-foreground/40">/</span>
          <span className="truncate font-medium text-foreground">{group.name}</span>
        </nav>
      </div>

      <div className="grid gap-2 sm:gap-3 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <article className="min-w-0 space-y-2 sm:space-y-3">
          <div className="relative overflow-hidden rounded-lg border border-border/50 bg-muted/20 shadow-sm">
            {group.coverImageUrl ? (
              <Image
                src={group.coverImageUrl}
                alt=""
                width={800}
                height={500}
                className="h-auto w-full object-cover"
              />
            ) : (
              <div className="flex h-28 w-full flex-col items-center justify-center gap-1.5 bg-linear-to-br from-primary/5 to-transparent text-primary/20 sm:h-40 md:h-48">
                <FileText aria-hidden="true" className="size-8 sm:size-10" />
                <span className="text-[10px] font-semibold uppercase tracking-widest">Bundle cover</span>
              </div>
            )}
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <p className="text-[9px] font-bold tracking-[0.15em] text-accent uppercase sm:text-[10px]">
              {group.category.name} bundle
            </p>
            <h1 className="font-heading text-sm font-bold leading-tight text-foreground sm:text-base md:text-xl">
              {group.name}
            </h1>
            {group.description ? (
              <MarkdownPreview
                markdown={group.description}
                className="text-xs leading-relaxed sm:text-sm"
              />
            ) : null}
          </div>

          <div className="border-t border-border/40 pt-2.5 sm:pt-3">
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 sm:mb-2">
              <h2 className="font-heading text-xs font-bold tracking-tight sm:text-sm">
                {group.noteCount} notes included
              </h2>
              <Badge variant="secondary" className="shrink-0 gap-1 rounded-full text-[10px] font-semibold">
                <Layers aria-hidden="true" className="size-2.5" />
                Complete pack
              </Badge>
            </div>
            <div className="grid gap-1.5 sm:gap-2">
              {group.notes.map((note) => (
                <NoteCard key={note.id} note={note} variant="compact" />
              ))}
            </div>
          </div>
        </article>

        <aside className="space-y-2 sm:space-y-3 lg:sticky lg:top-14 lg:self-start">
          <Card className="rounded-xl border border-border bg-card shadow-sm">
            <CardHeader className="pb-1 sm:pb-1.5">
              <CardTitle className="text-xs font-bold sm:text-sm">Get this bundle</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs">
                {group.noteCount} notes · {group.category.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-2.5">
              <PriceTag
                price={group.price}
                priceLabel={group.priceLabel}
                compareAtPrice={group.compareAtPrice}
                size="large"
              />

              {savings > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 p-2.5">
                  <TrendingUp aria-hidden="true" className="size-3.5 shrink-0 text-success" />
                  <div>
                    <p className="text-xs font-bold text-success">Save {savingsPercent}%</p>
                    <p className="text-[10px] text-muted-foreground">
                      Individual value:{" "}
                      <span className="line-through">{formatPrice(individualValue)}</span>
                    </p>
                  </div>
                </div>
              )}

              <Button
                render={<Link href={`/checkout/${group.slug}?itemType=group}`} />}
                className="h-11 w-full rounded-lg text-sm font-semibold bg-accent text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
                size="lg"
              >
                Buy this bundle
                <ArrowRight aria-hidden="true" className="size-3" />
              </Button>

              <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
                Download your files instantly from the order confirmation page.
              </p>

              <div className="flex items-center justify-center gap-1.5 border-t border-border/50 pt-2.5 text-[10px] text-muted-foreground sm:pt-3">
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
        <section className="mt-4 border-t border-border/40 pt-3 sm:mt-6 sm:pt-4">
          <h2 className="mb-1.5 font-heading text-xs font-bold tracking-tight sm:mb-2 sm:text-sm">
            More bundles you might like
          </h2>
          <div className="grid gap-1.5 sm:gap-2 md:grid-cols-2 lg:grid-cols-3">
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
