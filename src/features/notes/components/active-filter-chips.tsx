"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotesQueryState } from "@/features/notes/hooks/use-notes-query-state";

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
    <div className="mt-4 flex flex-wrap gap-2">
      {chips.map((value) => (
        <Button
          key={value}
          type="button"
          variant="secondary"
          onClick={() => {
            const key = (["category", "level"] as const).find((name) =>
              state[name].includes(value),
            );
            if (key)
              setFilter({ [key]: state[key].filter((item) => item !== value) });
          }}
        >
          {value}
          <X aria-hidden="true" />
        </Button>
      ))}
    </div>
  );
}
