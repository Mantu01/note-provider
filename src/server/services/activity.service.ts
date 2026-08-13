import { AdminActivity } from "../db/models/admin-activity.model";
import type { ActivityTargetType, AdminActivityAction } from "@/lib/types";

export type LogActivityInput = {
  adminId: string;
  action: AdminActivityAction;
  description: string;
  targetType?: ActivityTargetType | null;
  targetId?: string | null;
  targetLabel?: string | null;
  metadata?: Record<string, unknown> | null;
  ip?: string | null;
  userAgent?: string | null;
};

export async function logActivity(input: LogActivityInput): Promise<void> {
  try {
    await AdminActivity.create({
      admin: input.adminId,
      action: input.action,
      targetType: input.targetType ?? null,
      targetId: input.targetId ?? null,
      targetLabel: input.targetLabel ?? null,
      description: input.description,
      metadata: input.metadata ?? null,
      ipAddress: input.ip ?? null,
      userAgent: input.userAgent ?? null,
    });
  } catch (error) {
    console.error("[activity] failed to log", input.action, error);
  }
}
