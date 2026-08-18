import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Category } from '@/server/db/models/category.model'
import { Note } from '@/server/db/models/note.model'
import { toPublicCategory } from '@/server/mappers/category.mapper'

vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/category.model', () => ({
  Category: { find: vi.fn() },
}))
vi.mock('@/server/db/models/note.model', () => ({
  Note: { aggregate: vi.fn() },
}))
vi.mock('@/server/mappers/category.mapper', () => ({
  toPublicCategory: vi.fn((c: any) => c),
}))

function makeChain(val: unknown) {
  return {
    sort: vi.fn().mockReturnThis(),
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(val),
  }
}

describe('GET /api/categories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns active categories with note counts', async () => {
    const chain1 = makeChain([{ _id: 'c1', name: 'Web Dev', slug: 'web-dev', isActive: true }])
    ;(Category.find as any).mockReturnValue(chain1)
    ;(Note.aggregate as any).mockResolvedValue([{ _id: 'c1', count: 5 }])
    const mod = await import('@/app/api/categories/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/categories') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data).toHaveLength(1)
    expect(json.data[0].name).toBe('Web Dev')
    expect(Category.find).toHaveBeenCalledWith({ isActive: true })
  })

  it('returns empty list when no categories exist', async () => {
    ;(Category.find as any).mockReturnValue(makeChain([]))
    ;(Note.aggregate as any).mockResolvedValue([])
    const mod = await import('@/app/api/categories/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/categories') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data).toEqual([])
  })

  it('maps category counts via aggregation', async () => {
    ;(Category.find as any).mockReturnValue(makeChain([
      { _id: 'c1', name: 'Dev', slug: 'dev', isActive: true },
      { _id: 'c2', name: 'Math', slug: 'math', isActive: true },
    ]))
    ;(Note.aggregate as any).mockResolvedValue([
      { _id: 'c1', count: 3 },
      { _id: 'c2', count: 7 },
    ])
    const mod = await import('@/app/api/categories/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/categories') as any, undefined)
    const json = await res.json()
    expect(json.data).toHaveLength(2)
  })

  it('handles categories with zero notes', async () => {
    ;(Category.find as any).mockReturnValue(makeChain([{ _id: 'c1', name: 'Empty', slug: 'empty', isActive: true }]))
    ;(Note.aggregate as any).mockResolvedValue([])
    const mod = await import('@/app/api/categories/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/categories') as any, undefined)
    const json = await res.json()
    expect(json.data[0].name).toBe('Empty')
  })

  it('calls find with correct filter', async () => {
    ;(Category.find as any).mockReturnValue(makeChain([]))
    ;(Note.aggregate as any).mockResolvedValue([])
    const mod = await import('@/app/api/categories/route')
    await mod.GET(new NextRequest('http://localhost/api/categories') as any, undefined)
    expect(Category.find).toHaveBeenCalledTimes(1)
    expect(Category.find).toHaveBeenCalledWith({ isActive: true })
  })
})
