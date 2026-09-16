import { adminHandler } from "@/helpers/api-handler";
import { getDashboardStats } from "@/helpers/services/dashboard.service";
import { ok } from "@/helpers/api-response";

export const runtime = "nodejs";

export const GET = adminHandler(async () => {
  const stats = await getDashboardStats();
  const res = ok(stats);
  res.headers.set("Cache-Control", "public, max-age=30, s-maxage=30");
  return res;
});
