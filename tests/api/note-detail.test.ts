import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Note } from '@/server/db/models/note.model'
import { Group } from '@/server/db/models/group.model'
import { toPublicNote } from '@/server/mappers/note.mapper'
import { toPublicGroup } from '@/server/mappers/group.mapper'

vi.mock('@/server/db/connect', () => ({ connectDB: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/note.model', () => ({
  Note: { findOne: vi.fn(), find: vi.fn() },
}))
vi.mock('@/server/db/models/group.model', () => ({
  Group: { find: vi.fn() },
}))
vi.mock('@/server/mappers/note.mapper', () => ({
  toPublicNote: vi.fn((n: any) => n),
}))
vi.mock('@/server/mappers/group.mapper', () => ({
  toPublicGroup: vi.fn((g: any) => g),
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

describe('GET /api/notes/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns note with related content on success', async () => {
    const note = { _id: 'n1', slug: 'my-note', visibility: 'public', title: 'My Note', category: { _id: 'c1', name: 'Dev' }, tags: [] }
    ;(Note.findOne as any).mockReturnValue(makeChain(note))
    const relChain = makeChain([])
    ;(Note.find as any).mockReturnValue(relChain)
    ;(Group.find as any).mockReturnValue(makeChain([]))

    const mod = await import('@/app/api/notes/[slug]/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/my-note') as any, { params: Promise.resolve({ slug: 'my-note' }) })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.note.title).toBe('My Note')
    expect(Note.findOne).toHaveBeenCalledWith({ slug: 'my-note', visibility: 'public' })
  })

  it('returns 404 when note is not found', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain(null))
    const mod = await import('@/app/api/notes/[slug]/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/nonexistent') as any, { params: Promise.resolve({ slug: 'nonexistent' }) })
    expect(res.status).toBe(404)
  })

  it('filters by visibility public only', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain(null))
    const mod = await import('@/app/api/notes/[slug]/route')
    await mod.GET(new NextRequest('http://localhost/api/notes/admin-only') as any, { params: Promise.resolve({ slug: 'admin-only' }) })
    expect(Note.findOne).toHaveBeenCalledWith(expect.objectContaining({ visibility: 'public' }))
  })

  it('fetches related notes from same category', async () => {
    const note = { _id: 'n1', slug: 'n1', visibility: 'public', category: { _id: 'c1' } }
    ;(Note.findOne as any).mockReturnValue(makeChain(note))
    const relChain = makeChain([{ _id: 'n2', title: 'Related' }])
    ;(Note.find as any).mockReturnValue(relChain)
    ;(Group.find as any).mockReturnValue(makeChain([]))
    const mod = await import('@/app/api/notes/[slug]/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/n1') as any, { params: Promise.resolve({ slug: 'n1' }) })
    const json = await res.json()
    expect(json.data.relatedNotes).toHaveLength(1)
    expect(json.data.groups).toEqual([])
  })

  it('fetches groups containing the note', async () => {
    const note = { _id: 'n1', slug: 'n1', visibility: 'public', category: { _id: 'c1' } }
    ;(Note.findOne as any).mockReturnValue(makeChain(note))
    ;(Note.find as any).mockReturnValue(makeChain([]))
    const groupChain = makeChain([{ _id: 'g1', name: 'Bundle' }])
    ;(Group.find as any).mockReturnValue(groupChain)
    const mod = await import('@/app/api/notes/[slug]/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/n1') as any, { params: Promise.resolve({ slug: 'n1' }) })
    const json = await res.json()
    expect(json.data.groups).toHaveLength(1)
  })

  it('limits related notes to 4', async () => {
    const note = { _id: 'n1', slug: 'n1', visibility: 'public', category: { _id: 'c1' } }
    ;(Note.findOne as any).mockReturnValue(makeChain(note))
    const relChain = makeChain([
      { _id: 'n2' }, { _id: 'n3' }, { _id: 'n4' }, { _id: 'n5' }, { _id: 'n6' },
    ])
    ;(Note.find as any).mockReturnValue(relChain)
    ;(Group.find as any).mockReturnValue(makeChain([]))
    const mod = await import('@/app/api/notes/[slug]/route')
    await mod.GET(new NextRequest('http://localhost/api/notes/n1') as any, { params: Promise.resolve({ slug: 'n1' }) })
    expect(relChain.limit).toHaveBeenCalled()
  })

  it('returns empty arrays when no related content exists', async () => {
    const note = { _id: 'n1', slug: 'n1', visibility: 'public', category: { _id: 'c1' } }
    ;(Note.findOne as any).mockReturnValue(makeChain(note))
    ;(Note.find as any).mockReturnValue(makeChain([]))
    ;(Group.find as any).mockReturnValue(makeChain([]))
    const mod = await import('@/app/api/notes/[slug]/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/n1') as any, { params: Promise.resolve({ slug: 'n1' }) })
    const json = await res.json()
    expect(json.data.relatedNotes).toEqual([])
    expect(json.data.groups).toEqual([])
  })

  it('handles not found with proper error format', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain(null))
    const mod = await import('@/app/api/notes/[slug]/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/missing') as any, { params: Promise.resolve({ slug: 'missing' }) })
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('includes category population on main note', async () => {
    const note = { _id: 'n1', slug: 'n1', visibility: 'public', title: 'Test', category: { _id: 'c1', name: 'Category' } }
    ;(Note.findOne as any).mockReturnValue(makeChain(note))
    ;(Note.find as any).mockReturnValue(makeChain([]))
    ;(Group.find as any).mockReturnValue(makeChain([]))
    const mod = await import('@/app/api/notes/[slug]/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/n1') as any, { params: Promise.resolve({ slug: 'n1' }) })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.note.category).toBeDefined()
  })
})
