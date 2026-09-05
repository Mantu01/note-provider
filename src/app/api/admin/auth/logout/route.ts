import { handler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { clearAdminSessionCookie } from "@/server/lib/auth-guard";
import { Admin } from "@/server/db/models/admin.model";
import { getOptionalAdmin } from "@/server/lib/auth-guard";

export const runtime = "nodejs";

export const POST = handler(async (ctx) => {
  const admin = await getOptionalAdmin();
  await clearAdminSessionCookie();

  return ok({ ok: true });
});
