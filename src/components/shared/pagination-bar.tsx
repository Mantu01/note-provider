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
      className="flex items-center justify-between gap-2 sm:justify-center"
      data-testid="pagination"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 rounded-lg px-2.5 text-xs sm:h-8"
        disabled={!hasPrev}
        onClick={() => change(page - 1)}
      >
        <ChevronLeft aria-hidden="true" className="size-3.5 sm:size-3" />
        <span className="hidden sm:inline">Previous</span>
        <span className="sr-only sm:hidden">Previous page</span>
      </Button>

      <p className="text-[11px] font-medium tabular-nums text-muted-foreground" aria-live="polite">
        Page {page} of {totalPages}
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 rounded-lg px-2.5 text-xs sm:h-8"
        disabled={!hasNext}
        onClick={() => change(page + 1)}
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sr-only sm:hidden">Next page</span>
        <ChevronRight aria-hidden="true" className="size-3.5 sm:size-3" />
      </Button>
    </nav>
  );
}
