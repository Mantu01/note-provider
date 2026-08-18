import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Category } from '@/server/db/models/category.model'
import { Note } from '@/server/db/models/note.model'

vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/category.model', () => ({
  Category: { find: vi.fn() },
}))
vi.mock('@/server/db/models/note.model', () => ({
  Note: { aggregate: vi.fn() },
}))

function makeChain(val: unknown) {
  return {
    sort: vi.fn().mockReturnThis(),
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(val),
  }
}

describe('GET /api/filters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns filter facets from note aggregation', async () => {
    ;(Category.find as any).mockReturnValue(makeChain([{ _id: 'c1', name: 'Dev', slug: 'dev', isActive: true, order: 0 }]))
    ;(Note.aggregate as any).mockResolvedValue([{
      categories: [{ _id: 'c1', count: 3 }],
      levels: [{ _id: 'basics', count: 10 }],
      subjects: [],
      tags: [{ _id: 'react', count: 5 }],
      priceRange: [{ min: 100, max: 50000 }],
      pricing: [{ _id: 'free', count: 7 }, { _id: 'paid', count: 3 }],
    }])
    const mod = await import('@/app/api/filters/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/filters') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.categories).toHaveLength(1)
    expect(json.data.levels[0].value).toBe('basics')
    expect(json.data.tags[0].value).toBe('react')
    expect(json.data.priceRange.minPaise).toBe(100)
    expect(json.data.pricing.length).toBe(2)
  })

  it('returns zeroed price range when no notes', async () => {
    ;(Category.find as any).mockReturnValue(makeChain([]))
    ;(Note.aggregate as any).mockResolvedValue([{
      categories: [],
      levels: [],
      subjects: [],
      tags: [],
      priceRange: [],
      pricing: [],
    }])
    const mod = await import('@/app/api/filters/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/filters') as any, undefined)
    const json = await res.json()
    expect(json.data.priceRange).toEqual({ minPaise: 0, maxPaise: 0 })
  })

  it('returns empty subjects and tags arrays when none exist', async () => {
    ;(Category.find as any).mockReturnValue(makeChain([]))
    ;(Note.aggregate as any).mockResolvedValue([{
      categories: [],
      levels: [{ _id: 'advance', count: 1 }],
      subjects: [],
      tags: [],
      priceRange: [{ min: 500, max: 10000 }],
      pricing: [{ _id: 'paid', count: 1 }],
    }])
    const mod = await import('@/app/api/filters/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/filters') as any, undefined)
    const json = await res.json()
    expect(json.data.subjects).toEqual([])
    expect(json.data.tags).toEqual([])
  })

  it('includes category counts in response', async () => {
    ;(Category.find as any).mockReturnValue(makeChain([
      { _id: 'c1', name: 'Frontend', slug: 'frontend' },
      { _id: 'c2', name: 'Backend', slug: 'backend' },
    ]))
    ;(Note.aggregate as any).mockResolvedValue([{
      categories: [{ _id: 'c1', count: 10 }, { _id: 'c2', count: 5 }],
      levels: [],
      subjects: [],
      tags: [],
      priceRange: [],
      pricing: [],
    }])
    const mod = await import('@/app/api/filters/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/filters') as any, undefined)
    const json = await res.json()
    expect(json.data.categories[0].count).toBe(10)
    expect(json.data.categories[1].count).toBe(5)
  })

  it('formats level labels with capitalization', async () => {
    ;(Category.find as any).mockReturnValue(makeChain([]))
    ;(Note.aggregate as any).mockResolvedValue([{
      categories: [],
      levels: [{ _id: 'intermediate', count: 3 }],
      subjects: [],
      tags: [],
      priceRange: [],
      pricing: [],
    }])
    const mod = await import('@/app/api/filters/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/filters') as any, undefined)
    const json = await res.json()
    expect(json.data.levels[0].label).toBe('Intermediate')
  })

  it('maps pricing type values correctly', async () => {
    ;(Category.find as any).mockReturnValue(makeChain([]))
    ;(Note.aggregate as any).mockResolvedValue([{
      categories: [],
      levels: [],
      subjects: [],
      tags: [],
      priceRange: [],
      pricing: [{ _id: 'free', count: 20 }, { _id: 'paid', count: 15 }],
    }])
    const mod = await import('@/app/api/filters/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/filters') as any, undefined)
    const json = await res.json()
    expect(json.data.pricing).toContainEqual({ value: 'free', count: 20 })
    expect(json.data.pricing).toContainEqual({ value: 'paid', count: 15 })
  })
})
