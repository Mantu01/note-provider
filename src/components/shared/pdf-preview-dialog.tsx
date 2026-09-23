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
      <DialogTrigger render={<Button variant="outline" className="w-full"><FileText aria-hidden="true" className="mr-2 size-4" />Preview PDF</Button>} />

      <DialogContent className="max-w-[92vw] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-6xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <DialogTitle className="text-sm font-bold">Note Preview</DialogTitle>
            <DialogDescription className="text-[11px] text-muted-foreground">
              Review sample pages before purchasing.
            </DialogDescription>
          </div>
          <Button onClick={handleDownload} disabled={isDownloading} size="sm" className="h-8 text-xs">
            {isDownloading ? (
              "Preparing..."
            ) : (
              <>
                <FileDown aria-hidden="true" className="mr-1.5 size-3.5" />
                Download
              </>
            )}
          </Button>
        </div>

        <div className="relative h-[60vh] w-full bg-muted/10 sm:h-[75vh]">
          <iframe
            title="Note preview"
            src={iframeSrc}
            className="h-full w-full border-0"
            allow="fullscreen"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
