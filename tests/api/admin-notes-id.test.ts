import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Note } from '@/server/db/models/note.model'
import { Group } from '@/server/db/models/group.model'
import { Category } from '@/server/db/models/category.model'
import { logActivity } from '@/server/services/activity.service'
import { destroyAsset } from '@/server/lib/cloudinary'
import { toAdminNote } from '@/server/mappers/note.mapper'
import { updateNoteSchema } from '@/lib/schemas/note.schema'
import { requireAdmin } from '@/server/lib/auth-guard'
import { rupeesToPaise } from '@/lib/format'

vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/note.model', () => ({
  Note: { findById: vi.fn(), findByIdAndUpdate: vi.fn(), findByIdAndDelete: vi.fn(), distinct: vi.fn() },
}))
vi.mock('@/server/db/models/group.model', () => ({
  Group: { findById: vi.fn(), findByIdAndUpdate: vi.fn(), distinct: vi.fn() },
}))
vi.mock('@/server/db/models/category.model', () => ({
  Category: { findById: vi.fn() },
}))
vi.mock('@/server/services/activity.service', () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/server/lib/cloudinary', () => ({
  destroyAsset: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/server/mappers/note.mapper', () => ({
  toAdminNote: vi.fn((n: any) => n),
}))
vi.mock('@/lib/schemas/note.schema', () => ({
  updateNoteSchema: { safeParse: vi.fn() },
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

describe('GET /api/admin/notes/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
  })

  it('returns note with populated relations', async () => {
    const note = { _id: 'n1', title: 'React Notes', category: { _id: 'c1', name: 'Dev' } }
    ;(Note.findById as any).mockReturnValue(makeChain(note))
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/notes/n1') as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(200)
    expect(Note.findById).toHaveBeenCalledWith('n1')
  })

  it('returns 404 when note does not exist', async () => {
    ;(Note.findById as any).mockReturnValue(makeChain(null))
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/notes/nonexistent') as any, { params: Promise.resolve({ id: 'nonexistent' }) })
    expect(res.status).toBe(404)
  })

  it('populates createdBy field', async () => {
    ;(Note.findById as any).mockReturnValue(makeChain({ _id: 'n1' }))
    const mod = await import('@/app/api/admin/notes/[id]/route')
    await mod.GET(mockReq('GET', '/api/admin/notes/n1') as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(Note.findById).toHaveBeenCalledWith('n1')
  })
})

describe('PATCH /api/admin/notes/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    ;(updateNoteSchema.safeParse as any).mockReturnValue({ success: false, error: { issues: [{ path: ['title'], message: 'required' }] } })
    ;(Note.findById as any).mockReturnValue(makeChain(null))
  })

  it('returns validation error for invalid body', async () => {
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/notes/n1', { invalid: true }) as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(400)
  })

  it('returns not found when note does not exist', async () => {
    ;(updateNoteSchema.safeParse as any).mockReturnValue({ success: true, data: { title: 'Updated' } })
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/notes/n1', { title: 'Updated' }) as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(404)
  })

  it('returns not found when category does not exist', async () => {
    ;(updateNoteSchema.safeParse as any).mockReturnValue({ success: true, data: { categoryId: 'nonexistent-cat' } })
    ;(Note.findById as any).mockReturnValue(makeChain({ _id: 'n1', pricingType: 'paid' }))
    ;(Category.findById as any).mockReturnValue(makeChain(null))
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/notes/n1', { categoryId: 'nonexistent-cat' }) as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(404)
  })

  it('updates note fields successfully', async () => {
    ;(updateNoteSchema.safeParse as any).mockReturnValue({ success: true, data: { title: 'New Title', level: 'advance' } })
    const existing = { _id: 'n1', title: 'Old Title', pricingType: 'paid', fullFilePublicId: null, previewFilePublicId: null, coverImagePublicId: null }
    const updated = { ...existing, title: 'New Title', level: 'advance' }
    ;(Note.findById as any).mockReturnValueOnce(makeChain(existing)).mockReturnValueOnce(makeChain(updated))
    ;(Note.findByIdAndUpdate as any).mockReturnValue(makeChain({}))
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/notes/n1', { title: 'New Title', level: 'advance' }) as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(200)
  })

  it('converts price to paise', async () => {
    ;(updateNoteSchema.safeParse as any).mockReturnValue({ success: true, data: { price: 500 } })
    const existing = { _id: 'n1', pricingType: 'paid', fullFilePublicId: null, previewFilePublicId: null, coverImagePublicId: null }
    const updated = { ...existing }
    ;(Note.findById as any).mockReturnValueOnce(makeChain(existing)).mockReturnValueOnce(makeChain(updated))
    ;(Note.findByIdAndUpdate as any).mockReturnValue(makeChain({}))
    const mod = await import('@/app/api/admin/notes/[id]/route')
    await mod.PATCH(mockReq('PATCH', '/api/admin/notes/n1', { price: 500 }) as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(rupeesToPaise).toHaveBeenCalledWith(500)
  })

  it('logs activity on successful update', async () => {
    ;(updateNoteSchema.safeParse as any).mockReturnValue({ success: true, data: { title: 'Updated Note' } })
    const updated = { _id: 'n1', title: 'Updated Note' }
    ;(Note.findById as any).mockReturnValueOnce(makeChain(updated)).mockReturnValueOnce(makeChain(updated))
    ;(Note.findByIdAndUpdate as any).mockReturnValue(makeChain({}))
    const mod = await import('@/app/api/admin/notes/[id]/route')
    await mod.PATCH(mockReq('PATCH', '/api/admin/notes/n1', { title: 'Updated Note' }) as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: 'note.update' }))
  })

  it('changes pricingType from paid to free and cleans up preview', async () => {
    ;(updateNoteSchema.safeParse as any).mockReturnValue({ success: true, data: { pricingType: 'free' } })
    const existing = { _id: 'n1', pricingType: 'paid', previewFilePublicId: 'pub-prev', fullFilePublicId: null, coverImagePublicId: null }
    const updated = { ...existing, pricingType: 'free', previewFilePublicId: null }
    ;(Note.findById as any).mockReturnValueOnce(makeChain(existing)).mockReturnValueOnce(makeChain(updated))
    ;(Note.findByIdAndUpdate as any).mockReturnValue(makeChain({}))
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/notes/n1', { pricingType: 'free' }) as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(200)
    expect(destroyAsset).toHaveBeenCalledWith('pub-prev', 'raw', 'upload')
  })

  it('destroys old full file asset when replaced', async () => {
    ;(updateNoteSchema.safeParse as any).mockReturnValue({ success: true, data: { fullFile: { publicId: 'new-pub' } } })
    const existing = { _id: 'n1', fullFilePublicId: 'old-pub', previewFilePublicId: null, coverImagePublicId: null, pricingType: 'paid' }
    const updated = { ...existing }
    ;(Note.findById as any).mockReturnValueOnce(makeChain(existing)).mockReturnValueOnce(makeChain(updated))
    ;(Note.findByIdAndUpdate as any).mockReturnValue(makeChain({}))
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/notes/n1', { fullFile: { publicId: 'new-pub' } }) as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(200)
    expect(destroyAsset).toHaveBeenCalledWith('old-pub', 'raw', 'authenticated')
  })
})

