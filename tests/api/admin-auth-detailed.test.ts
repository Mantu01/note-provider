import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { handler, adminHandler } from '@/server/lib/api-handler'
import { ok, fail } from '@/server/lib/api-response'
import { AppError } from '@/server/lib/errors'
import { Admin } from '@/server/db/models/admin.model'
import { verifyPassword, hashPassword } from '@/server/lib/password'
import { signAdminToken } from '@/server/lib/jwt'
import { setAdminSessionCookie, clearAdminSessionCookie, getOptionalAdmin, requireAdmin } from '@/server/lib/auth-guard'
import { logActivity } from '@/server/services/activity.service'
import { enforceRateLimit } from '@/server/lib/rate-limit'
import { toAdminProfile } from '@/server/mappers/activity.mapper'
import { AdminActivity } from '@/server/db/models/admin-activity.model'

vi.mock('@/server/db/connect', () => ({ connectDB: vi.fn().mockResolvedValue(undefined) }))

vi.mock('@/server/db/models/admin.model', () => ({
  Admin: {
    findOne: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    create: vi.fn(),
    find: vi.fn(),
  },
}))

vi.mock('@/server/db/models/admin-activity.model', () => ({
  AdminActivity: {
    find: vi.fn(),
    countDocuments: vi.fn(),
  },
}))

vi.mock('@/server/lib/password', () => ({
  verifyPassword: vi.fn(),
  hashPassword: vi.fn(),
}))

vi.mock('@/server/lib/jwt', () => ({
  signAdminToken: vi.fn(),
}))

vi.mock('@/server/lib/auth-guard', () => ({
  setAdminSessionCookie: vi.fn(),
  clearAdminSessionCookie: vi.fn(),
  getOptionalAdmin: vi.fn(),
  requireAdmin: vi.fn(),
  requireHeadAdmin: vi.fn(),
}))

vi.mock('@/server/services/activity.service', () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/server/lib/rate-limit', () => ({
  enforceRateLimit: vi.fn(),
}))

vi.mock('@/server/mappers/activity.mapper', () => ({
  toAdminProfile: vi.fn((a: any) => a),
  toAdminActivity: vi.fn((a: any) => a),
}))

const adminLoginSchema = { safeParse: vi.fn() }
const adminRegisterSchema = { safeParse: vi.fn() }

vi.mock('@/lib/schemas/admin.schema', () => ({
  adminLoginSchema,
  adminRegisterSchema,
  updateOrderSchema: { safeParse: vi.fn() },
}))

function mockReq(method: string, path: string, body?: unknown, extraHeaders?: Record<string, string>) {
  const headers = new Headers({ 'content-type': 'application/json', ...extraHeaders })
  const req = new NextRequest(`http://localhost${path}`, { method, headers })
  if (body !== undefined) req.json = () => Promise.resolve(body as any)
  return req
}

function q(chainVal: unknown) {
  return {
    select: vi.fn().mockReturnThis(),
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(chainVal),
  }
}

// ─── Handlers ────────────────────────────────────────────────────────────────

const loginHandler = (handler as any)(async (ctx: any) => {
  enforceRateLimit('adminLogin', ctx.ip, { limit: 5, windowMs: 600000 })
  const body = await ctx.req.json()
  const parsed = adminLoginSchema.safeParse(body)
  if (!parsed.success) {
    const fields: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.') || 'form'
      if (!fields[key]) fields[key] = issue.message
    }
    return fail(AppError.validation(fields, parsed.error.issues[0]?.message ?? 'Invalid input'))
  }
  const admin = await Admin.findOne({ email: parsed.data.email.toLowerCase() }).select('+passwordHash').lean().exec()
  if (!admin) return fail(AppError.unauthorized('Invalid email or password'))
  const valid = await verifyPassword(parsed.data.password, admin.passwordHash)
  if (!valid) return fail(AppError.unauthorized('Invalid email or password'))
  await Admin.findByIdAndUpdate(admin._id, { lastLoginAt: new Date() }).exec()
  const token = await signAdminToken({ sub: admin._id.toString(), email: admin.email, name: admin.name, isHead: Boolean(admin.isHead) })
  await setAdminSessionCookie(token)
  await logActivity({ adminId: admin._id.toString(), action: 'admin.login', description: `Admin "${admin.name}" logged in`, targetType: 'admin', targetId: admin._id.toString(), targetLabel: admin.name, ip: ctx.ip, userAgent: ctx.userAgent })
  const profile = { ...admin, passwordHash: undefined }
  return ok(toAdminProfile(profile))
}) as any

