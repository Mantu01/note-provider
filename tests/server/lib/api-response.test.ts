import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ok, okPaginated, fail } from '@/server/lib/api-response';
import { AppError } from '@/server/lib/errors';
import { ADMIN_SESSION_COOKIE } from '@/lib/constants';

const { mockNextResponseJson, mockNextResponse } = vi.hoisted(() => ({
  mockNextResponseJson: vi.fn(),
  mockNextResponse: vi.fn(() => ({ json: vi.fn() })),
}));

vi.mock('next/server', () => ({
  NextResponse: {
    json: mockNextResponseJson,
  },
}));

describe('api-response', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ok', () => {
    it('returns JSON with success true and data', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      ok({ id: '1', name: 'test' });
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { success: true, data: { id: '1', name: 'test' } },
        { status: 200 },
      );
    });

    it('uses default status 200', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      ok({ value: 42 });
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { success: true, data: { value: 42 } },
        { status: 200 },
      );
    });

    it('accepts custom status code', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      ok({ created: true }, 201);
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { success: true, data: { created: true } },
        { status: 201 },
      );
    });

    it('handles null data', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      ok(null);
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { success: true, data: null },
        { status: 200 },
      );
    });

    it('handles empty array data', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      ok([]);
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { success: true, data: [] },
        { status: 200 },
      );
    });

    it('handles string data', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      ok('hello');
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { success: true, data: 'hello' },
        { status: 200 },
      );
    });

    it('handles number data', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      ok(0);
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { success: true, data: 0 },
        { status: 200 },
      );
    });

    it('handles boolean data', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      ok(false);
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { success: true, data: false },
        { status: 200 },
      );
    });
  });

  describe('okPaginated', () => {
    it('returns JSON with paginated data structure', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      okPaginated([{ id: '1' }], { page: 1, limit: 10, total: 1, totalPages: 1, hasNext: false, hasPrev: false });
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { success: true, data: { items: [{ id: '1' }], pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasNext: false, hasPrev: false } } },
        { status: 200 },
      );
    });

    it('accepts custom status code', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      okPaginated([], { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false }, 206);
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        expect.any(Object),
        { status: 206 },
      );
    });

    it('handles empty items array', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      okPaginated([], { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false });
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { success: true, data: { items: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false } } },
        { status: 200 },
      );
    });

    it('handles multiple pages', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      const pagination = { page: 2, limit: 10, total: 25, totalPages: 3, hasNext: true, hasPrev: true };
      okPaginated([{ id: '11' }], pagination);
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { success: true, data: { items: [{ id: '11' }], pagination } },
        { status: 200 },
      );
    });
  });

  describe('fail', () => {
    it('returns JSON with success false and error structure', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      const error = new AppError('NOT_FOUND', 'Resource not found');
      const result = fail(error);
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found',
          },
        },
        { status: 404 },
      );
    });

    it('includes fields when AppError has fields', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      const error = new AppError('VALIDATION_ERROR', 'Bad input', { email: 'invalid' });
      fail(error);
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Bad input',
            fields: { email: 'invalid' },
          },
        },
        { status: 400 },
      );
    });

    it('does not include fields when AppError has no fields', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      const error = new AppError('NOT_FOUND', 'missing');
      fail(error);
      const callArgs = mockNextResponseJson.mock.calls[0][0];
      expect(callArgs.error.fields).toBeUndefined();
    });

    it('deletes admin session cookie on UNAUTHORIZED', () => {
      mockNextResponseJson.mockReturnValue({ ok: true, cookies: { delete: vi.fn() } });
      const error = new AppError('UNAUTHORIZED', 'not logged in');
      const result = fail(error);
      expect(result.cookies.delete).toHaveBeenCalledWith(ADMIN_SESSION_COOKIE);
    });

    it('deletes admin session cookie on status 401', () => {
      mockNextResponseJson.mockReturnValue({ ok: true, cookies: { delete: vi.fn() } });
      const error = new AppError('UNAUTHORIZED', 'session expired');
      fail(error);
      expect(mockNextResponseJson.mock.calls[0][1]).toEqual({ status: 401 });
    });

    it('does not delete cookie for non-401 errors', () => {
      const cookiesDelete = vi.fn();
      mockNextResponseJson.mockReturnValue({ ok: true, cookies: { delete: cookiesDelete } });
      const error = new AppError('NOT_FOUND', 'missing');
      fail(error);
      expect(cookiesDelete).not.toHaveBeenCalled();
    });

    it('uses correct status for VALIDATION_ERROR', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      fail(new AppError('VALIDATION_ERROR', 'bad'));
      expect(mockNextResponseJson.mock.calls[0][1]).toEqual({ status: 400 });
    });

    it('uses correct status for FORBIDDEN', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      fail(new AppError('FORBIDDEN', 'no access'));
      expect(mockNextResponseJson.mock.calls[0][1]).toEqual({ status: 403 });
    });

    it('uses correct status for PAYMENT_ERROR', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      fail(new AppError('PAYMENT_ERROR', 'payment failed'));
      expect(mockNextResponseJson.mock.calls[0][1]).toEqual({ status: 402 });
    });

    it('uses correct status for RATE_LIMITED', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      fail(new AppError('RATE_LIMITED', 'too many'));
      expect(mockNextResponseJson.mock.calls[0][1]).toEqual({ status: 429 });
    });

    it('uses correct status for PAYLOAD_TOO_LARGE', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      fail(new AppError('PAYLOAD_TOO_LARGE', 'too big'));
      expect(mockNextResponseJson.mock.calls[0][1]).toEqual({ status: 413 });
    });

    it('uses correct status for UNSUPPORTED_MEDIA_TYPE', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      fail(new AppError('UNSUPPORTED_MEDIA_TYPE', 'wrong type'));
      expect(mockNextResponseJson.mock.calls[0][1]).toEqual({ status: 415 });
    });

    it('uses correct status for INTERNAL_ERROR', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      fail(new AppError('INTERNAL_ERROR', 'internal'));
      expect(mockNextResponseJson.mock.calls[0][1]).toEqual({ status: 500 });
    });

    it('uses correct status for CONFLICT', () => {
      mockNextResponseJson.mockReturnValue({ ok: true });
      fail(new AppError('CONFLICT', 'duplicate'));
      expect(mockNextResponseJson.mock.calls[0][1]).toEqual({ status: 409 });
    });
  });
});
