"use client";

import { useMutation } from "@tanstack/react-query";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({
  value,
  label = "Copy to clipboard",
}: {
  value: string;
  label?: string;
}) {
  const copyMutation = useMutation({
    mutationFn: async () => {
      await navigator.clipboard.writeText(value);
    },
    onSuccess: () => {
      toast.success("Copied to clipboard");
    },
    onError: () => {
      toast.error("Failed to copy to clipboard");
    },
  });

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      onClick={() => copyMutation.mutate()}
    >
      {copyMutation.isSuccess ? (
        <Check aria-hidden="true" className="size-4 text-success" />
      ) : (
        <Copy aria-hidden="true" className="size-4" />
      )}
    </Button>
  );
}
