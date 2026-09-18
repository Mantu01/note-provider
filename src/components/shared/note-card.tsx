import Image from "next/image";
import Link from "next/link";
import { FileText, BookOpen, TrendingUp } from "lucide-react";
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
        "group relative overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md",
        compact ? "flex flex-row items-stretch" : "flex flex-col",
      )}
    >
      <Link
        href={`/notes/${note.slug}`}
        className={cn(
          "relative block shrink-0 overflow-hidden",
          compact ? "w-28" : "aspect-[16/9]",
        )}
        aria-label={`View ${note.title}`}
      >
        {note.coverImageUrl ? (
          <Image
            src={note.coverImageUrl}
            alt=""
            fill
            sizes={compact ? "112px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
            className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-primary/5 to-transparent text-primary/30">
            <FileText aria-hidden="true" className="size-7" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">PDF</span>
          </div>
        )}
      </Link>

      <div className={cn("flex min-w-0 flex-1 flex-col gap-2 p-3", compact && "pr-3.5")}>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex h-5 items-center rounded-full bg-muted px-2 text-[11px] font-medium text-muted-foreground">
            {note.category.name}
          </span>
          <LevelBadge level={note.level} />
        </div>

        <Link
          href={`/notes/${note.slug}`}
          className={cn(
            "font-heading font-semibold leading-snug text-foreground transition-colors group-hover:text-primary/80",
            compact ? "text-[13px] line-clamp-2" : "text-sm line-clamp-2",
          )}
        >
          {note.title}
        </Link>

        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
          <BookOpen aria-hidden="true" className="size-3 shrink-0" />
          <span className="truncate tabular-nums">
            {note.pageCount ? `${note.pageCount} pages` : "PDF notes"}
            {note.fileSizeLabel ? ` · ${note.fileSizeLabel}` : ""}
          </span>
        </p>

        {!compact && (
          <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
            {note.description}
          </p>
        )}

        <div
          className={cn(
            "mt-auto flex items-center justify-between gap-2 pt-1",
            compact && "pt-0.5",
          )}
        >
          <PriceTag price={note.price} priceLabel={note.priceLabel} compareAtPrice={note.compareAtPrice} />
          {!compact && <PricingBadge pricingType={note.pricingType} />}
        </div>
      </div>
    </article>
  );
}
