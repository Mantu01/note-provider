"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { UploadKind, UploadResponse } from "@/lib/types";
import { toast } from "sonner";

export function useFileUpload() {
  return useMutation({
    mutationFn: async ({ file, kind }: { file: File; kind: UploadKind }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", kind);

      return apiClient<UploadResponse>("/admin/uploads", {
        method: "POST",
        body: formData,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "File upload failed");
    },
  });
}

export function useDeleteUpload() {
  return useMutation({
    mutationFn: async ({ publicId, resourceType }: { publicId: string; resourceType: "raw" | "image" }) => {
      return apiClient<{ deleted: true }>("/admin/uploads", {
        method: "DELETE",
        body: JSON.stringify({ publicId, resourceType }),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove file");
    },
  });
}
