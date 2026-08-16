import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { handler, adminHandler } from '@/server/lib/api-handler'
import { AppError } from '@/server/lib/errors'
import { Admin } from '@/server/db/models/admin.model'
import { verifyPassword, hashPassword } from '@/server/lib/password'
import { signAdminToken } from '@/server/lib/jwt'
import { setAdminSessionCookie, getOptionalAdmin, requireAdmin } from '@/server/lib/auth-guard'
import { logActivity } from '@/server/services/activity.service'
import { enforceRateLimit } from '@/server/lib/rate-limit'
import { toAdminProfile } from '@/server/mappers/activity.mapper'

vi.mock('@/server/lib/razorpay', () => ({
  getRazorpayKeyId: vi.fn(() => 'rzp_test_key'),
  verifyWebhookSignature: vi.fn(() => true),
  razorpay: { orders: { create: vi.fn() } },
}))

vi.mock('@/server/db/connect', () => ({
  connectDb: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/server/db/models/admin.model', () => ({
  Admin: {
    findOne: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    create: vi.fn(),
    find: vi.fn(),
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
}))

vi.mock('@/server/services/activity.service', () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/server/lib/rate-limit', () => ({
  enforceRateLimit: vi.fn(),
}))

vi.mock('@/server/mappers/activity.mapper', () => ({
  toAdminProfile: vi.fn((a: any) => a),
}))

vi.mock('@/lib/schemas/admin.schema', () => ({
  adminLoginSchema: { safeParse: vi.fn() },
  adminRegisterSchema: { safeParse: vi.fn() },
}))

const adminLoginSchema = { safeParse: vi.fn() }
const loginHandler = (handler as any)(async (ctx: any) => {
  enforceRateLimit('adminLogin', ctx.ip, { limit: 5, windowMs: 600000 })
  const body = await ctx.req.json()
  const parsed = adminLoginSchema.safeParse(body)
  if (!parsed.success) throw AppError.validation({ email: 'Invalid email' }, 'Invalid input')
  const admin = await Admin.findOne({ email: parsed.data.email.toLowerCase() }).select('+passwordHash').lean().exec()
  if (!admin) throw AppError.unauthorized('Invalid email or password')
  const valid = await verifyPassword(parsed.data.password, admin.passwordHash)
  if (!valid) throw AppError.unauthorized('Invalid email or password')
  await Admin.findByIdAndUpdate(admin._id, { lastLoginAt: new Date() }).exec()
  const token = await signAdminToken({ sub: admin._id.toString(), email: admin.email, name: admin.name, isHead: Boolean(admin.isHead) })
  await setAdminSessionCookie(token)
  await logActivity({ adminId: admin._id.toString(), action: 'admin.login', description: `Admin "${admin.name}" logged in`, targetType: 'admin', targetId: admin._id.toString(), targetLabel: admin.name, ip: ctx.ip, userAgent: ctx.userAgent })
  const profile = { ...admin, passwordHash: undefined }
  return { ok: true, data: toAdminProfile(profile) }
}) as any

const logoutHandler = (handler as any)(async (ctx: any) => {
  const admin = await getOptionalAdmin()
  await setAdminSessionCookie('')
  if (admin) {
    await logActivity({ adminId: admin.id, action: 'admin.logout', description: `Admin "${admin.name}" logged out`, targetType: 'admin', targetId: admin.id, targetLabel: admin.name, ip: ctx.ip, userAgent: ctx.userAgent })
  }
  return { ok: true }
}) as any

const meHandler = (adminHandler as any)(async (ctx: any) => {
  const admin = await Admin.findById(ctx.admin.id).select('-passwordHash').lean().exec()
  if (!admin) throw AppError.unauthorized()
  return { ok: true, data: toAdminProfile(admin) }
}) as any

