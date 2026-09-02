import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler, adminHandler, headAdminHandler, getClientIp } from '@/server/lib/api-handler';
import { AppError } from '@/server/lib/errors';
import { ZodError } from 'zod';

const mocks = vi.hoisted(() => ({
  mockFail: vi.fn(),
  mockRequireAdmin: vi.fn(),
  mockRequireHeadAdmin: vi.fn(),
  mockconnectDB: vi.fn(),
}));

vi.mock('@/server/db/connect', () => ({
  connectDB: mocks.mockconnectDB,
}));

vi.mock('@/server/lib/api-response', () => ({
  fail: mocks.mockFail,
}));

vi.mock('@/server/lib/auth-guard', () => ({
  requireAdmin: mocks.mockRequireAdmin,
  requireHeadAdmin: mocks.mockRequireHeadAdmin,
}));

describe('api-handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockFail.mockReturnValue({ failCalledWith: true });
    mocks.mockRequireAdmin.mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: false });
    mocks.mockRequireHeadAdmin.mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: true });
    mocks.mockconnectDB.mockResolvedValue(undefined);
  });

  describe('getClientIp', () => {
    it('returns first IP from x-forwarded-for header', () => {
      const req = { headers: { get: (name: string) => name === 'x-forwarded-for' ? '1.2.3.4, 5.6.7.8' : null } } as any;
      expect(getClientIp(req)).toBe('1.2.3.4');
    });

    it('trims whitespace from forwarded IP', () => {
      const req = { headers: { get: (name: string) => name === 'x-forwarded-for' ? '  1.2.3.4  ' : null } } as any;
      expect(getClientIp(req)).toBe('1.2.3.4');
    });

    it('falls back to x-real-ip when x-forwarded-for is absent', () => {
      const req = { headers: { get: (name: string) => name === 'x-real-ip' ? '9.8.7.6' : null } } as any;
      expect(getClientIp(req)).toBe('9.8.7.6');
    });

    it('returns null when no IP headers are present', () => {
      const req = { headers: { get: () => null } } as any;
      expect(getClientIp(req)).toBeNull();
    });

    it('returns null when x-forwarded-for is empty string', () => {
      const req = { headers: { get: (name: string) => name === 'x-forwarded-for' ? '' : null } } as any;
      expect(getClientIp(req)).toBeNull();
    });

    it('returns null when x-forwarded-for is only whitespace', () => {
      const req = { headers: { get: (name: string) => name === 'x-forwarded-for' ? '   ' : null } } as any;
      expect(getClientIp(req)).toBeNull();
    });

    it('prefers x-forwarded-for over x-real-ip', () => {
      const req = { headers: { get: (name: string) => name === 'x-forwarded-for' ? '1.1.1.1' : '2.2.2.2' } } as any;
      expect(getClientIp(req)).toBe('1.1.1.1');
    });

    it('handles x-forwarded-for with single IP', () => {
      const req = { headers: { get: (name: string) => name === 'x-forwarded-for' ? '10.0.0.1' : null } } as any;
      expect(getClientIp(req)).toBe('10.0.0.1');
    });
  });

  describe('handler', () => {
    it('connects to database before calling the function', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true });
      const wrapped = handler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      await wrapped(req, undefined);
      expect(mocks.mockconnectDB).toHaveBeenCalledOnce();
    });

    it('passes context with req, params, searchParams, ip, and userAgent to the function', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true });
      const wrapped = handler(fn);
      const searchParams = new URLSearchParams('foo=bar');
      const req = {
        headers: { get: (name: string) => name === 'user-agent' ? 'test-agent' : null },
        nextUrl: { searchParams },
      } as any;
      await wrapped(req, undefined);
      const ctx = fn.mock.calls[0][0];
      expect(ctx.req).toBe(req);
      expect(ctx.ip).toBeNull();
      expect(ctx.userAgent).toBe('test-agent');
      expect(ctx.searchParams).toBe(searchParams);
    });

    it('resolves params from Promise when args is provided', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true });
      const wrapped = handler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      await wrapped(req, { params: Promise.resolve({ slug: 'test-note' }) });
      const ctx = fn.mock.calls[0][0];
      expect(ctx.params).toEqual({ slug: 'test-note' });
    });

    it('returns context with empty params when args is undefined', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true });
      const wrapped = handler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      await wrapped(req, undefined);
      const ctx = fn.mock.calls[0][0];
      expect(ctx.params).toEqual({});
    });

    it('returns function result on success', async () => {
      const expected = { success: true, data: { id: '1' } };
      const fn = vi.fn().mockResolvedValue(expected);
      const wrapped = handler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      const result = await wrapped(req, undefined);
      expect(result).toBe(expected);
    });

    it('catches AppError and returns fail response', async () => {
      const fn = vi.fn().mockRejectedValue(new AppError('NOT_FOUND', 'missing'));
      const wrapped = handler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      await wrapped(req, undefined);
      expect(mocks.mockFail).toHaveBeenCalledOnce();
      expect(mocks.mockFail.mock.calls[0][0]).toBeInstanceOf(AppError);
    });

    it('catches ZodError and converts to validation AppError', async () => {
      const fn = vi.fn().mockRejectedValue(new ZodError([]));
      const wrapped = handler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      await wrapped(req, undefined);
      expect(mocks.mockFail).toHaveBeenCalledOnce();
    });

    it('catches ZodError with path issues and maps fields', async () => {
      const issues = [
        { path: ['email'], message: 'Invalid email' },
        { path: ['password'], message: 'Too short' },
      ] as any;
      const fn = vi.fn().mockRejectedValue(new ZodError(issues as any));
      const wrapped = handler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      await wrapped(req, undefined);
      const error = mocks.mockFail.mock.calls[0][0] as AppError;
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.fields).toEqual({ email: 'Invalid email', password: 'Too short' });
    });

    it('catches ZodError with empty path and uses form', async () => {
      const issues = [{ path: [], message: 'Invalid form' }] as any;
      const fn = vi.fn().mockRejectedValue(new ZodError(issues as any));
      const wrapped = handler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      await wrapped(req, undefined);
      const error = mocks.mockFail.mock.calls[0][0] as AppError;
      expect(error.fields).toEqual({ form: 'Invalid form' });
    });

    it('catches duplicate key error and converts to conflict AppError', async () => {
      const fn = vi.fn().mockRejectedValue({ code: 11000, keyPattern: { slug: 1 } });
      const wrapped = handler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      await wrapped(req, undefined);
      const error = mocks.mockFail.mock.calls[0][0] as AppError;
      expect(error.code).toBe('CONFLICT');
    });

    it('catches unknown errors and returns internal error', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('unknown error'));
      const wrapped = handler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      await wrapped(req, undefined);
      expect(mocks.mockFail).toHaveBeenCalledOnce();
    });

    it('does not throw on error, returns fail response instead', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('boom'));
      const wrapped = handler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      await expect(wrapped(req, undefined)).resolves.toBeDefined();
    });
  });

  describe('adminHandler', () => {
    it('requires admin auth and passes admin to function', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true });
      const wrapped = adminHandler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      const result = await wrapped(req, undefined);
      expect(mocks.mockRequireAdmin).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledOnce();
      const ctx = fn.mock.calls[0][0];
      expect(ctx.admin).toEqual({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: false });
    });

    it('catches unauthorized error from requireAdmin', async () => {
      mocks.mockRequireAdmin.mockRejectedValue(new Error('not logged in'));
      const fn = vi.fn().mockResolvedValue({ ok: true });
      const wrapped = adminHandler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      await wrapped(req, undefined);
      expect(mocks.mockFail).toHaveBeenCalledOnce();
      expect(fn).not.toHaveBeenCalled();
    });

    it('includes ip and userAgent in context for admin handler', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true });
      const wrapped = adminHandler(fn);
      const req = {
        headers: { get: (name: string) => name === 'user-agent' ? 'bot' : null },
        nextUrl: { searchParams: new URLSearchParams() },
      } as any;
      await wrapped(req, undefined);
      const ctx = fn.mock.calls[0][0];
      expect(ctx.userAgent).toBe('bot');
    });
  });

  describe('headAdminHandler', () => {
    it('requires head admin auth', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true });
      const wrapped = headAdminHandler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      await wrapped(req, undefined);
      expect(mocks.mockRequireHeadAdmin).toHaveBeenCalledOnce();
    });

    it('passes admin session to the function', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true });
      const wrapped = headAdminHandler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      await wrapped(req, undefined);
      const ctx = fn.mock.calls[0][0];
      expect(ctx.admin.isHead).toBe(true);
    });

    it('catches forbidden when user is not head admin', async () => {
      mocks.mockRequireHeadAdmin.mockRejectedValue(new Error('not head'));
      const fn = vi.fn().mockResolvedValue({ ok: true });
      const wrapped = headAdminHandler(fn);
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any;
      await wrapped(req, undefined);
      expect(mocks.mockFail).toHaveBeenCalledOnce();
      expect(fn).not.toHaveBeenCalled();
    });
  });
});
