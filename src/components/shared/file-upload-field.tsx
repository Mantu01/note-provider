"use client";

import Image from "next/image";
import { UploadCloud, FileText, ImageIcon, X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFileUpload, useDeleteUpload } from "@/features/admin/api/use-upload";
import type { UploadKind } from "@/lib/types";
import { toast } from "sonner";

type FileUploadFieldProps = {
  kind: UploadKind;
  label: string;
  accept?: string;
  maxSizeMB?: number;
  value?: { url: string; publicId: string; bytes?: number } | null;
  onChange: (value: { url: string; publicId: string; bytes: number } | null) => void;
  disabled?: boolean;
};

export function FileUploadField({
  kind,
  label,
  accept = ".pdf",
  maxSizeMB = 50,
  value,
  onChange,
  disabled = false,
}: FileUploadFieldProps) {
  const uploadMutation = useFileUpload();
  const deleteMutation = useDeleteUpload();

  const isImage = kind === "cover";

  const handleFileSelect = (file: File) => {
    if (disabled) return;
    uploadMutation.mutate(
      { file, kind },
      {
        onSuccess: (res) => {
          onChange({
            url: res.url,
            publicId: res.publicId,
            bytes: res.bytes,
          });
        },
        onError: (err: Error) => {
          toast.error(`Upload failed: ${err.message || "File could not be uploaded"}`);
        },
      }
    );
  };

  const handleRemove = () => {
    if (!value || disabled) return;
    const publicId = value.publicId;
    onChange(null);
    deleteMutation.mutate({
      publicId,
      resourceType: isImage ? "image" : "raw",
    });
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}

      {value ? (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            {isImage ? (
              value.url ? (
                <div className="relative aspect-[16/9] w-24 overflow-hidden rounded-lg border border-border">
                  <Image
                    src={value.url}
                    alt="Cover preview"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {value.publicId.split("/").pop() || "Uploaded File"}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-success font-medium">
                  <CheckCircle2 className="h-3 w-3" /> Ready
                </span>
                {value.bytes && <span>• {(value.bytes / (1024 * 1024)).toFixed(1)} MB</span>}
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={disabled || deleteMutation.isPending}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 p-6 text-center transition-all duration-200 hover:border-primary/50 hover:bg-muted/30 ${
            disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <input
            type="file"
            accept={accept}
            disabled={disabled || uploadMutation.isPending}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="absolute inset-0 z-10 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          {uploadMutation.isPending ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-foreground">Uploading file...</p>
              <p className="text-xs">Please wait while we process your asset</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Click to upload <span className="font-normal text-muted-foreground">or drag and drop</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {accept.toUpperCase()} up to {maxSizeMB} MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

