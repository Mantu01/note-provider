"use client";

import { FileDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDownloadFile } from "@/hooks/use-download-file";
import { isGoogleDriveUrl, toGoogleDrivePreviewUrl, toGoogleDriveDownloadUrl } from "@/schemas/note.schema";

export function PdfPreviewDialog({
  previewUrl,
  filename,
}: {
  previewUrl: string;
  filename: string;
}) {
  const { download, isDownloading } = useDownloadFile();

  const iframeSrc = isGoogleDriveUrl(previewUrl)
    ? toGoogleDrivePreviewUrl(previewUrl)
    : previewUrl;

  const handleDownload = () => {
    const directUrl = isGoogleDriveUrl(previewUrl)
      ? toGoogleDriveDownloadUrl(previewUrl)
      : previewUrl;
    download({ url: directUrl, filename });
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" className="w-full" />}>
        <FileText aria-hidden="true" className="mr-2 size-4" />
        Preview PDF
      </DialogTrigger>

      <DialogContent className="max-w-4xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Note Preview</DialogTitle>
          <DialogDescription>
            Review a sample before purchasing the full notes.
          </DialogDescription>
        </DialogHeader>

        <div className="relative overflow-hidden rounded-xl border bg-muted/30">
          <iframe
            title="Note preview"
            src={iframeSrc}
            className="h-[60vh] w-full border-0"
            allow="fullscreen"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
              "Preparing…"
            ) : (
              <>
                <FileDown aria-hidden="true" className="mr-2 size-4" />
                Download preview PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
