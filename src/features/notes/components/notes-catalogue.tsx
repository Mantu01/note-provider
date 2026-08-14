"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { NoteCardSkeleton } from "@/components/shared/note-card-skeleton";
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <FilterPanel className="sticky top-24 rounded-2xl border bg-card p-5" />
        </div>

        <div id="results" className="min-w-0">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="outline" className="w-full sm:w-auto lg:hidden" />
                }
              >
                <SlidersHorizontal aria-hidden="true" className="mr-2 size-4" />
                Filters & Search{activeFilterCount ? ` (${activeFilterCount})` : ""}
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {notes.data
                  ? `Showing ${notes.data.items.length} of ${notes.data.pagination.total} notes`
                  : "Loading notes…"}
              </span>
            </div>
          </div>

          <ActiveFilterChips state={state} setFilter={setFilter} />

          <div
            className={cn(
              "mt-6 grid gap-5",
              state.view === "grid"
                ? "sm:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1",
            )}
          >
            {notes.isPending ? (
              Array.from({ length: 12 }, (_, index) => (
                <NoteCardSkeleton key={index} />
              ))
            ) : notes.isError ? (
              <div className="sm:col-span-2 xl:col-span-3">
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
              <div className="sm:col-span-2 xl:col-span-3">
                <EmptyState
                  icon={Search}
                  title="No notes match these filters"
                  description="Try clearing a filter or searching with different keywords."
                  action={
                    <Button onClick={clearFilters}>Clear filters</Button>
                  }
                />
              </div>
            )}
          </div>

          {notes.data ? (
            <div className="mt-8">
              <PaginationBar
                pagination={notes.data.pagination}
                onPageChange={(page) => setFilter({ page })}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
