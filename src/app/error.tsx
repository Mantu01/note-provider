"use client";

import Link from "next/link";
import { TriangleAlert, HelpCircle } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="relative grid min-h-screen place-items-center px-4 paper-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--brand-orange-soft),transparent_60%)] opacity-40" />
      <div className="relative z-10 flex max-w-sm flex-col items-center gap-5 text-center paper-card torn-edge p-8">
        <Logo size="lg" />
        <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20">
          <TriangleAlert aria-hidden="true" className="size-8 text-destructive" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold tracking-tight">Something went wrong</h1>
          <p className="max-w-xs text-sm text-muted-foreground">Please try again or contact support if the problem continues.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button onClick={reset} className="rounded-full shadow-lg bg-brand-orange text-white">
            Try again
          </Button>
          <Button render={<Link href="/contact" />} variant="outline" className="gap-2 rounded-full">
            <HelpCircle className="size-4" />
            Support
          </Button>
          <Button render={<Link href="/" />} variant="ghost">
            Home
          </Button>
        </div>
      </div>
    </main>
  );
}
