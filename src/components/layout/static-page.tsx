import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/page-header";

export function StaticPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8"><PageHeader title={title} description={description} /><article className="prose prose-neutral mt-10 max-w-none dark:prose-invert">{children}</article></div>;
}
