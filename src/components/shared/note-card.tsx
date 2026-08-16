import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PriceTag } from "@/components/shared/price-tag";
import { StatusBadge } from "@/components/shared/status-badge";
import type { PublicNote } from "@/lib/types";

type NoteCardProps = {
  note: PublicNote;
  variant?: "default" | "compact" | "featured";
};

export function NoteCard({ note, variant = "default" }: NoteCardProps) {
  const compact = variant === "compact";
  const featured = variant === "featured";

  return (
    <div className={cn(
      "group overflow-hidden rounded-2xl border border-border/60 bg-card",
      compact ? "flex flex-row" : "flex flex-col",
    )}>
      <Link
        href={`/notes/${note.slug}`}
        className={cn(
          "relative block overflow-hidden bg-muted/40 shrink-0",
          compact ? "w-32" : featured ? "aspect-[16/9]" : "aspect-[16/9]",
        )}
        aria-label={`View ${note.title}`}
      >
        {note.coverImageUrl ? (
          <Image
            src={note.coverImageUrl}
            alt=""
            fill
            sizes={compact ? "128px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-primary/30">
            <FileText aria-hidden="true" className="size-8" />
          </div>
        )}
        {note.pricingType === "paid" && (
          <span className="absolute top-2 right-2 rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-sm backdrop-blur">
            Paid
          </span>
        )}
      </Link>

      <div className={cn(
        "flex min-w-0 flex-1 flex-col gap-2 p-3",
        compact && "py-3 pl-3 pr-4",
      )}>
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className="h-5 rounded-full px-2 text-[10px] font-medium">
            {note.category.name}
          </Badge>
          <StatusBadge type="level" value={note.level} />
        </div>

        <Link
          href={`/notes/${note.slug}`}
          className={cn(
            "font-heading font-semibold leading-snug text-foreground",
            compact ? "text-sm line-clamp-1" : "text-sm line-clamp-2",
          )}
        >
          {note.title}
        </Link>

        {!compact && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {note.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <PriceTag price={note.price} priceLabel={note.priceLabel} compareAtPrice={note.compareAtPrice} />
          {note.pageCount && !compact && (
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {note.pageCount} pg
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
