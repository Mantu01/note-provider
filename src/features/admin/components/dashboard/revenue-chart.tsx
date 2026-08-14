"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";

type RevenueChartProps = {
  data: DashboardStats["revenueSeries"];
};

export function RevenueChart({ data }: RevenueChartProps) {
  const formattedData = data.map((item) => ({
    date: item.date.slice(5),
    revenue: item.revenuePaise / 100,
    orders: item.orders,
  }));

  return (
    <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold">Revenue Trend (30 Days)</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px] w-full pt-0">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `₹${val}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                      <p className="text-xs font-semibold text-muted-foreground">{item.date}</p>
                      <p className="text-sm font-bold text-primary">₹{item.revenue}</p>
                      <p className="text-xs text-muted-foreground">{item.orders} orders</p>
                    </div>
                  );
                }
                return null;
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
      </CardContent>
    </Card>
  );
}
