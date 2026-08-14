"use client";

import { Suspense } from "react";
import { GroupsTable } from "@/features/admin/components/groups/groups-table";

export default function AdminGroupsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Study Bundles</h1>
      </div>
      <Suspense fallback={null}><GroupsTable /></Suspense>
    </div>
  );
}