describe('DELETE /api/admin/notes/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    ;(Note.findById as any).mockReturnValue(makeChain(null))
    ;(Group.distinct as any).mockResolvedValue([])
    ;(Note.findByIdAndDelete as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({}) })
  })

  it('returns not found when note does not exist', async () => {
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/notes/n1') as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(404)
  })

  it('returns forbidden for non-head non-creator admin', async () => {
    const note = { _id: 'n1', title: 'Note', createdBy: 'other-admin-id' }
    ;(Note.findById as any).mockReturnValue(makeChain(note))
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/notes/n1') as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(403)
  })

  it('deletes note and returns affected groups as head admin', async () => {
    const note = { _id: 'n1', title: 'Note', createdBy: 'head-admin-id', fullFilePublicId: null, previewFilePublicId: null, coverImagePublicId: null }
    ;(Note.findById as any).mockReturnValue(makeChain(note))
    ;(Group.distinct as any).mockResolvedValue([])
    ;(Note.findByIdAndDelete as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({}) })
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/notes/n1') as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.deleted).toBe(true)
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: 'note.delete' }))
  })

  it('allows creator to delete their own note', async () => {
    const note = { _id: 'n1', title: 'My Note', createdBy: 'a1', fullFilePublicId: null, previewFilePublicId: null, coverImagePublicId: null }
    ;(Note.findById as any).mockReturnValue(makeChain(note))
    ;(Group.distinct as any).mockResolvedValue([])
    ;(Note.findByIdAndDelete as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({}) })
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/notes/n1') as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(200)
    expect(Note.findByIdAndDelete).toHaveBeenCalledWith('n1')
  })

  it('hides empty groups when deleting note', async () => {
    const note = { _id: 'n1', title: 'Note', createdBy: 'a1', fullFilePublicId: null, previewFilePublicId: null, coverImagePublicId: null }
    const group = { _id: 'g1', name: 'Bundle', notes: ['n1', 'n2'] }
    ;(Note.findById as any).mockReturnValue(makeChain(note))
    ;(Group.distinct as any).mockResolvedValue(['g1'])
    ;(Group.findById as any).mockReturnValue(makeChain(group))
    ;(Group.findByIdAndUpdate as any).mockReturnValue(makeChain({}))
    ;(Note.findByIdAndDelete as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({}) })
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/notes/n1') as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(200)
  })

  it('destroys file assets on delete', async () => {
    const note = { _id: 'n1', title: 'Note', createdBy: 'a1', fullFilePublicId: 'pub-full', previewFilePublicId: 'pub-preview', coverImagePublicId: 'pub-cover' }
    ;(Note.findById as any).mockReturnValue(makeChain(note))
    ;(Group.distinct as any).mockResolvedValue([])
    ;(Note.findByIdAndDelete as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({}) })
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/notes/n1') as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(200)
    expect(destroyAsset).toHaveBeenCalledWith('pub-full', 'raw', 'authenticated')
    expect(destroyAsset).toHaveBeenCalledWith('pub-preview', 'raw', 'upload')
    expect(destroyAsset).toHaveBeenCalledWith('pub-cover', 'image', 'upload')
  })
})
