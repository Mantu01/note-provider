import Image from "next/image";
import Link from "next/link";
import { Layers3, BookOpen } from "lucide-react";
import { PriceTag } from "./price-tag";
import type { PublicGroup } from "@/lib/types";

export function GroupCard({ group }: { group: PublicGroup }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md max-sm:flex-row">
      <Link
        href={`/groups/${group.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-muted/20 max-sm:aspect-auto max-sm:w-28"
      >
        {group.coverImageUrl ? (
          <Image
            src={group.coverImageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 112px, (max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-primary/5 to-transparent text-primary/20">
            <Layers3 aria-hidden="true" className="size-7 sm:size-10" />
            <span className="text-[9px] font-semibold tracking-widest uppercase">Bundle</span>
          </div>
        )}

        <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-card/95 px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-sm">
          <BookOpen aria-hidden="true" className="size-2.5 text-primary" />
          {group.noteCount} notes
        </span>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="inline-flex min-w-0 items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            <span className="truncate">{group.category.name}</span>
          </span>
          <PriceTag
            price={group.price}
            priceLabel={group.priceLabel}
            compareAtPrice={group.compareAtPrice}
          />
        </div>

        <Link
          href={`/groups/${group.slug}`}
          className="font-heading text-sm font-semibold text-foreground transition-colors line-clamp-2 group-hover:text-primary"
        >
          {group.name}
        </Link>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {group.description}
        </p>
      </div>
    </article>
  );
}
