import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Category } from '@/server/db/models/category.model'
import { Note } from '@/server/db/models/note.model'
import { Group } from '@/server/db/models/group.model'
import { logActivity } from '@/server/services/activity.service'
import { toAdminCategory } from '@/server/mappers/category.mapper'
import { updateCategorySchema } from '@/lib/schemas/category.schema'
import { requireAdmin } from '@/server/lib/auth-guard'
import { AppError } from '@/server/lib/errors'

vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/category.model', () => ({
  Category: { findById: vi.fn(), findByIdAndUpdate: vi.fn(), findByIdAndDelete: vi.fn() },
}))
vi.mock('@/server/db/models/note.model', () => ({ Note: { countDocuments: vi.fn(), findById: vi.fn() } }))
vi.mock('@/server/db/models/group.model', () => ({ Group: { countDocuments: vi.fn() } }))
vi.mock('@/server/services/activity.service', () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/server/mappers/category.mapper', () => ({
  toAdminCategory: vi.fn((c: any, nc?: number, gc?: number) => ({ ...c, noteCount: nc ?? 0, groupCount: gc ?? 0 })),
}))
vi.mock('@/lib/schemas/category.schema', () => ({
  updateCategorySchema: { safeParse: vi.fn() },
}))
vi.mock('@/server/lib/auth-guard', () => ({
  requireAdmin: vi.fn(),
}))
vi.mock('@/server/lib/slug', () => ({
  slugify: vi.fn((s: string) => s.toLowerCase()),
}))

const ADMIN = { id: 'a1', name: 'Admin', email: 'a@b.com', isHead: false }
const HEAD_ADMIN = { ...ADMIN, isHead: true }

function makeChain(val: unknown) {
  return {
    populate: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(val),
  }
}

function mockReq(method: string, path: string, body?: unknown) {
  const req = new NextRequest(`http://localhost${path}`, { method })
  if (body !== undefined) {
    req.headers.set('content-type', 'application/json')
    req.json = () => Promise.resolve(body as any)
  }
  return req
}

