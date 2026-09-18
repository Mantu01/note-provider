"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const change = (next: number) => {
    onPageChange(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-3"
      data-testid="pagination"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 rounded-xl"
        disabled={!hasPrev}
        onClick={() => change(page - 1)}
      >
        <ChevronLeft aria-hidden="true" className="size-3.5" />
        Previous
      </Button>

      <p className="text-xs font-medium tabular-nums text-muted-foreground" aria-live="polite">
        Page {page} of {totalPages}
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 rounded-xl"
        disabled={!hasNext}
        onClick={() => change(page + 1)}
      >
        Next
        <ChevronRight aria-hidden="true" className="size-3.5" />
      </Button>
    </nav>
  );
}
