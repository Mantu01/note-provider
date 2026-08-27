"use client";

import { useCallback, useState } from "react";
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
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      onClick={copyToClipboard}
    >
      {copied ? (
        <Check aria-hidden="true" className="size-4 text-success" />
      ) : (
        <Copy aria-hidden="true" className="size-4" />
      )}
    </Button>
  );
}
