import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function StaticPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[2rem] border border-border/80 bg-gradient-to-br from-primary/8 via-card to-accent/8 p-8 text-center shadow-sm sm:p-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Information</p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground">{description}</p>
      </div>

      <Card className="overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-sm">
        <CardContent className="prose prose-neutral max-w-none space-y-5 p-6 text-foreground dark:prose-invert sm:p-8 lg:p-10">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
