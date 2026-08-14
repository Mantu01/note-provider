import { Suspense } from "react";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";


export const metadata = { robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminDashboard />
    </Suspense>
  );
}
