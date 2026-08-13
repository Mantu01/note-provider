import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { PublicCategory } from "@/lib/types";

export function CategoryCard({ category }: { category: PublicCategory }) {
  return (
    <Link
      href={`/notes?category=${encodeURIComponent(category.slug)}`}
      className="min-w-48 block"
    >
      <Card className="rounded-2xl border shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30">
        <CardContent className="flex items-center gap-3.5 p-4">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <BookOpen aria-hidden="true" className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block font-semibold truncate text-foreground">{category.name}</span>
            <span className="text-xs text-muted-foreground">{category.noteCount} notes</span>
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
