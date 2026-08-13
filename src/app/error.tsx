"use client";

import Link from "next/link";
import { TriangleAlert, HelpCircle } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <Logo href={null} size="lg" />
        <div className="space-y-2">
          <TriangleAlert aria-hidden="true" className="mx-auto size-10 text-destructive" />
          <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
          <p className="text-muted-foreground">Please try again or contact support if the problem continues.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button render={<Link href="/contact" />} variant="outline">
            <HelpCircle className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
          <Button render={<Link href="/" />} variant="ghost">Home</Button>
        </div>
      </div>
    </main>
  );
}
