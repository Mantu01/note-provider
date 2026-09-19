"use client";

import Link from "next/link";
import { HelpCircle, UploadCloud } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileUploadField } from "@/components/shared/file-upload-field";
import { type CreateNoteInput } from "@/schemas/note.schema";
import { NOTE_LEVELS } from "@/lib/constants";

type NoteDetailsSectionProps = {
  form: UseFormReturn<CreateNoteInput>;
  categories: Array<{ id: string; name: string }>;
  selectedCategory: { id: string; name: string } | undefined;
  onAddCategory: () => void;
  initialCategoryName?: string;
};

export function NoteDetailsSection({
  form,
  categories,
  selectedCategory,
  onAddCategory,
  initialCategoryName,
}: NoteDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Note Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="note-title" className="text-sm font-medium">Title</label>
          <Input
            id="note-title"
            placeholder="e.g. Complete Data Structures & Algorithms Handbook"
            {...form.register("title")}
          />
          {form.formState.errors.title && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="note-description" className="text-sm font-medium">Description</label>
          <Textarea
            id="note-description"
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
              <label htmlFor="note-category" className="text-sm font-medium">Category</label>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-xs text-primary font-medium"
                onClick={onAddCategory}
              >
                + Add Category
              </Button>
            </div>
            <Select
              id="note-category"
              value={form.watch("categoryId")}
              onValueChange={(val) => {
                form.setValue("categoryId", val ?? "");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category">
                  {selectedCategory?.name || initialCategoryName || "Select Category"}
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
        </div>

        <div className="pt-2">
          <label htmlFor="note-level" className="text-sm font-medium">Target Level</label>
          <Select
            id="note-level"
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
  );
}

import { useState } from "react";
import { isGoogleDriveUrl } from "@/schemas/note.schema";

type FileAttachmentsSectionProps = {
  form: UseFormReturn<CreateNoteInput>;
  pricingType: "free" | "paid";
  fullFile: { url: string; publicId?: string; bytes?: number } | null | undefined;
  previewFile: { url: string; publicId?: string; bytes?: number } | null | undefined;
  coverImage: { url: string; publicId?: string } | null | undefined;
};

export function FileAttachmentsSection({
  form,
  pricingType,
  fullFile,
  previewFile,
  coverImage,
}: FileAttachmentsSectionProps) {
  const currentDriveUrl = form.watch("fullFileUrl") ?? "";
  const [fullInputMode, setFullInputMode] = useState<"upload" | "drive">(
    currentDriveUrl ? "drive" : "upload",
  );

  const driveValid = currentDriveUrl.trim().length > 0 ? isGoogleDriveUrl(currentDriveUrl) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">File Attachments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-semibold text-foreground">
              1. Full Study Note (Required)
            </span>
            <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1">
              <Button
                type="button"
                size="sm"
                variant={fullInputMode === "upload" ? "default" : "ghost"}
                className="h-7 px-2.5 text-xs font-medium rounded-md"
                onClick={() => {
                  setFullInputMode("upload");
                  form.setValue("fullFileUrl", null);
                }}
              >
                Upload File
              </Button>
              <Button
                type="button"
                size="sm"
                variant={fullInputMode === "drive" ? "default" : "ghost"}
                className="h-7 px-2.5 text-xs font-medium rounded-md"
                onClick={() => {
                  setFullInputMode("drive");
                  form.setValue("fullFile", null);
                }}
              >
                Google Drive URL
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {pricingType === "free"
              ? "The complete study note that learners download immediately."
              : "The complete study note that buyers receive after successful checkout."}
          </p>

          {fullInputMode === "upload" ? (
            <div>
              <FileUploadField
                kind="note_full"
                label=""
                accept=".pdf"
                maxSizeMB={10}
                value={fullFile ?? null}
                onChange={(val) => {
                  form.setValue(
                    "fullFile",
                    val ? ({ ...val } as { url: string; publicId?: string; bytes?: number }) : null,
                  );
                  if (val) form.setValue("fullFileUrl", null);
                }}
              />
              {form.formState.errors.fullFile && (
                <p className="mt-1 text-xs text-destructive font-medium">
                  {form.formState.errors.fullFile.message}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                placeholder="https://drive.google.com/file/d/..."
                value={currentDriveUrl}
                onChange={(event) => {
                  const url = event.target.value;
                  form.setValue("fullFileUrl", url);
                  if (url.trim().length > 0) form.setValue("fullFile", null);
                }}
              />
              {currentDriveUrl.trim().length > 0 && (
                <p className={`text-xs ${driveValid ? "text-success" : "text-destructive"}`}>
                  {driveValid
                    ? "✓ Valid Google Drive link. It will automatically convert to a direct download link."
                    : "✗ Please enter a valid Google Drive file URL."}
                </p>
              )}
              {form.formState.errors.fullFileUrl && (
                <p className="text-xs text-destructive font-medium">
                  {form.formState.errors.fullFileUrl.message}
                </p>
              )}
              {form.formState.errors.fullFile && !currentDriveUrl && (
                <p className="text-xs text-destructive font-medium">
                  {form.formState.errors.fullFile.message}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              2. Sample Preview PDF (Required)
            </span>
            {previewFile?.url && (
              <span className="inline-flex items-center gap-1 text-[10px] text-success">
                <UploadCloud className="h-3 w-3" /> Uploaded via Cloudinary
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Sample preview pages (max 10MB) displayed in the preview dialog before purchase or download.
          </p>
          <FileUploadField
            kind="note_preview"
            label=""
            accept=".pdf"
            maxSizeMB={10}
            value={previewFile ?? null}
            onChange={(val) => {
              form.setValue(
                "previewFile",
                val ? ({ ...val } as { url: string; publicId?: string; bytes?: number }) : null,
              );
            }}
          />
          {form.formState.errors.previewFile && (
            <p className="text-xs text-destructive font-medium">
              {form.formState.errors.previewFile.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <span className="text-sm font-semibold text-foreground">
            3. Cover Image (Required)
          </span>
          <p className="text-xs text-muted-foreground">
            Thumbnail image (PNG, JPG, or WEBP up to 5MB) displayed on cards and order confirmation.
          </p>
          <FileUploadField
            kind="cover"
            label=""
            accept="image/*"
            maxSizeMB={5}
            value={coverImage ?? null}
            onChange={(val) => {
              form.setValue(
                "coverImage",
                val ? ({ ...val } as { url: string; publicId?: string }) : null,
              );
            }}
          />
          {form.formState.errors.coverImage && (
            <p className="text-xs text-destructive font-medium">
              {form.formState.errors.coverImage.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type PricingVisibilitySectionProps = {
  form: UseFormReturn<CreateNoteInput>;
  pricingType: "free" | "paid";
};

export function PricingVisibilitySection({
  form,
  pricingType,
}: PricingVisibilitySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pricing & Visibility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="note-pricing-type" className="text-sm font-medium">Pricing Type</label>
          <Select
            id="note-pricing-type"
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
              <label htmlFor="note-price" className="text-sm font-medium">Price (₹ INR)</label>
              <Input
                id="note-price"
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
              <label htmlFor="note-compare-at-price" className="text-sm font-medium">Original Price (₹ INR - Optional)</label>
              <Input
                id="note-compare-at-price"
                type="number"
                step="1"
                placeholder="999"
                {...form.register("compareAtPrice", { valueAsNumber: true })}
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="note-visibility" className="text-sm font-medium">Visibility</label>
          <Select
            id="note-visibility"
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
          <label htmlFor="note-page-count" className="text-sm font-medium">Page Count (Optional)</label>
          <Input
            id="note-page-count"
            type="number"
            placeholder="e.g. 42"
            {...form.register("pageCount", { valueAsNumber: true })}
          />
          {form.formState.errors.pageCount && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.pageCount.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type ServerErrorBannerProps = {
  message: string;
};

export function ServerErrorBanner({ message }: ServerErrorBannerProps) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <h4 className="font-semibold text-sm">Publishing Error</h4>
          <p className="text-xs">{message || "Failed to publish note. Please try again."}</p>
        </div>
      </div>
      <Button variant="outline" render={<Link href="/contact" />} size="sm">
        <HelpCircle className="mr-1.5 h-3.5 w-3.5" /> Contact Support
      </Button>
    </div>
  );
}