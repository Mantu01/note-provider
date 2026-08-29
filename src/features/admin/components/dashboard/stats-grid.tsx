"use client";

import { DollarSign, ShoppingBag, FileText, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";

type StatsGridProps = {
  stats: DashboardStats;
};

const STAT_CARDS = [
  {
    title: "Total Revenue",
    valueKey: "revenue",
    subtextKey: "revenue" as const,
    icon: DollarSign,
    ringClass: "ring-brand-emerald/20",
    iconBgClass: "bg-brand-emerald-soft text-brand-emerald-foreground",
    getValue: (s: DashboardStats) => s.revenue.totalLabel,
    getSub: (s: DashboardStats) => `Today: ${s.revenue.todayLabel}`,
  },
  {
    title: "Paid Orders",
    valueKey: "orders",
    subtextKey: "orders" as const,
    icon: ShoppingBag,
    ringClass: "ring-brand-blue/20",
    iconBgClass: "bg-brand-blue-soft text-brand-blue-foreground",
    getValue: (s: DashboardStats) => String(s.orders.paid),
    getSub: (s: DashboardStats) => `${s.orders.pendingFulfillment} pending fulfillment`,
  },
  {
    title: "Catalogue Notes",
    valueKey: "catalog",
    subtextKey: "catalog" as const,
    icon: FileText,
    ringClass: "ring-brand-orange/20",
    iconBgClass: "bg-brand-orange-soft text-brand-orange-foreground",
    getValue: (s: DashboardStats) => String(s.catalog.totalNotes),
    getSub: (s: DashboardStats) => `${s.catalog.paidNotes} paid · ${s.catalog.freeNotes} free`,
  },
  {
    title: "Leads Captured",
    valueKey: "leads",
    subtextKey: "leads" as const,
    icon: Users,
    ringClass: "ring-brand-amber/20",
    iconBgClass: "bg-brand-amber-soft text-brand-amber-foreground",
    getValue: (s: DashboardStats) => String(s.leads.total),
    getSub: (s: DashboardStats) => `Today: ${s.leads.today} submissions`,
  },
] as const;

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CARDS.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.title}
            className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            {/* colored top accent bar */}
            <div className={`h-1 w-full bg-gradient-to-r ${item.ringClass.replace("ring-", "from-").replace("/20", "")}-500 to-transparent`} />
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {item.title}
                </p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">
                  {item.getValue(stats)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.getSub(stats)}</p>
              </div>
              <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${item.iconBgClass} ring-1 ring-inset ring-current/10`}>
                <Icon aria-hidden="true" className="size-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
