import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Group } from '@/server/db/models/group.model'
import { Note } from '@/server/db/models/note.model'
import { logActivity } from '@/server/services/activity.service'
import { toAdminGroup } from '@/server/mappers/group.mapper'
import { updateGroupSchema } from '@/lib/schemas/group.schema'
import { requireAdmin } from '@/server/lib/auth-guard'
import { Types } from 'mongoose'

vi.mock('@/server/db/connect', () => ({ connectDB: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/group.model', () => ({
  Group: { findById: vi.fn(), findByIdAndUpdate: vi.fn(), findByIdAndDelete: vi.fn() },
}))
vi.mock('@/server/db/models/note.model', () => ({ Note: { find: vi.fn() } }))
vi.mock('@/server/services/activity.service', () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/server/mappers/group.mapper', () => ({
  toAdminGroup: vi.fn((g: any) => g),
}))
vi.mock('@/lib/schemas/group.schema', () => ({
  updateGroupSchema: { safeParse: vi.fn() },
}))
vi.mock('@/server/lib/auth-guard', () => ({
  requireAdmin: vi.fn(),
}))
vi.mock('@/lib/format', () => ({
  rupeesToPaise: vi.fn((n: number) => n * 100),
}))

const ADMIN = { id: 'a1', name: 'Admin', email: 'a@b.com', isHead: false }
const HEAD_ADMIN = { ...ADMIN, isHead: true }

function makeChain(val: unknown) {
  return {
    populate: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
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

describe('GET /api/admin/groups/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
  })

  it('returns group with populated relations', async () => {
    const group = { _id: 'g1', name: 'Bundle', category: { _id: 'c1', name: 'Dev' } }
    ;(Group.findById as any).mockReturnValue(makeChain(group))
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/groups/g1') as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(Group.findById).toHaveBeenCalledWith('g1')
  })

  it('returns 404 when group not found', async () => {
    ;(Group.findById as any).mockReturnValue(makeChain(null))
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/groups/missing') as any, { params: Promise.resolve({ id: 'missing' }) })
    expect(res.status).toBe(404)
  })

  it('populates createdBy field', async () => {
    ;(Group.findById as any).mockReturnValue(makeChain({ _id: 'g1' }))
    const mod = await import('@/app/api/admin/groups/[id]/route')
    await mod.GET(mockReq('GET', '/api/admin/groups/g1') as any, { params: Promise.resolve({ id: 'g1' }) })
    const callArgs = (Group.findById as any).mock.calls[0]
    expect(callArgs[0]).toBe('g1')
  })
})

