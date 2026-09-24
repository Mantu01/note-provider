import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriceTag } from "./price-tag";
import { LevelBadge, PricingBadge } from "./badges";
import type { PublicNote } from "@/lib/types";

interface NoteCardProps {
  note: PublicNote;
  variant?: "default" | "compact";
}

export function NoteCard({ note, variant = "default" }: NoteCardProps) {
  const compact = variant === "compact";

  return (
    <article
      className={cn(
        "group relative flex overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md",
        compact ? "flex-row" : "flex-col max-sm:flex-row",
      )}
    >
      <Link
        href={`/notes/${note.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className={cn(
          "relative shrink-0 overflow-hidden bg-muted/20",
          compact ? "w-20 sm:w-24" : "aspect-[16/9] w-full max-sm:aspect-[4/3] max-sm:w-20",
        )}
      >
        {note.coverImageUrl ? (
          <Image
            src={note.coverImageUrl}
            alt={note.title}
            fill
            sizes="(max-width: 640px) 80px, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1 bg-linear-to-br from-primary/5 to-transparent text-primary/30">
            <FileText aria-hidden="true" className="size-5" />
            <span className="text-[7px] font-semibold tracking-widest uppercase">Study note</span>
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1 p-2 max-sm:p-1.5">
        <div className="flex min-w-0 items-center gap-1 flex-wrap">
          <span className="inline-flex min-w-0 items-center rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
            <span className="truncate">{note.category.name}</span>
          </span>
          <LevelBadge level={note.level} className="shrink-0" />
          {!compact && (
            <PricingBadge pricingType={note.pricingType} className="shrink-0 max-sm:hidden" />
          )}
        </div>

        <Link
          href={`/notes/${note.slug}`}
          className={cn(
            "font-heading font-semibold text-foreground line-clamp-2 group-hover:text-primary",
            compact ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm",
          )}
        >
          {note.title}
        </Link>

        {!compact && (
          <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground max-sm:hidden">
            {note.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-1.5 pt-0.5">
          <PriceTag
            price={note.price}
            priceLabel={note.priceLabel}
            compareAtPrice={note.compareAtPrice}
          />
          {compact && (
            <PricingBadge pricingType={note.pricingType} className="shrink-0 max-sm:hidden" />
          )}
        </div>
      </div>
    </article>
  );
}