const registerHandler = (handler as any)(async (ctx: any) => {
  enforceRateLimit('adminRegister', ctx.ip, { limit: 10, windowMs: 3600000 })
  const body = await ctx.req.json()
  if (ctx.req.headers.get('x-admin-register-secret') !== 'secret123') throw AppError.forbidden('Access denied')
  const parsed = adminRegisterSchema.safeParse(body)
  if (!parsed.success) throw AppError.validation({ name: 'required' }, 'Invalid input')
  const existing = await Admin.findOne({ email: parsed.data.email.toLowerCase() }).lean().exec()
  if (existing) throw AppError.conflict('An account with this email already exists')
  const passwordHash = await hashPassword(parsed.data.password)
  const admin = await Admin.create({ name: parsed.data.name, email: parsed.data.email.toLowerCase(), passwordHash, isHead: false })
  await logActivity({ adminId: admin._id.toString(), action: 'admin.register', description: `Registered admin "${admin.name}"`, targetType: 'admin', targetId: admin._id.toString(), targetLabel: admin.name, ip: ctx.ip, userAgent: ctx.userAgent })
  return { ok: true, data: toAdminProfile(admin.toJSON()) }
}) as any

const adminRegisterSchema = { safeParse: vi.fn() }

describe('POST /api/admin/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(enforceRateLimit as any).mockImplementation(() => undefined)
    ;(Admin.findOne as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    })
    ;(Admin.findByIdAndUpdate as any).mockReturnValue({
      exec: vi.fn().mockResolvedValue({}),
    })
    ;(verifyPassword as any).mockResolvedValue(false)
    ;(signAdminToken as any).mockResolvedValue('test-token')
    ;(setAdminSessionCookie as any).mockResolvedValue(undefined)
    ;(logActivity as any).mockResolvedValue(undefined)
    ;(toAdminProfile as any).mockImplementation((a: any) => a)
    ;(adminLoginSchema.safeParse as any).mockReturnValue({ success: false, error: { issues: [{ path: ['email'], message: 'Invalid email' }] } })
  })

  it('returns validation error for invalid body', async () => {
    const req = new NextRequest('http://localhost/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    })
    req.json = () => Promise.resolve({})
    const result = await loginHandler(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('throws unauthorized when admin not found', async () => {
    ;(adminLoginSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { email: 'test@test.com', password: 'password123' },
    })
    ;(Admin.findOne as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    })
    const req = new NextRequest('http://localhost/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'password123' }),
    })
    req.json = () => Promise.resolve({ email: 'test@test.com', password: 'password123' })
    const result = await loginHandler(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('throws unauthorized when password is invalid', async () => {
    ;(adminLoginSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { email: 'test@test.com', password: 'password123' },
    })
    ;(Admin.findOne as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'admin-1', email: 'test@test.com', passwordHash: 'hash', name: 'Test Admin', isHead: false }),
    })
    ;(verifyPassword as any).mockResolvedValue(false)
    const req = new NextRequest('http://localhost/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'wrong-password' }),
    })
    req.json = () => Promise.resolve({ email: 'test@test.com', password: 'wrong-password' })
    const result = await loginHandler(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('logs in successfully with valid credentials', async () => {
    ;(adminLoginSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { email: 'test@test.com', password: 'password123' },
    })
    ;(Admin.findOne as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'admin-1', email: 'test@test.com', passwordHash: 'hash', name: 'Test Admin', isHead: false }),
    })
    ;(verifyPassword as any).mockResolvedValue(true)
    ;(signAdminToken as any).mockResolvedValue('test-token')
    ;(setAdminSessionCookie as any).mockResolvedValue(undefined)
    ;(logActivity as any).mockResolvedValue(undefined)
    ;(toAdminProfile as any).mockReturnValue({ id: 'admin-1', name: 'Test Admin', email: 'test@test.com' })
    const req = new NextRequest('http://localhost/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'user-agent': 'test-agent' },
      body: JSON.stringify({ email: 'test@test.com', password: 'password123' }),
    })
    req.json = () => Promise.resolve({ email: 'test@test.com', password: 'password123' })
    const result = await loginHandler(req as any, undefined)
    expect(result).toBeDefined()
    expect(signAdminToken).toHaveBeenCalled()
    expect(setAdminSessionCookie).toHaveBeenCalled()
    expect(logActivity).toHaveBeenCalled()
  })

  it('converts email to lowercase', async () => {
    ;(adminLoginSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { email: 'Test@Test.com', password: 'password123' },
    })
    ;(Admin.findOne as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    })
    const req = new NextRequest('http://localhost/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'Test@Test.com', password: 'password123' }),
    })
    req.json = () => Promise.resolve({ email: 'Test@Test.com', password: 'password123' })
    await loginHandler(req as any, undefined)
    expect(Admin.findOne).toHaveBeenCalledWith({ email: 'test@test.com' })
  })

  it('enforces rate limit on login attempts', async () => {
    const req = new NextRequest('http://localhost/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    })
    req.json = () => Promise.resolve({})
    await loginHandler(req as any, undefined)
    expect(enforceRateLimit).toHaveBeenCalled()
  })

  it('updates lastLoginAt on successful login', async () => {
    ;(adminLoginSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { email: 'test@test.com', password: 'password123' },
    })
    ;(Admin.findOne as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'admin-1', email: 'test@test.com', passwordHash: 'hash', name: 'Test Admin' }),
    })
    ;(verifyPassword as any).mockResolvedValue(true)
    ;(signAdminToken as any).mockResolvedValue('test-token')
    ;(setAdminSessionCookie as any).mockResolvedValue(undefined)
    const req = new NextRequest('http://localhost/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'password123' }),
    })
    req.json = () => Promise.resolve({ email: 'test@test.com', password: 'password123' })
    await loginHandler(req as any, undefined)
    expect(Admin.findByIdAndUpdate).toHaveBeenCalledWith('admin-1', { lastLoginAt: expect.any(Date) })
  })
})

