import Image from "next/image";
import Link from "next/link";
import { Layers3, BookOpen } from "lucide-react";
import { PriceTag } from "./price-tag";
import type { PublicGroup } from "@/lib/types";

export function GroupCard({ group }: { group: PublicGroup }) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      <Link
        href={`/groups/${group.slug}`}
        className="relative block aspect-[16/9] overflow-hidden"
        aria-label={`View ${group.name}`}
      >
        {group.coverImageUrl ? (
          <Image
            src={group.coverImageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-primary/5 to-transparent text-primary/20">
            <Layers3 aria-hidden="true" className="size-10" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Bundle</span>
          </div>
        )}

        <span className="absolute right-1.5 bottom-1.5 inline-flex items-center gap-1 rounded-full bg-card/95 px-1.5 py-0.5 text-[9px] font-semibold text-foreground shadow-sm sm:right-2 sm:bottom-2 sm:text-[10px]">
          <BookOpen aria-hidden="true" className="size-2.5 text-primary" />
          {group.noteCount} notes
        </span>
      </Link>

      <div className="space-y-1.5 p-2.5 sm:p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex h-5 items-center rounded-full bg-muted px-1.5 text-[10px] font-medium text-muted-foreground sm:px-2 sm:text-[11px]">
            {group.category.name}
          </span>
          <PriceTag price={group.price} priceLabel={group.priceLabel} compareAtPrice={group.compareAtPrice} />
        </div>

        <Link
          href={`/groups/${group.slug}`}
          className="block font-heading text-xs font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-sm"
        >
          {group.name}
        </Link>

        <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
          {group.description}
        </p>
      </div>
    </article>
  );
}
