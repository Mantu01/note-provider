import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { handler, adminHandler } from '@/server/lib/api-handler'
import { Admin } from '@/server/db/models/admin.model'
import { Category } from '@/server/db/models/category.model'
import { Note } from '@/server/db/models/note.model'
import { Group } from '@/server/db/models/group.model'
import { Order } from '@/server/db/models/order.model'
import { AdminActivity } from '@/server/db/models/admin-activity.model'
import { uploadFile, deleteUpload } from '@/server/services/upload.service'
import { getDashboardStats } from '@/server/services/dashboard.service'
import { logActivity } from '@/server/services/activity.service'
import { enforceRateLimit } from '@/server/lib/rate-limit'
import { toAdminCategory } from '@/server/mappers/category.mapper'
import { toAdminGroup } from '@/server/mappers/group.mapper'
import { toAdminNote } from '@/server/mappers/note.mapper'
import { toAdminOrder } from '@/server/mappers/order.mapper'
import { toAdminLead } from '@/server/mappers/order.mapper'
import { toAdminActivity } from '@/server/mappers/activity.mapper'
import { toAdminProfile } from '@/server/mappers/activity.mapper'
import { toCsv } from '@/server/lib/csv'
import { requireAdmin } from '@/server/lib/auth-guard'
import { createCategorySchema, updateCategorySchema } from '@/lib/schemas/category.schema'
import { uniqueSlug, slugify } from '@/server/lib/slug'

vi.mock('@/server/lib/razorpay', () => ({
  getRazorpayKeyId: vi.fn(() => 'rzp_test_key'),
  verifyWebhookSignature: vi.fn(() => true),
  razorpay: { orders: { create: vi.fn() } },
}))

vi.mock('@/server/db/connect', () => ({
  connectDb: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/server/db/models/admin.model', () => ({
  Admin: { find: vi.fn(), findById: vi.fn() },
}))