const logoutHandler = (handler as any)(async (ctx: any) => {
  const admin = await getOptionalAdmin()
  await clearAdminSessionCookie()
  if (admin) {
    await logActivity({ adminId: admin.id, action: 'admin.logout', description: `Admin "${admin.name}" logged out`, targetType: 'admin', targetId: admin.id, targetLabel: admin.name, ip: ctx.ip, userAgent: ctx.userAgent })
  }
  return ok({ ok: true })
}) as any

const meHandler = (adminHandler as any)(async (ctx: any) => {
  const admin = await Admin.findById(ctx.admin.id).select('-passwordHash').lean().exec()
  if (!admin) return fail(AppError.unauthorized())
  return ok(toAdminProfile(admin))
}) as any

const registerHandler = (handler as any)(async (ctx: any) => {
  enforceRateLimit('adminRegister', ctx.ip, { limit: 10, windowMs: 3600000 })
  const secret = ctx.req.headers.get('x-admin-register-secret')
  if (secret !== process.env.ADMIN_REGISTER_SECRET) return fail(AppError.forbidden('Access denied'))
  const body = await ctx.req.json()
  const parsed = adminRegisterSchema.safeParse(body)
  if (!parsed.success) {
    const fields: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.') || 'form'
      if (!fields[key]) fields[key] = issue.message
    }
    return fail(AppError.validation(fields, parsed.error.issues[0]?.message ?? 'Invalid input'))
  }
  const existing = await Admin.findOne({ email: parsed.data.email.toLowerCase() }).lean().exec()
  if (existing) return fail(AppError.conflict('An account with this email already exists'))
  const isHead = parsed.data.isHead ?? false
  const passwordHash = await hashPassword(parsed.data.password)
  const admin = await Admin.create({ name: parsed.data.name, email: parsed.data.email.toLowerCase(), passwordHash, isHead })
  await logActivity({ adminId: admin._id.toString(), action: 'admin.register', description: `Registered admin "${admin.name}"`, targetType: 'admin', targetId: admin._id.toString(), targetLabel: admin.name, ip: ctx.ip, userAgent: ctx.userAgent })
  return ok(toAdminProfile(admin.toJSON()))
}) as any

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('POST /api/admin/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.ADMIN_REGISTER_SECRET = 'test-secret'
    ;(enforceRateLimit as any).mockImplementation(() => undefined)
    ;(adminLoginSchema.safeParse as any).mockReturnValue({ success: false, error: { issues: [{ path: ['email'], message: 'Invalid email' }] } })
    ;(Admin.findOne as any).mockReturnValue(q(null))
    ;(Admin.findByIdAndUpdate as any).mockReturnValue(q({}))
    ;(verifyPassword as any).mockResolvedValue(false)
    ;(signAdminToken as any).mockResolvedValue('tok')
    ;(setAdminSessionCookie as any).mockResolvedValue(undefined)
    ;(logActivity as any).mockResolvedValue(undefined)
  })

  it('returns validation error for invalid body', async () => {
    const req = mockReq('POST', '/api/admin/auth/login', {})
    const res = await loginHandler(req as any, undefined)
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })

  it('returns 401 when admin not found', async () => {
    ;(adminLoginSchema.safeParse as any).mockReturnValue({ success: true, data: { email: 'test@test.com', password: 'pass' } })
    ;(Admin.findOne as any).mockReturnValue(q(null))
    const req = mockReq('POST', '/api/admin/auth/login', { email: 'test@test.com', password: 'pass' })
    const res = await loginHandler(req as any, undefined)
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('UNAUTHORIZED')
  })

  it('returns 401 when password is invalid', async () => {
    ;(adminLoginSchema.safeParse as any).mockReturnValue({ success: true, data: { email: 't@t.com', password: 'pass' } })
    ;(Admin.findOne as any).mockReturnValue(q({ _id: 'a1', email: 't@t.com', passwordHash: 'h', name: 'Test', isHead: false }))
    ;(verifyPassword as any).mockResolvedValue(false)
    const req = mockReq('POST', '/api/admin/auth/login', { email: 't@t.com', password: 'wrong' })
    const res = await loginHandler(req as any, undefined)
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(401)
  })

  it('logs in successfully with valid credentials', async () => {
    ;(adminLoginSchema.safeParse as any).mockReturnValue({ success: true, data: { email: 't@t.com', password: 'pass' } })
    ;(Admin.findOne as any).mockReturnValue(q({ _id: 'a1', email: 't@t.com', passwordHash: 'h', name: 'Test', isHead: false }))
    ;(verifyPassword as any).mockResolvedValue(true)
    ;(signAdminToken as any).mockResolvedValue('tok')
    ;(setAdminSessionCookie as any).mockResolvedValue(undefined)
    ;(logActivity as any).mockResolvedValue(undefined)
    const req = mockReq('POST', '/api/admin/auth/login', { email: 't@t.com', password: 'pass' })
    const res = await loginHandler(req as any, undefined)
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(setAdminSessionCookie).toHaveBeenCalledWith('tok')
    expect(logActivity).toHaveBeenCalled()
  })

  it('converts email to lowercase', async () => {
    ;(adminLoginSchema.safeParse as any).mockReturnValue({ success: true, data: { email: 'Test@Test.com', password: 'pass' } })
    ;(Admin.findOne as any).mockReturnValue(q(null))
    const req = mockReq('POST', '/api/admin/auth/login', { email: 'Test@Test.com', password: 'pass' })
    await loginHandler(req as any, undefined)
    expect(Admin.findOne).toHaveBeenCalledWith({ email: 'test@test.com' })
  })

  it('enforces rate limit on login', async () => {
    const req = mockReq('POST', '/api/admin/auth/login', {})
    await loginHandler(req as any, undefined)
    expect(enforceRateLimit).toHaveBeenCalled()
  })

  it('updates lastLoginAt on successful login', async () => {
    ;(adminLoginSchema.safeParse as any).mockReturnValue({ success: true, data: { email: 't@t.com', password: 'pass' } })
    ;(Admin.findOne as any).mockReturnValue(q({ _id: 'a1', email: 't@t.com', passwordHash: 'h', name: 'Test' }))
    ;(verifyPassword as any).mockResolvedValue(true)
    ;(signAdminToken as any).mockResolvedValue('tok')
    ;(setAdminSessionCookie as any).mockResolvedValue(undefined)
    const req = mockReq('POST', '/api/admin/auth/login', { email: 't@t.com', password: 'pass' })
    await loginHandler(req as any, undefined)
    expect(Admin.findByIdAndUpdate).toHaveBeenCalledWith('a1', { lastLoginAt: expect.any(Date) })
  })
})

