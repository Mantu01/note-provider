import { RefreshCw, TriangleAlert, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";

type ErrorStateProps = {
  message?: string;
  onRetry: () => void;
};

export function ErrorState({ message = "We could not load this right now.", onRetry }: ErrorStateProps) {
  return (
    <EmptyState
      icon={TriangleAlert}
      title="Something went wrong"
      description={message}
      action={
        <div className="flex items-center gap-2">
          <Button onClick={onRetry} size="sm">
            <RefreshCw aria-hidden="true" className="mr-1.5 size-3.5" />
            Try again
          </Button>
          <Button render={<Link href="/contact" />} variant="outline" size="sm">
            <HelpCircle aria-hidden="true" className="mr-1.5 size-3.5" />
            Contact Support
          </Button>
        </div>
      }
    />
  );
}
