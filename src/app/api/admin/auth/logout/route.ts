import { handler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { clearAdminSessionCookie } from "@/helpers/auth-guard";

export const runtime = "nodejs";

export const POST = handler(async (_ctx) => {
  await clearAdminSessionCookie();
  return ok({ ok: true });
});