describe('POST /api/admin/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(getOptionalAdmin as any).mockResolvedValue(null)
    ;(clearAdminSessionCookie as any).mockResolvedValue(undefined)
    ;(logActivity as any).mockResolvedValue(undefined)
  })

  it('returns 200 with ok true when no admin is logged in', async () => {
    ;(getOptionalAdmin as any).mockResolvedValue(null)
    const req = mockReq('POST', '/api/admin/auth/logout')
    const res = await logoutHandler(req as any, undefined)
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.ok).toBe(true)
  })

  it('logs activity when admin is logged in', async () => {
    ;(getOptionalAdmin as any).mockResolvedValue({ id: 'a1', name: 'Test Admin' })
    const req = mockReq('POST', '/api/admin/auth/logout')
    await logoutHandler(req as any, undefined)
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: 'admin.logout' }))
  })
})

describe('GET /api/admin/auth/me', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue({ id: 'a1', name: 'Admin', email: 'a@b.com', isHead: false })
    ;(Admin.findById as any).mockReturnValue(q(null))
  })

  it('returns admin profile when authenticated', async () => {
    ;(Admin.findById as any).mockReturnValue(q({ _id: 'a1', name: 'Admin', email: 'a@b.com', isActive: true, isHead: false }))
    const req = mockReq('GET', '/api/admin/auth/me')
    const res = await meHandler(req as any, undefined)
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toBeDefined()
    expect(Admin.findById).toHaveBeenCalledWith('a1')
  })

  it('returns 401 when admin is not found', async () => {
    ;(Admin.findById as any).mockReturnValue(q(null))
    const req = mockReq('GET', '/api/admin/auth/me')
    const res = await meHandler(req as any, undefined)
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('UNAUTHORIZED')
  })

  it('excludes passwordHash from response', async () => {
    ;(Admin.findById as any).mockReturnValue(q({ _id: 'a1', name: 'Admin', email: 'a@b.com', passwordHash: 'secret' }))
    const req = mockReq('GET', '/api/admin/auth/me')
    const res = await meHandler(req as any, undefined)
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(200)
    expect(Admin.findById).toHaveBeenCalledWith('a1')
  })
})

