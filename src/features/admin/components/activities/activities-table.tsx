"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { ActivityFilterBar } from "@/features/admin/components/activities/activity-filter-bar";
import { useAdminActivities } from "@/features/admin/api/use-admin-activities";
import { formatDateTime, formatRelativeTime } from "@/lib/format";
import type { AdminActivity } from "@/lib/types";

export function ActivitiesTable() {
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    q: parseAsString,
    action: parseAsString,
    targetType: parseAsString,
    from: parseAsString,
    to: parseAsString,
  });

  const page = params.page;
  const filters = {
    q: params.q ?? undefined,
    action: params.action ?? undefined,
    targetType: params.targetType ?? undefined,
    from: params.from ?? undefined,
    to: params.to ?? undefined,
  };

  const { data, isLoading } = useAdminActivities({
    page,
    limit: 20,
    ...filters,
  });

  const setPage = (p: number) => setParams({ page: p });
  const setFilters = (newFilters: typeof filters) => setParams({ ...newFilters, page: 1 });

  const activities = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <ActivityFilterBar
        filters={filters}
        onChange={(newFilters) => {
          setFilters(newFilters as typeof filters);
          setPage(1);
        }}
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }, (_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <div className="h-10 animate-pulse rounded bg-muted/50" />
                  </TableCell>
                </TableRow>
              ))
            ) : activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState
                    title="No activity log entries"
                    description="Administrative actions will be recorded here automatically."
                  />
                </TableCell>
              </TableRow>
            ) : (
              activities.map((act) => (
                <TableRow key={act.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{act.admin?.name || "System"}</div>
                    <div className="text-xs text-muted-foreground">{act.admin?.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-mono">
                      {act.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-foreground">{act.description}</div>
                    {act.targetLabel && (
                      <div className="text-xs text-muted-foreground">Target: {act.targetLabel}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {act.ipAddress || "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    <div>{formatRelativeTime(act.createdAt)}</div>
                    <div className="text-xs text-muted-foreground/70">{formatDateTime(act.createdAt)}</div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <PaginationBar
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
