"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/hooks/useNotes";
import { useNotesQueryState } from "@/hooks/use-notes-query-state";
import { NOTE_LEVEL_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { NoteLevel } from "@/lib/types";

export function ActiveFilterChips({
  state,
  setFilter,
}: {
  state: ReturnType<typeof useNotesQueryState>["state"];
  setFilter: ReturnType<typeof useNotesQueryState>["setFilter"];
}) {
  const filters = useFilters();

  const categoryName = (slug: string) =>
    filters.data?.categories.find((category) => category.slug === slug)?.name ?? slug;

  const chips = [
    ...state.category.map((slug) => ({
      key: `category-${slug}`,
      label: categoryName(slug),
      clear: () => setFilter({ category: state.category.filter((item) => item !== slug) }),
    })),
    ...state.level.map((value) => ({
      key: `level-${value}`,
      label: NOTE_LEVEL_LABELS[value as NoteLevel] ?? value,
      clear: () => setFilter({ level: state.level.filter((item) => item !== value) }),
    })),
    ...(state.pricing
      ? [
          {
            key: `pricing-${state.pricing}`,
            label: state.pricing === "free" ? "Free only" : "Paid only",
            clear: () => setFilter({ pricing: "" }),
          },
        ]
      : []),
    ...(state.minPrice !== null || state.maxPrice !== null
      ? [
          {
            key: "price-range",
            label: `${state.minPrice !== null ? formatPrice(state.minPrice * 100) : "₹0"} – ${
              state.maxPrice !== null ? formatPrice(state.maxPrice * 100) : "Any"
            }`,
            clear: () => setFilter({ minPrice: null, maxPrice: null }),
          },
        ]
      : []),
  ];

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <Button
          key={chip.key}
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 rounded-full px-3 text-xs"
          onClick={chip.clear}
        >
          {chip.label}
          <X aria-hidden="true" className="ml-1 size-3" />
        </Button>
      ))}
    </div>
  );
}
