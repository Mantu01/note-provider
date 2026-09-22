import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function StaticPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-3 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-4 rounded-xl border border-border/60 bg-linear-to-br from-primary/8 via-card to-accent/6 p-4 text-center shadow-sm sm:mb-6 sm:p-6">
        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-primary">Information</p>
        <h1 className="mb-1.5 font-heading text-lg font-bold tracking-tight sm:text-xl md:text-2xl">{title}</h1>
        <p className="mx-auto max-w-xl text-xs text-muted-foreground">{description}</p>
      </div>

      <Card className="overflow-hidden rounded-xl border-border/60 shadow-sm">
        <CardContent className="prose prose-neutral max-w-none space-y-3 p-4 text-foreground dark:prose-invert sm:p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
