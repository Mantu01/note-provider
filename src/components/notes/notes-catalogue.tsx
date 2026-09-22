"use client";

import { Search, SlidersHorizontal, LayoutGrid, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { NoteCard } from "@/components/shared/note-card";
import { NotesCatalogueSkeleton } from "@/components/shared/shimmer-loader";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { useNotes } from "@/hooks/useNotes";
import { useNotesQueryState } from "@/hooks/use-notes-query-state";
import { cn } from "@/lib/utils";
import { FilterPanel, NoteSearchField } from "./filter-panel";
import { ActiveFilterChips } from "./active-filter-chips";

export function NotesCatalogue() {
  const { state, setFilter, clearFilters, activeFilterCount, hasQuery } = useNotesQueryState();

  const notes = useNotes({
    page: state.page,
    limit: state.limit,
    q: state.q,
    category: state.category,
    level: state.level,
    pricing: state.pricing,
    minPrice: state.minPrice,
    maxPrice: state.maxPrice,
    sort: state.sort,
  });

  const total = notes.data?.pagination.total;
  const resultsLabel =
    total === undefined ? "results" : `${total} note${total !== 1 ? "s" : ""}`;
  const isFiltered = activeFilterCount > 0 || hasQuery;

  return (
    <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4" data-testid="notes-catalogue">
      <div className="mb-2 flex items-end justify-between gap-2 sm:mb-3">
        <div className="min-w-0 space-y-0.5">
          <h1 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
            All Notes
          </h1>
          <p className="truncate text-[10px] text-muted-foreground sm:text-xs">
            {total === undefined
              ? "Browse the full catalogue."
              : `${resultsLabel} available`}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-1 rounded-lg border border-border bg-card p-0.5 sm:flex">
          <Button
            variant={state.view === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setFilter({ view: "grid" })}
            aria-label="Grid view"
            aria-pressed={state.view === "grid"}
          >
            <LayoutGrid aria-hidden="true" className="size-3.5" />
          </Button>
          <Button
            variant={state.view === "list" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setFilter({ view: "list" })}
            aria-label="List view"
            aria-pressed={state.view === "list"}
          >
            <List aria-hidden="true" className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="sticky top-14 z-30 -mx-3 mb-2 border-b border-border/50 bg-background/90 px-3 py-2 backdrop-blur-md sm:-mx-4 sm:px-4 sm:mb-3 sm:py-2 lg:hidden">
        <div className="flex items-center gap-2">
          <NoteSearchField className="h-9 flex-1" />

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="relative size-9 shrink-0 rounded-lg"
                  aria-label={
                    activeFilterCount > 0 ? `Filters, ${activeFilterCount} active` : "Filters"
                  }
                >
                  <SlidersHorizontal aria-hidden="true" className="size-3.5" />
                  {activeFilterCount > 0 && (
                    <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 rounded-full px-1 text-[9px] tabular-nums">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              }
            />

            <SheetContent side="bottom" className="h-[85dvh] gap-0 rounded-t-2xl p-0">
              <SheetHeader className="border-b px-3 py-2 sm:px-4 sm:py-2.5">
                <SheetTitle className="text-sm font-semibold">Filters</SheetTitle>
              </SheetHeader>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2 sm:px-4 sm:py-3">
                <FilterPanel showSearch={false} />
              </div>

              <div className="border-t bg-popover px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 sm:px-4 sm:pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:pt-2.5">
                <SheetClose
                  render={
                    <Button size="lg" className="h-10 w-full rounded-lg text-sm font-semibold">
                      Show {resultsLabel}
                    </Button>
                  }
                >
                  Show {resultsLabel}
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isFiltered && (
        <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-3">
          <ActiveFilterChips state={state} setFilter={setFilter} />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 shrink-0 px-2 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <X aria-hidden="true" className="size-3" />
            {activeFilterCount > 0 ? "Clear all" : "Clear search"}
          </Button>
        </div>
      )}

      <div className="grid gap-2 lg:grid-cols-[15rem_minmax(0,1fr)] sm:gap-3">
        <div className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border border-border bg-card p-3 sm:p-4">
            <FilterPanel />
          </div>
        </div>

        <div className="min-w-0">
          <div
            className={cn(
              "grid gap-2 sm:gap-3",
              state.view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
            )}
          >
            {notes.isPending ? (
              <div className="col-span-full">
                <NotesCatalogueSkeleton />
              </div>
            ) : notes.isError ? (
              <div className="col-span-full">
                <ErrorState onRetry={() => notes.refetch()} />
              </div>
            ) : notes.data?.items.length ? (
              notes.data.items.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  variant={state.view === "list" ? "compact" : "default"}
                />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  icon={Search}
                  title="No notes match"
                  description="Try clearing filters or searching differently."
                  action={
                    <Button onClick={clearFilters} size="sm">
                      Clear filters
                    </Button>
                  }
                />
              </div>
            )}
          </div>

          {notes.data && notes.data.pagination.totalPages > 1 && (
            <div className="mt-3 sm:mt-4">
              <PaginationBar
                page={notes.data.pagination.page}
                totalPages={notes.data.pagination.totalPages}
                onPageChange={(page) => setFilter({ page })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
