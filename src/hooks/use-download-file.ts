"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

async function downloadFile({ url, filename }: { url: string; filename: string }) {
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) throw new Error("Unable to prepare your download. Please try again.");
  const objectUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

export function useDownloadFile() {
  const mutation = useMutation({
    mutationFn: downloadFile,
    onMutate: () => toast.loading("Preparing your download…", { id: "download" }),
    onSuccess: () => toast.success("Download started", { id: "download" }),
    onError: () => toast.error("Unable to prepare your download. Please try again.", { id: "download" }),
  });
  return { download: mutation.mutate, isDownloading: mutation.isPending };
}
