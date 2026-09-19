"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

function extractDriveId(url: string): string | null {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)|\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/);
  return match ? (match[1] || match[2] || match[3]) : null;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
}

async function downloadFile({ url, filename }: { url: string; filename: string }) {
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const msg = errorData?.error?.message ?? "Unable to prepare your download. Please try again.";
    throw new Error(msg);
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/pdf") || contentType.includes("application/octet-stream")) {
    const blob = await response.blob();
    triggerBlobDownload(blob, filename);
    return;
  }

  const data = await response.json();
  const fileUrl = data.url;
  const finalFilename = data.filename || filename;

  if (!fileUrl) throw new Error("Download URL not found");

  const driveId = extractDriveId(fileUrl);
  if (driveId) {
    const driveDownloadUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
    window.open(driveDownloadUrl, "_blank");
    return;
  }

  try {
    const directRes = await fetch(fileUrl);
    if (directRes.ok) {
      const blob = await directRes.blob();
      triggerBlobDownload(blob, finalFilename);
      return;
    }
  } catch {
  }

  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = finalFilename;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function useDownloadFile() {
  const mutation = useMutation({
    mutationFn: downloadFile,
    onMutate: () => toast.loading("Preparing your download…", { id: "download" }),
    onSuccess: () => toast.success("Download started", { id: "download" }),
    onError: (error: Error) => toast.error(error.message || "Unable to prepare your download. Please try again.", { id: "download" }),
  });
  return { download: mutation.mutate, isDownloading: mutation.isPending };
}