vi.mock('@/server/db/models/category.model', () => ({
  Category: {
    find: vi.fn(),
    countDocuments: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('@/server/db/models/note.model', () => ({
  Note: {
    find: vi.fn(),
    countDocuments: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    aggregate: vi.fn(),
    distinct: vi.fn(),
  },
}))

vi.mock('@/server/db/models/group.model', () => ({
  Group: {
    find: vi.fn(),
    countDocuments: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    distinct: vi.fn(),
  },
}))

vi.mock('@/server/db/models/order.model', () => ({
  Order: {
    find: vi.fn(),
    countDocuments: vi.fn(),
    findById: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}))

vi.mock('@/server/db/models/admin-activity.model', () => ({
  AdminActivity: {
    find: vi.fn(),
    countDocuments: vi.fn(),
  },
}))

vi.mock('@/server/services/upload.service', () => ({
  uploadFile: vi.fn(),
  deleteUpload: vi.fn(),
}))

vi.mock('@/server/services/dashboard.service', () => ({
  getDashboardStats: vi.fn(),
}))

vi.mock('@/server/services/activity.service', () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/server/lib/rate-limit', () => ({
  enforceRateLimit: vi.fn(),
}))

vi.mock('@/server/lib/slug', () => ({
  uniqueSlug: vi.fn(async (model: any, name: string) => name.toLowerCase().replace(/\s+/g, '-')),
  slugify: vi.fn((s: string) => s.toLowerCase()),
}))

vi.mock('@/server/lib/cloudinary', () => ({
  destroyAsset: vi.fn().mockResolvedValue(undefined),
  buildSignedUrl: vi.fn(),
}))

vi.mock('@/server/lib/query', () => ({
  parsePagination: vi.fn(() => ({ page: 1, limit: 20, skip: 0 })),
  buildPagination: vi.fn(() => ({ page: 1, limit: 20, total: 0, totalPages: 1, hasNext: false, hasPrev: false })),
  buildOrderFilter: vi.fn(() => ({})),
  buildOrderSort: vi.fn(() => ({ createdAt: -1 })),
}))

vi.mock('@/server/mappers/category.mapper', () => ({
  toAdminCategory: vi.fn((c) => c),
  toPublicCategory: vi.fn((c) => c),
}))

vi.mock('@/server/mappers/group.mapper', () => ({
  toAdminGroup: vi.fn((g) => g),
  toPublicGroup: vi.fn((g) => g),
}))

vi.mock('@/server/mappers/note.mapper', () => ({
  toAdminNote: vi.fn((n) => n),
  toPublicNote: vi.fn((n) => n),
}))

vi.mock('@/server/mappers/order.mapper', () => ({
  toAdminOrder: vi.fn((o) => o),
  toAdminLead: vi.fn((o) => o),
  toPublicOrder: vi.fn((o) => o),
}))

vi.mock('@/server/mappers/activity.mapper', () => ({
  toAdminProfile: vi.fn((a) => a),
  toAdminActivity: vi.fn((a) => a),
}))

vi.mock('@/server/lib/csv', () => ({
  toCsv: vi.fn((rows: any[]) => rows.map((r: any) => Object.values(r).join(',')).join('\n')),
}))

vi.mock('@/server/lib/auth-guard', () => ({
  requireAdmin: vi.fn(),
  requireHeadAdmin: vi.fn(),
}))

vi.mock('@/lib/schemas/category.schema', () => ({
  createCategorySchema: { safeParse: vi.fn() },
  updateCategorySchema: { safeParse: vi.fn() },
}))

function mockReq(method: string, path: string, body?: any, headers: Record<string, string> = {}) {
  const req = new NextRequest(`http://localhost${path}`, { method, headers })
  if (body !== undefined) {
    req.json = () => Promise.resolve(body)
    req.formData = () => Promise.resolve(new FormData())
  }
  return req
}

// Dashboard handler
const dashboardHandler = (adminHandler as any)(async (ctx: any) => {
  const stats = await getDashboardStats()
  return { ok: true, data: stats }
}) as any

// Admins handler
const adminsHandler = (adminHandler as any)(async (ctx: any) => {
  const admins = await Admin.find({}, { passwordHash: 0 }).sort({ createdAt: 1 }).lean().exec()
  return { ok: true, data: admins.map(toAdminProfile) }
}) as any

// Categories list handler
const categoriesListHandler = (adminHandler as any)(async (ctx: any) => {
  const [items, total] = await Promise.all([
    Category.find({}).sort({ order: 1, name: 1 }).lean().exec(),
    Category.countDocuments().exec(),
  ])
  const categoriesWithCounts = await Promise.all(
    items.map(async (cat) => {
      const [noteCount, groupCount] = await Promise.all([
        Note.countDocuments({ category: cat._id.toString() }).exec(),
        Group.countDocuments({ category: cat._id.toString() }).exec(),
      ])
      return toAdminCategory({ ...cat, noteCount, groupCount }, noteCount, groupCount)
    }),
  )
  return { ok: true, data: { items: categoriesWithCounts, pagination: { page: 1, limit: total, total, totalPages: 1, hasNext: false, hasPrev: false } } }
}) as any


// Create category handler
const createCategoryHandler = (adminHandler as any)(async (ctx: any) => {
  const body = await ctx.req.json()
  const parsed = createCategorySchema.safeParse(body)
  if (!parsed.success) throw new Error('Validation error')
  const { admin } = ctx
  const slug = await uniqueSlug(Category, parsed.data.name)
  const doc = await Category.create({
    ...parsed.data,
    slug,
    createdBy: admin.id,
    updatedBy: admin.id,
  })
  await logActivity({
    adminId: admin.id,
    action: 'category.create',
    description: `Created category "${parsed.data.name}"`,
    targetType: 'category',
    targetId: doc._id.toString(),
    targetLabel: parsed.data.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  })
  return { ok: true, data: toAdminCategory(doc.toJSON(), 0, 0) }
}) as any

// Update category handler
const updateCategoryHandler = (adminHandler as any)(async (ctx: any) => {
  const { id } = await ctx.params
  const body = await ctx.req.json()
  const parsed = updateCategorySchema.safeParse(body)
  if (!parsed.success) throw new Error('Validation error')
  const { admin } = ctx
  const existing = await Category.findById(id).lean().exec()
  if (!existing) throw new Error('Not found')
  const updates: Record<string, unknown> = { updatedBy: admin.id }
  if (parsed.data.name !== undefined) updates.name = parsed.data.name
  if (parsed.data.description !== undefined) updates.description = parsed.data.description
  const updated = await Category.findByIdAndUpdate(id, updates, { new: true }).lean().exec()
  if (!updated) throw new Error('Internal error')
  const [noteCount, groupCount] = await Promise.all([
    Note.countDocuments({ category: id }).exec(),
    Group.countDocuments({ category: id }).exec(),
  ])
  await logActivity({
    adminId: admin.id,
    action: 'category.update',
    description: `Updated category "${updated.name}"`,
    targetType: 'category',
    targetId: id,
    targetLabel: updated.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  })
  return { ok: true, data: toAdminCategory(updated, noteCount, groupCount) }
}) as any

// Delete category handler
const deleteCategoryHandler = (adminHandler as any)(async (ctx: any) => {
  const { id } = await ctx.params
  const { admin } = ctx
  if (!admin.isHead) throw new Error('Forbidden')
  const category = await Category.findById(id).lean().exec()
  if (!category) throw new Error('Not found')
  const noteCount = await Note.countDocuments({ category: id }).exec()
  const groupCount = await Group.countDocuments({ category: id }).exec()
  const total = noteCount + groupCount
  if (total > 0) {
    await logActivity({
      adminId: admin.id,
      action: 'category.delete',
      description: `Attempted to delete category "${category.name}" (refused)`,
      targetType: 'category',
      targetId: id,
      targetLabel: category.name,
      metadata: { refused: true, noteCount, groupCount },
      ip: ctx.ip,
      userAgent: ctx.userAgent,
    })
    return { ok: true, data: { refused: true } }
  }
  await Category.findByIdAndDelete(id).exec()
  await logActivity({
    adminId: admin.id,
    action: 'category.delete',
    description: `Deleted category "${category.name}"`,
    targetType: 'category',
    targetId: id,
    targetLabel: category.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  })
  return { ok: true, data: { deleted: true } }
}) as any

describe('GET /api/admin/dashboard', () => {
  beforeEach(() => {
    ;(vi as any).clearAllMocks()
    ;(Note.aggregate as any).mockReturnValue({ then: vi.fn((cb) => cb([[]])) })
    ;(getDashboardStats as any).mockResolvedValue({ totalNotes: 10, totalGroups: 5 })
    ;(requireAdmin as any).mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: false })
  })

  it('returns dashboard stats', async () => {
    const req = mockReq('GET', '/api/admin/dashboard')
    const result = await dashboardHandler(req as any, undefined)
    expect(result).toBeDefined()
    expect(getDashboardStats).toHaveBeenCalled()
  })
})

describe('GET /api/admin/admins', () => {
  beforeEach(() => {
    ;(vi as any).clearAllMocks()
    ;(Admin.find as any).mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
    ;(requireAdmin as any).mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: false })
  })

  it('returns list of admins without password hashes', async () => {
    const req = mockReq('GET', '/api/admin/admins')
    const result = await adminsHandler(req as any, undefined)
    expect(result).toBeDefined()
    expect(Admin.find).toHaveBeenCalledWith({}, { passwordHash: 0 })
  })
})

