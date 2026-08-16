import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { signAdminToken, verifyAdminToken, type AdminTokenPayload } from '@/server/lib/jwt';

const mocks = vi.hoisted(() => ({
  mockSign: vi.fn<() => Promise<string>>(),
  mockVerify: vi.fn(),
}));

vi.mock('jose', async (importOriginal) => {
  const actual = await importOriginal<typeof import('jose')>();
  return {
    ...actual,
    SignJWT: vi.fn().mockImplementation(function (this: any) {
      return {
        setProtectedHeader: vi.fn().mockReturnThis(),
        setSubject: vi.fn().mockReturnThis(),
        setIssuedAt: vi.fn().mockReturnThis(),
        setExpirationTime: vi.fn().mockReturnThis(),
        sign: mocks.mockSign,
      };
    }),
    jwtVerify: mocks.mockVerify,
  };
});

describe('jwt', () => {
  const originalSecret = process.env.JWT_SECRET;
  const TEST_SECRET = 'test-jwt-secret-key-for-vitest';

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = TEST_SECRET;
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  describe('signAdminToken', () => {
    it('produces a valid JWT string', async () => {
      const token = 'signed-token-value';
      mocks.mockSign.mockResolvedValue(token);

      const payload: AdminTokenPayload = {
        sub: 'admin-id-1',
        email: 'admin@test.com',
        name: 'Test Admin',
        isHead: true,
      };
      const result = await signAdminToken(payload);

      expect(result).toBe(token);
      expect(mocks.mockSign).toHaveBeenCalledOnce();
    });

    it('sets JWT protected header with alg HS256', async () => {
      mocks.mockSign.mockResolvedValue('token');

      await signAdminToken({
        sub: 'admin-id-1',
        email: 'admin@test.com',
        name: 'Test',
        isHead: false,
      });

      expect(mocks.mockSign).toHaveBeenCalled();
    });

    it('sets subject from payload.sub', async () => {
      mocks.mockSign.mockResolvedValue('token');

      await signAdminToken({
        sub: 'admin-123',
        email: 'a@b.com',
        name: 'User',
        isHead: false,
      });

      expect(mocks.mockSign).toHaveBeenCalled();
    });

    it('throws when JWT_SECRET is not set', async () => {
      delete process.env.JWT_SECRET;
      await expect(signAdminToken({
        sub: 'admin-id',
        email: 'a@b.com',
        name: 'User',
        isHead: false,
      })).rejects.toThrow('Authentication is not configured');
    });

    it('encodes the secret with TextEncoder', async () => {
      mocks.mockSign.mockResolvedValue('token');
      await signAdminToken({
        sub: 'id',
        email: 'e@e.com',
        name: 'N',
        isHead: false,
      });
      expect(mocks.mockSign).toHaveBeenCalled();
    });

    it('passes payload email, name, and isHead to JWT', async () => {
      mocks.mockSign.mockResolvedValue('token');
      await signAdminToken({
        sub: 'sub-1',
        email: 'test@example.com',
        name: 'Note Taker',
        isHead: true,
      });
      expect(mocks.mockSign).toHaveBeenCalled();
    });

    it('sets expiration time to ADMIN_SESSION_MAX_AGE_SECONDS', async () => {
      mocks.mockSign.mockResolvedValue('token');
      await signAdminToken({
        sub: 'sub',
        email: 'e@e.com',
        name: 'N',
        isHead: false,
      });
      expect(mocks.mockSign).toHaveBeenCalled();
    });
  });

  describe('verifyAdminToken', () => {
    it('returns payload for a valid token', async () => {
      const verifiedPayload = {
        sub: 'admin-1',
        email: 'admin@test.com',
        name: 'Admin User',
        isHead: true,
        iat: 1000000,
        exp: 1000000 + 604800,
      };
      mocks.mockVerify.mockResolvedValue({ payload: verifiedPayload });

      const result = await verifyAdminToken('valid-token');
      expect(result).toEqual({
        sub: 'admin-1',
        email: 'admin@test.com',
        name: 'Admin User',
        isHead: true,
      });
    });

    it('converts isHead to boolean', async () => {
      mocks.mockVerify.mockResolvedValue({
        payload: {
          sub: 'admin-1',
          email: 'a@b.com',
          name: 'User',
          isHead: 1,
        },
      });
      const result = await verifyAdminToken('token');
      expect(result.isHead).toBe(true);
    });

    it('converts isHead false to boolean false', async () => {
      mocks.mockVerify.mockResolvedValue({
        payload: {
          sub: 'admin-1',
          email: 'a@b.com',
          name: 'User',
          isHead: 0,
        },
      });
      const result = await verifyAdminToken('token');
      expect(result.isHead).toBe(false);
    });

    it('throws unauthorized when token is missing sub', async () => {
      mocks.mockVerify.mockResolvedValue({
        payload: {
          email: 'a@b.com',
          name: 'User',
        },
      });
      await expect(verifyAdminToken('token')).rejects.toThrow('Your session has expired');
    });

    it('throws unauthorized when email is not a string', async () => {
      mocks.mockVerify.mockResolvedValue({
        payload: {
          sub: 'admin-1',
          email: 123 as unknown as string,
          name: 'User',
        },
      });
      await expect(verifyAdminToken('token')).rejects.toThrow('Your session has expired');
    });

    it('throws unauthorized when name is not a string', async () => {
      mocks.mockVerify.mockResolvedValue({
        payload: {
          sub: 'admin-1',
          email: 'a@b.com',
          name: 42 as unknown as string,
        },
      });
      await expect(verifyAdminToken('token')).rejects.toThrow('Your session has expired');
    });

    it('throws unauthorized for malformed token', async () => {
      mocks.mockVerify.mockRejectedValue(new Error('invalid token'));
      await expect(verifyAdminToken('bad-token')).rejects.toThrow('Your session has expired');
    });

    it('throws unauthorized for expired token', async () => {
      mocks.mockVerify.mockRejectedValue(new Error('token expired'));
      await expect(verifyAdminToken('expired-token')).rejects.toThrow('Your session has expired');
    });

    it('throws unauthorized when jose verify throws unknown error', async () => {
      mocks.mockVerify.mockRejectedValue(new Error('random error'));
      await expect(verifyAdminToken('bad')).rejects.toThrow('Your session has expired');
    });

    it('throws when JWT_SECRET is missing', async () => {
      delete process.env.JWT_SECRET;
      await expect(verifyAdminToken('any-token')).rejects.toThrow('Your session has expired');
    });

    it('throws when payload has null sub', async () => {
      mocks.mockVerify.mockResolvedValue({
        payload: {
          sub: null,
          email: 'a@b.com',
          name: 'User',
        },
      });
      await expect(verifyAdminToken('token')).rejects.toThrow('Your session has expired');
    });

    it('throws when payload has undefined sub', async () => {
      mocks.mockVerify.mockResolvedValue({
        payload: {
          email: 'a@b.com',
          name: 'User',
        },
      });
      await expect(verifyAdminToken('token')).rejects.toThrow('Your session has expired');
    });
  });
});
