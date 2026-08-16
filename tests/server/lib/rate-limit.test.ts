import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { enforceRateLimit, resetStore } from '@/server/lib/rate-limit';
import { AppError } from '@/server/lib/errors';

describe('rate-limit', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  it('allows requests within the limit', () => {
    for (let i = 0; i < 5; i++) {
      expect(() => enforceRateLimit('test', '1.2.3.4', { limit: 5, windowMs: 60000 })).not.toThrow();
    }
  });

  it('throws when limit is exceeded', () => {
    for (let i = 0; i < 5; i++) {
      enforceRateLimit('test', '1.2.3.4', { limit: 5, windowMs: 60000 });
    }
    expect(() => enforceRateLimit('test', '1.2.3.4', { limit: 5, windowMs: 60000 }))
      .toThrow(AppError);
  });

  it('throws rate limited error with correct message', () => {
    for (let i = 0; i < 5; i++) {
      enforceRateLimit('test', 'ip-1', { limit: 5, windowMs: 60000 });
    }
    expect(() => enforceRateLimit('test', 'ip-1', { limit: 5, windowMs: 60000 }))
      .toThrow(/Too many attempts/);
  });

  it('resets after window expires', () => {
    for (let i = 0; i < 5; i++) {
      enforceRateLimit('test', 'ip-1', { limit: 5, windowMs: 60000 });
    }
    const store = (globalThis as any).__rateLimitStore;
    const key = 'test:ip-1';
    const bucket = store.get(key);
    if (bucket) bucket.resetAt = Date.now() - 1;
    expect(() => enforceRateLimit('test', 'ip-1', { limit: 5, windowMs: 60000 })).not.toThrow();
  });

  it('tracks different IPs separately', () => {
    for (let i = 0; i < 5; i++) {
      enforceRateLimit('test', 'ip-a', { limit: 5, windowMs: 60000 });
    }
    expect(() => enforceRateLimit('test', 'ip-a', { limit: 5, windowMs: 60000 }))
      .toThrow();
    expect(() => enforceRateLimit('test', 'ip-b', { limit: 5, windowMs: 60000 }))
      .not.toThrow();
  });

  it('tracks different routes separately', () => {
    enforceRateLimit('route-a', 'ip-1', { limit: 2, windowMs: 60000 });
    enforceRateLimit('route-a', 'ip-1', { limit: 2, windowMs: 60000 });
    expect(() => enforceRateLimit('route-a', 'ip-1', { limit: 2, windowMs: 60000 }))
      .toThrow();
    expect(() => enforceRateLimit('route-b', 'ip-1', { limit: 2, windowMs: 60000 }))
      .not.toThrow();
  });

  it('handles null IP as unknown', () => {
    expect(() => enforceRateLimit('test', null, { limit: 5, windowMs: 60000 })).not.toThrow();
  });

  it('uses unknown key for null IP', () => {
    enforceRateLimit('test', null, { limit: 2, windowMs: 60000 });
    enforceRateLimit('test', null, { limit: 2, windowMs: 60000 });
    expect(() => enforceRateLimit('test', null, { limit: 2, windowMs: 60000 }))
      .toThrow();
  });

  it('prunes expired entries when store exceeds 5000', () => {
    const store = (globalThis as any).__rateLimitStore;
    for (let i = 0; i < 5000; i++) {
      store.set(`key-${i}`, { count: 1, resetAt: Date.now() - 1000 });
    }
    store.set('active-key', { count: 1, resetAt: Date.now() + 60000 });
    expect(() => enforceRateLimit('test', 'ip-prune', { limit: 5, windowMs: 60000 })).not.toThrow();
    expect(store.size).toBeLessThan(5000);
    expect(store.has('active-key')).toBe(true);
  });

  it('does not prune when store has fewer than 5000 entries', () => {
    const store = (globalThis as any).__rateLimitStore;
    for (let i = 0; i < 100; i++) {
      store.set(`key-${i}`, { count: 1, resetAt: Date.now() - 1000 });
    }
    enforceRateLimit('test', 'ip-1', { limit: 5, windowMs: 60000 });
    expect(store.size).toBe(101);
  });

  it('throws with correct minutes in error message', () => {
    for (let i = 0; i < 3; i++) {
      enforceRateLimit('test', 'ip-1', { limit: 3, windowMs: 300000 });
    }
    try {
      enforceRateLimit('test', 'ip-1', { limit: 3, windowMs: 300000 });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe('RATE_LIMITED');
      expect((error as AppError).message).toContain('5 minute');
    }
  });

  it('throws with at least 1 minute in error message', () => {
    for (let i = 0; i < 2; i++) {
      enforceRateLimit('test', 'ip-1', { limit: 2, windowMs: 5000 });
    }
    const store = (globalThis as any).__rateLimitStore;
    const key = 'test:ip-1';
    const bucket = store.get(key);
    if (bucket) bucket.resetAt = Date.now() - 1;
    try {
      enforceRateLimit('test', 'ip-1', { limit: 2, windowMs: 5000 });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).message).toContain('1 minute');
    }
  });

  it('resets counter after window and allows new requests', () => {
    enforceRateLimit('test', 'ip-1', { limit: 2, windowMs: 10000 });
    enforceRateLimit('test', 'ip-1', { limit: 2, windowMs: 10000 });
    expect(() => enforceRateLimit('test', 'ip-1', { limit: 2, windowMs: 10000 }))
      .toThrow();
    const store = (globalThis as any).__rateLimitStore;
    const key = 'test:ip-1';
    const bucket = store.get(key);
    if (bucket) bucket.resetAt = Date.now() - 1;
    enforceRateLimit('test', 'ip-1', { limit: 2, windowMs: 10000 });
    enforceRateLimit('test', 'ip-1', { limit: 2, windowMs: 10000 });
    expect(() => enforceRateLimit('test', 'ip-1', { limit: 2, windowMs: 10000 }))
      .toThrow();
  });

  it('allows first request for any new IP/route combination', () => {
    expect(() => enforceRateLimit('new-route', 'new-ip', { limit: 1, windowMs: 60000 }))
      .not.toThrow();
  });

  it('handles limit of 0 by throwing on second request', () => {
    enforceRateLimit('test', 'ip-1', { limit: 0, windowMs: 60000 });
    expect(() => enforceRateLimit('test', 'ip-1', { limit: 0, windowMs: 60000 }))
      .toThrow();
  });
});
