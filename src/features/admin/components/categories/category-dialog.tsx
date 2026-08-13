"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  BookOpen,
  Code2,
  FlaskConical,
  Calculator,
  Briefcase,
  Palette,
  Scale,
  Globe,
  Trophy,
  Cpu,
  Stethoscope,
  FileText,
  Check,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateCategory, useUpdateCategory } from "@/features/admin/api/use-admin-categories";
import { createCategorySchema, type CreateCategoryInput } from "@/lib/schemas/category.schema";
import type { AdminCategory, SubjectItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type CategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: AdminCategory | null;
};

const CATEGORY_ICON_PRESETS = [
  { name: "BookOpen", label: "Study", icon: BookOpen },
  { name: "Code2", label: "Programming", icon: Code2 },
  { name: "FlaskConical", label: "Science", icon: FlaskConical },
  { name: "Calculator", label: "Math", icon: Calculator },
  { name: "Briefcase", label: "Business", icon: Briefcase },
  { name: "Palette", label: "Arts", icon: Palette },
  { name: "Scale", label: "Law", icon: Scale },
  { name: "Globe", label: "Languages", icon: Globe },
  { name: "Trophy", label: "Exams", icon: Trophy },
  { name: "Cpu", label: "Engineering", icon: Cpu },
  { name: "Stethoscope", label: "Medical", icon: Stethoscope },
  { name: "FileText", label: "General", icon: FileText },
];

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const isEditing = Boolean(category?.id);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory(category?.id ?? "");
  const subjectInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    values: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      icon: category?.icon ?? "BookOpen",
      order: category?.order ?? 0,
      subjects: category?.subjects ? category.subjects.map((s) => ({ id: s.id, name: s.name, slug: s.slug, order: s.order, isActive: s.isActive })) : [],
    },
  });

  const selectedIcon = form.watch("icon") || "BookOpen";
  const subjectsList = form.watch("subjects") || [];

  const handleAddSubject = () => {
    const trimmed = subjectInputRef.current?.value.trim() ?? "";
    if (!trimmed) return;
    const current = form.getValues("subjects") || [];
    if (!current.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      form.setValue("subjects", [...current, { name: trimmed, order: current.length, isActive: true }]);
    }
    if (subjectInputRef.current) subjectInputRef.current.value = "";
  };

  const handleRemoveSubject = (index: number) => {
    const current = form.getValues("subjects") || [];
    form.setValue(
      "subjects",
      current.filter((_, i) => i !== index),
    );
  };

  const onSubmit = (values: CreateCategoryInput) => {
    if (isEditing) {
      updateMutation.mutate(values, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      createMutation.mutate(values, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Category" : "Create New Category"}</DialogTitle>
            <DialogDescription>
              Categories and their subjects help buyers filter and find notes in your catalogue.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Category Name</label>
              <Input placeholder="e.g. Computer Science" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea rows={2} placeholder="Brief summary of notes in this category..." {...form.register("description")} />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Subjects in this Category</label>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  ref={subjectInputRef}
                  placeholder="Add subject (e.g. Data Structures)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSubject();
                    }
                  }}
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddSubject}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {subjectsList.length > 0 && (
                <div className="max-h-36 overflow-y-auto space-y-1.5 border rounded-xl p-2 bg-muted/30">
                  {subjectsList.map((sub, index) => (
                    <div key={sub.id || sub.slug || index} className="flex items-center justify-between gap-2 bg-card p-1.5 px-2.5 rounded-lg border text-xs">
                      <span className="font-medium text-foreground">{sub.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveSubject(index)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Choose Category Icon</label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORY_ICON_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = selectedIcon === preset.name;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => form.setValue("icon", preset.name)}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {isSelected && (
                        <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                      <Icon className="h-5 w-5 mb-1" />
                      <span className="text-[10px] truncate max-w-full">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Display Priority / Sort Order</label>
              <Input type="number" placeholder="0" {...form.register("order", { valueAsNumber: true })} />
              <p className="text-[11px] text-muted-foreground mt-0.5">Lower numbers appear first in the catalog filter.</p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
