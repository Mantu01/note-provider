"use client";

import { useParams } from "next/navigation";
import { GroupDetailPage } from "@/features/groups/components/group-pages";

export default function GroupRoute() {
  const params = useParams<{ slug: string }>();
  return <GroupDetailPage slug={params.slug} />;
}
