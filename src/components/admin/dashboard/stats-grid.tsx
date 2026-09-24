"use client";

import { FileText, IndianRupee, ShoppingBag, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCompactNumber, formatPrice } from "@/lib/format";
import type { DashboardStats } from "@/lib/types";

export function StatsGrid({
  stats,
  periodDays = 30,
  periodPaise,
}: {
  stats: DashboardStats;
  periodDays?: 7 | 30;
  periodPaise?: number;
}) {
  const activePeriodPaise = periodPaise ?? stats.revenue.periodPaise;
  const activePeriodLabel = formatPrice(activePeriodPaise);

  const statCards = [
    {
      title: "Total Revenue",
      icon: IndianRupee,
      iconClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
      value: stats.revenue.totalLabel,
      sub: `Today ${stats.revenue.todayLabel}`,
    },
    {
      title: "Paid Orders",
      icon: ShoppingBag,
      iconClass: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
      value: formatCompactNumber(stats.orders.paid),
      sub: `${formatCompactNumber(stats.orders.today)} today`,
    },
    {
      title: periodDays === 7 ? "7-Day Revenue" : "30-Day Revenue",
      icon: TrendingUp,
      iconClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
      value: activePeriodLabel,
      sub: `Last ${periodDays} days`,
    },
    {
      title: "Catalogue Notes",
      icon: FileText,
      iconClass: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
      value: formatCompactNumber(stats.catalog.totalNotes),
      sub: `${stats.catalog.paidNotes} paid · ${stats.catalog.freeNotes} free`,
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="rounded-2xl border border-border/60 bg-card">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                  {card.title}
                </p>
                <p className="mt-1.5 text-2xl font-bold tabular-nums tracking-tight text-foreground">
                  {card.value}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{card.sub}</p>
              </div>
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl",
                  card.iconClass,
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
