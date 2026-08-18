import { adminHandler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { AppError } from "@/server/lib/errors";
import { toAdminProfile } from "@/server/mappers/activity.mapper";
import { Admin } from "@/server/db/models/admin.model";

export const runtime = "nodejs";

export const GET = adminHandler(async (ctx) => {
  const admin = await Admin.findById(ctx.admin.id).select("-passwordHash").lean().exec();
  if (!admin) throw AppError.unauthorized();
  const res = ok(toAdminProfile(admin));
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
});

