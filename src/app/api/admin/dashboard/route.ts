import { adminHandler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { getDashboardStats } from "@/server/services/dashboard.service";

export const runtime = "nodejs";

export const GET = adminHandler(async () => {
  const stats = await getDashboardStats();
  const res = ok(stats);
  res.headers.set("Cache-Control", "public, max-age=30, s-maxage=30");
  return res;
});
