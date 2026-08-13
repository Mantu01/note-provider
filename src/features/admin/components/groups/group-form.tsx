"use client";

import { parseAsBoolean, useQueryStates } from "nuqs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, ArrowLeft, AlertCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileUploadField } from "@/components/shared/file-upload-field";
import { CategoryDialog } from "@/features/admin/components/categories/category-dialog";
import { NoteMultiSelect } from "@/features/admin/components/groups/note-multi-select";
import { useAdminCategories } from "@/features/admin/api/use-admin-categories";
import { useCreateGroup, useUpdateGroup } from "@/features/admin/api/use-admin-groups";
import { createGroupSchema, type CreateGroupInput } from "@/lib/schemas/group.schema";
import type { AdminGroup } from "@/lib/types";

type GroupFormProps = {
  initialData?: AdminGroup | null;
};

export function GroupForm({ initialData }: GroupFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);
  const createMutation = useCreateGroup();
  const updateMutation = useUpdateGroup(initialData?.id ?? "");
  const { data: categoriesData } = useAdminCategories();
  const categories = categoriesData?.items ?? [];

  const [{ categoryDialog: categoryDialogOpen }, setParams] = useQueryStates({
    categoryDialog: parseAsBoolean.withDefault(false),
  });
  const setCategoryDialogOpen = (open: boolean) => setParams({ categoryDialog: open });

  const form = useForm<CreateGroupInput>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      categoryId: initialData?.category?.id ?? "",
      price: initialData ? initialData.price / 100 : 999,
      compareAtPrice: initialData?.compareAtPrice ? initialData.compareAtPrice / 100 : null,
      noteIds: initialData?.noteIds ?? initialData?.notes?.map((n) => n.id) ?? [],
      visibility: initialData?.visibility ?? "public",
      isFeatured: initialData?.isFeatured ?? false,
      coverImage: initialData?.coverImageUrl && initialData.coverImagePublicId ? {
        url: initialData.coverImageUrl,
        publicId: initialData.coverImagePublicId,
      } : null,
    },
  });

  const onSubmit = (values: CreateGroupInput) => {
    if (isEditing) {
      updateMutation.mutate(values, {
        onSuccess: () => router.push("/admin/groups"),
      });
    } else {
      createMutation.mutate(values, {
        onSuccess: () => router.push("/admin/groups"),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const serverError = createMutation.error || updateMutation.error;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative">
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 shadow-2xl max-w-sm text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div>
              <h3 className="font-bold text-lg text-foreground">
                {isEditing ? "Saving bundle..." : "Creating study bundle..."}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Please wait while your bundle collection is saved.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.push("/admin/groups")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditing ? `Edit Bundle "${initialData?.name}"` : "Create Note Bundle"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Bundle multiple study notes into a discounted single purchase package.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" onClick={() => router.push("/admin/groups")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isEditing ? "Save Changes" : "Create Bundle"}
          </Button>
        </div>
      </div>

      {Object.keys(form.formState.errors).length > 0 && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Please fix the following issues:</h4>
            <ul className="mt-1 text-xs space-y-1 list-disc list-inside">
              {Object.entries(form.formState.errors).map(([key, err]) => (
                <li key={key}>{err?.message?.toString() || `${key} is required`}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {serverError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <div>
              <h4 className="font-semibold text-sm">Bundle Creation Error</h4>
              <p className="text-xs">{serverError.message || "Failed to create bundle. Please try again."}</p>
            </div>
          </div>
          <Button variant="outline" render={<Link href="/contact" />} size="sm">
            <HelpCircle className="mr-1.5 h-3.5 w-3.5" /> Contact Support
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bundle Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Bundle Name</label>
                <Input
                  placeholder="e.g. Master GATE CS Complete Notes Pack"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  rows={4}
                  placeholder="Explain what is included in this bundle and savings..."
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Category</label>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-xs text-primary font-medium"
                    onClick={() => setCategoryDialogOpen(true)}
                  >
                    + Add Category
                  </Button>
                </div>
                <Select
                  value={form.watch("categoryId")}
                  onValueChange={(val) => form.setValue("categoryId", val ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category">
                      {categories.find((c) => c.id === form.watch("categoryId"))?.name || initialData?.category?.name || "Select Category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.categoryId && (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.categoryId.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Note Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <NoteMultiSelect
                selectedIds={form.watch("noteIds") ?? []}
                onChange={(ids) => form.setValue("noteIds", ids)}
              />
              {form.formState.errors.noteIds && (
                <p className="mt-2 text-xs text-destructive">{form.formState.errors.noteIds.message}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Bundle Price (₹ INR)</label>
                <Input
                  type="number"
                  step="1"
                  placeholder="999"
                  {...form.register("price", { valueAsNumber: true })}
                />
                {form.formState.errors.price && (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Original Value (₹ INR - Optional)</label>
                <Input
                  type="number"
                  step="1"
                  placeholder="1999"
                  {...form.register("compareAtPrice", { valueAsNumber: true })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Visibility</label>
                <Select
                  value={form.watch("visibility")}
                  onValueChange={(val: "public" | "private" | null) => {
                    if (val !== null) form.setValue("visibility", val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public (Visible in Catalogue)</SelectItem>
                    <SelectItem value="private">Private (Hidden from Public)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-sm font-medium">Featured Bundle</p>
                  <p className="text-xs text-muted-foreground">Highlight on homepage</p>
                </div>
                <Switch
                  checked={form.watch("isFeatured")}
                  onCheckedChange={(checked) => form.setValue("isFeatured", checked)}
                />
              </div>

              <FileUploadField
                kind="cover"
                label="Bundle Cover Image (Optional)"
                accept="image/*"
                maxSizeMB={10}
                value={form.watch("coverImage")}
                onChange={(val) => form.setValue("coverImage", val)}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
      />
    </form>
  );
}
