"use client";

import { FileText, IndianRupee, PackageCheck, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/lib/format";
import type { DashboardStats } from "@/lib/types";

const STAT_CARDS = [
  {
    title: "Total Revenue",
    icon: IndianRupee,
    iconClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    getValue: (stats: DashboardStats) => stats.revenue.totalLabel,
    getSub: (stats: DashboardStats) => `Today ${stats.revenue.todayLabel}`,
  },
  {
    title: "Paid Orders",
    icon: ShoppingBag,
    iconClass: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
    getValue: (stats: DashboardStats) => formatCompactNumber(stats.orders.paid),
    getSub: (stats: DashboardStats) => `${formatCompactNumber(stats.orders.today)} today`,
  },
  {
    title: "Pending Delivery",
    icon: PackageCheck,
    iconClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    getValue: (stats: DashboardStats) => formatCompactNumber(stats.orders.pendingFulfillment),
    getSub: (stats: DashboardStats) =>
      stats.orders.pendingFulfillment === 0 ? "All delivered" : "Awaiting fulfilment",
  },
  {
    title: "Catalogue Notes",
    icon: FileText,
    iconClass: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
    getValue: (stats: DashboardStats) => formatCompactNumber(stats.catalog.totalNotes),
    getSub: (stats: DashboardStats) =>
      `${stats.catalog.paidNotes} paid · ${stats.catalog.freeNotes} free`,
  },
] as const;

export function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="rounded-2xl border border-border/60 bg-card">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                  {card.title}
                </p>
                <p className="mt-1.5 text-2xl font-bold tabular-nums tracking-tight text-foreground">
                  {card.getValue(stats)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{card.getSub(stats)}</p>
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
