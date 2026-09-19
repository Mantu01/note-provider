"use client";

import { useEffect } from "react";
import { parseAsBoolean, useQueryStates } from "nuqs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "@/components/admin/categories/category-dialog";
import { useAdminCategories, useCreateNote, useUpdateNote } from "@/hooks/useAdmin";
import { createNoteSchema, type CreateNoteInput } from "@/schemas/note.schema";
import type { AdminNote } from "@/lib/types";
import {
  NoteDetailsSection,
  FileAttachmentsSection,
  PricingVisibilitySection,
  ServerErrorBanner,
} from "./note-form-sections";

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

  const isInitialDrive = Boolean(
    initialData?.fullFileUrl &&
    (initialData.fullFileUrl.includes("drive.google.com") || initialData.fullFileUrl.includes("docs.google.com")),
  );

  const defaultFullFile = initialData?.fullFileUrl && !isInitialDrive
    ? { url: initialData.fullFileUrl, publicId: "existing", bytes: 0 }
    : null;

  const defaultFullFileUrl = isInitialDrive ? (initialData?.fullFileUrl ?? null) : null;

  const defaultPreviewFile = initialData?.previewFileUrl
    ? { url: initialData.previewFileUrl, publicId: "existing", bytes: 0 }
    : null;

  const defaultCoverImage = initialData?.coverImageUrl
    ? { url: initialData.coverImageUrl, publicId: "existing" }
    : null;

  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      categoryId: initialData?.category?.id ?? "",
      level: initialData?.level ?? "basics",
      visibility: initialData?.visibility ?? "public",
      pricingType: initialData?.pricingType ?? "free",
      price: initialData ? initialData.price / 100 : 0,
      compareAtPrice: initialData?.compareAtPrice ? initialData.compareAtPrice / 100 : null,
      tags: initialData?.tags ?? [],
      isFeatured: initialData?.isFeatured ?? false,
      pageCount: initialData?.pageCount ?? null,
      fullFile: defaultFullFile,
      fullFileUrl: defaultFullFileUrl,
      previewFile: defaultPreviewFile,
      coverImage: defaultCoverImage,
    },
  });

  const selectedCategoryId = form.watch("categoryId");
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const pricingType = form.watch("pricingType");
  const fullFile = form.watch("fullFile");
  const previewFile = form.watch("previewFile");
  const coverImage = form.watch("coverImage");

  useEffect(() => {
    const err = createMutation.error || updateMutation.error;
    if (err && typeof err === "object" && "fields" in err && (err as any).fields) {
      for (const [key, msg] of Object.entries((err as any).fields as Record<string, string>)) {
        form.setError(key as any, { message: msg });
      }
    }
  }, [createMutation.error, updateMutation.error, form]);

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
            aria-label="Back to notes list"
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
            <h4 className="font-semibold text-sm">Please fix the following issues:</h4>
            <ul className="mt-1 text-xs space-y-1 list-disc list-inside">
              {Object.entries(form.formState.errors).map(([key, err]) => (
                <li key={key}>
                  {typeof err?.message === "string" ? err.message : `${key} is invalid`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {serverError && <ServerErrorBanner message={serverError.message || ""} />}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <NoteDetailsSection
            form={form}
            categories={categories}
            selectedCategory={selectedCategory}
            onAddCategory={() => setCategoryDialogOpen(true)}
            initialCategoryName={initialData?.category?.name}
          />
          <FileAttachmentsSection
            form={form}
            pricingType={pricingType}
            fullFile={fullFile}
            previewFile={previewFile}
            coverImage={coverImage}
          />
        </div>

        <div className="space-y-6">
          <PricingVisibilitySection form={form} pricingType={pricingType} />
        </div>
      </div>

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
      />
    </form>
  );
}