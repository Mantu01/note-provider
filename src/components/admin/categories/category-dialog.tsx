"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CATEGORY_ICON_OPTIONS, CategoryIcon } from "@/components/shared/category-icon";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useAdmin";
import { createCategorySchema, type CreateCategoryInput } from "@/schemas/category.schema";
import type { AdminCategory } from "@/lib/types";

type CategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: AdminCategory | null;
};


export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const isEditing = Boolean(category?.id);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory(category?.id ?? "");

  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    values: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      icon: category?.icon ?? "BookOpen",
      order: category?.order ?? 0,
    },
  });

  const selectedIcon = form.watch("icon") || "BookOpen";

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
              Organize your notes into clear, accessible categories for your buyers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="category-name" className="text-sm font-medium">Category Name</label>
              <Input id="category-name" placeholder="e.g. Computer Science" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="category-description" className="text-sm font-medium">Description (Optional)</label>
              <Textarea id="category-description" rows={2} placeholder="Brief summary of notes in this category..." {...form.register("description")} />
            </div>

            <div>
              <label htmlFor="category-icon" className="text-sm font-medium block mb-2">Choose Category Icon</label>
              <Select id="category-icon" value={selectedIcon} onValueChange={(val) => form.setValue("icon", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an icon">
                    <span className="flex items-center gap-2">
                      <CategoryIcon name={selectedIcon} className="size-4" />
                      <span>
                        {CATEGORY_ICON_OPTIONS.find((preset) => preset.name === selectedIcon)?.label ??
                          "Select an icon"}
                      </span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {CATEGORY_ICON_OPTIONS.map((preset) => (
                    <SelectItem key={preset.name} value={preset.name}>
                      <span className="flex items-center gap-2">
                        <CategoryIcon name={preset.name} className="size-4 text-muted-foreground" />
                        <span>{preset.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="category-order" className="text-sm font-medium">Display Priority / Sort Order</label>
              <Input id="category-order" type="number" placeholder="0" {...form.register("order", { valueAsNumber: true })} />
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
