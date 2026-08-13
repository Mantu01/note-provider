import { adminHandler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { getDashboardStats } from "@/server/services/dashboard.service";

export const runtime = "nodejs";

export const GET = adminHandler(async () => {
  const stats = await getDashboardStats();
  return ok(stats);
});
