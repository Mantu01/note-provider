import { format, formatDistanceToNow } from "date-fns";
import type { NotePricingType } from "./types";

const INR_PRICE_FORMAT = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const COMPACT_NUMBER_FORMAT = new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 });

export function formatPrice(paise: number): string {
  return INR_PRICE_FORMAT.format(paise / 100);
}

export function formatDate(iso: string): string {
  return format(new Date(iso), "dd MMM yyyy");
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), "dd MMM yyyy, h:mm a");
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function formatRelativeTime(iso: string): string {
  return formatRelative(iso);
}

export function formatCompactNumber(value: number): string {
  return COMPACT_NUMBER_FORMAT.format(value);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)) - 1, units.length - 1);
  return `${(bytes / 1024 ** (unitIndex + 1)).toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function formatDiscount(price: number, compareAtPrice: number | null): string | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return `${Math.round((1 - price / compareAtPrice) * 100)}% OFF`;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function formatPriceLabel(paise: number, pricingType?: NotePricingType): string {
  if (pricingType === "free" || paise === 0) return "Free";
  return formatPrice(paise);
}

export function formatFileSizeLabel(bytes: number | null | undefined): string | null {
  if (bytes === null || bytes === undefined || bytes <= 0) return null;
  return formatFileSize(bytes);
}

export function toIsoString(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function toIsoStringRequired(value: Date | string): string {
  return toIsoString(value) ?? new Date(0).toISOString();
}

export function toDateKey(value: Date): string {
  return value.toISOString().slice(0, 10);
}
