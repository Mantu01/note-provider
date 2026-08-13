"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { LeadsTable } from "@/features/admin/components/leads/leads-table";

export default function AdminLeadsPage() {
  return (
    <Suspense fallback={null}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout Leads</h1>
        </div>
        <LeadsTable />
      </div>
    </Suspense>
  );
}
