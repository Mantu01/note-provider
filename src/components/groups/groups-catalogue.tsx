"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { GroupCard } from "@/components/shared/group-card";
import { GroupsCatalogueSkeleton } from "@/components/shared/shimmer-loader";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { useGroups } from "@/hooks/useGroups";

export function GroupsPage() {
  const [page, setPage] = useState(1);
  const query = useGroups({ page, limit: 12 });

  const pagination = query.data?.pagination;

  return (
    <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4" data-testid="groups-page">
      <div className="mb-3 sm:mb-4">
        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-accent">
          Curated collections
        </p>
        <h1 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
          Bundles
        </h1>
        <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
          {pagination
            ? `${pagination.total} bundle${pagination.total !== 1 ? "s" : ""} available`
            : "Loading…"}
        </p>
      </div>

      {query.isError ? (
        <ErrorState onRetry={() => query.refetch()} />
      ) : query.isPending ? (
        <GroupsCatalogueSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {query.data?.items.length ? (
              query.data.items.map((group) => <GroupCard key={group.id} group={group} />)
            ) : (
              <div className="col-span-full">
                <EmptyState
                  icon={Layers3}
                  title="Bundles coming soon"
                  description="We are assembling our first value-packed note collections."
                  action={
                    <Button render={<Link href="/notes" />} variant="outline" size="sm">
                      Browse individual notes
                    </Button>
                  }
                />
              </div>
            )}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-3 sm:mt-4">
              <PaginationBar
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
