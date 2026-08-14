"use client";

import { Suspense } from "react";
import { GroupForm } from "@/features/admin/components/groups/group-form";

export default function NewGroupPage() {
  return (
    <Suspense fallback={null}>
      <GroupForm />
    </Suspense>
  );
}
