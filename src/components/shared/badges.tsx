import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const LEVEL_CLASS: Record<string, string> = {
  basics:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  intermediate:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  advance:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300",
};

const PRICING_CLASS: Record<string, string> = {
  free: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  paid: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-300",
};

const LEVEL_LABEL: Record<string, string> = {
  basics: "Basics",
  intermediate: "Intermediate",
  advance: "Advanced",
};

export function LevelBadge({ level, className }: { level: string; className?: string }) {
  return (
    <Badge
      className={cn(
        "border text-[11px] font-semibold",
        LEVEL_CLASS[level] ?? "border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      {LEVEL_LABEL[level] ?? level}
    </Badge>
  );
}

export function PricingBadge({ pricingType, className }: { pricingType: string; className?: string }) {
  const isFree = pricingType === "free";
  return (
    <Badge
      className={cn(
        "border text-[11px] font-semibold",
        isFree ? PRICING_CLASS.free : PRICING_CLASS.paid,
        className,
      )}
    >
      {isFree ? "Free" : "Premium"}
    </Badge>
  );
}
