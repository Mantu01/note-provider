import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { PublicCategory } from "@/lib/types";

export function CategoryCard({ category }: { category: PublicCategory }) {
  return (
    <Link href={`/notes?category=${encodeURIComponent(category.slug)}`}>
      <div className="flex min-w-36 shrink-0 items-center gap-2.5 rounded-lg border border-border/50 bg-card px-3 py-2">
        <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
          <BookOpen aria-hidden="true" className="size-3.5" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-xs font-semibold text-foreground">
            {category.name}
          </span>
          <span className="text-[9px] text-muted-foreground">
            {category.noteCount} note{category.noteCount !== 1 ? "s" : ""}
          </span>
        </span>
      </div>
    </Link>
  );
}
