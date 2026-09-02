import Image from "next/image";
import Link from "next/link";
import { Layers3, BookOpen, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriceTag } from "./price-tag";
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
        "group relative overflow-hidden rounded-xl border bg-card torn-paper paper-card transition-shadow hover:shadow-md",
        featured && "ring-1 ring-brand-orange/30 shadow-sm"
      )}
    >
      <Link
        href={`/groups/${group.slug}`}
        className={cn(
          "relative block overflow-hidden",
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
          <div className="flex size-full flex-col items-center justify-center gap-1.5 text-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <Layers3 aria-hidden="true" className="size-10" />
            <span className="text-[8px] font-semibold uppercase tracking-widest">Bundle</span>
          </div>
        )}

        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full bg-card/90 px-2 py-0.5 text-[9px] font-bold text-foreground backdrop-blur-md shadow-sm border border-white/20 dark:border-black/10">
          <BookOpen aria-hidden="true" className="size-2.5 text-primary" />
          {group.noteCount} notes
        </span>

        {featured && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-brand-orange/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-md">
            <TrendingUp aria-hidden="true" className="size-2.5" />
            Featured
          </span>
        )}
      </Link>

      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex h-5 items-center rounded-full bg-secondary px-2 text-[10px] font-semibold text-secondary-foreground border border-border/50">
            {group.category.name}
          </span>
          <PriceTag price={group.price} priceLabel={group.priceLabel} compareAtPrice={group.compareAtPrice} />
        </div>

        <Link
          href={`/groups/${group.slug}`}
          className="block font-heading text-sm font-bold leading-snug text-foreground line-clamp-1 transition-colors group-hover:text-primary/80"
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