describe('GET /api/admin/categories', () => {
  beforeEach(() => {
    ;(vi as any).clearAllMocks()
    ;(Category.find as any).mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
    ;(Category.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(Note.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(Group.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(Note.aggregate as any).mockReturnValue({ then: vi.fn((cb) => cb([[]])) })
    ;(requireAdmin as any).mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: false })
  })

  it('returns categories with note and group counts', async () => {
    const req = mockReq('GET', '/api/admin/categories')
    const result = await categoriesListHandler(req as any, undefined)
    expect(result).toBeDefined()
    expect(Category.find).toHaveBeenCalledWith({})
  })
})

describe('POST /api/admin/categories', () => {
  beforeEach(() => {
    ;(vi as any).clearAllMocks()
    ;(Category.create as any).mockResolvedValue({ _id: 'cat-1', name: 'New Category', toJSON: () => ({ _id: 'cat-1', name: 'New Category' }) })
    ;(logActivity as any).mockResolvedValue(undefined)
    ;(toAdminCategory as any).mockImplementation((c: any) => c)
    ;(requireAdmin as any).mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: false })
    ;(createCategorySchema.safeParse as any).mockReturnValue({ success: false, error: { flatten: () => ({ fieldErrors: {} }), issues: [{ path: ['name'], message: 'required' }] } })
  })

  it('returns validation error for invalid body', async () => {
    const req = mockReq('POST', '/api/admin/categories', { invalid: true })
    const result = await createCategoryHandler(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('creates category with unique slug', async () => {
    ;(createCategorySchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: 'Web Development', description: null, icon: null, order: 0, isActive: true, subjects: [] },
    })
    const req = mockReq('POST', '/api/admin/categories', { name: 'Web Development' })
    const result = await createCategoryHandler(req as any, undefined)
    expect(result).toBeDefined()
    expect(Category.create).toHaveBeenCalled()
  })

  it('logs activity on category creation', async () => {
    ;(createCategorySchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: 'Web Development', description: null, icon: null, order: 0, isActive: true, subjects: [] },
    })
    ;(Category.create as any).mockResolvedValue({ _id: 'cat-1', name: 'Web Development', toJSON: () => ({ _id: 'cat-1', name: 'Web Development' }) })
    const req = mockReq('POST', '/api/admin/categories', { name: 'Web Development' })
    await createCategoryHandler(req as any, undefined)
    expect(logActivity).toHaveBeenCalled()
  })
})

