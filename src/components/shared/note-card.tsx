import Image from "next/image";
import Link from "next/link";
import { FileText, BookOpen, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PriceTag } from "@/components/shared/price-tag";
import { StatusBadge } from "@/components/shared/status-badge";
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
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-200 hover:border-primary/25 hover:shadow-lg hover:-translate-y-0.5",
        compact ? "flex flex-row items-stretch" : "flex flex-col"
      )}
    >
      {/* Cover image */}
      <Link
        href={`/notes/${note.slug}`}
        className={cn(
          "relative block overflow-hidden bg-muted/20 shrink-0",
          compact ? "w-28" : "aspect-[16/9]",
          featured && "aspect-[16/10]"
        )}
        aria-label={`View ${note.title}`}
      >
        {note.coverImageUrl ? (
          <Image
            src={note.coverImageUrl}
            alt=""
            fill
            sizes={compact ? "112px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
            className="object-cover transition-transform duration-400 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1.5 text-primary/25 bg-gradient-to-br from-primary/5 to-transparent">
            <FileText aria-hidden="true" className="size-7" />
            <span className="text-[8px] font-semibold uppercase tracking-widest">PDF</span>
          </div>
        )}

        {/* Pricing badge */}
        <span className={cn(
          "absolute top-2 right-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-md",
          note.pricingType === "paid"
            ? "bg-card/90 text-foreground"
            : "bg-success/90 text-success-foreground"
        )}>
          {note.pricingType === "paid" ? "Premium" : "Free"}
        </span>

        {/* Featured ribbon */}
        {featured && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground shadow-sm">
            <TrendingUp aria-hidden="true" className="size-2.5" />
            Featured
          </span>
        )}
      </Link>

      {/* Content */}
      <div className={cn(
        "flex min-w-0 flex-1 flex-col gap-2 p-3",
        compact && "py-3 pl-3 pr-3.5"
      )}>
        {/* Meta row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="secondary" className="h-5 rounded-full px-2 text-[10px] font-semibold">
            {note.category.name}
          </Badge>
          <StatusBadge type="level" value={note.level} />
        </div>

        {/* Title */}
        <Link
          href={`/notes/${note.slug}`}
          className={cn(
            "font-heading font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors",
            compact ? "text-[11px] line-clamp-1" : "text-xs line-clamp-2"
          )}
        >
          {note.title}
        </Link>

        {/* Description */}
        {!compact && (
          <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground flex-1">
            {note.description}
          </p>
        )}

        {/* Footer row */}
        <div className={cn(
          "mt-auto flex items-end justify-between gap-2 pt-1",
          compact && "pt-0"
        )}>
          <PriceTag price={note.price} priceLabel={note.priceLabel} compareAtPrice={note.compareAtPrice} />
          {!compact && note.pageCount && (
            <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md">
              <BookOpen aria-hidden="true" className="size-2.5" />
              {note.pageCount} pg
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
