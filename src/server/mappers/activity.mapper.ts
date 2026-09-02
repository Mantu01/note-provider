import { toIsoString, toIsoStringRequired } from "@/lib/format";
import type { AdminActivity, AdminProfile } from "@/lib/types";
import { id, isPopulated, nullableStr, str } from "./primitives";

export function toAdminProfile(raw: unknown): AdminProfile {
  const doc = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    id: id(doc._id),
    name: str(doc.name),
    email: str(doc.email),
    isHead: Boolean(doc.isHead),
    lastLoginAt: toIsoString(doc.lastLoginAt as Date | null),
    createdAt: toIsoStringRequired(doc.createdAt as Date),
  };
}

export function toAdminActivity(raw: unknown): AdminActivity {
  const doc = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const admin = doc.admin;

  return {
    id: id(doc._id),
    admin: isPopulated(admin)
      ? { id: id(admin._id), name: str(admin.name), email: str(admin.email) }
      : { id: id(admin), name: "", email: "" },
    action: str(doc.action) as AdminActivity["action"],
    targetType: (nullableStr(doc.targetType) as AdminActivity["targetType"]) ?? null,
    targetId: doc.targetId ? id(doc.targetId) : null,
    targetLabel: nullableStr(doc.targetLabel),
    description: str(doc.description),
    metadata: (doc.metadata as Record<string, unknown> | null) ?? null,
    ipAddress: nullableStr(doc.ipAddress),
    createdAt: toIsoStringRequired(doc.createdAt as Date),
  };
}