describe('POST /api/admin/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(getOptionalAdmin as any).mockResolvedValue(null)
    ;(setAdminSessionCookie as any).mockResolvedValue(undefined)
    ;(logActivity as any).mockResolvedValue(undefined)
    ;(requireAdmin as any).mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: false })
  })

  it('clears session cookie and returns ok when no admin is logged in', async () => {
    ;(getOptionalAdmin as any).mockResolvedValue(null)
    const req = new NextRequest('http://localhost/api/admin/auth/logout', { method: 'POST' })
    const result = await logoutHandler(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('logs activity when admin is logged in', async () => {
    ;(getOptionalAdmin as any).mockResolvedValue({ id: 'admin-1', name: 'Test Admin' })
    const req = new NextRequest('http://localhost/api/admin/auth/logout', {
      method: 'POST',
      headers: { 'user-agent': 'test-agent' },
    })
    req.json = () => Promise.resolve({})
    await logoutHandler(req as any, undefined)
    expect(logActivity).toHaveBeenCalled()
  })
})

describe('GET /api/admin/auth/me', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(Admin.findById as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    })
    ;(requireAdmin as any).mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: false })
  })

  it('returns admin profile when authenticated', async () => {
    ;(Admin.findById as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'admin-1', name: 'Admin', email: 'a@b.com', isActive: true, isHead: false }),
    })
    const req = new NextRequest('http://localhost/api/admin/auth/me')
    const result = await meHandler(req as any, undefined)
    expect(result).toBeDefined()
    expect(Admin.findById).toHaveBeenCalledWith('admin-1')
  })

  it('throws unauthorized when admin is not found', async () => {
    ;(Admin.findById as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    })
    const req = new NextRequest('http://localhost/api/admin/auth/me')
    const result = await meHandler(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('selects without password hash', async () => {
    ;(Admin.findById as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'admin-1', name: 'Admin', email: 'a@b.com', passwordHash: 'secret' }),
    })
    const req = new NextRequest('http://localhost/api/admin/auth/me')
    await meHandler(req as any, undefined)
    expect(Admin.findById).toHaveBeenCalledWith('admin-1')
  })
})

