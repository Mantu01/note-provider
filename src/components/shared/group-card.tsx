import Image from "next/image";
import Link from "next/link";
import { Layers3, BookOpen, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PriceTag } from "@/components/shared/price-tag";
import type { PublicGroup } from "@/lib/types";

interface GroupCardProps {
  group: PublicGroup;
  variant?: "default" | "featured";
}

export function GroupCard({ group, variant = "default" }: GroupCardProps) {
  const featured = variant === "featured";

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card torn-paper",
        featured && "ring-1 ring-primary/15"
      )}
    >
      <Link
        href={`/groups/${group.slug}`}
        className={cn(
          "relative block overflow-hidden bg-muted/10",
          featured ? "aspect-[16/8]" : "aspect-[16/9]"
        )}
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
          <div className="flex size-full flex-col items-center justify-center gap-1.5 text-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <Layers3 aria-hidden="true" className="size-10" />
            <span className="text-[8px] font-semibold uppercase tracking-widest">Bundle</span>
          </div>
        )}

        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-card/90 px-2 py-0.5 text-[9px] font-bold text-foreground backdrop-blur-sm shadow-sm">
          <BookOpen aria-hidden="true" className="size-2.5 text-primary" />
          {group.noteCount} notes
        </span>

        {featured && (
          <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground backdrop-blur-sm shadow-sm">
            <TrendingUp aria-hidden="true" className="size-2.5" />
            Featured
          </span>
        )}
      </Link>

      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="h-5 rounded-full px-2 text-[10px] font-semibold">
            {group.category.name}
          </Badge>
          <PriceTag price={group.price} priceLabel={group.priceLabel} compareAtPrice={group.compareAtPrice} />
        </div>

        <Link
          href={`/groups/${group.slug}`}
          className="block font-heading text-sm font-bold leading-snug text-foreground line-clamp-1"
        >
          {group.name}
        </Link>

        <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
          {group.description}
        </p>
      </div>
    </article>
  );
}
