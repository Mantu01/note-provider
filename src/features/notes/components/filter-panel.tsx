"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        {activeFilterCount ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        ) : null}
      </div>

      <div className="space-y-3 border-t pt-5">
        <h3 className="text-sm font-semibold">Categories</h3>
        {data?.categories.map((category) => (
          <Label
            key={category.slug}
            className="flex cursor-pointer items-center justify-between gap-2"
          >
            <span className="flex items-center gap-2">
              <Checkbox
                checked={state.category.includes(category.slug)}
                onCheckedChange={() => toggle("category", category.slug)}
              />
              {category.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {category.count}
            </span>
          </Label>
        ))}
      </div>

      <div className="space-y-3 border-t pt-5">
        <h3 className="text-sm font-semibold">Level</h3>
        {data?.levels.map((level) => (
          <Label
            key={level.value}
            className="flex cursor-pointer items-center justify-between gap-2"
          >
            <span className="flex items-center gap-2">
              <Checkbox
                checked={state.level.includes(level.value)}
                onCheckedChange={() => toggle("level", level.value)}
              />
              {level.label}
            </span>
            <span className="text-xs text-muted-foreground">{level.count}</span>
          </Label>
        ))}
      </div>

      <div className="space-y-3 border-t pt-5">
        <h3 className="text-sm font-semibold">Pricing</h3>
        <Select
          value={state.pricing || "all"}
          onValueChange={(value) =>
            setFilter({ pricing: value === "all" || !value ? "" : value })
          }
        >
          <SelectTrigger className="w-full">
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
