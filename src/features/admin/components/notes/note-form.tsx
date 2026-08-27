"use client";

import React from "react";
import { parseAsBoolean, useQueryStates } from "nuqs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "@/features/admin/components/categories/category-dialog";
import { useAdminCategories } from "@/features/admin/api/use-admin-categories";
import { useCreateNote, useUpdateNote } from "@/features/admin/api/use-admin-notes";
import { createNoteSchema, type CreateNoteInput, type CreateNotePayload } from "@/lib/schemas/note.schema";
import type { AdminNote } from "@/lib/types";
import {
  NoteDetailsSection,
  FileAttachmentsSection,
  PricingVisibilitySection,
  ServerErrorBanner,
} from "./note-form-sections";

type FileSource = "upload" | "drive";

type FileFieldSource = CreateNotePayload["fullFile"] extends { source: FileSource }
  ? CreateNotePayload["fullFile"]
  : never;

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

  const initialPdfSource: FileSource = initialData?.pdfSource === "drive" ? "drive" : "upload";

  const defaultFullFile: FileFieldSource | undefined = (() => {
    if (initialData?.pdfSource === "drive" && initialData.drivePdfUrl) {
      return { source: "drive" as const, url: initialData.drivePdfUrl };
    }
    if (initialData?.fullFileUrl && initialData.fullFilePublicId) {
      return { source: "upload" as const, url: initialData.fullFileUrl, publicId: initialData.fullFilePublicId, bytes: initialData.fullFileBytes };
    }
    return undefined;
  })();

  const defaultPreviewFile: FileFieldSource | null = (() => {
    if (!initialData?.previewFileUrl) return null;
    if (initialData.previewFilePublicId) {
      return { source: "upload" as const, url: initialData.previewFileUrl, publicId: initialData.previewFilePublicId, bytes: initialData.previewFileBytes ?? 0 };
    }
    return { source: "drive" as const, url: initialData.previewFileUrl };
  })();

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
      previewFile: defaultPreviewFile,
      coverImage: initialData?.coverImageUrl && initialData.coverImagePublicId ? {
        url: initialData.coverImageUrl,
        publicId: initialData.coverImagePublicId,
      } : null,
    },
  });

  const selectedCategoryId = form.watch("categoryId");
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const pricingType = form.watch("pricingType");
  const fullFile = form.watch("fullFile");
  const previewFile = form.watch("previewFile");
  const [fullFileSource, setFullFileSource] = React.useState<FileSource>(initialPdfSource);
  const [previewFileSource, setPreviewFileSource] = React.useState<FileSource>("upload");

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
            previewFile={previewFile ?? null}
            fullFileSource={fullFileSource}
            setFullFileSource={setFullFileSource}
            previewFileSource={previewFileSource}
            setPreviewFileSource={setPreviewFileSource}
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
