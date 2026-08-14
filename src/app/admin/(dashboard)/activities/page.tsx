"use client";


import { Suspense } from "react";
import { ActivitiesTable } from "@/features/admin/components/activities/activities-table";

function ActivitiesContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Activity Logs</h1>
        <p className="text-sm text-muted-foreground">Comprehensive tracking of all administrative actions across the system.</p>
      </div>
      <ActivitiesTable />
    </div>
  );
}

export default function AdminActivitiesPage() {
  return (
    <Suspense fallback={null}>
      <ActivitiesContent />
    </Suspense>
  );
}
