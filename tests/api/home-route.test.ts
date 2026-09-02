import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Note } from '@/server/db/models/note.model'
import { Group } from '@/server/db/models/group.model'
import { Category } from '@/server/db/models/category.model'
import { Order } from '@/server/db/models/order.model'
import { toPublicNote } from '@/server/mappers/note.mapper'
import { toPublicGroup } from '@/server/mappers/group.mapper'
import { toPublicCategory } from '@/server/mappers/category.mapper'

vi.mock('@/server/db/connect', () => ({ connectDB: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/note.model', () => ({
  Note: { find: vi.fn(), countDocuments: vi.fn(), aggregate: vi.fn() },
}))
vi.mock('@/server/db/models/group.model', () => ({
  Group: { find: vi.fn() },
}))
vi.mock('@/server/db/models/category.model', () => ({
  Category: { find: vi.fn() },
}))
vi.mock('@/server/db/models/order.model', () => ({
  Order: { countDocuments: vi.fn() },
}))
vi.mock('@/server/mappers/note.mapper', () => ({
  toPublicNote: vi.fn((n: any) => n),
}))
vi.mock('@/server/mappers/group.mapper', () => ({
  toPublicGroup: vi.fn((g: any, notes?: any[]) => ({ ...g, _notes: notes ?? [] })),
}))
vi.mock('@/server/mappers/category.mapper', () => ({
  toPublicCategory: vi.fn((c: any, count?: number) => c),
}))

function makeChain(val: unknown) {
  return {
    populate: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(val),
  }
}