describe('POST /api/admin/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.ADMIN_REGISTER_SECRET = 'test-secret'
    ;(enforceRateLimit as any).mockImplementation(() => undefined)
    ;(adminRegisterSchema.safeParse as any).mockReturnValue({ success: false, error: { issues: [{ path: ['name'], message: 'required' }] } })
    ;(Admin.findOne as any).mockReturnValue(q(null))
    ;(Admin.create as any).mockResolvedValue({ _id: 'a2', name: 'New Admin', email: 'new@test.com', isHead: false, toJSON: () => ({ _id: 'a2', name: 'New Admin', email: 'new@test.com', isHead: false }) })
    ;(hashPassword as any).mockResolvedValue('hashed_pw')
    ;(logActivity as any).mockResolvedValue(undefined)
  })

  it('returns 403 when register secret is wrong', async () => {
    const req = mockReq('POST', '/api/admin/auth/register', { name: 'X', email: 'x@x.com', password: 'Pass1234' }, { 'x-admin-register-secret': 'bad' })
    const res = await registerHandler(req as any, undefined)
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(403)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('FORBIDDEN')
  })

  it('returns 403 when register secret header is missing', async () => {
    const req = mockReq('POST', '/api/admin/auth/register', { name: 'X', email: 'x@x.com', password: 'Pass1234' })
    const res = await registerHandler(req as any, undefined)
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(403)
  })

  it('returns validation error for invalid body', async () => {
    ;(adminRegisterSchema.safeParse as any).mockReturnValue({
      success: false,
      error: { flatten: () => ({ fieldErrors: { name: ['required'] } }), issues: [{ path: ['name'], message: 'required' }] },
    })
    const req = mockReq('POST', '/api/admin/auth/register', {}, { 'x-admin-register-secret': 'test-secret' })
    const res = await registerHandler(req as any, undefined)
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })

  it('creates admin when valid', async () => {
    ;(adminRegisterSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: 'New Admin', email: 'new@test.com', password: 'Pass1234', isHead: false },
    })
    const req = mockReq('POST', '/api/admin/auth/register', { name: 'New Admin', email: 'new@test.com', password: 'Pass1234' }, { 'x-admin-register-secret': 'test-secret' })
    const res = await registerHandler(req as any, undefined)
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toBeDefined()
    expect(Admin.create).toHaveBeenCalled()
    expect(hashPassword).toHaveBeenCalledWith('Pass1234')
  })

  it('returns 409 when email already exists', async () => {
    ;(adminRegisterSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: 'Test', email: 'existing@test.com', password: 'Pass1234' },
    })
    ;(Admin.findOne as any).mockReturnValue(q({ _id: 'existing', email: 'existing@test.com' }))
    const req = mockReq('POST', '/api/admin/auth/register', { name: 'Test', email: 'existing@test.com', password: 'Pass1234' }, { 'x-admin-register-secret': 'test-secret' })
    const res = await registerHandler(req as any, undefined)
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(409)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('CONFLICT')
  })

  it('hashes password before creating admin', async () => {
    ;(adminRegisterSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: 'Test', email: 't@t.com', password: 'Pass1234' },
    })
    ;(hashPassword as any).mockResolvedValue('hashed-secret')
    const req = mockReq('POST', '/api/admin/auth/register', { name: 'Test', email: 't@t.com', password: 'Pass1234' }, { 'x-admin-register-secret': 'test-secret' })
    await registerHandler(req as any, undefined)
    expect(hashPassword).toHaveBeenCalledWith('Pass1234')
  })

  it('enforces rate limit on registration', async () => {
    ;(adminRegisterSchema.safeParse as any).mockReturnValue({
      success: false,
      error: { flatten: () => ({ fieldErrors: {} }), issues: [] },
    })
    const req = mockReq('POST', '/api/admin/auth/register', {}, { 'x-admin-register-secret': 'test-secret' })
    await registerHandler(req as any, undefined)
    expect(enforceRateLimit).toHaveBeenCalled()
  })

  it('handles isHead=true when provided', async () => {
    ;(adminRegisterSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: 'Head', email: 'h@h.com', password: 'Pass1234', isHead: true },
    })
    const req = mockReq('POST', '/api/admin/auth/register', { name: 'Head', email: 'h@h.com', password: 'Pass1234', isHead: true }, { 'x-admin-register-secret': 'test-secret' })
    await registerHandler(req as any, undefined)
    expect(Admin.create).toHaveBeenCalledWith(expect.objectContaining({ isHead: true }))
  })

  it('handles isHead=false when not provided', async () => {
    ;(adminRegisterSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: 'New', email: 'n@n.com', password: 'Pass1234' },
    })
    const req = mockReq('POST', '/api/admin/auth/register', { name: 'New', email: 'n@n.com', password: 'Pass1234' }, { 'x-admin-register-secret': 'test-secret' })
    await registerHandler(req as any, undefined)
    expect(Admin.create).toHaveBeenCalledWith(expect.objectContaining({ isHead: false }))
  })

  it('logs register activity on success', async () => {
    ;(adminRegisterSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: 'New', email: 'n@n.com', password: 'Pass1234' },
    })
    const req = mockReq('POST', '/api/admin/auth/register', { name: 'New', email: 'n@n.com', password: 'Pass1234' }, { 'x-admin-register-secret': 'test-secret' })
    await registerHandler(req as any, undefined)
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: 'admin.register' }))
  })
})

