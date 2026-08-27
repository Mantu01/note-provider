"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { UploadKind, UploadResponse } from "@/lib/types";
import { toast } from "sonner";

export function useFileUpload() {
  const queryClient = useQueryClient();
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.notes.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "File upload failed");
    },
  });
}

export function useDeleteUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ publicId, resourceType }: { publicId: string; resourceType: "raw" | "image" }) => {
      return apiClient<{ deleted: true }>("/admin/uploads", {
        method: "DELETE",
        body: JSON.stringify({ publicId, resourceType }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.notes.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove file");
    },
  });
}
