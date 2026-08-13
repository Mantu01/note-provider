"use client";

import { DollarSign, ShoppingBag, FileText, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";

type StatsGridProps = {
  stats: DashboardStats;
};

export function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: stats.revenue.totalLabel,
      subtext: `Today: ${stats.revenue.todayLabel}`,
      icon: DollarSign,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Paid Orders",
      value: stats.orders.paid,
      subtext: `${stats.orders.pendingFulfillment} pending fulfillment`,
      icon: ShoppingBag,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Catalogue Notes",
      value: stats.catalog.totalNotes,
      subtext: `${stats.catalog.paidNotes} paid, ${stats.catalog.freeNotes} free`,
      icon: FileText,
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      title: "Total Leads",
      value: stats.leads.total,
      subtext: `Today: ${stats.leads.today} submissions`,
      icon: Users,
      color: "text-amber-500 bg-amber-500/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="rounded-2xl border-border bg-card/60 backdrop-blur-sm">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                  {card.value}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{card.subtext}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
