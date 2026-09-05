import { toIsoString, toIsoStringRequired } from "@/lib/format";
import type { AdminProfile } from "@/lib/types";
import { id, nullableStr, str } from "./primitives";

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
