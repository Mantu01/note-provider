"use client";

import { Suspense, use } from "react";
import { Loader2 } from "lucide-react";
import { GroupForm } from "@/components/admin/groups/group-form";
import { ErrorState } from "@/components/shared/error-state";
import { useAdminGroup } from "@/hooks/useAdmin";

function GroupFormContent({ id }: { id: string }) {
  const query = useAdminGroup(id);

  if (query.isPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 aria-hidden="true" className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <ErrorState
        message="This bundle could not be loaded."
        onRetry={() => query.refetch()}
      />
    );
  }

  return <GroupForm initialData={query.data} />;
}

export default function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <Suspense fallback={null}>
      <GroupFormContent id={id} />
    </Suspense>
  );
}
