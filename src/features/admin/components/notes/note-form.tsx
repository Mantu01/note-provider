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
import { useAdminCategories } from "@/features/admin/api/use-admin-categories";
import { useCreateNote, useUpdateNote } from "@/features/admin/api/use-admin-notes";
import { createNoteSchema, type CreateNoteInput } from "@/lib/schemas/note.schema";
import { NOTE_LEVELS } from "@/lib/constants";
import type { AdminNote } from "@/lib/types";

type NoteFormProps = {
  initialData?: AdminNote | null;
};

export function NoteForm({ initialData }: NoteFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote(initialData?.id ?? "");
  const { data: categoriesData } = useAdminCategories();
  const categories = categoriesData?.items ?? [];

  const [{ categoryDialog: categoryDialogOpen }, setParams] = useQueryStates({
    categoryDialog: parseAsBoolean.withDefault(false),
  });
  const setCategoryDialogOpen = (open: boolean) => setParams({ categoryDialog: open });

  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      subject: initialData?.subject ?? "",
      subjectSlug: initialData?.subjectSlug ?? "",
      categoryId: initialData?.category?.id ?? "",
      level: initialData?.level ?? "basics",
      visibility: initialData?.visibility ?? "public",
      pricingType: initialData?.pricingType ?? "free",
      price: initialData ? initialData.price / 100 : 0,
      compareAtPrice: initialData?.compareAtPrice ? initialData.compareAtPrice / 100 : null,
      tags: initialData?.tags ?? [],
      isFeatured: initialData?.isFeatured ?? false,
      pageCount: initialData?.pageCount ?? null,
      fullFile: initialData?.fullFileUrl && initialData.fullFilePublicId ? {
        url: initialData.fullFileUrl,
        publicId: initialData.fullFilePublicId,
        bytes: initialData.fullFileBytes,
      } : undefined,
      previewFile: initialData?.previewFileUrl && initialData.previewFilePublicId && initialData.previewFileBytes ? {
        url: initialData.previewFileUrl,
        publicId: initialData.previewFilePublicId,
        bytes: initialData.previewFileBytes,
      } : null,
      coverImage: initialData?.coverImageUrl && initialData.coverImagePublicId ? {
        url: initialData.coverImageUrl,
        publicId: initialData.coverImagePublicId,
      } : null,
    },
  });

  const selectedCategoryId = form.watch("categoryId");
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const availableSubjects = selectedCategory?.subjects?.filter((s) => s.isActive !== false) ?? [];

  const pricingType = form.watch("pricingType");

  const onSubmit = (values: CreateNoteInput) => {
    if (isEditing) {
      updateMutation.mutate(values, {
        onSuccess: () => router.push("/admin/notes"),
      });
    } else {
      createMutation.mutate(values, {
        onSuccess: () => router.push("/admin/notes"),
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
                {isEditing ? "Saving changes..." : "Publishing note to catalogue..."}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Please wait while your files and metadata are processed.
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
            onClick={() => router.push("/admin/notes")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditing ? `Edit "${initialData?.title}"` : "Create New Note"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill out note metadata and attach study files.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" onClick={() => router.push("/admin/notes")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isEditing ? "Save Changes" : "Publish Note"}
          </Button>
        </div>
      </div>

      {Object.keys(form.formState.errors).length > 0 && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Please fix the following issues before publishing:</h4>
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
              <h4 className="font-semibold text-sm">Publishing Error</h4>
              <p className="text-xs">{serverError.message || "Failed to publish note. Please try again."}</p>
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
              <CardTitle className="text-lg">Note Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="e.g. Complete Data Structures & Algorithms Handbook"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  rows={6}
                  placeholder="Detailed overview of what this note covers..."
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
                    value={selectedCategoryId}
                    onValueChange={(val) => {
                      form.setValue("categoryId", val ?? "");
                      form.setValue("subjectSlug", "");
                      form.setValue("subject", "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category">
                        {selectedCategory?.name || initialData?.category?.name || "Select Category"}
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

                <div>
                  <label className="text-sm font-medium mb-1 block">Subject</label>
                  <Select
                    disabled={!selectedCategoryId || availableSubjects.length === 0}
                    value={form.watch("subjectSlug")}
                    onValueChange={(val) => {
                      const sub = availableSubjects.find((s) => s.slug === val);
                      if (sub) {
                        form.setValue("subjectSlug", sub.slug);
                        form.setValue("subject", sub.name);
                      } else {
                        form.setValue("subjectSlug", "");
                        form.setValue("subject", "");
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={!selectedCategoryId ? "Select Category first" : availableSubjects.length === 0 ? "No subjects found" : "Select Subject"}>
                        {availableSubjects.find((s) => s.slug === form.watch("subjectSlug"))?.name || initialData?.subject || "Select Subject"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubjects.map((sub) => (
                        <SelectItem key={sub.id || sub.slug} value={sub.slug}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(form.formState.errors.subjectSlug || form.formState.errors.subject) && (
                    <p className="mt-1 text-xs text-destructive">
                      {form.formState.errors.subjectSlug?.message || form.formState.errors.subject?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label className="text-sm font-medium">Target Level</label>
                <Select
                  value={form.watch("level")}
                  onValueChange={(val: "basics" | "intermediate" | "advance" | null) => {
                    if (val !== null) form.setValue("level", val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTE_LEVELS.map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.level && (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.level.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">File Attachments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {pricingType === "free" ? (
                <div>
                  <FileUploadField
                    kind="note_full"
                    label="Full Study Note PDF Document (Required for Free Download)"
                    accept=".pdf"
                    maxSizeMB={100}
                    value={form.watch("fullFile")}
                    onChange={(val) => {
                      form.setValue("fullFile", val ?? undefined as unknown as CreateNoteInput["fullFile"]);
                      form.setValue("previewFile", null);
                    }}
                  />
                  {form.formState.errors.fullFile && (
                    <p className="text-xs text-destructive font-medium mt-1">
                      {form.formState.errors.fullFile.message}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <FileUploadField
                    kind="note_preview"
                    label="Sample Preview PDF (Required for Paid Note)"
                    accept=".pdf"
                    maxSizeMB={50}
                    value={form.watch("previewFile") || form.watch("fullFile")}
                    onChange={(val) => {
                      form.setValue("previewFile", val);
                      if (val) form.setValue("fullFile", val);
                    }}
                  />
                  {form.formState.errors.previewFile && (
                    <p className="text-xs text-destructive font-medium mt-1">
                      {form.formState.errors.previewFile.message}
                    </p>
                  )}
                </div>
              )}

              <FileUploadField
                kind="cover"
                label="Cover Image (Optional)"
                accept="image/*"
                maxSizeMB={10}
                value={form.watch("coverImage")}
                onChange={(val) => form.setValue("coverImage", val)}
              />
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
                <label className="text-sm font-medium">Pricing Type</label>
                <Select
                  value={pricingType}
                  onValueChange={(val: "free" | "paid" | null) => {
                    if (val !== null) {
                      form.setValue("pricingType", val);
                      if (val === "free") {
                        form.setValue("price", 0);
                        form.setValue("compareAtPrice", null);
                      }
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free Note</SelectItem>
                    <SelectItem value="paid">Paid Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {pricingType === "paid" && (
                <>
                  <div>
                    <label className="text-sm font-medium">Price (₹ INR)</label>
                    <Input
                      type="number"
                      step="1"
                      placeholder="499"
                      {...form.register("price", { valueAsNumber: true })}
                    />
                    {form.formState.errors.price && (
                      <p className="mt-1 text-xs text-destructive">{form.formState.errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">Original Price (₹ INR - Optional)</label>
                    <Input
                      type="number"
                      step="1"
                      placeholder="999"
                      {...form.register("compareAtPrice", { valueAsNumber: true })}
                    />
                  </div>
                </>
              )}

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
                  <p className="text-sm font-medium">Featured Note</p>
                  <p className="text-xs text-muted-foreground">Display prominently on homepage</p>
                </div>
                <Switch
                  checked={form.watch("isFeatured")}
                  onCheckedChange={(checked) => form.setValue("isFeatured", checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Page Count (Optional)</label>
                <Input
                  type="number"
                  placeholder="e.g. 42"
                  {...form.register("pageCount", { valueAsNumber: true })}
                />
              </div>
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
