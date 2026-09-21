"use client";

import { Layers3 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { GroupCard } from "@/components/shared/group-card";
import { GroupsCatalogueSkeleton } from "@/components/shared/shimmer-loader";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { useGroups } from "@/hooks/useGroups";
import Link from "next/link";

export function GroupsPage() {
  const query = useGroups({ limit: 12 });

  const pagination = query.data?.pagination;

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mt-3 mb-5 sm:mt-4 sm:mb-8">
        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-accent">Curated collections</p>
        <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
          Bundles
        </h1>
        <p className="mt-0.5 text-[11px] text-muted-foreground sm:mt-1 sm:text-xs">
          {query.data
            ? `${pagination?.total} bundle${pagination?.total !== 1 ? "s" : ""} available`
            : "Loading…"}
        </p>
      </div>

      {query.isError ? (
        <div className="mt-5">
          <ErrorState onRetry={() => query.refetch()} />
        </div>
      ) : query.isPending ? (
        <GroupsCatalogueSkeleton />
      ) : (
        <>
          <div className="mt-2 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8">
              <PaginationBar
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => query.refetch()}
              />
            </div>
          )}
          {pagination && pagination.total === 0 && (
            <div className="mt-8 flex justify-center">
              <Link
                href="/notes"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm hover:bg-muted/50 hover:text-foreground"
              >
                Browse individual notes instead
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
