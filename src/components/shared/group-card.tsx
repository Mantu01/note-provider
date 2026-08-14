import Image from "next/image";
import Link from "next/link";
import { Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PriceTag } from "@/components/shared/price-tag";
import type { PublicGroup } from "@/lib/types";

export function GroupCard({ group }: { group: PublicGroup }) {
  return (
    <Card className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
      <Link
        href={`/groups/${group.slug}`}
        className="relative block aspect-[16/9] overflow-hidden brand-gradient-soft"
        aria-label={`View ${group.name}`}
      >
        {group.coverImageUrl ? (
          <Image
            src={group.coverImageUrl}
            alt={`Cover for ${group.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <Layers3
            aria-hidden="true"
            className="absolute inset-0 m-auto size-12 text-primary/60"
          />
        )}
      </Link>

      <CardContent className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">{group.category.name}</Badge>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
            {group.noteCount} notes
          </span>
        </div>

        <Link
          href={`/groups/${group.slug}`}
          className="line-clamp-2 font-heading text-lg font-semibold text-foreground"
        >
          {group.name}
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
          {group.description}
        </p>

        <div className="pt-2">
          <PriceTag
            price={group.price}
            priceLabel={group.priceLabel}
            compareAtPrice={group.compareAtPrice}
          />
        </div>
      </CardContent>
    </Card>
  );
}
