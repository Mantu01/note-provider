"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Pagination as PaginationData } from "@/lib/types";

type PaginationBarProps =
  | {
      pagination: PaginationData;
      onPageChange: (page: number) => void;
      page?: never;
      totalPages?: never;
    }
  | {
      pagination?: never;
      onPageChange: (page: number) => void;
      page: number;
      totalPages: number;
    };

export function PaginationBar(props: PaginationBarProps) {
  const currentPage = props.pagination ? props.pagination.page : (props.page ?? 1);
  const totalPages = props.pagination ? props.pagination.totalPages : (props.totalPages ?? 1);
  const hasPrev = props.pagination ? props.pagination.hasPrev : currentPage > 1;
  const hasNext = props.pagination ? props.pagination.hasNext : currentPage < totalPages;

  if (totalPages <= 1) return null;

  const change = (page: number) => {
    props.onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#results"
            aria-disabled={!hasPrev}
            className={!hasPrev ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
            onClick={(event) => {
              event.preventDefault();
              if (hasPrev) change(currentPage - 1);
            }}
          />
        </PaginationItem>

        <PaginationItem>
          <span className="px-4 text-sm font-medium text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href="#results"
            aria-disabled={!hasNext}
            className={!hasNext ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
            onClick={(event) => {
              event.preventDefault();
              if (hasNext) change(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
