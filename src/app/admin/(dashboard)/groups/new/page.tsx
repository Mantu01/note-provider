"use client";

import { Suspense } from "react";
import { GroupForm } from "@/components/admin/groups/group-form";

export default function NewGroupPage() {
  return (
    <Suspense fallback={null}>
      <GroupForm />
    </Suspense>
  );
}
