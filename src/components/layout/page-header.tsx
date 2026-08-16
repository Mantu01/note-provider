import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({ eyebrow, title, description, action, className }: { eyebrow?: string; title: string; description?: string; action?: ReactNode; className?: string }) {
  return <header className={cn("flex flex-col gap-3 border-b pb-6 md:flex-row md:items-end md:justify-between", className)}>
    <div className="max-w-2xl space-y-1.5">
      {eyebrow && <p className="text-[10px] font-semibold tracking-[0.15em] text-primary uppercase">{eyebrow}</p>}
      <h1 className="font-heading text-xl font-bold tracking-tight md:text-2xl">{title}</h1>
      {description && <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>}
    </div>
    {action}
  </header>;
}
