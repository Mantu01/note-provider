import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { PublicCategory } from "@/lib/types";

export function CategoryCard({ category }: { category: PublicCategory }) {
  return (
    <Link href={`/notes?category=${encodeURIComponent(category.slug)}`}>
      <div className="flex min-w-36 shrink-0 items-center gap-2.5 rounded-xl border border-border/50 bg-card px-3 py-2.5 transition-colors transition-shadow hover:border-primary/30 hover:shadow-sm">
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 transition-transform group-hover:scale-105">
          <BookOpen aria-hidden="true" className="size-4" />
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
