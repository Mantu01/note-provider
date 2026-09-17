"use client";

import { Button } from "@/components/ui/button";
import { useNotesQueryState } from "@/hooks/use-notes-query-state";

export function ActiveFilterChips({
  state,
  setFilter,
}: {
  state: ReturnType<typeof useNotesQueryState>["state"];
  setFilter: ReturnType<typeof useNotesQueryState>["setFilter"];
}) {
  const chips = [...state.category, ...state.level];
  if (!chips.length) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {chips.map((value) => (
        <Button
          key={value}
          type="button"
          variant="secondary"
          size="sm"
          className="h-6 rounded-full px-2 text-[10px]"
          onClick={() => {
            const key = (["category", "level"] as const).find((name) =>
              state[name].includes(value),
            );
            if (key)
              setFilter({ [key]: state[key].filter((item) => item !== value) });
          }}
        >
          {value}
          <svg aria-hidden="true" className="ml-1 size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Button>
      ))}
    </div>
  );
}