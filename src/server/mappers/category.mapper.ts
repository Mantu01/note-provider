import type { AdminCategory, AdminRef, CategoryRef, PublicCategory, SubjectItem } from "@/lib/types";
import { toIsoStringRequired } from "@/lib/format";
import { id, isPopulated, nullableStr, num, str, type Lean } from "./primitives";

export function toCategoryRef(value: unknown): CategoryRef {
  if (isPopulated(value)) {
    return { id: id(value._id), name: str(value.name), slug: str(value.slug), icon: nullableStr(value.icon) };
  }
  return { id: id(value), name: "", slug: "", icon: null };
}

export function toAdminRef(value: unknown): AdminRef | null {
  if (!isPopulated(value)) return null;
  return { id: id(value._id), name: str(value.name) };
}

export function toPublicCategory(raw: unknown, noteCount = 0): PublicCategory {
  const doc = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const rawSubjects = Array.isArray(doc.subjects) ? doc.subjects : [];
  const subjects: SubjectItem[] = rawSubjects.map((sub: Record<string, unknown>) => ({
    id: id(sub._id),
    name: str(sub.name),
    slug: str(sub.slug),
    order: num(sub.order),
    isActive: sub.isActive !== false,
  }));

  return {
    id: id(doc._id),
    name: str(doc.name),
    slug: str(doc.slug),
    description: nullableStr(doc.description),
    icon: nullableStr(doc.icon),
    subjects,
    noteCount,
  };
}

export function toAdminCategory(raw: unknown, noteCount = 0, groupCount = 0): AdminCategory {
  const doc = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    ...toPublicCategory(doc, noteCount),
    order: num(doc.order),
    isActive: doc.isActive !== false,
    groupCount,
    createdAt: toIsoStringRequired(doc.createdAt as Date),
    updatedAt: toIsoStringRequired(doc.updatedAt as Date),
  };
}
