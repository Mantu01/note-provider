import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Group } from '@/server/db/models/group.model'
import { Note } from '@/server/db/models/note.model'
import { toPublicGroup } from '@/server/mappers/group.mapper'
import { toPublicNote } from '@/server/mappers/note.mapper'
import { GET } from '@/app/api/groups/[slug]/route'

vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/group.model', () => ({
  Group: { findOne: vi.fn(), find: vi.fn() },
}))
vi.mock('@/server/db/models/note.model', () => ({
  Note: { find: vi.fn() },
}))
vi.mock('@/server/mappers/group.mapper', () => ({
  toPublicGroup: vi.fn((g: any, notes?: any[]) => ({ ...g, _notes: notes ?? [] })),
}))
vi.mock('@/server/mappers/note.mapper', () => ({
  toPublicNote: vi.fn((n: any) => n),
}))

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

describe('GET /api/groups/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns group with included notes and related groups', async () => {
    const group = { _id: 'g1', slug: 'bundle', visibility: 'public', name: 'Bundle', notes: ['n1'], category: { _id: 'c1' } }
    ;(Group.findOne as any).mockReturnValue(makeChain(group))
    ;(Note.find as any).mockReturnValue(makeChain([{ _id: 'n1', title: 'Note 1', category: null }]))
    ;(Group.find as any).mockReturnValue(makeChain([]))
    const res = await GET(new NextRequest('http://localhost/api/groups/bundle') as any, { params: Promise.resolve({ slug: 'bundle' }) })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.group.name).toBe('Bundle')
    expect(json.data.relatedGroups).toEqual([])
  })

  it('returns 404 when group not found', async () => {
    ;(Group.findOne as any).mockReturnValue(makeChain(null))
    const res = await GET(new NextRequest('http://localhost/api/groups/missing') as any, { params: Promise.resolve({ slug: 'missing' }) })
    expect(res.status).toBe(404)
  })

  it('filters by visibility public only', async () => {
    ;(Group.findOne as any).mockReturnValue(makeChain(null))
    await GET(new NextRequest('http://localhost/api/groups/secret') as any, { params: Promise.resolve({ slug: 'secret' }) })
    expect(Group.findOne).toHaveBeenCalledWith(expect.objectContaining({ visibility: 'public' }))
  })

  it('fetches related groups from same category', async () => {
    const group = { _id: 'g1', slug: 'bundle', visibility: 'public', name: 'Bundle', notes: [], category: { _id: 'c1' } }
    ;(Group.findOne as any).mockReturnValue(makeChain(group))
    ;(Note.find as any).mockReturnValue(makeChain([]))
    ;(Group.find as any).mockReturnValue(makeChain([{ _id: 'g2', name: 'Related' }]))
    const res = await GET(new NextRequest('http://localhost/api/groups/bundle') as any, { params: Promise.resolve({ slug: 'bundle' }) })
    const json = await res.json()
    expect(json.data.relatedGroups).toHaveLength(1)
    expect(Group.find).toHaveBeenCalled()
  })

  it('limits related groups to 3', async () => {
    const group = { _id: 'g1', slug: 'bundle', visibility: 'public', name: 'Bundle', notes: [], category: { _id: 'c1' } }
    ;(Group.findOne as any).mockReturnValue(makeChain(group))
    ;(Note.find as any).mockReturnValue(makeChain([]))
    ;(Group.find as any).mockReturnValue(makeChain([{ _id: 'g2' }, { _id: 'g3' }, { _id: 'g4' }, { _id: 'g5' }]))
    const res = await GET(new NextRequest('http://localhost/api/groups/bundle') as any, { params: Promise.resolve({ slug: 'bundle' }) })
    expect(res.status).toBe(200)
  })

  it('includes note objects in group data', async () => {
    const group = { _id: 'g1', slug: 'bundle', visibility: 'public', name: 'Bundle', notes: ['n1', 'n2'], category: { _id: 'c1' } }
    ;(Group.findOne as any).mockReturnValue(makeChain(group))
    ;(Note.find as any).mockReturnValue(makeChain([
      { _id: 'n1', title: 'Note 1' },
      { _id: 'n2', title: 'Note 2' },
    ]))
    ;(Group.find as any).mockReturnValue(makeChain([]))
    const res = await GET(new NextRequest('http://localhost/api/groups/bundle') as any, { params: Promise.resolve({ slug: 'bundle' }) })
    expect(res.status).toBe(200)
  })

  it('returns 404 with proper error format', async () => {
    ;(Group.findOne as any).mockReturnValue(makeChain(null))
    const res = await GET(new NextRequest('http://localhost/api/groups/nonexistent') as any, { params: Promise.resolve({ slug: 'nonexistent' }) })
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('populates note categories', async () => {
    const group = { _id: 'g1', slug: 'bundle', visibility: 'public', name: 'Bundle', notes: ['n1'], category: { _id: 'c1' } }
    ;(Group.findOne as any).mockReturnValue(makeChain(group))
    ;(Note.find as any).mockReturnValue(makeChain([{ _id: 'n1', category: { _id: 'c1', name: 'Dev' } }]))
    ;(Group.find as any).mockReturnValue(makeChain([]))
    const res = await GET(new NextRequest('http://localhost/api/groups/bundle') as any, { params: Promise.resolve({ slug: 'bundle' }) })
    expect(res.status).toBe(200)
  })
})
