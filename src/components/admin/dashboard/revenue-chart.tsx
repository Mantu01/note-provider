"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DashboardStats } from "@/lib/types";

export function RevenueChart({
  data,
  days,
  onDaysChange,
}: {
  data: DashboardStats["revenueSeries"];
  days: 7 | 30;
  onDaysChange: (days: 7 | 30) => void;
}) {
  const points = data.map((item) => ({
    date: item.date.slice(5),
    revenue: item.revenuePaise / 100,
    orders: item.orders,
  }));
  const hasRevenue = data.some((item) => item.revenuePaise > 0);

  return (
    <Card className="rounded-2xl border border-border">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-base font-bold">Revenue (last {days} days)</CardTitle>
        <div className="inline-flex items-center rounded-lg border border-border/60 bg-muted/30 p-1">
          <Button
            size="sm"
            variant={days === 7 ? "default" : "ghost"}
            className="h-7 px-2.5 text-xs font-semibold rounded-md"
            onClick={() => onDaysChange(7)}
          >
            7 Days
          </Button>
          <Button
            size="sm"
            variant={days === 30 ? "default" : "ghost"}
            className="h-7 px-2.5 text-xs font-semibold rounded-md"
            onClick={() => onDaysChange(30)}
          >
            30 Days
          </Button>
        </div>
      </CardHeader>
      <CardContent className="w-full">
        {hasRevenue ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={(value: number) => `₹${value}`}
              />
              <Tooltip
                cursor={{ stroke: "var(--border)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const point = payload[0].payload as { date: string; revenue: number; orders: number };
                  return (
                    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
                      <p className="text-xs font-semibold text-muted-foreground">{point.date}</p>
                      <p className="text-sm font-bold text-primary tabular-nums">
                        ₹{point.revenue.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {point.orders} order{point.orders === 1 ? "" : "s"}
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
            No paid orders in the last {days} days.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
