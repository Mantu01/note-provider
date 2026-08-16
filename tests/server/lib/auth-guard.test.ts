import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireAdmin, requireHeadAdmin, setAdminSessionCookie, clearAdminSessionCookie, getOptionalAdmin } from '@/server/lib/auth-guard';
import { AppError } from '@/server/lib/errors';
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_SECONDS } from '@/lib/constants';

const { mockCookies, mockVerifyAdminToken, mockAdminFindById } = vi.hoisted(() => ({
  mockCookies: vi.fn(),
  mockVerifyAdminToken: vi.fn(),
  mockAdminFindById: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: () => mockCookies(),
}));

vi.mock('@/server/lib/jwt', () => ({
  verifyAdminToken: mockVerifyAdminToken,
}));

vi.mock('@/server/db/models/admin.model', () => ({
  Admin: {
    findById: vi.fn(() => ({
      select: vi.fn(() => ({ lean: mockAdminFindById })),
    })),
  },
}));

describe('auth-guard', () => {
  const mockAdminDoc = {
    _id: 'admin-id-1',
    name: 'Test Admin',
    email: 'admin@test.com',
    isActive: true,
    isHead: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCookies.mockReturnValue({
      get: vi.fn(() => ({ value: 'valid-token' })),
      set: vi.fn(),
    });
    mockVerifyAdminToken.mockResolvedValue({
      sub: 'admin-id-1',
      email: 'admin@test.com',
      name: 'Test Admin',
      isHead: false,
    });
    mockAdminFindById.mockResolvedValue(mockAdminDoc);
  });

  describe('requireAdmin', () => {
    it('returns admin session when cookie and token are valid', async () => {
      const session = await requireAdmin();
      expect(session).toEqual({
        id: 'admin-id-1',
        name: 'Test Admin',
        email: 'admin@test.com',
        isHead: false,
      });
    });

    it('uses token from admin session cookie', async () => {
      await requireAdmin();
      expect(mockCookies).toHaveBeenCalledOnce();
      expect(mockCookies().get).toHaveBeenCalledWith(ADMIN_SESSION_COOKIE);
    });

    it('throws unauthorized when cookie is missing', async () => {
      mockCookies.mockReturnValue({
        get: vi.fn(() => undefined),
      });
      await expect(requireAdmin()).rejects.toThrow('Your session has expired');
    });

    it('throws unauthorized when token value is missing', async () => {
      mockCookies.mockReturnValue({
        get: vi.fn(() => ({})),
      });
      await expect(requireAdmin()).rejects.toThrow('Your session has expired');
    });

    it('throws when verifyAdminToken rejects', async () => {
      mockVerifyAdminToken.mockRejectedValue(new Error('invalid'));
      await expect(requireAdmin()).rejects.toThrow('invalid');
    });

    it('throws unauthorized when admin is not found', async () => {
      mockAdminFindById.mockResolvedValue(null);
      await expect(requireAdmin()).rejects.toThrow('Your session has expired');
    });

    it('throws unauthorized when admin is inactive', async () => {
      mockAdminFindById.mockResolvedValue({ ...mockAdminDoc, isActive: false });
      await expect(requireAdmin()).rejects.toThrow('Your session has expired');
    });

    it('returns isHead as true when admin is head', async () => {
      mockAdminFindById.mockResolvedValue({ ...mockAdminDoc, isHead: true });
      const session = await requireAdmin();
      expect(session.isHead).toBe(true);
    });

    it('selects only required fields from admin', async () => {
      await requireAdmin();
      expect(mockAdminFindById).toHaveBeenCalledOnce();
    });
  });

  describe('requireHeadAdmin', () => {
    it('returns session for head admin', async () => {
      mockAdminFindById.mockResolvedValue({ ...mockAdminDoc, isHead: true });
      const session = await requireHeadAdmin();
      expect(session.isHead).toBe(true);
    });

    it('throws forbidden for non-head admin', async () => {
      mockAdminFindById.mockResolvedValue({ ...mockAdminDoc, isHead: false });
      await expect(requireHeadAdmin()).rejects.toThrow('Only head admin can perform delete operations');
    });

    it('throws when requireAdmin fails', async () => {
      mockCookies.mockReturnValue({ get: vi.fn(() => undefined) });
      await expect(requireHeadAdmin()).rejects.toThrow();
    });
  });

  describe('setAdminSessionCookie', () => {
    it('sets the admin session cookie with correct options', async () => {
      const setFn = vi.fn();
      mockCookies.mockReturnValue({ set: setFn });
      await setAdminSessionCookie('my-token');
      expect(setFn).toHaveBeenCalledWith(
        ADMIN_SESSION_COOKIE,
        'my-token',
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
        },
      );
    });

    it('uses production secure flag based on NODE_ENV', async () => {
      const setFn = vi.fn();
      mockCookies.mockReturnValue({ set: setFn });
      (process.env as any).NODE_ENV = 'production';
      await setAdminSessionCookie('token');
      expect(setFn).toHaveBeenCalledWith(
        ADMIN_SESSION_COOKIE,
        'token',
        expect.objectContaining({ secure: true }),
      );
    });

    it('does not set secure when not in production', async () => {
      const setFn = vi.fn();
      mockCookies.mockReturnValue({ set: setFn });
      (process.env as any).NODE_ENV = 'development';
      await setAdminSessionCookie('token');
      expect(setFn).toHaveBeenCalledWith(
        ADMIN_SESSION_COOKIE,
        'token',
        expect.objectContaining({ secure: false }),
      );
    });
  });

  describe('clearAdminSessionCookie', () => {
    it('clears the admin session cookie', async () => {
      const setFn = vi.fn();
      mockCookies.mockReturnValue({ set: setFn });
      await clearAdminSessionCookie();
      expect(setFn).toHaveBeenCalledWith(
        ADMIN_SESSION_COOKIE,
        '',
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 0,
        },
      );
    });
  });

  describe('getOptionalAdmin', () => {
    it('returns admin session when auth succeeds', async () => {
      const result = await getOptionalAdmin();
      expect(result).toEqual({
        id: 'admin-id-1',
        name: 'Test Admin',
        email: 'admin@test.com',
        isHead: false,
      });
    });

    it('returns null when auth fails', async () => {
      mockCookies.mockReturnValue({ get: vi.fn(() => undefined) });
      const result = await getOptionalAdmin();
      expect(result).toBeNull();
    });

    it('returns null when admin is inactive', async () => {
      mockAdminFindById.mockResolvedValue({ ...mockAdminDoc, isActive: false });
      const result = await getOptionalAdmin();
      expect(result).toBeNull();
    });
  });
});
