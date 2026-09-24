"use client";

import { Suspense } from "react";
import { GroupsTable } from "@/components/admin/groups/groups-table";

export default function AdminGroupsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Study Bundles</h1>
        <p className="text-sm text-muted-foreground">Group notes into discounted packs.</p>
      </div>
      <Suspense fallback={null}>
        <GroupsTable />
      </Suspense>
    </div>
  );
}
