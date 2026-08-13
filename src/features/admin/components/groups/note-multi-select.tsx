"use client";

import { parseAsString, useQueryStates } from "nuqs";
import { Check, Search, FileText, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAdminNotes } from "@/features/admin/api/use-admin-notes";

type NoteMultiSelectProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export function NoteMultiSelect({ selectedIds, onChange }: NoteMultiSelectProps) {
  const [{ query }, setParams] = useQueryStates({
    query: parseAsString.withDefault(""),
  });
  const setQuery = (q: string) => setParams({ query: q });

  const { data, isLoading } = useAdminNotes({ limit: 100, q: query });

  const notes = data?.items ?? [];

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeId = (id: string) => {
    onChange(selectedIds.filter((item) => item !== id));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground">Select Notes in Bundle</label>
        <p className="text-xs text-muted-foreground">Pick notes that buyers receive when purchasing this bundle.</p>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-muted/30 p-3">
          {selectedIds.map((id) => {
            const note = notes.find((n) => n.id === id);
            return (
              <Badge key={id} variant="secondary" className="flex items-center gap-1.5 py-1 px-2.5">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span>{note ? note.title : id.slice(-6)}</span>
                <button
                  type="button"
                  onClick={() => removeId(id)}
                  className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search notes by title or subject..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="max-h-60 overflow-y-auto rounded-xl border border-border bg-card divide-y divide-border">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No matching notes found.</div>
        ) : (
          notes.map((note) => {
            const isSelected = selectedIds.includes(note.id);
            return (
              <div
                key={note.id}
                onClick={() => toggleSelect(note.id)}
                className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                  isSelected ? "bg-primary/10" : "hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background"
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{note.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {note.subject} • {note.category?.name || "Uncategorized"} • {note.priceLabel}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {note.pricingType}
                </Badge>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
