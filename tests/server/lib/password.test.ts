import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hashPassword, verifyPassword } from '@/server/lib/password';

vi.mock('bcryptjs', () => {
  const hash = vi.fn();
  const compare = vi.fn();
  return {
    __esModule: true,
    default: { hash, compare },
    hash,
    compare,
  };
});

const { hash: mockHash, compare: mockCompare } = await import('bcryptjs');

describe('password', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('calls bcrypt.hash with the plain password and cost factor 12', async () => {
      (mockHash as any).mockResolvedValue('hashed-value');
      const result = await hashPassword('mySecret123');
      expect(mockHash).toHaveBeenCalledWith('mySecret123', 12);
      expect(result).toBe('hashed-value');
    });

    it('returns the bcrypt hash string', async () => {
      (mockHash as any).mockResolvedValue('$2a$12$...');
      const result = await hashPassword('test');
      expect(typeof result).toBe('string');
    });

    it('handles empty password', async () => {
      (mockHash as any).mockResolvedValue('hashed-empty');
      const result = await hashPassword('');
      expect(mockHash).toHaveBeenCalledWith('', 12);
      expect(result).toBe('hashed-empty');
    });

    it('handles very long password', async () => {
      const longPassword = 'x'.repeat(10000);
      (mockHash as any).mockResolvedValue('hashed-long');
      const result = await hashPassword(longPassword);
      expect(mockHash).toHaveBeenCalledWith(longPassword, 12);
      expect(result).toBe('hashed-long');
    });

    it('passes password with unicode characters', async () => {
      (mockHash as any).mockResolvedValue('hashed-unicode');
      const result = await hashPassword('e' + 'n' + 'u');
      expect(mockHash).toHaveBeenCalledWith('e' + 'n' + 'u', 12);
      expect(result).toBe('hashed-unicode');
    });
  });

  describe('verifyPassword', () => {
    it('returns true for matching password and hash', async () => {
      (mockCompare as any).mockResolvedValue(true);
      const result = await verifyPassword('correct', '$2a$12$validhash');
      expect(result).toBe(true);
    });

    it('returns false for non-matching password and hash', async () => {
      (mockCompare as any).mockResolvedValue(false);
      const result = await verifyPassword('wrong', '$2a$12$validhash');
      expect(result).toBe(false);
    });

    it('handles empty password', async () => {
      (mockCompare as any).mockResolvedValue(false);
      const result = await verifyPassword('', 'hash');
      expect(result).toBe(false);
    });

    it('handles invalid hash format', async () => {
      (mockCompare as any).mockResolvedValue(false);
      const result = await verifyPassword('pass', 'not-a-hash');
      expect(result).toBe(false);
    });

    it('handles null hash', async () => {
      (mockCompare as any).mockResolvedValue(false);
      const result = await verifyPassword('pass', '');
      expect(result).toBe(false);
    });

    it('calls bcrypt.compare with correct arguments', async () => {
      (mockCompare as any).mockResolvedValue(true);
      await verifyPassword('myPass', 'myHash');
      expect(mockCompare).toHaveBeenCalledWith('myPass', 'myHash');
    });
  });
});
