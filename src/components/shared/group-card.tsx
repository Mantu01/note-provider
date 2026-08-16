import Image from "next/image";
import Link from "next/link";
import { Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/shared/price-tag";
import type { PublicGroup } from "@/lib/types";

type GroupCardProps = {
  group: PublicGroup;
};

export function GroupCard({ group }: GroupCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <Link
        href={`/groups/${group.slug}`}
        className="relative block aspect-[16/9] overflow-hidden bg-muted/40"
        aria-label={`View ${group.name}`}
      >
        {group.coverImageUrl ? (
          <Image
            src={group.coverImageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-primary/30">
            <Layers3 aria-hidden="true" className="size-10" />
          </div>
        )}
      </Link>

      <div className="space-y-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="h-5 rounded-full px-2 text-[10px] font-medium">
            {group.category.name}
          </Badge>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {group.noteCount} notes
          </span>
        </div>

        <Link
          href={`/groups/${group.slug}`}
          className="block font-heading text-sm font-semibold leading-snug text-foreground"
        >
          {group.name}
        </Link>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {group.description}
        </p>

        <div className="pt-1">
          <PriceTag price={group.price} priceLabel={group.priceLabel} compareAtPrice={group.compareAtPrice} />
        </div>
      </div>
    </div>
  );
}
