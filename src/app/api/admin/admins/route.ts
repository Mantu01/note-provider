import { adminHandler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { Admin } from "@/server/db/models/admin.model";
import { toAdminProfile } from "@/server/mappers/activity.mapper";

export const runtime = "nodejs";

export const GET = adminHandler(async () => {
  const admins = await Admin.find({}, { passwordHash: 0 }).sort({ createdAt: 1 }).lean().exec();
  return ok(admins.map(toAdminProfile));
});
