import Image from "next/image";
import Link from "next/link";
import { FileText, BookOpen, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriceTag } from "./price-tag";
import { LevelBadge, PricingBadge } from "./badges";
import type { PublicNote } from "@/lib/types";

interface NoteCardProps {
  note: PublicNote;
  variant?: "default" | "compact" | "featured";
}

export function NoteCard({ note, variant = "default" }: NoteCardProps) {
  const compact = variant === "compact";
  const featured = variant === "featured";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card torn-paper paper-card transition-shadow hover:shadow-md",
        compact ? "flex flex-row items-stretch" : "flex flex-col",
        featured && "ring-1 ring-brand-orange/30 shadow-sm"
      )}
    >
      <Link
        href={`/notes/${note.slug}`}
        className={cn(
          "relative block overflow-hidden shrink-0",
          compact ? "w-28" : "aspect-[16/9]"
        )}
        aria-label={`View ${note.title}`}
      >
        {note.coverImageUrl ? (
          <Image
            src={note.coverImageUrl}
            alt=""
            fill
            sizes={compact ? "112px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1.5 text-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <FileText aria-hidden="true" className="size-7" />
            <span className="text-[8px] font-semibold uppercase tracking-widest">PDF</span>
          </div>
        )}

        {featured && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-brand-orange/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-md">
            <TrendingUp aria-hidden="true" className="size-2.5" />
            Featured
          </span>
        )}
      </Link>

      <div className={cn(
        "flex min-w-0 flex-1 flex-col gap-2 p-3",
        compact && "py-3 pl-3 pr-3.5"
      )}>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex h-5 items-center rounded-full bg-secondary px-2 text-[10px] font-semibold text-secondary-foreground border border-border/50">
            {note.category.name}
          </span>
          <LevelBadge level={note.level} />
        </div>

        <Link
          href={`/notes/${note.slug}`}
          className={cn(
            "font-heading font-semibold leading-snug text-foreground line-clamp-2 transition-colors group-hover:text-primary/80",
            compact ? "text-[11px] line-clamp-1" : "text-xs line-clamp-2"
          )}
        >
          {note.title}
        </Link>

        {!compact && (
          <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground flex-1">
            {note.description}
          </p>
        )}

        <div className={cn(
          "mt-auto flex items-end justify-between gap-2 pt-1",
          compact && "pt-0"
        )}>
          <PriceTag price={note.price} priceLabel={note.priceLabel} compareAtPrice={note.compareAtPrice} />
          {!compact && (
            <div className="flex items-center gap-1.5">
              {note.pageCount && (
                <span className="inline-flex items-center gap-1 text-[9px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                  <BookOpen aria-hidden="true" className="size-2.5" />
                  {note.pageCount}pg
                </span>
              )}
              <PricingBadge pricingType={note.pricingType} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
