"use client";

import Link from "next/link";
import { TriangleAlert, HelpCircle } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="relative grid min-h-screen place-items-center px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--brand-orange-soft),transparent_60%)] opacity-40" />
      <div className="relative z-10 flex max-w-sm flex-col items-center gap-5 text-center">
        <Logo href={null} size="lg" />
        <div className="space-y-1.5">
          <TriangleAlert aria-hidden="true" className="mx-auto size-8 text-destructive" />
          <h1 className="text-xl font-bold tracking-tight">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">Please try again or contact support if the problem continues.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button onClick={reset}>Try again</Button>
          <Button render={<Link href="/contact" />} variant="outline">
            <HelpCircle className="mr-1.5 size-3.5" />
            Support
          </Button>
          <Button render={<Link href="/" />} variant="ghost">Home</Button>
        </div>
      </div>
    </main>
  );
}
