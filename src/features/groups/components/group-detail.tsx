"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FileText, Layers, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";
import { GroupCard } from "@/components/shared/group-card";
import { NoteCard } from "@/components/shared/note-card";
import { ShimmerLoader } from "@/components/shared/shimmer-loader";
import { PriceTag } from "@/components/shared/price-tag";
import { useGroup } from "@/features/groups/api/use-group";
import { formatPrice } from "@/lib/format";

export function GroupDetailPage({ slug }: { slug: string }) {
  const query = useGroup(slug);

  if (query.isPending) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <ShimmerLoader className="h-3 w-32 rounded" />
          <ShimmerLoader className="h-56 w-full rounded-2xl" />
          <ShimmerLoader className="h-5 w-3/4 rounded" />
          <ShimmerLoader className="h-3 w-full rounded" />
        </div>
      </div>
    );
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
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span aria-hidden="true" className="text-muted-foreground/40">/</span>
        <Link href="/groups" className="hover:text-foreground transition-colors">Bundles</Link>
        <span aria-hidden="true" className="text-muted-foreground/40">/</span>
        <span className="font-medium text-foreground truncate">{group.name}</span>
      </nav>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* Article */}
        <article className="space-y-5">
          {/* Hero image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/50 bg-muted/20 shadow-sm">
            {group.coverImageUrl ? (
              <Image
                src={group.coverImageUrl}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-primary/20">
                <FileText aria-hidden="true" className="size-12" />
                <span className="text-xs font-medium uppercase tracking-widest">Bundle Cover</span>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary">
              {group.category.name} bundle
            </p>
            <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
              {group.name}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {group.description}
            </p>
          </div>

          {/* Notes included */}
          <div className="border-t border-border/40 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-base font-bold tracking-tight">
                {group.noteCount} notes included
              </h2>
              <Badge variant="secondary" className="h-6 rounded-full px-3 text-xs font-semibold">
                <Layers aria-hidden="true" className="mr-1 size-3" />
                Complete pack
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.notes.map((note) => (
                <NoteCard key={note.id} note={note} variant="compact" />
              ))}
            </div>
          </div>
        </article>

        {/* Sidebar - sticky purchase card */}
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
          <Card className="rounded-2xl border border-border shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Get this bundle</CardTitle>
              <CardDescription className="text-xs">
                {group.noteCount} notes · {group.category.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PriceTag price={group.price} priceLabel={group.priceLabel} compareAtPrice={group.compareAtPrice} size="large" />

              {/* Savings callout */}
              {savings > 0 && (
                <div className="rounded-xl border border-success/20 bg-success/5 p-3 flex items-center gap-2">
                  <TrendingUp aria-hidden="true" className="size-4 shrink-0 text-success" />
                  <div>
                    <p className="text-xs font-bold text-success">Save {savingsPercent}%</p>
                    <p className="text-[10px] text-muted-foreground">
                      Individual value: <span className="line-through text-muted-foreground">{formatPrice(individualValue)}</span>
                    </p>
                  </div>
                </div>
              )}

              <Button
                render={<Link href={`/checkout/${group.slug}?itemType=group`} />}
                className="w-full rounded-xl font-semibold shadow-md"
                size="lg"
              >
                Buy this bundle
                <ArrowLeft aria-hidden="true" className="ml-1 size-3.5 rotate-180" />
              </Button>

              <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
                Delivered within 4–6 hours after payment confirmation.
              </p>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-2 border-t border-border/50 pt-4 text-[10px] text-muted-foreground">
                <span>Secure payment</span>
                <span className="text-muted-foreground/30">·</span>
                <span>Original content</span>
                <span className="text-muted-foreground/30">·</span>
                <span>No spam</span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* More bundles */}
      {relatedGroups.length > 0 && (
        <section className="mt-10 border-t border-border/40 pt-8">
          <h2 className="mb-4 font-heading text-lg font-bold tracking-tight">More bundles you might like</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedGroups.map((related) => (
              <GroupCard key={related.id} group={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
