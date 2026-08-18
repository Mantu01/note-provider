import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { handler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { clearAdminSessionCookie } from "@/server/lib/auth-guard";
import { logActivity } from "@/server/services/activity.service";
import { getOptionalAdmin } from "@/server/lib/auth-guard";

vi.mock("@/server/db/connect", () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/server/lib/auth-guard", () => ({
  clearAdminSessionCookie: vi.fn().mockResolvedValue(undefined),
  getOptionalAdmin: vi.fn(),
}));
vi.mock("@/server/services/activity.service", () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/server/lib/api-handler", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/lib/api-handler")>();
  return {
    ...actual,
    handler: vi.fn((fn: any) => fn),
  };
});

const mockHandler = vi.mocked(handler);

function mockReq(method: string, path: string, headers?: Record<string, string>) {
  const url = `http://localhost${path}`;
  const opts: RequestInit = { method, headers };
  return new NextRequest(url, opts as any);
}

describe("POST /api/admin/auth/logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("clears session cookie and returns ok when no admin is logged in", async () => {
    ;(getOptionalAdmin as any).mockResolvedValue(null);
    ;(clearAdminSessionCookie as any).mockResolvedValue(undefined);
    const mod = await import("@/app/api/admin/auth/logout/route");
    const res = await mod.POST(mockReq("POST", "/api/admin/auth/logout") as any, undefined);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.ok).toBe(true);
    expect(clearAdminSessionCookie).toHaveBeenCalled();
    expect(logActivity).not.toHaveBeenCalled();
  });

  it("logs activity when admin is logged in", async () => {
    ;(getOptionalAdmin as any).mockResolvedValue({ id: "a1", name: "Test Admin", email: "t@t.com", isHead: false });
    ;(clearAdminSessionCookie as any).mockResolvedValue(undefined);
    ;(logActivity as any).mockResolvedValue(undefined);
    const mod = await import("@/app/api/admin/auth/logout/route");
    const req = mockReq("POST", "/api/admin/auth/logout", { "user-agent": "test-agent" });
    await mod.POST(req as any, undefined);
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({
      action: "admin.logout",
      adminId: "a1",
      description: expect.stringContaining("Test Admin"),
    }));
  });

  it("clears session cookie even when getOptionalAdmin fails", async () => {
    ;(getOptionalAdmin as any).mockResolvedValue(null);
    ;(clearAdminSessionCookie as any).mockResolvedValue(undefined);
    const mod = await import("@/app/api/admin/auth/logout/route");
    await mod.POST(mockReq("POST", "/api/admin/auth/logout") as any, undefined);
    expect(clearAdminSessionCookie).toHaveBeenCalled();
  });
});
