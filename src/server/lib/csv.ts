const UTF8_BOM = "﻿";
const FORMULA_PREFIXES = ["=", "+", "-", "@"];

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let cell = String(value);

  if (FORMULA_PREFIXES.some((prefix) => cell.startsWith(prefix))) {
    cell = `'${cell}`;
  }

  if (/[",\n\r]/.test(cell)) {
    return `"${cell.replace(/"/g, '""')}"`;
  }

  return cell;
}

export function toCsv(rows: Record<string, unknown>[]): string {
  const header = Object.keys(rows[0] ?? []).join(",");
  const body = rows.map((row) =>
    Object.values(row).map((v) => escapeCell(v)).join(","),
  );
  return `${UTF8_BOM}${[header, ...body].join("\r\n")}`;
}