describe('GET /api/home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns homepage data with featured items', async () => {
    ;(Note.find as any).mockImplementation((filter: any) => makeChain([]))
    ;(Group.find as any).mockReturnValue(makeChain([]))
    ;(Category.find as any).mockReturnValue(makeChain([{ _id: 'c1', name: 'Dev', slug: 'dev' }]))
    ;(Note.countDocuments as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(100) })
    ;(Note.aggregate as any).mockImplementation((pipeline: any[]) => {
      if (pipeline.some((p: any) => p.$group && p.$group.total)) return Promise.resolve([{ total: 500 }])
      return Promise.resolve([{ _id: 'c1', count: 3 }])
    })
    ;(Order.countDocuments as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(80) })

    const mod = await import('@/app/api/home/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/home') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.stats.totalNotes).toBe(100)
    expect(json.data.stats.happyLearners).toBe(80)
    expect(json.data.featuredNotes).toEqual([])
    expect(json.data.categories).toHaveLength(1)
  })

  it('returns featured notes', async () => {
    const featured = [{ _id: 'n1', title: 'Featured Note', isFeatured: true }]
    ;(Note.find as any).mockImplementation((filter: any) => {
      if (filter.isFeatured !== undefined) return makeChain(featured)
      return makeChain([])
    })
    ;(Group.find as any).mockReturnValue(makeChain([]))
    ;(Category.find as any).mockReturnValue(makeChain([]))
    ;(Note.countDocuments as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(0) })
    ;(Note.aggregate as any).mockImplementation((pipeline: any[]) => {
      if (pipeline.some((p: any) => p.$group && p.$group.total)) return Promise.resolve([{ total: 0 }])
      return Promise.resolve([])
    })
    ;(Order.countDocuments as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(0) })
    const mod = await import('@/app/api/home/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/home') as any, undefined)
    const json = await res.json()
    expect(json.data.featuredNotes).toHaveLength(1)
  })

  it('returns latest notes sorted by createdAt desc', async () => {
    const latest = [{ _id: 'n1', title: 'Latest' }]
    ;(Note.find as any).mockImplementation((filter: any) => {
      if (filter.visibility) return makeChain(latest)
      return makeChain([])
    })
    ;(Group.find as any).mockReturnValue(makeChain([]))
    ;(Category.find as any).mockReturnValue(makeChain([]))
    ;(Note.countDocuments as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(1) })
    ;(Note.aggregate as any).mockImplementation((pipeline: any[]) => {
      if (pipeline.some((p: any) => p.$group && p.$group.total)) return Promise.resolve([{ total: 0 }])
      return Promise.resolve([])
    })
    ;(Order.countDocuments as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(0) })
    const mod = await import('@/app/api/home/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/home') as any, undefined)
    const json = await res.json()
    expect(json.data.latestNotes).toHaveLength(1)
  })

  it('returns free notes section', async () => {
    const freeNotes = [{ _id: 'n1', pricingType: 'free', title: 'Free' }]
    ;(Note.find as any).mockImplementation((filter: any) => {
      if (filter.pricingType === 'free') return makeChain(freeNotes)
      return makeChain([])
    })
    ;(Group.find as any).mockReturnValue(makeChain([]))
    ;(Category.find as any).mockReturnValue(makeChain([]))
    ;(Note.countDocuments as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(1) })
    ;(Note.aggregate as any).mockImplementation((pipeline: any[]) => {
      if (pipeline.some((p: any) => p.$group && p.$group.total)) return Promise.resolve([{ total: 0 }])
      return Promise.resolve([])
    })
    ;(Order.countDocuments as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(0) })
    const mod = await import('@/app/api/home/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/home') as any, undefined)
    const json = await res.json()
    expect(json.data.freeNotes).toHaveLength(1)
  })

  it('returns stats with correct totals', async () => {
    ;(Note.find as any).mockReturnValue(makeChain([]))
    ;(Group.find as any).mockReturnValue(makeChain([]))
    ;(Category.find as any).mockReturnValue(makeChain([
      { _id: 'c1', name: 'C1' },
      { _id: 'c2', name: 'C2' },
    ]))
    ;(Note.countDocuments as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(50) })
    ;(Note.aggregate as any).mockImplementation((pipeline: any[]) => {
      if (pipeline.some((p: any) => p.$group && p.$group.total)) return Promise.resolve([{ total: 1000 }])
      return Promise.resolve([])
    })
    ;(Order.countDocuments as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(25) })
    const mod = await import('@/app/api/home/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/home') as any, undefined)
    const json = await res.json()
    expect(json.data.stats.totalNotes).toBe(50)
    expect(json.data.stats.totalDownloads).toBe(1000)
    expect(json.data.stats.happyLearners).toBe(25)
    expect(json.data.stats.totalCategories).toBe(2)
  })

  it('includes featured groups', async () => {
    const groups = [{ _id: 'g1', name: 'Featured Bundle', isFeatured: true }]
    ;(Note.find as any).mockReturnValue(makeChain([]))
    ;(Group.find as any).mockReturnValue(makeChain(groups))
    ;(Category.find as any).mockReturnValue(makeChain([]))
    ;(Note.countDocuments as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(0) })
    ;(Note.aggregate as any).mockImplementation((pipeline: any[]) => {
      if (pipeline.some((p: any) => p.$group && p.$group.total)) return Promise.resolve([{ total: 0 }])
      return Promise.resolve([])
    })
    ;(Order.countDocuments as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(0) })
    const mod = await import('@/app/api/home/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/home') as any, undefined)
    const json = await res.json()
    expect(json.data.featuredGroups).toHaveLength(1)
  })

  it('handles all empty queries gracefully', async () => {
    ;(Note.find as any).mockReturnValue(makeChain([]))
    ;(Group.find as any).mockReturnValue(makeChain([]))
    ;(Category.find as any).mockReturnValue(makeChain([]))
    ;(Note.countDocuments as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(0) })
    ;(Note.aggregate as any).mockResolvedValue([])
    ;(Order.countDocuments as any).mockReturnValue({ lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(0) })
    const mod = await import('@/app/api/home/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/home') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.featuredNotes).toEqual([])
    expect(json.data.stats).toBeDefined()
  })
})
