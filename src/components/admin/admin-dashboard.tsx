"use client";

import { useState } from "react";
import Link from "next/link";
import { FilePlus2, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";
import { AdminDashboardSkeleton } from "@/components/shared/shimmer-loader";
import { StatsGrid } from "@/components/admin/dashboard/stats-grid";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { RecentOrders } from "@/components/admin/dashboard/recent-orders";
import { useDashboard } from "@/hooks/useAdmin";

export function AdminDashboard() {
  const [days, setDays] = useState<7 | 30>(30);
  const query = useDashboard();

  if (query.isPending) {
    return <AdminDashboardSkeleton />;
  }

  if (query.isError || !query.data) {
    return (
      <ErrorState message="Dashboard data could not be loaded." onRetry={() => query.refetch()} />
    );
  }

  const data = query.data;
  const filteredSeries = days === 7 ? data.revenueSeries.slice(-7) : data.revenueSeries;
  const periodPaise = filteredSeries.reduce((acc, curr) => acc + curr.revenuePaise, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Revenue, orders and catalogue health at a glance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" render={<Link href="/admin/groups/new" />}>
            <FolderPlus className="size-4" />
            Create Bundle
          </Button>
          <Button render={<Link href="/admin/notes/new" />}>
            <FilePlus2 className="size-4" />
            Create Note
          </Button>
        </div>
      </div>

      <StatsGrid stats={data} periodDays={days} periodPaise={periodPaise} />
      <RevenueChart data={filteredSeries} days={days} onDaysChange={setDays} />
      <RecentOrders orders={data.recentOrders} />
    </div>
  );
}
