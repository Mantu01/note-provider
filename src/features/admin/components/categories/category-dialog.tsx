"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  BookOpen, Code2, FlaskConical, Calculator, Briefcase, Palette, Scale,
  Globe, Trophy, Cpu, Stethoscope, FileText, Check, Plus, X,
  Activity, ArrowRight, Battery, Bell, Bookmark, Calendar, Camera,
  Cloud, Compass, CreditCard, Database, Feather, Flag, Folder,
  Gift, Headphones, Heart, Key, Link, Map, MessageCircle, Monitor,
  Music, Paperclip, PenTool, Play, Printer, Settings, Shield,
  ShoppingCart, Star, Sun, Terminal, Truck, Tv, Umbrella, Video,
  Watch, Wifi, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateCategory, useUpdateCategory } from "@/features/admin/api/use-admin-categories";
import { createCategorySchema, type CreateCategoryInput } from "@/lib/schemas/category.schema";
import type { AdminCategory } from "@/lib/types";
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
  { name: "Activity", label: "Activity", icon: Activity },
  { name: "Battery", label: "Battery", icon: Battery },
  { name: "Bell", label: "Notifications", icon: Bell },
  { name: "Bookmark", label: "Bookmark", icon: Bookmark },
  { name: "Calendar", label: "Events", icon: Calendar },
  { name: "Camera", label: "Photography", icon: Camera },
  { name: "Cloud", label: "Cloud", icon: Cloud },
  { name: "Compass", label: "Navigation", icon: Compass },
  { name: "CreditCard", label: "Finance", icon: CreditCard },
  { name: "Database", label: "Data", icon: Database },
  { name: "Feather", label: "Design", icon: Feather },
  { name: "Flag", label: "Milestones", icon: Flag },
  { name: "Folder", label: "Files", icon: Folder },
  { name: "Gift", label: "Rewards", icon: Gift },
  { name: "Headphones", label: "Audio", icon: Headphones },
  { name: "Heart", label: "Health", icon: Heart },
  { name: "Key", label: "Security", icon: Key },
  { name: "Map", label: "Geography", icon: Map },
  { name: "MessageCircle", label: "Chat", icon: MessageCircle },
  { name: "Monitor", label: "Desktop", icon: Monitor },
  { name: "Music", label: "Music", icon: Music },
  { name: "PenTool", label: "Writing", icon: PenTool },
  { name: "Settings", label: "Configuration", icon: Settings },
  { name: "Shield", label: "Protection", icon: Shield },
  { name: "Star", label: "Favorites", icon: Star },
  { name: "Terminal", label: "Console", icon: Terminal },
  { name: "Zap", label: "Quick", icon: Zap },
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
              <label className="text-sm font-medium block mb-2">Choose Category Icon</label>
              <Select value={selectedIcon} onValueChange={(val) => form.setValue("icon", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an icon">
                    {(() => {
                      const active = CATEGORY_ICON_PRESETS.find(p => p.name === selectedIcon);
                      if (!active) return "Select an icon";
                      const ActiveIcon = active.icon;
                      return (
                        <div className="flex items-center gap-2">
                          <ActiveIcon className="h-4 w-4" />
                          <span>{active.label}</span>
                        </div>
                      );
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {CATEGORY_ICON_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    return (
                      <SelectItem key={preset.name} value={preset.name}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span>{preset.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
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
