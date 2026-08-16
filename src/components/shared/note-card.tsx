import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
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

  return (
    <div className={cn(
      "overflow-hidden rounded-xl border border-border/50 bg-card",
      compact ? "flex flex-row" : "flex flex-col",
    )}>
      <Link
        href={`/notes/${note.slug}`}
        className={cn(
          "relative block overflow-hidden bg-muted/30 shrink-0",
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
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-primary/20">
            <FileText aria-hidden="true" className="size-6" />
          </div>
        )}
        {note.pricingType === "paid" && (
          <span className="absolute top-1.5 right-1.5 rounded-full bg-card/90 px-1.5 py-0.5 text-[9px] font-semibold text-foreground backdrop-blur">
            Paid
          </span>
        )}
      </Link>

      <div className={cn(
        "flex min-w-0 flex-1 flex-col gap-1.5 p-2.5",
        compact && "py-2.5 pl-2.5 pr-3",
      )}>
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="h-4 rounded-full px-1.5 text-[9px] font-medium">
            {note.category.name}
          </Badge>
          <StatusBadge type="level" value={note.level} />
        </div>

        <Link
          href={`/notes/${note.slug}`}
          className={cn(
            "font-heading font-semibold leading-snug text-foreground",
            compact ? "text-xs line-clamp-1" : "text-xs line-clamp-2",
          )}
        >
          {note.title}
        </Link>

        {!compact && (
          <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
            {note.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-0.5">
          <PriceTag price={note.price} priceLabel={note.priceLabel} compareAtPrice={note.compareAtPrice} />
          {note.pageCount && !compact && (
            <span className="shrink-0 text-[9px] text-muted-foreground">
              {note.pageCount} pg
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