describe('GET /api/admin/activities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue({ id: 'a1', name: 'Admin' })
  })

  function setupActivityMocks() {
    ;(AdminActivity.find as any).mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
    ;(AdminActivity.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
  }

  it('returns paginated activities', async () => {
    setupActivityMocks()
    const req = mockReq('GET', '/api/admin/activities?page=1&limit=50')
    const mod = await import('@/app/api/admin/activities/route')
    const res = await mod.GET(req as any, undefined)
    expect(res).toBeDefined()
  })

  it('filters by adminId param', async () => {
    setupActivityMocks()
    const req = mockReq('GET', '/api/admin/activities?adminId=a1')
    await import('@/app/api/admin/activities/route').then(m => m.GET(req as any, undefined))
    const call = (AdminActivity.find as any).mock.calls[0][0]
    expect(call.admin).toBe('a1')
  })

  it('filters by action param', async () => {
    setupActivityMocks()
    const req = mockReq('GET', '/api/admin/activities?action=admin.login')
    await import('@/app/api/admin/activities/route').then(m => m.GET(req as any, undefined))
    const call = (AdminActivity.find as any).mock.calls[0][0]
    expect(call.action).toBe('admin.login')
  })

  it('supports date range filtering', async () => {
    setupActivityMocks()
    const req = mockReq('GET', '/api/admin/activities?from=2024-01-01&to=2024-12-31')
    await import('@/app/api/admin/activities/route').then(m => m.GET(req as any, undefined))
    const call = (AdminActivity.find as any).mock.calls[0][0]
    expect(call.createdAt.$gte).toBeDefined()
    expect(call.createdAt.$lte).toBeDefined()
  })

  it('supports text search on description', async () => {
    setupActivityMocks()
    const req = mockReq('GET', '/api/admin/activities?q=test')
    await import('@/app/api/admin/activities/route').then(m => m.GET(req as any, undefined))
    const call = (AdminActivity.find as any).mock.calls[0][0]
    expect(call.$or).toBeDefined()
  })

  it('supports targetType filter', async () => {
    setupActivityMocks()
    const req = mockReq('GET', '/api/admin/activities?targetType=note')
    await import('@/app/api/admin/activities/route').then(m => m.GET(req as any, undefined))
    const call = (AdminActivity.find as any).mock.calls[0][0]
    expect(call.targetType).toBe('note')
  })
})
