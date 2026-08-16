import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function StaticPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/6 via-card to-accent/6 p-6 text-center sm:p-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Information</p>
        <h1 className="mb-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <CardContent className="prose prose-neutral max-w-none space-y-4 p-5 text-foreground dark:prose-invert sm:p-6 lg:p-8">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
