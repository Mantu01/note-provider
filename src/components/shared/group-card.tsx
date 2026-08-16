import Image from "next/image";
import Link from "next/link";
import { Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/shared/price-tag";
import type { PublicGroup } from "@/lib/types";

interface GroupCardProps {
  group: PublicGroup;
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
      <Link
        href={`/groups/${group.slug}`}
        className="relative block aspect-[16/9] overflow-hidden bg-muted/30"
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
          <div className="flex size-full items-center justify-center text-primary/20">
            <Layers3 aria-hidden="true" className="size-8" />
          </div>
        )}
      </Link>

      <div className="space-y-1.5 p-2.5">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="h-4 rounded-full px-1.5 text-[9px] font-medium">
            {group.category.name}
          </Badge>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
            {group.noteCount} notes
          </span>
        </div>

        <Link
          href={`/groups/${group.slug}`}
          className="block font-heading text-xs font-semibold leading-snug text-foreground"
        >
          {group.name}
        </Link>

        <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
          {group.description}
        </p>

        <div className="pt-0.5">
          <PriceTag price={group.price} priceLabel={group.priceLabel} compareAtPrice={group.compareAtPrice} />
        </div>
      </div>
    </div>
  );
}
