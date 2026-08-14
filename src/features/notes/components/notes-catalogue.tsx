"use client";

import { Grid2X2, List, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useFilters } from "@/features/notes/api/use-filters";
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
      <div className="mb-8 rounded-[2rem] border border-border/80 bg-gradient-to-r from-primary/8 via-card to-accent/8 p-8 text-left shadow-sm sm:p-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Catalogue</p>
        <h1 className="mb-3 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">Find notes that fit your study plan</h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">Search a growing library of clear, focused resources designed for smarter revision.</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <FilterPanel className="sticky top-24 rounded-2xl border bg-card p-5" />
        </div>

        <div id="results" className="min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={state.q}
                onChange={(event) => setFilter({ q: event.target.value })}
                placeholder="Search notes or tags"
                className="h-10 pl-9"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Clear search"
                onClick={() => setFilter({ q: "" })}
                className={cn(
                  "absolute top-1/2 right-1 -translate-y-1/2",
                  !state.q && "hidden",
                )}
              >
                <X aria-hidden="true" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger
                  render={
                    <Button variant="outline" className="lg:hidden" />
                  }
                >
                  <SlidersHorizontal aria-hidden="true" />
                  Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}
                </SheetTrigger>
                <SheetContent side="left" className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>

              <Select
                value={state.sort}
                onValueChange={(value) =>
                  setFilter({ sort: value as typeof state.sort })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="price_asc">Price: low to high</SelectItem>
                  <SelectItem value="price_desc">Price: high to low</SelectItem>
                  <SelectItem value="popular">Most popular</SelectItem>
                  <SelectItem value="title_asc">A–Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden rounded-lg border p-1 sm:flex">
                <Button
                  type="button"
                  size="icon-sm"
                  variant={state.view === "grid" ? "secondary" : "ghost"}
                  aria-label="Grid view"
                  onClick={() => setFilter({ view: "grid" })}
                >
                  <Grid2X2 aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant={state.view === "list" ? "secondary" : "ghost"}
                  aria-label="List view"
                  onClick={() => setFilter({ view: "list" })}
                >
                  <List aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {notes.data
                ? `Showing ${notes.data.items.length} of ${notes.data.pagination.total} notes`
                : "Loading notes…"}
            </span>
            {activeFilterCount ? (
              <Button variant="link" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : null}
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