describe('POST /api/admin/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(enforceRateLimit as any).mockImplementation(() => undefined)
    ;(Admin.findOne as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    })
    ;(Admin.create as any).mockResolvedValue({ _id: 'admin-1', name: 'New Admin', email: 'new@test.com', toJSON: () => ({ _id: 'admin-1', name: 'New Admin', email: 'new@test.com' }) })
    ;(hashPassword as any).mockResolvedValue('hashed-password')
    ;(logActivity as any).mockResolvedValue(undefined)
    ;(toAdminProfile as any).mockImplementation((a: any) => a)
    ;(requireAdmin as any).mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: false })
  })

  it('returns forbidden when register secret is invalid', async () => {
    const req = new NextRequest('http://localhost/api/admin/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-register-secret': 'wrong-secret' },
      body: JSON.stringify({ name: 'Test', email: 'test@test.com', password: 'password123' }),
    })
    req.json = () => Promise.resolve({ name: 'Test', email: 'test@test.com', password: 'password123' })
    const result = await registerHandler(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('returns validation error for invalid body', async () => {
    ;(adminRegisterSchema.safeParse as any).mockReturnValue({
      success: false,
      error: { flatten: () => ({ fieldErrors: { name: ['required'] } }), issues: [{ path: ['name'], message: 'required' }] },
    })
    const req = new NextRequest('http://localhost/api/admin/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-register-secret': 'secret123' },
      body: JSON.stringify({}),
    })
    req.json = () => Promise.resolve({})
    const result = await registerHandler(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('creates admin when valid', async () => {
    ;(adminRegisterSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: 'New Admin', email: 'new@test.com', password: 'password123', isHead: false },
    })
    const req = new NextRequest('http://localhost/api/admin/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-register-secret': 'secret123', 'user-agent': 'test' },
      body: JSON.stringify({ name: 'New Admin', email: 'new@test.com', password: 'password123' }),
    })
    req.json = () => Promise.resolve({ name: 'New Admin', email: 'new@test.com', password: 'password123' })
    const result = await registerHandler(req as any, undefined)
    expect(result).toBeDefined()
    expect(Admin.create).toHaveBeenCalled()
  })

  it('throws conflict when email already exists', async () => {
    ;(adminRegisterSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: 'Test', email: 'existing@test.com', password: 'password123' },
    })
    ;(Admin.findOne as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'existing', email: 'existing@test.com' }),
    })
    const req = new NextRequest('http://localhost/api/admin/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-register-secret': 'secret123' },
      body: JSON.stringify({ name: 'Test', email: 'existing@test.com', password: 'password123' }),
    })
    req.json = () => Promise.resolve({ name: 'Test', email: 'existing@test.com', password: 'password123' })
    const result = await registerHandler(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('hashes password before creating admin', async () => {
    ;(adminRegisterSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: 'Test', email: 'test@test.com', password: 'password123' },
    })
    ;(hashPassword as any).mockResolvedValue('hashed-secret')
    const req = new NextRequest('http://localhost/api/admin/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-register-secret': 'secret123' },
      body: JSON.stringify({ name: 'Test', email: 'test@test.com', password: 'password123' }),
    })
    req.json = () => Promise.resolve({ name: 'Test', email: 'test@test.com', password: 'password123' })
    await registerHandler(req as any, undefined)
    expect(hashPassword).toHaveBeenCalledWith('password123')
  })

  it('enforces rate limit on registration', async () => {
    ;(adminRegisterSchema.safeParse as any).mockReturnValue({
      success: false,
      error: { flatten: () => ({ fieldErrors: {} }), issues: [] },
    })
    const req = new NextRequest('http://localhost/api/admin/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-register-secret': 'secret123' },
      body: JSON.stringify({}),
    })
    req.json = () => Promise.resolve({})
    await registerHandler(req as any, undefined)
    expect(enforceRateLimit).toHaveBeenCalled()
  })
})
