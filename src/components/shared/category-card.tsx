import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { PublicCategory } from "@/lib/types";

export function CategoryCard({ category }: { category: PublicCategory }) {
  return (
    <Link href={`/notes?category=${encodeURIComponent(category.slug)}`}>
      <Card className="min-w-44 overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <CardContent className="flex items-center gap-3 p-3">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <BookOpen aria-hidden="true" className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-foreground">
              {category.name}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {category.noteCount} note{category.noteCount !== 1 ? "s" : ""}
            </span>
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
