"use client";

import { Search, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { NoteCard } from "@/components/shared/note-card";
import { ShimmerNoteCard } from "@/components/shared/shimmer-loader";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { useNotes } from "@/features/notes/api/use-notes";
import { useNotesQueryState } from "@/features/notes/hooks/use-notes-query-state";
import { cn } from "@/lib/utils";

import { FilterPanel } from "./filter-panel";
import { ActiveFilterChips } from "./active-filter-chips";

export function NotesCatalogue() {
  const { state, setFilter, clearFilters, activeFilterCount } =
    useNotesQueryState();

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 paper-bg">
      <div className="mt-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
            Catalogue
          </p>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            All Notes
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {notes.data
              ? `${notes.data.pagination.total} note${notes.data.pagination.total !== 1 ? "s" : ""}`
              : "Loading…"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:inline-flex items-center rounded-full border border-border bg-card p-0.5 shadow-sm">
            <Button
              variant={state.view === "grid" ? "default" : "ghost"}
              size="icon"
              className={cn(
                "size-7 rounded-full",
                state.view === "grid" && "bg-primary text-primary-foreground shadow-none"
              )}
              onClick={() => setFilter({ view: "grid" })}
              aria-label="Grid view"
            >
              <LayoutGrid aria-hidden="true" className="size-3.5" />
            </Button>
            <Button
              variant={state.view === "list" ? "default" : "ghost"}
              size="icon"
              className={cn(
                "size-7 rounded-full",
                state.view === "list" && "bg-primary text-primary-foreground shadow-none"
              )}
              onClick={() => setFilter({ view: "list" })}
              aria-label="List view"
            >
              <List aria-hidden="true" className="size-3.5" />
            </Button>
          </div>

          <Sheet>
            <SheetTrigger render={
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-full px-3 text-xs shadow-sm lg:hidden"
              >
                <SlidersHorizontal aria-hidden="true" className="mr-1.5 size-3.5" />
                Filters{activeFilterCount ? ` · ${activeFilterCount}` : ""}
              </Button>
            } />
            <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <FilterPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <ActiveFilterChips state={state} setFilter={setFilter} />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-6 text-[10px] text-muted-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="mt-2 grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <div className="sticky top-20 rounded-2xl border border-border bg-card p-4 shadow-sm notebook-lines torn-paper">
            <FilterPanel />
          </div>
        </div>

        <div id="results" className="min-w-0">
          <div
            className={cn(
              "mt-4 grid gap-3",
              state.view === "grid"
                ? "sm:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1"
            )}
          >
            {notes.isPending ? (
              Array.from({ length: 12 }, (_, index) => (
                <ShimmerNoteCard key={index} />
              ))
            ) : notes.isError ? (
              <div className={state.view === "grid" ? "sm:col-span-2 xl:col-span-3" : "col-span-full"}>
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
              <div className={state.view === "grid" ? "sm:col-span-2 xl:col-span-3" : "col-span-full"}>
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
            <div className="mt-6">
              <PaginationBar
                pagination={notes.data.pagination}
                onPageChange={(page) => setFilter({ page })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