describe('PATCH /api/admin/groups/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    ;(updateGroupSchema.safeParse as any).mockReturnValue({ success: false, error: { issues: [{ path: ['name'], message: 'required' }] } })
    ;(Group.findById as any).mockReturnValue(makeChain(null))
  })

  it('returns validation error for invalid body', async () => {
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/groups/g1', { invalid: true }) as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(400)
  })

  it('returns not found when group does not exist', async () => {
    ;(updateGroupSchema.safeParse as any).mockReturnValue({ success: true, data: { name: 'Updated' } })
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/groups/g1', { name: 'Updated' }) as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(404)
  })

  it('updates name successfully', async () => {
    ;(updateGroupSchema.safeParse as any).mockReturnValue({ success: true, data: { name: 'New Name' } })
    const existing = { _id: 'g1', name: 'Old Name' }
    ;(Group.findById as any).mockReturnValue(makeChain(existing))
    ;(Group.findByIdAndUpdate as any).mockReturnValue(makeChain({}))
    ;(Group.findById as any).mockReturnValue(makeChain(existing))
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/groups/g1', { name: 'New Name' }) as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(200)
  })

  it('converts price to paise before saving', async () => {
    ;(updateGroupSchema.safeParse as any).mockReturnValue({ success: true, data: { price: 100 } })
    const existing = { _id: 'g1', name: 'G', category: null }
    ;(Group.findById as any).mockReturnValue(makeChain(existing))
    ;(Group.findByIdAndUpdate as any).mockReturnValue(makeChain({}))
    ;(Group.findById as any).mockReturnValue(makeChain(existing))
    const mod = await import('@/app/api/admin/groups/[id]/route')
    await mod.PATCH(mockReq('PATCH', '/api/admin/groups/g1', { price: 100 }) as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(Group.findByIdAndUpdate).toHaveBeenCalledWith('g1', expect.objectContaining({ price: 10000 }), expect.anything())
  })

  it('handles category field update', async () => {
    ;(updateGroupSchema.safeParse as any).mockReturnValue({ success: true, data: { categoryId: 'c1' } })
    const existing = { _id: 'g1', name: 'G' }
    ;(Group.findById as any).mockReturnValue(makeChain(existing))
    ;(Group.findByIdAndUpdate as any).mockReturnValue(makeChain({}))
    ;(Group.findById as any).mockReturnValue(makeChain(existing))
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/groups/g1', { categoryId: 'c1' }) as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(200)
  })

  it('handles noteIds validation — rejects empty array', async () => {
    ;(updateGroupSchema.safeParse as any).mockReturnValue({ success: true, data: { noteIds: [] } })
    const existing = { _id: 'g1', name: 'G' }
    ;(Group.findById as any).mockReturnValue(makeChain(existing))
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/groups/g1', { noteIds: [] }) as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(400)
  })

  it('handles noteIds with missing notes', async () => {
    const validId = new Types.ObjectId().toString()
    ;(updateGroupSchema.safeParse as any).mockReturnValue({ success: true, data: { noteIds: [validId] } })
    ;(Group.findById as any).mockReturnValue(makeChain({ _id: 'g1', name: 'G' }))
    ;(Note.find as any).mockReturnValue(makeChain([]))
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/groups/g1', { noteIds: [validId] }) as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(404)
  })

  it('logs activity on successful update', async () => {
    ;(updateGroupSchema.safeParse as any).mockReturnValue({ success: true, data: { name: 'Updated Bundle' } })
    const updated = { _id: 'g1', name: 'Updated Bundle' }
    ;(Group.findById as any).mockReturnValue(makeChain(updated))
    ;(Group.findByIdAndUpdate as any).mockReturnValue(makeChain(updated))
    ;(Group.findById as any).mockReturnValue(makeChain(updated))
    const mod = await import('@/app/api/admin/groups/[id]/route')
    await mod.PATCH(mockReq('PATCH', '/api/admin/groups/g1', { name: 'Updated Bundle' }) as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: 'group.update' }))
  })

  it('handles visibility field update', async () => {
    ;(updateGroupSchema.safeParse as any).mockReturnValue({ success: true, data: { visibility: 'private' } })
    const existing = { _id: 'g1', name: 'G' }
    ;(Group.findById as any).mockReturnValue(makeChain(existing))
    ;(Group.findByIdAndUpdate as any).mockReturnValue(makeChain({}))
    ;(Group.findById as any).mockReturnValue(makeChain(existing))
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/groups/g1', { visibility: 'private' }) as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(200)
  })

  it('handles compareAtPrice field update', async () => {
    ;(updateGroupSchema.safeParse as any).mockReturnValue({ success: true, data: { compareAtPrice: 500 } })
    const existing = { _id: 'g1', name: 'G' }
    ;(Group.findById as any).mockReturnValue(makeChain(existing))
    ;(Group.findByIdAndUpdate as any).mockReturnValue(makeChain({}))
    ;(Group.findById as any).mockReturnValue(makeChain(existing))
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/groups/g1', { compareAtPrice: 500 }) as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(200)
  })

  it('returns internal error when update fails after findByIdAndUpdate', async () => {
    ;(updateGroupSchema.safeParse as any).mockReturnValue({ success: true, data: { name: 'X' } })
    ;(Group.findById as any).mockReturnValueOnce(makeChain({ _id: 'g1', name: 'X' })).mockReturnValue(makeChain(null))
    ;(Group.findByIdAndUpdate as any).mockReturnValue(makeChain(null))
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/groups/g1', { name: 'X' }) as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(500)
  })
})

describe('DELETE /api/admin/groups/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    ;(Group.findById as any).mockReturnValue(makeChain(null))
  })

  it('returns not found when group does not exist', async () => {
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/groups/g1') as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(404)
  })

  it('returns forbidden for non-head non-creator admin', async () => {
    const group = { _id: 'g1', name: 'Bundle', createdBy: 'other-admin-id' }
    ;(Group.findById as any).mockReturnValue(makeChain(group))
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/groups/g1') as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(403)
  })

  it('deletes group and logs activity as head admin', async () => {
    const group = { _id: 'g1', name: 'Bundle', createdBy: 'head-admin-id' }
    ;(Group.findById as any).mockReturnValue(makeChain(group))
    ;(Group.findByIdAndDelete as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue({}) })
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/groups/g1') as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.deleted).toBe(true)
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: 'group.delete' }))
  })

  it('allows creator to delete their own group', async () => {
    const group = { _id: 'g1', name: 'My Bundle', createdBy: 'a1' }
    ;(Group.findById as any).mockReturnValue(makeChain(group))
    ;(Group.findByIdAndDelete as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue({}) })
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/groups/g1') as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(200)
    expect(Group.findByIdAndDelete).toHaveBeenCalledWith('g1')
  })

  it('logs deletion activity with correct details', async () => {
    const group = { _id: 'g1', name: 'Deleted Bundle', createdBy: 'a1' }
    ;(Group.findById as any).mockReturnValue(makeChain(group))
    ;(Group.findByIdAndDelete as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue({}) })
    const mod = await import('@/app/api/admin/groups/[id]/route')
    await mod.DELETE(mockReq('DELETE', '/api/admin/groups/g1') as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({
      action: 'group.delete',
      description: 'Deleted group "Deleted Bundle"',
    }))
  })
})
