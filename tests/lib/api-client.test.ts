import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError, apiClient, buildQueryString } from '../../src/lib/api-client';
import type { ApiResult, ErrorCode } from '../../src/lib/types';

describe('ApiError', () => {
  it('has name ApiError', () => {
    const error = new ApiError('INTERNAL_ERROR', 'fail', 500);
    expect(error.name).toBe('ApiError');
  });

  it('stores code, message, status, and fields', () => {
    const error = new ApiError('VALIDATION_ERROR', 'Bad input', 400, { name: 'required' });
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.message).toBe('Bad input');
    expect(error.status).toBe(400);
    expect(error.fields).toEqual({ name: 'required' });
  });

  it('stores fields as undefined when not provided', () => {
    const error = new ApiError('NOT_FOUND', 'missing', 404);
    expect(error.fields).toBeUndefined();
  });

  it('is an instance of Error', () => {
    const error = new ApiError('INTERNAL_ERROR', 'fail', 500);
    expect(error).toBeInstanceOf(Error);
  });
});

describe('apiClient', () => {
  const mockFetch = vi.fn();
  beforeEach(() => {
    vi.restoreAllMocks();
    mockFetch.mockClear();
    globalThis.fetch = mockFetch;
  });

  it('sends GET request with correct path and headers', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: (key: string) => key === 'content-type' ? 'application/json' : null },
      json: async () => ({ success: true, data: { id: '1' } }),
    });

    const result = await apiClient('/notes/test');
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/notes/test',
      expect.objectContaining({
        headers: expect.any(Headers),
        credentials: 'include',
      }),
    );
    expect(result).toEqual({ id: '1' });
  });

  it('sets Content-Type header for non-FormData bodies', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: (key: string) => key === 'content-type' ? 'application/json' : null },
      json: async () => ({ success: true, data: {} }),
    });

    await apiClient('/notes', { method: 'POST', body: JSON.stringify({ title: 'test' }) });
    const call = mockFetch.mock.calls[0];
    const headers = call[1].headers as Headers;
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('does not override existing Content-Type header', async () => {
    const customHeader = new Headers({ 'Content-Type': 'text/plain' });
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, data: {} }),
    });

    await apiClient('/upload', { headers: customHeader });
    const call = mockFetch.mock.calls[0];
    expect(call[1].headers).toBeDefined();
  });

  it('does not set Content-Type for FormData bodies', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, data: {} }),
    });

    const formData = new FormData();
    await apiClient('/upload', { method: 'POST', body: formData });
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toBe('/api/upload');
    expect(call[1].credentials).toBe('include');
  });

  it('returns data on success response', async () => {
    const responseData = { id: 'abc', title: 'Note' };
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, data: responseData }),
    });

    const result = await apiClient('/notes/abc');
    expect(result).toEqual(responseData);
  });

  it('throws ApiError on failure response', async () => {
    const errorPayload: ApiResult<never> = {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input', fields: { name: 'required' } },
    };
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      headers: { get: () => 'application/json' },
      json: async () => errorPayload,
    });

    await expect(apiClient('/notes')).rejects.toThrow(ApiError);
    try {
      await apiClient('/notes');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      const apiError = error as ApiError;
      expect(apiError.code).toBe('VALIDATION_ERROR');
      expect(apiError.message).toBe('Invalid input');
      expect(apiError.status).toBe(400);
      expect(apiError.fields).toEqual({ name: 'required' });
    }
  });

  it('throws ApiError with INTERNAL_ERROR when response is not JSON', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      headers: { get: () => 'text/html' },
      json: async () => ({}),
    });

    await expect(apiClient('/notes')).rejects.toThrow(ApiError);
    try {
      await apiClient('/notes');
    } catch (error) {
      expect((error as ApiError).code).toBe('INTERNAL_ERROR');
      expect((error as ApiError).status).toBe(500);
    }
  });

  it('throws ApiError when content-type does not include application/json', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'text/plain; charset=utf-8' },
      json: async () => ({}),
    });

    await expect(apiClient('/notes')).rejects.toThrow(ApiError);
    try {
      await apiClient('/notes');
    } catch (error) {
      expect((error as ApiError).code).toBe('INTERNAL_ERROR');
    }
  });

  it('passes through additional request options', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, data: {} }),
    });

    await apiClient('/notes', {
      method: 'DELETE',
      headers: new Headers({ 'X-Custom-Header': 'value' }),
    });

    const call = mockFetch.mock.calls[0];
    expect(call[0]).toMatch(/^\/api\/notes/);
    expect(call[1].credentials).toBe('include');
    const headers = call[1].headers as Headers;
    expect(headers.get('X-Custom-Header')).toBe('value');
  });
});

describe('buildQueryString', () => {
  it('returns empty string for empty params', () => {
    expect(buildQueryString({})).toBe('');
  });

  it('returns empty string when all values are null/undefined', () => {
    expect(buildQueryString({ a: null, b: undefined })).toBe('');
  });

  it('skips null values', () => {
    expect(buildQueryString({ a: 'hello', b: null })).toBe('?a=hello');
  });

  it('skips undefined values', () => {
    expect(buildQueryString({ a: 'hello', b: undefined })).toBe('?a=hello');
  });

  it('skips empty string values', () => {
    expect(buildQueryString({ a: 'hello', b: '' })).toBe('?a=hello');
  });

  it('includes string values', () => {
    expect(buildQueryString({ q: 'test' })).toBe('?q=test');
  });

  it('includes number values', () => {
    expect(buildQueryString({ page: 2, limit: 10 })).toBe('?page=2&limit=10');
  });

  it('includes boolean values', () => {
    expect(buildQueryString({ featured: true, public: false })).toBe('?featured=true&public=false');
  });

  it('handles arrays by appending multiple values', () => {
    const result = buildQueryString({ category: ['cat1', 'cat2'] });
    expect(result).toContain('category=cat1');
    expect(result).toContain('category=cat2');
  });

  it('filters out falsy array entries', () => {
    const result = buildQueryString({ category: ['cat1', null, 'cat2', ''] } as any);
    expect(result).toContain('category=cat1');
    expect(result).toContain('category=cat2');
  });

  it('returns query with leading question mark', () => {
    expect(buildQueryString({ a: '1' }).startsWith('?')).toBe(true);
  });

  it('handles multiple keys with arrays', () => {
    const result = buildQueryString({ level: ['basics', 'intermediate'], tags: ['dsa'] });
    expect(result).toContain('level=basics');
    expect(result).toContain('level=intermediate');
    expect(result).toContain('tags=dsa');
  });
});
