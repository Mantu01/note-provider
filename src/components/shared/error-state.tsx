import Link from "next/link";
import { RefreshCw, TriangleAlert, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export function ErrorState({
  message = "We could not load this right now.",
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <EmptyState
      icon={TriangleAlert}
      title="Something went wrong"
      description={message}
      action={
        <div className="flex items-center gap-3">
          <Button onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button variant="outline" render={<Link href="/contact" />}>
            <HelpCircle className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
        </div>
      }
    />
  );
}
