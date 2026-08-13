import Image from "next/image";
import Link from "next/link";
import { FileText, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PriceTag } from "@/components/shared/price-tag";
import { StatusBadge } from "@/components/shared/status-badge";
import type { PublicNote } from "@/lib/types";
import { cn } from "@/lib/utils";

export function NoteCard({
  note,
  variant = "default",
}: {
  note: PublicNote;
  variant?: "default" | "compact" | "featured";
}) {
  const isCompact = variant === "compact";

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-2xl border shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-primary/30",
        isCompact && "flex-row py-0",
      )}
    >
      <Link
        href={`/notes/${note.slug}`}
        className={cn(
          "relative block overflow-hidden brand-gradient-soft",
          isCompact ? "aspect-[16/9] w-36 shrink-0" : "aspect-[16/9] w-full",
        )}
        aria-label={`View ${note.title}`}
      >
        {note.coverImageUrl ? (
          <Image
            src={note.coverImageUrl}
            alt={`Cover for ${note.title}`}
            fill
            sizes={
              isCompact
                ? "144px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            }
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <FileText
            aria-hidden="true"
            className="absolute inset-0 m-auto size-12 text-primary/60 transition-transform duration-300 group-hover:scale-110"
          />
        )}
        {note.isLocked && (
          <Badge className="absolute top-3 right-3 bg-card/90 backdrop-blur text-card-foreground border shadow-sm flex items-center gap-1">
            <Lock aria-hidden="true" className="size-3" /> Paid
          </Badge>
        )}
      </Link>

      <CardContent className={cn("flex min-w-0 flex-1 flex-col gap-3 p-5", isCompact && "py-4 p-4")}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{note.category.name}</Badge>
          <StatusBadge type="level" value={note.level} />
        </div>

        <Link
          href={`/notes/${note.slug}`}
          className="line-clamp-2 font-heading text-lg font-semibold leading-snug transition-colors hover:text-primary"
        >
          {note.title}
        </Link>

        {!isCompact && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {note.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <PriceTag
            price={note.price}
            priceLabel={note.priceLabel}
            compareAtPrice={note.compareAtPrice}
          />
          {note.pageCount ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              <FileText aria-hidden="true" className="size-3.5" />
              {note.pageCount} pages
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
