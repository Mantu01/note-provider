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

      <DialogContent className="max-w-[90vw] sm:max-w-6xl gap-0 p-0">
        <div className="flex flex-col px-4 pt-4 pb-2">
          <DialogTitle className="text-base font-bold">Note Preview</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Review sample pages before purchasing.
          </DialogDescription>
        </div>

        <div className="relative mx-0 mb-0 overflow-hidden rounded-none border-x-0 border-b-0 bg-muted/10">
          <iframe
            title="Note preview"
            src={iframeSrc}
            className="h-[75vh] w-full border-0"
            allow="fullscreen"
          />
        </div>

        <div className="flex items-center justify-between px-4 pb-4">
          <p className="text-xs text-muted-foreground">
            Preview limited to a few sample pages.
          </p>
          <Button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
              "Preparing..."
            ) : (
              <>
                <FileDown aria-hidden="true" className="mr-2 size-4" />
                Download Preview
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
