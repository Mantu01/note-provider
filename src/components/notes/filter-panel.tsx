"use client";

import { Search, X } from "lucide-react";
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
import { useFilters } from "@/hooks/useNotes";
import { useNotesQueryState } from "@/hooks/use-notes-query-state";
import { NOTE_SORTS, NOTE_SORT_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ToggleKey = "category" | "level";

const PRICING_OPTIONS = [
  { value: "", label: "All" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
] as const;

export function NoteSearchField({ className }: { className?: string } = {}) {
  const { state, setFilter } = useNotesQueryState();

  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        inputMode="search"
        value={state.q}
        onChange={(event) => setFilter({ q: event.target.value })}
        placeholder="Search notes or tags"
        aria-label="Search notes"
        className="h-full rounded-xl pr-3 pl-9 text-base sm:text-sm"
      />
    </div>
  );
}

export function FilterPanel({
  className,
  showSearch = true,
}: { className?: string; showSearch?: boolean } = {}) {
  const filters = useFilters();
  const { state, setFilter, clearFilters, activeFilterCount } = useNotesQueryState();

  const toggle = (key: ToggleKey, value: string) =>
    setFilter({
      [key]: state[key].includes(value)
        ? state[key].filter((item) => item !== value)
        : [...state[key], value],
    });

  const setPrice = (key: "minPrice" | "maxPrice", raw: string) =>
    setFilter({ [key]: raw.trim() === "" ? null : Math.max(0, Math.floor(Number(raw) || 0)) });

  if (filters.isError) {
    return (
      <div
        className={cn(
          "rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive",
          className,
        )}
      >
        Could not load filter options.
      </div>
    );
  }

  const data = filters.data;

  return (
    <div className={cn("@container flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-3">
        {showSearch && <NoteSearchField className="h-11" />}

        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="notes-sort" className="sr-only">
            Sort notes
          </Label>
          <Select value={state.sort} onValueChange={(value) => setFilter({ sort: value as typeof state.sort })}>
            <SelectTrigger id="notes-sort" className="h-11 w-full rounded-xl text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {NOTE_SORTS.map((value) => (
                <SelectItem key={value} value={value}>
                  {NOTE_SORT_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="h-10 w-full rounded-xl text-sm"
        >
          <X aria-hidden="true" className="size-3.5" />
          Clear all filters
        </Button>
      )}

      <div className="grid grid-cols-1 gap-6 @md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <FilterGroup title="Pricing">
            <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-muted/60 p-1">
              {PRICING_OPTIONS.map((option) => {
                const count = data?.pricing.find((entry) => entry.value === option.value)?.count;
                return (
                  <button
                    key={option.label}
                    type="button"
                    aria-pressed={state.pricing === option.value}
                    onClick={() => setFilter({ pricing: option.value })}
                    className={cn(
                      "flex h-11 flex-col items-center justify-center rounded-lg text-xs font-semibold transition-colors sm:h-9",
                      state.pricing === option.value
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span>{option.label}</span>
                    {count !== undefined && (
                      <span className="text-[10px] font-medium tabular-nums opacity-70">{count}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="min-price" className="text-[11px] text-muted-foreground">
                  Min ₹
                </Label>
                <Input
                  id="min-price"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={state.minPrice ?? ""}
                  onChange={(event) => setPrice("minPrice", event.target.value)}
                  placeholder="0"
                  className="h-10 rounded-xl text-sm tabular-nums"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="max-price" className="text-[11px] text-muted-foreground">
                  Max ₹
                </Label>
                <Input
                  id="max-price"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={state.maxPrice ?? ""}
                  onChange={(event) => setPrice("maxPrice", event.target.value)}
                  placeholder="Any"
                  className="h-10 rounded-xl text-sm tabular-nums"
                />
              </div>
            </div>
          </FilterGroup>

          <FilterGroup title="Level">
            {data?.levels.map((level) => (
              <FilterOption
                key={level.value}
                label={level.label}
                count={level.count}
                checked={state.level.includes(level.value)}
                onToggle={() => toggle("level", level.value)}
              />
            ))}
          </FilterGroup>
        </div>

        <FilterGroup title="Category">
          {data?.categories.map((category) => (
            <FilterOption
              key={category.slug}
              label={category.name}
              count={category.count}
              checked={state.category.includes(category.slug)}
              onToggle={() => toggle("category", category.slug)}
            />
          ))}
        </FilterGroup>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-1">
      <legend className="pb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        {title}
      </legend>
      <div className="space-y-0.5">{children}</div>
    </fieldset>
  );
}

function FilterOption({
  label,
  count,
  checked,
  onToggle,
}: {
  label: string;
  count: number;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted/50">
      <span className="flex min-w-0 items-center gap-2.5">
        <Checkbox checked={checked} onCheckedChange={onToggle} className="size-4.5" />
        <span className="truncate">{label}</span>
      </span>
      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
        {count}
      </span>
    </Label>
  );
}
