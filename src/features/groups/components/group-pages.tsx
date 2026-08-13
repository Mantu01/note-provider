"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { GroupCard } from "@/components/shared/group-card";
import { NoteCard } from "@/components/shared/note-card";
import { PriceTag } from "@/components/shared/price-tag";
import { useGroup } from "@/features/groups/api/use-group";
import { useGroups } from "@/features/groups/api/use-groups";
import { formatPrice } from "@/lib/format";

export function GroupsPage() {
  const query = useGroups({ limit: 12 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Bundles
        </p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          More notes, better value
        </h1>
        <p className="text-muted-foreground">
          Focused collections to make planning your revision easier.
        </p>
      </div>

      {query.isError ? (
        <div className="mt-8">
          <ErrorState onRetry={() => query.refetch()} />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {query.data?.items.length ? (
            query.data.items.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3">
              <EmptyState
                icon={Layers3}
                title="Bundles are coming soon"
                description="We are assembling our first value-packed note collections."
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function GroupDetailPage({ slug }: { slug: string }) {
  const query = useGroup(slug);

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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="px-2">/</span>
        <Link href="/groups" className="hover:text-foreground">
          Bundles
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground font-medium">{group.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <article className="space-y-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl brand-gradient-soft shadow-sm">
            {group.coverImageUrl ? (
              <Image
                src={group.coverImageUrl}
                alt={group.name}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-primary/60">
                <FileText className="size-16" />
              </div>
            )}
          </div>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            {group.category.name} bundle
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            {group.name}
          </h1>
          <p className="max-w-3xl leading-relaxed text-muted-foreground">
            {group.description}
          </p>

          <h2 className="pt-6 text-2xl font-bold border-t">Included notes</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.notes.map((note) => (
              <NoteCard key={note.id} note={note} variant="compact" />
            ))}
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="rounded-3xl border shadow-sm">
            <CardContent className="space-y-5 p-6">
              <p className="text-sm text-muted-foreground">
                {group.noteCount} notes included
              </p>
              <PriceTag
                price={group.price}
                priceLabel={group.priceLabel}
                compareAtPrice={group.compareAtPrice}
                size="large"
              />
              <div className="rounded-xl bg-muted p-3 text-sm">
                <span className="text-muted-foreground">Individual value </span>
                <span className="font-semibold">{formatPrice(individualValue)}</span>
              </div>
              <Button
                render={<Link href={`/checkout/${group.slug}?itemType=group`} />}
                className="w-full"
                size="lg"
              >
                Buy this bundle
                <ArrowRight aria-hidden="true" className="ml-2 size-4" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Delivered manually to your chosen handle within 4–6 hours.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      {relatedGroups.length ? (
        <section className="mt-16 border-t pt-12">
          <h2 className="mb-6 text-2xl font-bold">More bundles</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {relatedGroups.map((related) => (
              <GroupCard key={related.id} group={related} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