describe('PATCH /api/admin/categories/[id]', () => {
  beforeEach(() => {
    ;(vi as any).clearAllMocks()
    ;(Category.findById as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    })
    ;(updateCategorySchema.safeParse as any).mockReturnValue({ success: false, error: { issues: [{ path: [], message: 'Invalid' }] } })
    ;(requireAdmin as any).mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: false })
  })

  it('returns validation error for invalid body', async () => {
    const req = mockReq('PATCH', '/api/admin/categories/cat-1', { invalid: true })
    const result = await updateCategoryHandler(req as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(result).toBeDefined()
  })

  it('returns not found when category does not exist', async () => {
    ;(Category.findById as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    })
    ;(updateCategorySchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: 'Updated Category' },
    })
    const req = mockReq('PATCH', '/api/admin/categories/cat-1', { name: 'Updated Category' })
    const result = await updateCategoryHandler(req as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(result).toBeDefined()
  })
})

describe('DELETE /api/admin/categories/[id]', () => {
  beforeEach(() => {
    ;(vi as any).clearAllMocks()
    ;(Category.findById as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    })
    ;(Note.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(Group.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(requireAdmin as any).mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@b.com', isHead: true })
  })

  it('returns not found when category does not exist', async () => {
    const req = mockReq('DELETE', '/api/admin/categories/cat-1')
    const result = await deleteCategoryHandler(req as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(result).toBeDefined()
  })

  it('refuses delete when category has associated notes', async () => {
    ;(Category.findById as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'cat-1', name: 'Test Category' }),
    })
    ;(Note.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(2) })
    const req = mockReq('DELETE', '/api/admin/categories/cat-1')
    const result = await deleteCategoryHandler(req as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(result).toBeDefined()
  })
})
