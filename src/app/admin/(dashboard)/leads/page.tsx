"use client";

import { Suspense } from "react";
import { LeadsTable } from "@/features/admin/components/leads/leads-table";

export default function AdminLeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout Leads</h1>
      </div>
      <Suspense fallback={null}><LeadsTable /></Suspense>
    </div>
  );
}
