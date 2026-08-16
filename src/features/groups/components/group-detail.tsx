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
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <ShimmerLoader className="h-4 w-48" />
          <ShimmerLoader className="h-56 w-full rounded-2xl" />
          <ShimmerLoader className="h-6 w-3/4" />
          <ShimmerLoader className="h-4 w-full" />
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link href="/" className="text-muted-foreground">Home</Link>
        <span className="mx-1.5 text-muted-foreground/50">/</span>
        <Link href="/groups" className="text-muted-foreground">Bundles</Link>
        <span className="mx-1.5 text-muted-foreground/50">/</span>
        <span className="font-medium text-foreground">{group.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="space-y-5">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border/60 bg-muted/40">
            {group.coverImageUrl ? (
              <Image
                src={group.coverImageUrl}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-primary/30">
                <FileText className="size-10" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-primary">
              {group.category.name} bundle
            </p>
            <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
              {group.name}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {group.description}
            </p>
          </div>

          <div className="border-t border-border/40 pt-5">
            <h2 className="mb-3 font-heading text-sm font-bold tracking-tight">Included notes</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.notes.map((note) => (
                <NoteCard key={note.id} note={note} variant="compact" />
              ))}
            </div>
          </div>
        </article>

        <aside className="lg:sticky lg:top-16 lg:self-start">
          <Card className="rounded-xl border border-border/60">
            <CardContent className="space-y-4 p-4">
              <p className="text-xs text-muted-foreground">
                {group.noteCount} note{group.noteCount !== 1 ? "s" : ""} included
              </p>
              <PriceTag price={group.price} priceLabel={group.priceLabel} compareAtPrice={group.compareAtPrice} size="large" />
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
                <span className="text-muted-foreground">Individual value </span>
                <span className="font-semibold">{formatPrice(individualValue)}</span>
              </div>
              <Button
                render={<Link href={`/checkout/${group.slug}?itemType=group`} />}
                className="w-full rounded-lg"
                size="lg"
              >
                Buy this bundle
                <ArrowLeft aria-hidden="true" className="ml-1 size-3 rotate-180" />
              </Button>
              <p className="text-center text-[10px] text-muted-foreground">
                Delivered manually within 4–6 hours.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      {relatedGroups.length > 0 && (
        <section className="mt-10 border-t border-border/40 pt-8">
          <h2 className="mb-4 font-heading text-base font-bold tracking-tight">More bundles</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {relatedGroups.map((related) => (
              <GroupCard key={related.id} group={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
