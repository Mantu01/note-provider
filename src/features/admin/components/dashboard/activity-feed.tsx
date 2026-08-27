"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/format";
import type { AdminActivity } from "@/lib/types";

export function ActivityFeed({ activities }: { activities: AdminActivity[] }) {
  return (
    <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold">Activity Feed</CardTitle>
        <Button variant="ghost" size="sm" render={<Link href="/admin/activities" />}>
          Full Log
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">No recent activity.</p>
          ) : (
            activities.slice(0, 6).map((act) => (
              <div key={act.id} className="flex items-start justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-xs font-semibold text-foreground">{act.admin?.name || "Admin"}</p>
                  <p className="text-xs text-muted-foreground">{act.description}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                  {formatRelativeTime(act.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
