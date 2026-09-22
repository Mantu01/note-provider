import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function StaticPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-3 py-5 sm:px-5 sm:py-7 lg:px-8">
      <div className="mb-3.5 rounded-xl border border-border/60 bg-linear-to-br from-primary/8 via-card to-accent/6 p-3.5 text-center shadow-sm sm:mb-5 sm:p-5">
        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-primary">Information</p>
        <h1 className="mb-1.5 font-heading text-base font-bold tracking-tight sm:text-lg md:text-xl">{title}</h1>
        <p className="mx-auto max-w-xl text-xs text-muted-foreground">{description}</p>
      </div>

      <Card className="overflow-hidden rounded-xl border-border/60 shadow-sm">
        <CardContent className="prose prose-neutral max-w-none space-y-2.5 p-3.5 text-foreground dark:prose-invert sm:p-5">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
