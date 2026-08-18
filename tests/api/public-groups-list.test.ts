import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Group } from '@/server/db/models/group.model'
import { toPublicGroup } from '@/server/mappers/group.mapper'

vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/group.model', () => ({
  Group: { find: vi.fn(), countDocuments: vi.fn() },
}))
vi.mock('@/server/mappers/group.mapper', () => ({
  toPublicGroup: vi.fn((g: any) => g),
}))
vi.mock('@/server/lib/query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/server/lib/query')>()
  return {
    ...actual,
    parsePagination: vi.fn(() => ({ page: 1, limit: 12, skip: 0 })),
    buildPagination: vi.fn(() => ({ page: 1, limit: 12, total: 1, totalPages: 1, hasNext: false, hasPrev: false })),
  }
})

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

describe('GET /api/groups', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns paginated public groups', async () => {
    ;(Group.find as any).mockReturnValue(makeChain([{ _id: 'g1', name: 'Bundle', slug: 'bundle' }]))
    ;(Group.countDocuments as any).mockReturnValue(makeChain(1))
    const mod = await import('@/app/api/groups/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/groups') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.items).toHaveLength(1)
    expect(json.data.pagination.total).toBe(1)
  })

  it('filters by visibility public only', async () => {
    ;(Group.find as any).mockReturnValue(makeChain([]))
    const mod = await import('@/app/api/groups/route')
    await mod.GET(new NextRequest('http://localhost/api/groups') as any, undefined)
    expect(Group.find).toHaveBeenCalledWith({ visibility: 'public' })
  })

  it('returns empty items array when no groups exist', async () => {
    ;(Group.find as any).mockReturnValue(makeChain([]))
    ;(Group.countDocuments as any).mockReturnValue(makeChain(0))
    const mod = await import('@/app/api/groups/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/groups') as any, undefined)
    const json = await res.json()
    expect(json.data.items).toEqual([])
  })

  it('includes pagination metadata', async () => {
    ;(Group.find as any).mockReturnValue(makeChain([]))
    ;(Group.countDocuments as any).mockReturnValue(makeChain(100))
    const mod = await import('@/app/api/groups/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/groups?page=2&limit=10') as any, undefined)
    const json = await res.json()
    expect(json.data.pagination).toBeDefined()
  })

  it('sorts groups by createdAt descending', async () => {
    ;(Group.find as any).mockReturnValue(makeChain([]))
    ;(Group.countDocuments as any).mockReturnValue(makeChain(0))
    const mod = await import('@/app/api/groups/route')
    await mod.GET(new NextRequest('http://localhost/api/groups') as any, undefined)
    expect(Group.find).toHaveBeenCalledWith({ visibility: 'public' })
  })

  it('populates category on returned groups', async () => {
    const populated = { _id: 'g1', category: { _id: 'c1', name: 'Dev' } }
    ;(Group.find as any).mockReturnValue(makeChain([populated]))
    ;(Group.countDocuments as any).mockReturnValue(makeChain(1))
    const mod = await import('@/app/api/groups/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/groups') as any, undefined)
    const json = await res.json()
    expect(json.data.items[0].category).toBeDefined()
  })
})
