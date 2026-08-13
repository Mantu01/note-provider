export type Lean = Record<string, unknown>;

export function id(value: unknown): string {
  return String(value ?? "");
}

export function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function nullableStr(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function nullableNum(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function bool(value: unknown): boolean {
  return value === true;
}

export function isPopulated(value: unknown): value is Lean {
  return typeof value === "object" && value !== null && !Array.isArray(value) && "_id" in value;
}

export function toIdList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => (isPopulated(entry) ? id(entry._id) : id(entry))).filter(Boolean);
}
