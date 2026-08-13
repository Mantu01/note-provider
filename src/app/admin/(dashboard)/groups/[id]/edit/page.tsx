"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { use } from "react";
import { useAdminGroup } from "@/features/admin/api/use-admin-groups";
import { GroupForm } from "@/features/admin/components/groups/group-form";
import { ErrorState } from "@/components/shared/error-state";
import { Loader2 } from "lucide-react";

function GroupFormContent({ id }: { id: string }) {
  const { data: group, isLoading } = useAdminGroup(id);
  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  if (!group) return <ErrorState message="Group not found" onRetry={() => window.location.reload()} />;
  return <GroupForm initialData={group} />;
}

export default function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={null}>
      <GroupFormContent id={id} />
    </Suspense>
  );
}
