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
import { ShimmerLoader, ShimmerNoteCard } from "@/components/shared/shimmer-loader";
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
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mt-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            All Notes
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {notes.data
              ? `${notes.data.pagination.total} note${notes.data.pagination.total !== 1 ? "s" : ""}`
              : "Loading…"}
          </p>
        </div>

        <Sheet>
          <SheetTrigger render={<Button
            variant="outline"
            size="sm"
            className="shrink-0 rounded-full h-9 lg:hidden"
          >
            <SlidersHorizontal aria-hidden="true" className="mr-1.5 size-3.5" />
            Filters{activeFilterCount ? ` · ${activeFilterCount}` : ""}
          </Button>} />
          <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-6">
              <FilterPanel />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <FilterPanel className="sticky top-20 rounded-2xl border bg-card p-4" />
        </div>

        <div id="results" className="min-w-0">
          <ActiveFilterChips state={state} setFilter={setFilter} />

          <div
            className={cn(
              "mt-5 grid gap-3",
              state.view === "grid"
                ? "sm:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1",
            )}
          >
            {notes.isPending ? (
              Array.from({ length: 12 }, (_, index) => (
                <ShimmerNoteCard key={index} />
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
                    <Button onClick={clearFilters} size="sm">
                      Clear filters
                    </Button>
                  }
                />
              </div>
            )}
          </div>

          {notes.data ? (
            <div className="mt-6">
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
