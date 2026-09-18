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
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            All Notes
          </h1>
          <p className="text-sm text-muted-foreground">
            {total === undefined
              ? "Browse the full catalogue of study notes."
              : `${resultsLabel} available`}
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
          <Button
            variant={state.view === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setFilter({ view: "grid" })}
            aria-label="Grid view"
            aria-pressed={state.view === "grid"}
          >
            <LayoutGrid aria-hidden="true" className="size-4" />
          </Button>
          <Button
            variant={state.view === "list" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setFilter({ view: "list" })}
            aria-label="List view"
            aria-pressed={state.view === "list"}
          >
            <List aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>

      <div className="sticky top-14 z-30 -mx-4 mb-5 border-b border-border/50 bg-background/85 px-4 py-2.5 backdrop-blur-md sm:-mx-6 sm:px-6 lg:hidden">
        <div className="flex items-center gap-2">
          <NoteSearchField className="h-10 flex-1" />

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="relative size-10 shrink-0 rounded-xl"
                  aria-label={
                    activeFilterCount > 0 ? `Filters, ${activeFilterCount} active` : "Filters"
                  }
                />
              }
            >
              <SlidersHorizontal aria-hidden="true" className="size-4" />
              {activeFilterCount > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 h-4.5 min-w-4.5 rounded-full px-1 text-[10px] tabular-nums">
                  {activeFilterCount}
                </Badge>
              )}
            </SheetTrigger>

            <SheetContent side="bottom" className="h-[85dvh] gap-0 rounded-t-2xl p-0">
              <SheetHeader className="border-b px-5 py-4">
                <SheetTitle className="text-base font-semibold">Filters</SheetTitle>
              </SheetHeader>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                <FilterPanel showSearch={false} />
              </div>

              <div className="border-t bg-popover px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <SheetClose
                  render={
                    <Button size="lg" className="h-12 w-full rounded-xl text-sm font-semibold" />
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
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <ActiveFilterChips state={state} setFilter={setFilter} />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <X aria-hidden="true" className="size-3.5" />
            {activeFilterCount > 0 ? "Clear all" : "Clear search"}
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <div className="sticky top-20 rounded-2xl border border-border bg-card p-5">
            <FilterPanel />
          </div>
        </div>

        <div id="results" className="min-w-0">
          <div
            className={cn(
              "grid gap-4",
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
                  title="No notes match these filters"
                  description="Try clearing a filter or searching with different keywords."
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
            <div className="mt-8">
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
