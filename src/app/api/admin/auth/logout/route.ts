import { handler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { clearAdminSessionCookie } from "@/server/lib/auth-guard";
import { logActivity } from "@/server/services/activity.service";
import { Admin } from "@/server/db/models/admin.model";
import { getOptionalAdmin } from "@/server/lib/auth-guard";

export const runtime = "nodejs";

export const POST = handler(async (ctx) => {
  const admin = await getOptionalAdmin();
  await clearAdminSessionCookie();

  if (admin) {
    await logActivity({
      adminId: admin.id,
      action: "admin.logout",
      description: `Admin "${admin.name}" logged out`,
      targetType: "admin",
      targetId: admin.id,
      targetLabel: admin.name,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
    });
  }

  return ok({ ok: true });
});
