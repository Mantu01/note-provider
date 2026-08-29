"use client";

import Link from "next/link";
import { FilePlus2, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/error-state";
import { StatsGrid } from "@/features/admin/components/dashboard/stats-grid";
import { RevenueChart } from "@/features/admin/components/dashboard/revenue-chart";
import { RecentOrders } from "@/features/admin/components/dashboard/recent-orders";
import { ActivityFeed } from "@/features/admin/components/dashboard/activity-feed";
import { useDashboard } from "@/features/admin/api/use-admin";

export function AdminDashboard() {
  const query = useDashboard();

  if (query.isPending) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl bg-muted/40" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-2xl bg-muted/40" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return <ErrorState message="Dashboard data could not be loaded." onRetry={() => query.refetch()} />;
  }

  const data = query.data;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary">Analytics & Operations</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" render={<Link href="/admin/groups/new" />} className="rounded-full">
            <FolderPlus className="mr-2 h-4 w-4" />
            Create Bundle
          </Button>
          <Button render={<Link href="/admin/notes/new" />} className="rounded-full shadow-md">
            <FilePlus2 className="mr-2 h-4 w-4" />
            Create Note
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <StatsGrid stats={data} />

      {/* Revenue chart */}
      <RevenueChart data={data.revenueSeries} />

      {/* Recent orders + activity feed */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrders orders={data.recentOrders} />
        <ActivityFeed activities={data.recentActivities} />
      </div>
    </div>
  );
}
