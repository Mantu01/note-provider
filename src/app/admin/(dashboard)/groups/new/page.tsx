"use client";

import { Suspense } from "react";
import { GroupForm } from "@/features/admin/components/groups/group-form";

function GroupFormSuspense() {
  return <GroupForm />;
}

export default function NewGroupPage() {
  return (
    <Suspense fallback={null}>
      <GroupFormSuspense />
    </Suspense>
  );
}