describe('PATCH /api/admin/categories/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    ;(updateCategorySchema.safeParse as any).mockReturnValue({ success: false, error: { issues: [{ path: ['name'], message: 'required' }] } })
    ;(Category.findById as any).mockReturnValue(makeChain(null))
  })

  it('returns validation error for invalid body', async () => {
    const mod = await import('@/app/api/admin/categories/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/categories/cat-1', { invalid: true }) as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(res.status).toBe(400)
  })

  it('returns 404 when category does not exist', async () => {
    ;(updateCategorySchema.safeParse as any).mockReturnValue({ success: true, data: { name: 'Updated Category' } })
    const mod = await import('@/app/api/admin/categories/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/categories/cat-1', { name: 'Updated Category' }) as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(res.status).toBe(404)
  })

  it('updates category fields successfully', async () => {
    ;(updateCategorySchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: 'New Name', description: 'New desc', isActive: true },
    })
    const existing = { _id: 'cat-1', name: 'Old Name', subjects: [] }
    const updated = { ...existing, name: 'New Name', description: 'New desc', isActive: true }
    ;(Category.findById as any).mockReturnValue(makeChain(existing))
    ;(Category.findByIdAndUpdate as any).mockReturnValue(makeChain(updated))
    ;(Note.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(Group.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    const mod = await import('@/app/api/admin/categories/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/categories/cat-1', { name: 'New Name', description: 'New desc', isActive: true }) as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(res.status).toBe(200)
    expect(Category.findByIdAndUpdate).toHaveBeenCalledWith('cat-1', expect.objectContaining({ name: 'New Name' }), expect.anything())
  })

  it('logs activity on successful update', async () => {
    ;(updateCategorySchema.safeParse as any).mockReturnValue({ success: true, data: { name: 'Updated Cat' } })
    const updatedNote = { _id: 'cat-1', name: 'Updated Cat' }
    ;(Category.findById as any).mockReturnValue(makeChain(updatedNote))
    ;(Category.findByIdAndUpdate as any).mockReturnValue(makeChain(updatedNote))
    ;(Note.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(Group.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    const mod = await import('@/app/api/admin/categories/[id]/route')
    await mod.PATCH(mockReq('PATCH', '/api/admin/categories/cat-1', { name: 'Updated Cat' }) as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: 'category.update' }))
  })

  it('handles icon field update', async () => {
    ;(updateCategorySchema.safeParse as any).mockReturnValue({ success: true, data: { icon: 'book' } })
    const existing = { _id: 'cat-1', name: 'Cat', subjects: [] }
    const updated = { ...existing, icon: 'book' }
    ;(Category.findById as any).mockReturnValue(makeChain(existing))
    ;(Category.findByIdAndUpdate as any).mockReturnValue(makeChain(updated))
    ;(Note.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(Group.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    const mod = await import('@/app/api/admin/categories/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/categories/cat-1', { icon: 'book' }) as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(res.status).toBe(200)
  })

  it('handles order field update', async () => {
    ;(updateCategorySchema.safeParse as any).mockReturnValue({ success: true, data: { order: 5 } })
    const existing = { _id: 'cat-1', name: 'Cat', subjects: [] }
    const updated = { ...existing, order: 5 }
    ;(Category.findById as any).mockReturnValue(makeChain(existing))
    ;(Category.findByIdAndUpdate as any).mockReturnValue(makeChain(updated))
    ;(Note.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(Group.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    const mod = await import('@/app/api/admin/categories/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/categories/cat-1', { order: 5 }) as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(res.status).toBe(200)
  })

  it('returns internal error when update fails', async () => {
    ;(updateCategorySchema.safeParse as any).mockReturnValue({ success: true, data: { name: 'X' } })
    ;(Category.findById as any).mockReturnValue(makeChain({ _id: 'cat-1', name: 'X' }))
    ;(Category.findByIdAndUpdate as any).mockReturnValue(makeChain(null))
    const mod = await import('@/app/api/admin/categories/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/categories/cat-1', { name: 'X' }) as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(res.status).toBe(500)
  })
})

describe('DELETE /api/admin/categories/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    ;(Category.findById as any).mockReturnValue(makeChain(null))
    ;(Note.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(Group.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
  })

  it('returns not found when category does not exist', async () => {
    const mod = await import('@/app/api/admin/categories/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/categories/cat-1') as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(res.status).toBe(404)
  })

  it('refuses delete when category has associated notes', async () => {
    ;(Category.findById as any).mockReturnValue(makeChain({ _id: 'cat-1', name: 'Test Category' }))
    ;(Note.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(2) })
    const mod = await import('@/app/api/admin/categories/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/categories/cat-1') as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.refused).toBe(true)
  })

  it('refuses delete when category has associated groups', async () => {
    ;(Category.findById as any).mockReturnValue(makeChain({ _id: 'cat-1', name: 'Cat' }))
    ;(Note.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(Group.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(1) })
    const mod = await import('@/app/api/admin/categories/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/categories/cat-1') as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.refused).toBe(true)
  })

  it('returns forbidden for non-head admin', async () => {
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    ;(Category.findById as any).mockReturnValue(makeChain({ _id: 'cat-1', name: 'Cat' }))
    const mod = await import('@/app/api/admin/categories/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/categories/cat-1') as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(res.status).toBe(403)
  })

  it('deletes category when no associations', async () => {
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    ;(Category.findById as any).mockReturnValue(makeChain({ _id: 'cat-1', name: 'Empty Cat' }))
    ;(Note.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(Group.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(Category.findByIdAndDelete as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({}) })
    const mod = await import('@/app/api/admin/categories/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/categories/cat-1') as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.deleted).toBe(true)
    expect(Category.findByIdAndDelete).toHaveBeenCalledWith('cat-1')
  })

  it('refusal logs activity with metadata', async () => {
    ;(Category.findById as any).mockReturnValue(makeChain({ _id: 'cat-1', name: 'Test Category' }))
    ;(Note.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(3) })
    ;(Group.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(1) })
    const mod = await import('@/app/api/admin/categories/[id]/route')
    await mod.DELETE(mockReq('DELETE', '/api/admin/categories/cat-1') as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: 'category.delete' }))
    const call = (logActivity as any).mock.calls[0][0]
    expect(call.metadata).toBeDefined()
    expect(call.metadata.refused).toBe(true)
  })

  it('success delete logs activity', async () => {
    ;(Category.findById as any).mockReturnValue(makeChain({ _id: 'cat-1', name: 'Deleted Cat' }))
    ;(Note.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(Group.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(Category.findByIdAndDelete as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({}) })
    const mod = await import('@/app/api/admin/categories/[id]/route')
    await mod.DELETE(mockReq('DELETE', '/api/admin/categories/cat-1') as any, { params: Promise.resolve({ id: 'cat-1' }) })
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: 'category.delete', description: 'Deleted category "Deleted Cat"' }))
  })

  it('includes conflict message in refusal response', async () => {
    ;(Category.findById as any).mockReturnValue(makeChain({ _id: 'cat-1', name: 'Cat' }))
    ;(Note.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(2) })
    ;(Group.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    const mod = await import('@/app/api/admin/categories/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/categories/cat-1') as any, { params: Promise.resolve({ id: 'cat-1' }) })
    const json = await res.json()
    expect(json.data.conflictMessage).toBeDefined()
    expect(json.data.conflictMessage).toContain('2 notes')
  })
})
