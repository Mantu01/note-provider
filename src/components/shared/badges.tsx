import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const LEVEL_BADGE: Record<string, string> = {
  basics:    "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
  intermediate: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
  advance:   "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
};

const PRICING_BADGE: Record<string, string> = {
  free: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
  paid: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border border-orange-200 dark:border-orange-800",
};

interface LevelBadgeProps {
  level: string;
  className?: string;
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  return (
    <Badge className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", LEVEL_BADGE[level] ?? "bg-muted text-muted-foreground border border-border", className)}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </Badge>
  );
}

interface PricingBadgeProps {
  pricingType: string;
  className?: string;
}

export function PricingBadge({ pricingType, className }: PricingBadgeProps) {
  const cls = pricingType === "free" ? PRICING_BADGE.free : PRICING_BADGE.paid;
  const label = pricingType === "free" ? "Free" : "Premium";
  return (
    <Badge className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", cls, className)}>
      {label}
    </Badge>
  );
}
