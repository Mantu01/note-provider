"use client";

import { Suspense } from "react";
import { CategoriesTable } from "@/components/admin/categories/categories-table";

export default function AdminCategoriesPage() {
  return <Suspense fallback={null}><CategoriesTable /></Suspense>;
}
