import Link from "next/link";
import { CategoryIcon } from "@/components/shared/category-icon";
import type { PublicCategory } from "@/lib/types";

export function CategoryCard({ category }: { category: PublicCategory }) {
  return (
    <Link
      href={`/notes?category=${encodeURIComponent(category.slug)}`}
      className="flex min-w-36 shrink-0 items-center gap-2.5 rounded-xl border border-border/50 bg-card px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-muted/30"
    >
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <CategoryIcon name={category.icon} className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold text-foreground">
          {category.name}
        </span>
        <span className="text-[10px] tabular-nums text-muted-foreground">
          {category.noteCount} note{category.noteCount !== 1 ? "s" : ""}
        </span>
      </span>
    </Link>
  );
}
