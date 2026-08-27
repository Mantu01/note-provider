"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";
import RevenueAreaChart from "./revenue-area-chart";

type RevenueChartProps = {
  data: DashboardStats["revenueSeries"];
};

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold">Revenue Trend (30 Days)</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px] w-full pt-0">
        <Suspense fallback={<div className="h-[280px] animate-pulse rounded-lg bg-muted" />} >
          <RevenueAreaChart data={data} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
