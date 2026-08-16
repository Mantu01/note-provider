import { AppError } from "./errors";

type Bucket = { count: number; resetAt: number };

const globalStore = globalThis as typeof globalThis & { __rateLimitStore?: Map<string, Bucket> };
const store: Map<string, Bucket> = globalStore.__rateLimitStore ?? new Map();
globalStore.__rateLimitStore = store;

export function resetStore(): void {
  store.clear();
}

export function prune(now: number): void {
  if (store.size < 5000) return;
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}

export function enforceRateLimit(
  routeKey: string,
  ip: string | null,
  config: { limit: number; windowMs: number },
): void {
  const now = Date.now();
  prune(now);

  const key = `${routeKey}:${ip ?? "unknown"}`;
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return;
  }

  bucket.count += 1;
  if (bucket.count > config.limit) {
    const minutes = Math.max(Math.ceil((bucket.resetAt - now) / 60000), 1);
    throw AppError.rateLimited(`Too many attempts. Please try again in ${minutes} minute(s).`);
  }
}
