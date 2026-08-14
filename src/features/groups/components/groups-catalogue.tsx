"use client";

import { Layers3 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { GroupCard } from "@/components/shared/group-card";
import { useGroups } from "@/features/groups/api/use-groups";

export function GroupsPage() {
  const query = useGroups({ limit: 12 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {query.isError ? (
        <div className="mt-8">
          <ErrorState onRetry={() => query.refetch()} />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {query.data?.items.length ? (
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
