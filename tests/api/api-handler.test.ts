import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { handler, adminHandler, headAdminHandler, type RouteContext, type AdminRouteContext } from '@/server/lib/api-handler'
import { AppError } from '@/server/lib/errors'
import { ZodError } from 'zod'

vi.mock('@/server/db/connect', () => ({
  connectDb: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/server/lib/api-response', () => ({
  fail: vi.fn((error: any) => ({ failCalledWith: error })),
}))

vi.mock('@/server/lib/auth-guard', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: false }),
  requireHeadAdmin: vi.fn().mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: true }),
}))

describe('api-handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('handler', () => {
    it('connects to database before calling the function', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = handler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await wrapped(req, undefined)
      const { connectDb } = await import('@/server/db/connect')
      expect(connectDb).toHaveBeenCalledOnce()
    })

    it('passes context with req, params, searchParams, ip, and userAgent to the function', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = handler(fn)
      const searchParams = new URLSearchParams('foo=bar')
      const req = {
        headers: { get: (name: string) => name === 'user-agent' ? 'test-agent' : null },
        nextUrl: { searchParams },
      } as any
      await wrapped(req, undefined)
      const ctx = fn.mock.calls[0][0] as RouteContext
      expect(ctx.req).toBe(req)
      expect(ctx.ip).toBeNull()
      expect(ctx.userAgent).toBe('test-agent')
      expect(ctx.searchParams).toBe(searchParams)
    })

    it('resolves params from Promise when args is provided', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = handler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await wrapped(req, { params: Promise.resolve({ slug: 'test-note' }) })
      const ctx = fn.mock.calls[0][0] as RouteContext
      expect(ctx.params).toEqual({ slug: 'test-note' })
    })

    it('returns context with empty params when args is undefined', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = handler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await wrapped(req, undefined)
      const ctx = fn.mock.calls[0][0] as RouteContext
      expect(ctx.params).toEqual({})
    })

    it('returns function result on success', async () => {
      const expected = { success: true, data: { id: '1' } }
      const fn = vi.fn().mockResolvedValue(expected)
      const wrapped = handler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      const result = await wrapped(req, undefined)
      expect(result).toBe(expected)
    })

    it('catches AppError and returns fail response', async () => {
      const fn = vi.fn().mockRejectedValue(new AppError('NOT_FOUND', 'missing'))
      const wrapped = handler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      const result = await wrapped(req, undefined)
      const { fail } = (await import('@/server/lib/api-response')) as any
      expect(fail).toHaveBeenCalledOnce()
      expect((fail as any).mock.calls[0][0]).toBeInstanceOf(AppError)
    })

    it('catches ZodError and converts to validation AppError', async () => {
      const fn = vi.fn().mockRejectedValue(new ZodError([]))
      const wrapped = handler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      const result = await wrapped(req, undefined)
      const { fail } = (await import('@/server/lib/api-response')) as any
      expect(fail).toHaveBeenCalledOnce()
    })

    it('catches ZodError with path issues and maps fields', async () => {
      const issues = [
        { path: ['email'], message: 'Invalid email' },
        { path: ['password'], message: 'Too short' },
      ]
      const fn = vi.fn().mockRejectedValue(new ZodError(issues as any))
      const wrapped = handler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await wrapped(req, undefined)
      const { fail } = (await import('@/server/lib/api-response')) as any
      const error = (fail as any).mock.calls[0][0] as AppError
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.fields).toEqual({ email: 'Invalid email', password: 'Too short' })
    })

    it('catches ZodError with empty path and uses "form"', async () => {
      const issues = [{ path: [], message: 'Invalid form' }]
      const fn = vi.fn().mockRejectedValue(new ZodError(issues as any))
      const wrapped = handler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await wrapped(req, undefined)
      const { fail } = (await import('@/server/lib/api-response')) as any
      const error = (fail as any).mock.calls[0][0] as AppError
      expect(error.fields).toEqual({ form: 'Invalid form' })
    })

    it('catches duplicate key error and converts to conflict AppError', async () => {
      const fn = vi.fn().mockRejectedValue({ code: 11000, keyPattern: { slug: 1 } })
      const wrapped = handler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await wrapped(req, undefined)
      const { fail } = (await import('@/server/lib/api-response')) as any
      const error = (fail as any).mock.calls[0][0] as AppError
      expect(error.code).toBe('CONFLICT')
    })

    it('catches unknown errors and returns internal error', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('unknown error'))
      const wrapped = handler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      const result = await wrapped(req, undefined)
      const { fail } = await import('@/server/lib/api-response')
      expect(fail).toHaveBeenCalledOnce()
    })

    it('does not throw on error, returns fail response instead', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('boom'))
      const wrapped = handler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await expect(wrapped(req, undefined)).resolves.toBeDefined()
    })

    it('handles x-forwarded-for with single IP', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = handler(fn)
      const req = { headers: { get: (name: string) => name === 'x-forwarded-for' ? '10.0.0.1' : null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await wrapped(req, undefined)
      const ctx = fn.mock.calls[0][0] as RouteContext
      expect(ctx.ip).toBe('10.0.0.1')
    })

    it('handles x-forwarded-for with multiple IPs', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = handler(fn)
      const req = { headers: { get: (name: string) => name === 'x-forwarded-for' ? '1.2.3.4, 5.6.7.8' : null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await wrapped(req, undefined)
      const ctx = fn.mock.calls[0][0] as RouteContext
      expect(ctx.ip).toBe('1.2.3.4')
    })

    it('falls back to x-real-ip when x-forwarded-for is absent', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = handler(fn)
      const req = { headers: { get: (name: string) => name === 'x-real-ip' ? '9.8.7.6' : null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await wrapped(req, undefined)
      const ctx = fn.mock.calls[0][0] as RouteContext
      expect(ctx.ip).toBe('9.8.7.6')
    })

    it('returns null ip when no IP headers present', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = handler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await wrapped(req, undefined)
      const ctx = fn.mock.calls[0][0] as RouteContext
      expect(ctx.ip).toBeNull()
    })
  })

  describe('adminHandler', () => {
    it('requires admin auth and passes admin to function', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = adminHandler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      const result = await wrapped(req, undefined)
      const { requireAdmin } = await import('@/server/lib/auth-guard')
      expect(requireAdmin).toHaveBeenCalledOnce()
      expect(fn).toHaveBeenCalledOnce()
      const ctx = fn.mock.calls[0][0] as AdminRouteContext
      expect(ctx.admin).toEqual({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: false })
    })

    it('catches unauthorized error from requireAdmin', async () => {
      const { requireAdmin } = await import('@/server/lib/auth-guard') as any
      ;(requireAdmin as any).mockRejectedValue(new AppError('UNAUTHORIZED', 'not logged in'))
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = adminHandler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      const result = await wrapped(req, undefined)
      const { fail } = await import('@/server/lib/api-response')
      expect(fail).toHaveBeenCalledOnce()
      expect(fn).not.toHaveBeenCalled()
    })

    it('includes ip and userAgent in context for admin handler', async () => {
      const { requireAdmin } = await import('@/server/lib/auth-guard')
      ;(requireAdmin as any).mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: false })
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = adminHandler(fn)
      const req = {
        headers: { get: (name: string) => name === 'user-agent' ? 'bot' : null },
        nextUrl: { searchParams: new URLSearchParams() },
      } as any
      await wrapped(req, undefined)
      expect(fn).toHaveBeenCalledOnce()
      const ctx = fn.mock.calls[0][0] as AdminRouteContext
      expect(ctx.userAgent).toBe('bot')
    })

    it('resolves params in admin context', async () => {
      const { requireAdmin } = await import('@/server/lib/auth-guard') as any
      ;(requireAdmin as any).mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: false })
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = adminHandler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await wrapped(req, { params: Promise.resolve({ id: 'abc123' }) })
      expect(fn).toHaveBeenCalledOnce()
      const ctx = fn.mock.calls[0][0] as AdminRouteContext
      expect(ctx.params.id).toBe('abc123')
    })

    it('does not call function when requireAdmin rejects', async () => {
      const { requireAdmin } = await import('@/server/lib/auth-guard') as any
      ;(requireAdmin as any).mockRejectedValue(new AppError('UNAUTHORIZED', 'no token'))
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = adminHandler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await wrapped(req, undefined)
      expect(fn).not.toHaveBeenCalled()
    })
  })

  describe('headAdminHandler', () => {
    it('requires head admin auth', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = headAdminHandler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await wrapped(req, undefined)
      const { requireHeadAdmin } = await import('@/server/lib/auth-guard')
      expect(requireHeadAdmin).toHaveBeenCalledOnce()
    })

    it('passes admin session to the function', async () => {
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = headAdminHandler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await wrapped(req, undefined)
      const ctx = fn.mock.calls[0][0] as AdminRouteContext
      expect(ctx.admin.isHead).toBe(true)
    })

    it('catches forbidden when user is not head admin', async () => {
      const { requireHeadAdmin } = await import('@/server/lib/auth-guard') as any
      ;(requireHeadAdmin as any).mockRejectedValue(new AppError('FORBIDDEN', 'not head'))
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = headAdminHandler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      const result = await wrapped(req, undefined)
      const { fail } = await import('@/server/lib/api-response')
      expect(fail).toHaveBeenCalledOnce()
      expect(fn).not.toHaveBeenCalled()
    })

    it('does not call function when requireHeadAdmin rejects', async () => {
      const { requireHeadAdmin } = await import('@/server/lib/auth-guard') as any
      ;(requireHeadAdmin as any).mockRejectedValue(new AppError('FORBIDDEN', 'denied'))
      const fn = vi.fn().mockResolvedValue({ ok: true })
      const wrapped = headAdminHandler(fn)
      const req = { headers: { get: () => null }, nextUrl: { searchParams: new URLSearchParams() } } as any
      await wrapped(req, undefined)
      expect(fn).not.toHaveBeenCalled()
    })
  })
})
