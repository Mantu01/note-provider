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

type CategoryOption = { name: string; slug: string; count: number };
type LevelOption = { value: string; label: string; count: number };

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
      <div className={cn("rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive", className)}>
        Could not load filter options.
      </div>
    );
  }

  const data = filters.data;

  return (
    <aside className={cn("space-y-5", className)}>
      <div className="space-y-3">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={state.q}
            onChange={(event) => setFilter({ q: event.target.value })}
            placeholder="Search notes or tags"
            className="h-9 pl-8 rounded-lg text-sm"
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
            <X aria-hidden="true" className="size-3.5" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Select
            value={state.sort}
            onValueChange={(value) =>
              setFilter({ sort: value as typeof state.sort })
            }
          >
            <SelectTrigger className="rounded-lg flex-1 h-9 text-sm">
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
              <Grid2X2 aria-hidden="true" className="size-3.5" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant={state.view === "list" ? "secondary" : "ghost"}
              aria-label="List view"
              onClick={() => setFilter({ view: "list" })}
            >
              <List aria-hidden="true" className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Filters</h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-xs text-muted-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="space-y-2 border-t pt-4">
        <h3 className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">
          Categories
        </h3>
        {data?.categories.map((category) => (
          <Label
            key={category.slug}
            className="flex cursor-pointer items-center justify-between gap-2 p-1.5 rounded-md text-sm"
          >
            <span className="flex items-center gap-2">
              <Checkbox
                checked={state.category.includes(category.slug)}
                onCheckedChange={() => toggle("category", category.slug)}
              />
              <span className="truncate">{category.name}</span>
            </span>
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {category.count}
            </span>
          </Label>
        ))}
      </div>

      <div className="space-y-2 border-t pt-4">
        <h3 className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">
          Level
        </h3>
        {data?.levels.map((level) => (
          <Label
            key={level.value}
            className="flex cursor-pointer items-center justify-between gap-2 p-1.5 rounded-md text-sm"
          >
            <span className="flex items-center gap-2">
              <Checkbox
                checked={state.level.includes(level.value)}
                onCheckedChange={() => toggle("level", level.value)}
              />
              {level.label}
            </span>
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{level.count}</span>
          </Label>
        ))}
      </div>

      <div className="space-y-2 border-t pt-4">
        <h3 className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">
          Pricing
        </h3>
        <Select
          value={state.pricing || "all"}
          onValueChange={(value) =>
            setFilter({ pricing: value === "all" || !value ? "" : value })
          }
        >
          <SelectTrigger className="w-full rounded-lg h-9 text-sm">
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
