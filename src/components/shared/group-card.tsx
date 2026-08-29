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
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5",
        featured && "ring-1 ring-primary/20"
      )}
    >
      {/* Cover image */}
      <Link
        href={`/groups/${group.slug}`}
        className={cn(
          "relative block overflow-hidden bg-muted/20",
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
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-primary/20">
            <Layers3 aria-hidden="true" className="size-10" />
          </div>
        )}

        {/* Note count badge */}
        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-card/90 px-2 py-0.5 text-[9px] font-bold text-foreground backdrop-blur-sm shadow-sm">
          <BookOpen aria-hidden="true" className="size-2.5 text-primary" />
          {group.noteCount} notes
        </span>

        {/* Featured ribbon */}
        {featured && (
          <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground backdrop-blur-sm shadow-sm">
            <TrendingUp aria-hidden="true" className="size-2.5" />
            Featured
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Category + Price row */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="h-5 rounded-full px-2 text-[10px] font-semibold">
            {group.category.name}
          </Badge>
          <PriceTag price={group.price} priceLabel={group.priceLabel} compareAtPrice={group.compareAtPrice} />
        </div>

        {/* Title */}
        <Link
          href={`/groups/${group.slug}`}
          className="block font-heading text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-1"
        >
          {group.name}
        </Link>

        {/* Description */}
        <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
          {group.description}
        </p>
      </div>
    </article>
  );
}
