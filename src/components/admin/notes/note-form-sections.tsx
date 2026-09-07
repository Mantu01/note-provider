"use client";

import Link from "next/link";
import { HelpCircle, HardDrive, UploadCloud } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileUploadField } from "@/components/shared/file-upload-field";
import { type CreateNoteInput, type CreateNotePayload } from "@/lib/schemas/note.schema";
import { NOTE_LEVELS } from "@/lib/constants";
import type { AdminNote } from "@/lib/types";

type FileSource = "upload" | "drive";

type FileFieldSource = CreateNotePayload["fullFile"] extends { source: FileSource }
  ? CreateNotePayload["fullFile"]
  : never;

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

type FileAttachmentsSectionProps = {
  form: UseFormReturn<CreateNoteInput>;
  pricingType: "free" | "paid";
  fullFile: FileFieldSource | undefined;
  previewFile: FileFieldSource | null;
  fullFileSource: FileSource;
  setFullFileSource: (source: FileSource) => void;
  previewFileSource: FileSource;
  setPreviewFileSource: (source: FileSource) => void;
};

export function FileAttachmentsSection({
  form,
  pricingType,
  fullFile,
  previewFile,
  fullFileSource,
  setFullFileSource,
  previewFileSource,
  setPreviewFileSource,
}: FileAttachmentsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">File Attachments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Full PDF section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {pricingType === "free"
                ? "Full Study Note PDF (Required for Free Download)"
                : "Full Study Note PDF (Required — buyers receive this after payment)"}
            </span>
            {fullFile && fullFile.source === "upload" && (
              <span className="inline-flex items-center gap-1 text-[10px] text-success">
                <UploadCloud className="h-3 w-3" /> Uploaded via Cloudinary
              </span>
            )}
            {fullFile && fullFile.source === "drive" && (
              <span className="inline-flex items-center gap-1 text-[10px] text-primary">
                <HardDrive className="h-3 w-3" /> Google Drive link
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant={fullFileSource === "upload" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setFullFileSource("upload")}
            >
              <UploadCloud className="mr-1.5 h-3 w-3" /> Upload File
            </Button>
            <Button
              type="button"
              variant={fullFileSource === "drive" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                setFullFileSource("drive");
                form.setValue("fullFile", { source: "drive", url: "" } as CreateNoteInput["fullFile"]);
              }}
            >
              <HardDrive className="mr-1.5 h-3 w-3" /> Google Drive URL
            </Button>
          </div>

          {fullFileSource === "drive" ? (
            <div className="space-y-2">
              <Input
                placeholder="https://drive.google.com/file/d/.../view"
                value={fullFile?.source === "drive" ? fullFile.url : ""}
                onChange={(e) => {
                  form.setValue("fullFile", { source: "drive", url: e.target.value } as CreateNoteInput["fullFile"]);
                }}
              />
              <p className="text-[10px] text-muted-foreground">
                Paste the Google Drive share link directly. No file upload needed.
              </p>
              {form.formState.errors.fullFile && (
                <p className="text-xs text-destructive font-medium">{form.formState.errors.fullFile.message}</p>
              )}
            </div>
          ) : (
            <>
              <FileUploadField
                kind="note_full"
                label=""
                accept=".pdf"
                maxSizeMB={100}
                value={fullFile?.source === "upload" ? fullFile : null}
                onChange={(val) => {
                  if (val) {
                    form.setValue("fullFile", { ...val, source: "upload" as const } as CreateNoteInput["fullFile"]);
                  } else {
                    form.setValue("fullFile", undefined as unknown as CreateNoteInput["fullFile"]);
                  }
                  form.setValue("previewFile", null);
                }}
              />
              {form.formState.errors.fullFile && (
                <p className="text-xs text-destructive font-medium">{form.formState.errors.fullFile.message}</p>
              )}
            </>
          )}
        </div>

        {/* Preview PDF section (paid only) */}
        {pricingType === "paid" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sample Preview PDF (Optional)</span>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant={previewFileSource === "upload" ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setPreviewFileSource("upload")}
              >
                <UploadCloud className="mr-1.5 h-3 w-3" /> Upload File
              </Button>
              <Button
                type="button"
                variant={previewFileSource === "drive" ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  setPreviewFileSource("drive");
                  form.setValue("previewFile", { source: "drive", url: "" } as CreateNoteInput["previewFile"]);
                }}
              >
                <HardDrive className="mr-1.5 h-3 w-3" /> Google Drive URL
              </Button>
            </div>

            {previewFileSource === "drive" ? (
              <div className="space-y-2">
                <Input
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={previewFile?.source === "drive" ? previewFile.url : ""}
                  onChange={(e) => {
                    form.setValue("previewFile", { source: "drive", url: e.target.value } as CreateNoteInput["previewFile"]);
                  }}
                />
                <p className="text-[10px] text-muted-foreground">
                  Paste the Google Drive share link directly. No file upload needed.
                </p>
                {form.formState.errors.previewFile && (
                  <p className="text-xs text-destructive font-medium">{form.formState.errors.previewFile.message}</p>
                )}
              </div>
            ) : (
              <>
                <FileUploadField
                  kind="note_preview"
                  label=""
                  accept=".pdf"
                  maxSizeMB={50}
                  value={previewFile?.source === "upload" ? previewFile : null}
                  onChange={(val) => {
                    if (val) {
                      form.setValue("previewFile", { ...val, source: "upload" as const } as CreateNoteInput["previewFile"]);
                    } else {
                      form.setValue("previewFile", null);
                    }
                  }}
                />
                {form.formState.errors.previewFile && (
                  <p className="text-xs text-destructive font-medium">{form.formState.errors.previewFile.message}</p>
                )}
              </>
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
