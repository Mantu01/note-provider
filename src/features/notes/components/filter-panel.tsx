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
import { useFilters } from "@/features/notes/api/use-filters";
import { useNotesQueryState } from "@/features/notes/hooks/use-notes-query-state";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  className?: string;
}

export function FilterPanel({ className }: FilterPanelProps) {
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
      <div className={cn("rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive", className)}>
        Could not load filter options.
      </div>
    );
  }

  const data = filters.data;

  const categorySet = data ? new Set(data.categories.map((c) => c.slug)) : new Set();
  const levelSet = data ? new Set(data.levels.map((l) => l.value)) : new Set();

  return (
    <aside className={cn("space-y-4", className)}>
      <div className="space-y-2.5">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 size-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={state.q}
            onChange={(event) => setFilter({ q: event.target.value })}
            placeholder="Search notes or tags"
            className="h-8 pl-7 rounded-lg text-xs"
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
            <X aria-hidden="true" className="size-3" />
          </Button>
        </div>

        <div className="flex gap-1.5">
          <Select
            value={state.sort}
            onValueChange={(value) =>
              setFilter({ sort: value as typeof state.sort })
            }
          >
            <SelectTrigger className="rounded-lg flex-1 h-8 text-xs">
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

          <div className="flex rounded-lg border bg-muted/20 p-0.5">
            <Button
              type="button"
              size="icon-sm"
              variant={state.view === "grid" ? "secondary" : "ghost"}
              aria-label="Grid view"
              onClick={() => setFilter({ view: "grid" })}
            >
              <Grid2X2 aria-hidden="true" className="size-3" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant={state.view === "list" ? "secondary" : "ghost"}
              aria-label="List view"
              onClick={() => setFilter({ view: "list" })}
            >
              <List aria-hidden="true" className="size-3" />
            </Button>
          </div>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold">Filters</h2>
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

      <div className="space-y-1.5 border-t pt-3">
        <h3 className="text-[9px] font-semibold tracking-wide uppercase text-muted-foreground">
          Categories
        </h3>
        {data?.categories.map((category) => (
          <Label
            key={category.slug}
            className="flex cursor-pointer items-center justify-between gap-2 p-1 rounded-md text-xs"
          >
            <span className="flex items-center gap-1.5">
              <Checkbox
                checked={categorySet.has(category.slug)}
                onCheckedChange={() => toggle("category", category.slug)}
              />
              <span className="truncate">{category.name}</span>
            </span>
            <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {category.count}
            </span>
          </Label>
        ))}
      </div>

      <div className="space-y-1.5 border-t pt-3">
        <h3 className="text-[9px] font-semibold tracking-wide uppercase text-muted-foreground">
          Level
        </h3>
        {data?.levels.map((level) => (
          <Label
            key={level.value}
            className="flex cursor-pointer items-center justify-between gap-2 p-1 rounded-md text-xs"
          >
            <span className="flex items-center gap-1.5">
              <Checkbox
                checked={levelSet.has(level.value)}
                onCheckedChange={() => toggle("level", level.value)}
              />
              {level.label}
            </span>
            <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{level.count}</span>
          </Label>
        ))}
      </div>

      <div className="space-y-1.5 border-t pt-3">
        <h3 className="text-[9px] font-semibold tracking-wide uppercase text-muted-foreground">
          Pricing
        </h3>
        <Select
          value={state.pricing || "all"}
          onValueChange={(value) =>
            setFilter({ pricing: value === "all" || !value ? "" : value })
          }
        >
          <SelectTrigger className="w-full rounded-lg h-8 text-xs">
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
