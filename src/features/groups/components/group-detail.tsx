"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <ShimmerLoader className="h-3.5 w-40" />
          <ShimmerLoader className="h-48 w-full rounded-xl" />
          <ShimmerLoader className="h-5 w-3/4" />
          <ShimmerLoader className="h-3.5 w-full" />
        </div>
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-3 text-[10px] text-muted-foreground">
        <Link href="/" className="text-muted-foreground">Home</Link>
        <span className="mx-1 text-muted-foreground/50">/</span>
        <Link href="/groups" className="text-muted-foreground">Bundles</Link>
        <span className="mx-1 text-muted-foreground/50">/</span>
        <span className="font-medium text-foreground">{group.name}</span>
      </nav>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border/50 bg-muted/30">
            {group.coverImageUrl ? (
              <Image
                src={group.coverImageUrl}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-primary/20">
                <FileText className="size-8" />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-primary">
              {group.category.name} bundle
            </p>
            <h1 className="font-heading text-xl font-bold tracking-tight md:text-2xl">
              {group.name}
            </h1>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {group.description}
            </p>
          </div>

          <div className="border-t border-border/40 pt-4">
            <h2 className="mb-2.5 font-heading text-xs font-bold tracking-tight">Included notes</h2>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {group.notes.map((note) => (
                <NoteCard key={note.id} note={note} variant="compact" />
              ))}
            </div>
          </div>
        </article>

        <aside className="lg:sticky lg:top-14 lg:self-start">
          <Card className="rounded-xl border border-border/50">
            <CardContent className="space-y-3 p-3">
              <p className="text-[10px] text-muted-foreground">
                {group.noteCount} note{group.noteCount !== 1 ? "s" : ""} included
              </p>
              <PriceTag price={group.price} priceLabel={group.priceLabel} compareAtPrice={group.compareAtPrice} size="large" />
              <div className="rounded-lg border border-border/50 bg-muted/20 p-2.5 text-xs">
                <span className="text-muted-foreground">Individual value </span>
                <span className="font-semibold">{formatPrice(individualValue)}</span>
              </div>
              <Button
                render={<Link href={`/checkout/${group.slug}?itemType=group`} />}
                className="w-full rounded-lg"
                size="lg"
              >
                Buy this bundle
                <ArrowLeft aria-hidden="true" className="ml-1 size-2.5 rotate-180" />
              </Button>
              <p className="text-center text-[9px] text-muted-foreground">
                Delivered manually within 4–6 hours.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      {relatedGroups.length > 0 && (
        <section className="mt-8 border-t border-border/40 pt-6">
          <h2 className="mb-3 font-heading text-sm font-bold tracking-tight">More bundles</h2>
          <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
            {relatedGroups.map((related) => (
              <GroupCard key={related.id} group={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
