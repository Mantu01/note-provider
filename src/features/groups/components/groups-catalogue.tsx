"use client";

import { Layers3 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { GroupCard } from "@/components/shared/group-card";
import { ShimmerNoteCard } from "@/components/shared/shimmer-loader";
import { useGroups } from "@/features/groups/api/use-groups";

export function GroupsPage() {
  const query = useGroups({ limit: 12 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 paper-bg">
      <div className="mt-4 mb-8">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-orange">Curated collections</p>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Bundles
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {query.data
            ? `${query.data.pagination.total} bundle${query.data.pagination.total !== 1 ? "s" : ""} available`
            : "Loading…"}
        </p>
      </div>

      {query.isError ? (
        <div className="mt-5">
          <ErrorState onRetry={() => query.refetch()} />
        </div>
      ) : (
        <div className="mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {query.isPending ? (
            Array.from({ length: 6 }, (_, i) => <ShimmerNoteCard key={i} />)
          ) : query.data?.items.length ? (
            query.data.items.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3">
              <EmptyState
                icon={Layers3}
                title="Bundles are coming soon"
                description="We are assembling our first value-packed note collections."
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
