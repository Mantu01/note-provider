import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logActivity } from "../../../src/server/services/activity.service";
import * as AdminActivityModel from "../../../src/server/db/models/admin-activity.model";

vi.mock("../../../src/server/db/models/admin-activity.model", () => ({
  AdminActivity: {
    create: vi.fn(),
  },
}));

const originalConsoleError = console.error;

describe("logActivity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("logs activity successfully", async () => {
    vi.mocked(AdminActivityModel.AdminActivity.create).mockResolvedValue(undefined as any);

    await logActivity({
      adminId: "adm1",
      action: "note.create",
      description: "Created note React Basics",
      targetType: "note",
      targetId: "note1",
      targetLabel: "React Basics",
      ip: "1.2.3.4",
      userAgent: "Mozilla/5.0",
    });

    expect(AdminActivityModel.AdminActivity.create).toHaveBeenCalledWith({
      admin: "adm1",
      action: "note.create",
      targetType: "note",
      targetId: "note1",
      targetLabel: "React Basics",
      description: "Created note React Basics",
      metadata: null,
      ipAddress: "1.2.3.4",
      userAgent: "Mozilla/5.0",
    });
  });

  it("passes null for optional fields when not provided", async () => {
    vi.mocked(AdminActivityModel.AdminActivity.create).mockResolvedValue(undefined as any);

    await logActivity({
      adminId: "adm1",
      action: "note.delete",
      description: "Deleted note",
    });

    expect(AdminActivityModel.AdminActivity.create).toHaveBeenCalledWith({
      admin: "adm1",
      action: "note.delete",
      targetType: null,
      targetId: null,
      targetLabel: null,
      description: "Deleted note",
      metadata: null,
      ipAddress: null,
      userAgent: null,
    });
  });

  it("swallows errors without rethrowing", async () => {
    vi.mocked(AdminActivityModel.AdminActivity.create).mockRejectedValue(new Error("DB error"));

    await expect(
      logActivity({
        adminId: "adm1",
        action: "note.create",
        description: "Created note",
      }),
    ).resolves.toBeUndefined();

    expect(console.error).toHaveBeenCalledWith(
      "[activity] failed to log",
      "note.create",
      expect.any(Error),
    );
  });

  it("swallows errors with undefined metadata", async () => {
    vi.mocked(AdminActivityModel.AdminActivity.create).mockRejectedValue(new Error("fail"));

    await expect(
      logActivity({
        adminId: "adm1",
        action: "category.update",
        description: "Updated category",
        metadata: undefined as any,
      }),
    ).resolves.toBeUndefined();
  });
});
