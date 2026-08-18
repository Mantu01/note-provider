import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Note } from '@/server/db/models/note.model'
import { toPublicNote } from '@/server/mappers/note.mapper'
import { GET } from '@/app/api/notes/route'

vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/note.model', () => ({
  Note: { find: vi.fn(), countDocuments: vi.fn() },
}))
vi.mock('@/server/db/models/category.model', () => ({
  Category: { find: vi.fn().mockReturnValue({ sort: vi.fn().mockReturnThis(), lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue([]) }) },
}))
vi.mock('@/server/mappers/note.mapper', () => {
  const m = vi.fn((n: any) => n)
  return { __esModule: true, default: m, toPublicNote: m }
})
vi.mock('@/server/lib/query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/server/lib/query')>()
  return {
    ...actual,
    parsePagination: vi.fn(() => ({ page: 1, limit: 12, skip: 0 })),
    buildPagination: vi.fn((total: number) => ({ page: 1, limit: 12, total, totalPages: 1, hasNext: false, hasPrev: false })),
    buildNoteFilter: vi.fn(() => ({})),
    buildNoteSort: vi.fn(() => ({ createdAt: -1 })),
    resolveCategoryIds: vi.fn(async () => undefined),
  }
})

function makeChain(val: unknown) {
  return {
    populate: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(val),
  }
}

describe('GET /api/notes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns paginated public notes', async () => {
    ;(Note.find as any).mockReturnValue(makeChain([]))
    ;(Note.countDocuments as any).mockReturnValue(makeChain(0))
    const res = await GET(new NextRequest('http://localhost/api/notes?page=1&limit=12') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.items).toEqual([])
    expect(json.data.pagination.total).toBe(0)
  })

  it('returns notes mapped through toPublicNote', async () => {
    const notes = [{ _id: 'n1', title: 'Note 1' }]
    ;(Note.find as any).mockReturnValue(makeChain(notes))
    ;(Note.countDocuments as any).mockReturnValue(makeChain(1))
    const res = await GET(new NextRequest('http://localhost/api/notes') as any, undefined)
    const json = await res.json()
    expect(json.data.items).toHaveLength(1)
    expect(toPublicNote).toHaveBeenCalledWith(notes[0], 0, notes)
  })

  it('supports sort parameter', async () => {
    ;(Note.find as any).mockReturnValue(makeChain([]))
    ;(Note.countDocuments as any).mockReturnValue(makeChain(0))
    await GET(new NextRequest('http://localhost/api/notes?sort=newest') as any, undefined)
    expect(Note.find).toHaveBeenCalled()
  })

  it('supports featured filter', async () => {
    ;(Note.find as any).mockReturnValue(makeChain([]))
    ;(Note.countDocuments as any).mockReturnValue(makeChain(0))
    await GET(new NextRequest('http://localhost/api/notes?featured=true') as any, undefined)
    expect(Note.find).toHaveBeenCalled()
  })

  it('handles price range filtering', async () => {
    ;(Note.find as any).mockReturnValue(makeChain([]))
    ;(Note.countDocuments as any).mockReturnValue(makeChain(0))
    await GET(new NextRequest('http://localhost/api/notes?minPrice=100&maxPrice=5000') as any, undefined)
    expect(Note.find).toHaveBeenCalled()
  })

  it('returns pagination metadata', async () => {
    ;(Note.find as any).mockReturnValue(makeChain([]))
    ;(Note.countDocuments as any).mockReturnValue(makeChain(20))
    const res = await GET(new NextRequest('http://localhost/api/notes?page=3&limit=5') as any, undefined)
    const json = await res.json()
    expect(json.data.pagination).toBeDefined()
    expect(json.data.pagination.total).toBe(20)
  })
})
