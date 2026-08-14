"use client";

import { Grid2X2, List, Search, X } from "lucide-react";
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
import { ErrorState } from "@/components/shared/error-state";
import { useFilters } from "@/features/notes/api/use-filters";
import { useNotesQueryState } from "@/features/notes/hooks/use-notes-query-state";
import { cn } from "@/lib/utils";

export function FilterPanel({ className }: { className?: string }) {
  const filters = useFilters();
  const { state, setFilter, clearFilters, activeFilterCount } =
    useNotesQueryState();

  const toggle = (key: "category" | "level", value: string) =>
    setFilter({
      [key]: state[key].includes(value)
        ? state[key].filter((item) => item !== value)
        : [...state[key], value],
    });

  if (filters.isError) {
    return (
      <ErrorState
        message="Filter options could not be loaded."
        onRetry={() => filters.refetch()}
      />
    );
  }

  const data = filters.data;

  return (
    <aside className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={state.q}
            onChange={(event) => setFilter({ q: event.target.value })}
            placeholder="Search notes or tags"
            className="h-10 pl-9 rounded-xl"
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

        <div className="flex gap-2">
          <Select
            value={state.sort}
            onValueChange={(value) =>
              setFilter({ sort: value as typeof state.sort })
            }
          >
            <SelectTrigger className="rounded-xl flex-1">
              <SelectValue placeholder="Sort by" />
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

          <div className="flex rounded-xl border p-1 bg-muted/20">
            <Button
              type="button"
              size="icon-sm"
              variant={state.view === "grid" ? "secondary" : "ghost"}
              aria-label="Grid view"
              onClick={() => setFilter({ view: "grid" })}
            >
              <Grid2X2 aria-hidden="true" className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant={state.view === "list" ? "secondary" : "ghost"}
              aria-label="List view"
              onClick={() => setFilter({ view: "list" })}
            >
              <List aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <h2 className="font-semibold text-lg">Filters</h2>
        {activeFilterCount ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        ) : null}
      </div>

      <div className="space-y-3 border-t pt-5">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Categories</h3>
        {data?.categories.map((category) => (
          <Label
            key={category.slug}
            className="flex cursor-pointer items-center justify-between gap-2 p-1 hover:bg-muted/50 rounded-md transition-colors"
          >
            <span className="flex items-center gap-2">
              <Checkbox
                checked={state.category.includes(category.slug)}
                onCheckedChange={() => toggle("category", category.slug)}
              />
              {category.name}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {category.count}
            </span>
          </Label>
        ))}
      </div>

      <div className="space-y-3 border-t pt-5">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Level</h3>
        {data?.levels.map((level) => (
          <Label
            key={level.value}
            className="flex cursor-pointer items-center justify-between gap-2 p-1 hover:bg-muted/50 rounded-md transition-colors"
          >
            <span className="flex items-center gap-2">
              <Checkbox
                checked={state.level.includes(level.value)}
                onCheckedChange={() => toggle("level", level.value)}
              />
              {level.label}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{level.count}</span>
          </Label>
        ))}
      </div>

      <div className="space-y-3 border-t pt-5">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Pricing</h3>
        <Select
          value={state.pricing || "all"}
          onValueChange={(value) =>
            setFilter({ pricing: value === "all" || !value ? "" : value })
          }
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All notes</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
}
