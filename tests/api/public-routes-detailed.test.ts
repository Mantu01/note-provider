import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Note } from '@/server/db/models/note.model'
import { Group } from '@/server/db/models/group.model'
import { Category } from '@/server/db/models/category.model'
import { Order } from '@/server/db/models/order.model'
import { toPublicNote } from '@/server/mappers/note.mapper'
import { toPublicGroup } from '@/server/mappers/group.mapper'
import { toPublicCategory } from '@/server/mappers/category.mapper'
import { buildSignedUrl } from '@/server/lib/cloudinary'
import { enforceRateLimit } from '@/server/lib/rate-limit'
import { incrementDownloadCount } from '@/server/services/note.service'
import * as fs from 'fs'

vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))

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

vi.mock('@/server/db/models/note.model', () => ({
  Note: {
    find: vi.fn(), countDocuments: vi.fn(), aggregate: vi.fn(),
    findOne: vi.fn(), findById: vi.fn(),
  },
}))

vi.mock('@/server/db/models/group.model', () => ({
  Group: {
    find: vi.fn(), countDocuments: vi.fn(),
    findOne: vi.fn(), findById: vi.fn(), findByIdAndUpdate: vi.fn(),
  },
}))

vi.mock('@/server/db/models/category.model', () => ({
  Category: {
    find: vi.fn(), countDocuments: vi.fn(),
    findOne: vi.fn(), findByIdAndUpdate: vi.fn(),
  },
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

vi.mock('@/server/lib/query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/server/lib/query')>()
  return {
    ...actual,
    parsePagination: vi.fn((_sp: any, _max?: number) => ({ page: 1, limit: 12, skip: 0 })),
    buildPagination: vi.fn((_total: number, _page: number, _limit: number) => ({ page: 1, limit: 12, total: _total, totalPages: 1, hasNext: false, hasPrev: false })),
    buildNoteFilter: vi.fn(() => ({})),
    buildNoteSort: vi.fn(() => ({ createdAt: -1 })),
    resolveCategoryIds: vi.fn(async () => undefined),
    parseArrayParam: vi.fn(() => []),
    parseBooleanParam: vi.fn(() => false),
    parseNumberParam: vi.fn(() => undefined),
  }
})

vi.mock('@/server/lib/cloudinary', () => ({
  buildSignedUrl: vi.fn(),
}))

vi.mock('@/server/lib/rate-limit', () => ({
  enforceRateLimit: vi.fn(),
}))

vi.mock('@/server/services/note.service', () => ({
  incrementDownloadCount: vi.fn().mockResolvedValue(undefined),
}))

const _mockFs = vi.hoisted(() => ({ existsSync: vi.fn(), readFileSync: vi.fn() }))
vi.mock('fs', () => ({
  __esModule: true,
  default: _mockFs,
  ..._mockFs,
}))

beforeEach(() => { vi.clearAllMocks() })

// ─── GET /api/notes ────────────────────────────────────────────────────────────

describe('GET /api/notes', () => {
  it('returns paginated public notes', async () => {
    ;(Note.find as any).mockReturnValue(makeChain([]))
    ;(Note.countDocuments as any).mockReturnValue(makeChain(0))
    const { GET } = await import('@/app/api/notes/route')
    const res = await GET(new NextRequest('http://localhost/api/notes?page=1&limit=12') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.items).toEqual([])
    expect(json.data.pagination.total).toBe(0)
  })
})

// ─── GET /api/categories ───────────────────────────────────────────────────────

describe('GET /api/categories', () => {
  it('returns active categories with note counts', async () => {
    ;(Category.find as any).mockReturnValue(makeChain([{ _id: 'c1', name: 'Web Dev', slug: 'web-dev' }]))
    ;(Note.aggregate as any).mockResolvedValue([{ _id: 'c1', count: 5 }])
    const { GET } = await import('@/app/api/categories/route')
    const res = await GET(new NextRequest('http://localhost/api/categories') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data).toHaveLength(1)
    expect(json.data[0].name).toBe('Web Dev')
  })

  it('returns empty list when no categories exist', async () => {
    ;(Category.find as any).mockReturnValue(makeChain([]))
    ;(Note.aggregate as any).mockResolvedValue([])
    const { GET } = await import('@/app/api/categories/route')
    const res = await GET(new NextRequest('http://localhost/api/categories') as any, undefined)
    expect(res.status).toBe(200)
    expect((await res.json()).data).toEqual([])
  })
})

// ─── GET /api/groups ───────────────────────────────────────────────────────────

describe('GET /api/groups', () => {
  it('returns paginated public groups', async () => {
    ;(Group.find as any).mockReturnValue(makeChain([{ _id: 'g1', name: 'Bundle', slug: 'bundle' }]))
    ;(Group.countDocuments as any).mockReturnValue(makeChain(1))
    const { GET } = await import('@/app/api/groups/route')
    const res = await GET(new NextRequest('http://localhost/api/groups') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.items).toHaveLength(1)
    expect(json.data.pagination.total).toBe(1)
  })

  it('filters by visibility public only', async () => {
    ;(Group.find as any).mockReturnValue(makeChain([]))
    const { GET } = await import('@/app/api/groups/route')
    await GET(new NextRequest('http://localhost/api/groups') as any, undefined)
    expect(Group.find).toHaveBeenCalledWith({ visibility: 'public' })
  })
})

// ─── GET /api/groups/[slug] ────────────────────────────────────────────────────

describe('GET /api/groups/[slug]', () => {
  it('returns group with included notes and related groups', async () => {
    const group = { _id: 'g1', slug: 'bundle', visibility: 'public', name: 'Bundle', notes: ['n1'], category: { _id: 'c1' } }
    ;(Group.findOne as any).mockReturnValue(makeChain(group))
    ;(Note.find as any).mockReturnValue(makeChain([{ _id: 'n1', title: 'Note 1', category: null }]))
    ;(Group.find as any).mockReturnValue(makeChain([]))
    const { GET } = await import('@/app/api/groups/[slug]/route')
    const res = await GET(new NextRequest('http://localhost/api/groups/bundle') as any, { params: Promise.resolve({ slug: 'bundle' }) })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.group.name).toBe('Bundle')
    expect(json.data.relatedGroups).toEqual([])
  })

  it('returns 404 when group not found', async () => {
    ;(Group.findOne as any).mockReturnValue(makeChain(null))
    const { GET } = await import('@/app/api/groups/[slug]/route')
    const res = await GET(new NextRequest('http://localhost/api/groups/missing') as any, { params: Promise.resolve({ slug: 'missing' }) })
    expect(res.status).toBe(404)
  })

  it('filters by visibility public only', async () => {
    ;(Group.findOne as any).mockReturnValue(makeChain(null))
    const { GET } = await import('@/app/api/groups/[slug]/route')
    await GET(new NextRequest('http://localhost/api/groups/secret') as any, { params: Promise.resolve({ slug: 'secret' }) })
    expect(Group.findOne).toHaveBeenCalledWith(expect.objectContaining({ visibility: 'public' }))
  })
})

// ─── GET /api/filters ──────────────────────────────────────────────────────────

describe('GET /api/filters', () => {
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
    const { GET } = await import('@/app/api/filters/route')
    const res = await GET(new NextRequest('http://localhost/api/filters') as any, undefined)
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
    const { GET } = await import('@/app/api/filters/route')
    const res = await GET(new NextRequest('http://localhost/api/filters') as any, undefined)
    const json = await res.json()
    expect(json.data.priceRange).toEqual({ minPaise: 0, maxPaise: 0 })
  })
})

// ─── GET /api/home ─────────────────────────────────────────────────────────────

describe('GET /api/home', () => {
  it('returns homepage data with featured items', async () => {
    ;(Note.find as any).mockImplementation((filter: any) => {
      if (filter.isFeatured !== undefined) return makeChain([])
      if (filter.pricingType === 'free') return makeChain([])
      return makeChain([])
    })
    ;(Group.find as any).mockReturnValue(makeChain([]))
    ;(Category.find as any).mockReturnValue(makeChain([{ _id: 'c1', name: 'Dev', slug: 'dev' }]))
    ;(Note.countDocuments as any).mockReturnValue(makeChain(100))
    ;(Note.aggregate as any).mockImplementation((pipeline: any[]) => {
      // download-count aggregation
      if (pipeline.length === 1 && pipeline[0].$match) return Promise.resolve([{ total: 500 }])
      // category-count aggregation with $group
      return Promise.resolve([{ _id: 'c1', count: 3 }])
    })
    ;(Order.countDocuments as any).mockReturnValue(makeChain(80))

    const { GET } = await import('@/app/api/home/route')
    const res = await GET(new NextRequest('http://localhost/api/home') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.stats.totalNotes).toBe(100)
    expect(json.data.stats.happyLearners).toBe(80)
    expect(json.data.featuredNotes).toEqual([])
    expect(json.data.categories).toHaveLength(1)
  })
})

// ─── GET /api/notes/[slug] ─────────────────────────────────────────────────────

describe('GET /api/notes/[slug]', () => {
  beforeEach(() => {
    ;(enforceRateLimit as any).mockImplementation(() => undefined)
  })

  it('returns note with related content on success', async () => {
    const note = { _id: 'n1', slug: 'my-note', visibility: 'public', title: 'My Note', category: { _id: 'c1', name: 'Dev' }, tags: [] }
    ;(Note.findOne as any).mockReturnValue(makeChain(note))
    ;(Note.find as any).mockReturnValue(makeChain([]))
    ;(Group.find as any).mockReturnValue(makeChain([]))

    const { GET } = await import('@/app/api/notes/[slug]/route')
    const res = await GET(new NextRequest('http://localhost/api/notes/my-note') as any, { params: Promise.resolve({ slug: 'my-note' }) })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.note.title).toBe('My Note')
    expect(Note.findOne).toHaveBeenCalledWith({ slug: 'my-note', visibility: 'public' })
  })

  it('returns 404 when note is not found', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain(null))
    const { GET } = await import('@/app/api/notes/[slug]/route')
    const res = await GET(new NextRequest('http://localhost/api/notes/nonexistent') as any, { params: Promise.resolve({ slug: 'nonexistent' }) })
    expect(res.status).toBe(404)
  })

  it('filters by visibility public only', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain(null))
    const { GET } = await import('@/app/api/notes/[slug]/route')
    await GET(new NextRequest('http://localhost/api/notes/admin-only') as any, { params: Promise.resolve({ slug: 'admin-only' }) })
    expect(Note.findOne).toHaveBeenCalledWith(expect.objectContaining({ visibility: 'public' }))
  })
})

// ─── GET /api/notes/[slug]/download ────────────────────────────────────────────

describe('GET /api/notes/[slug]/download', () => {
  beforeEach(() => {
    ;(enforceRateLimit as any).mockImplementation(() => undefined)
    vi.mocked(fs.existsSync).mockReturnValue(false)
  })

  it('returns 404 when note is not found', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain(null))
    const { GET } = await import('@/app/api/notes/[slug]/download/route')
    const res = await GET(new NextRequest('http://localhost/api/notes/gone/download') as any, { params: Promise.resolve({ slug: 'gone' }) })
    expect(res.status).toBe(404)
  })

  it('returns 403 for paid notes', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain({ _id: 'n1', slug: 'paid-note', visibility: 'public', pricingType: 'paid' }))
    const { GET } = await import('@/app/api/notes/[slug]/download/route')
    const res = await GET(new NextRequest('http://localhost/api/notes/paid-note/download') as any, { params: Promise.resolve({ slug: 'paid-note' }) })
    expect(res.status).toBe(403)
  })

  it('downloads free note via cloudinary signed URL', async () => {
    const fakeBuffer = Buffer.from('fake-pdf')
    ;(fs.readFileSync as any).mockReturnValue(fakeBuffer)
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'free-note', visibility: 'public', pricingType: 'free',
      fullFilePublicId: 'pub/n1', fullFileUrl: null,
    }))
    ;(buildSignedUrl as any).mockReturnValue('https://signed-url.com/n1.pdf')
    global.fetch = vi.fn().mockResolvedValue({ ok: true, arrayBuffer: () => Promise.resolve(fakeBuffer.buffer) })

    const { GET } = await import('@/app/api/notes/[slug]/download/route')
    const res = await GET(new NextRequest('http://localhost/api/notes/free-note/download') as any, { params: Promise.resolve({ slug: 'free-note' }) })
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/pdf')
    expect(incrementDownloadCount).toHaveBeenCalledWith('n1')
  })

  it('falls back to fullFileUrl when cloudinary fails', async () => {
    const fakeBuffer = Buffer.from('fallback-pdf')
    ;(fs.readFileSync as any).mockReturnValue(fakeBuffer)
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'free-note', visibility: 'public', pricingType: 'free',
      fullFilePublicId: 'pub/n1', fullFileUrl: 'https://example.com/n1.pdf',
    }))
    ;(buildSignedUrl as any).mockReturnValue('https://signed-url.com/n1.pdf')
    global.fetch = vi.fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({ ok: true, arrayBuffer: () => Promise.resolve(fakeBuffer.buffer) })

    const { GET } = await import('@/app/api/notes/[slug]/download/route')
    const res = await GET(new NextRequest('http://localhost/api/notes/free-note/download') as any, { params: Promise.resolve({ slug: 'free-note' }) })
    expect(res.status).toBe(200)
  })

  it('reads sample.pdf when no other source available', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    const sampleBuffer = Buffer.from('sample-pdf')
    vi.mocked(fs.readFileSync).mockReturnValue(sampleBuffer)
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'no-file', visibility: 'public', pricingType: 'free',
      fullFilePublicId: null, fullFileUrl: null,
    }))

    const { GET } = await import('@/app/api/notes/[slug]/download/route')
    const res = await GET(new NextRequest('http://localhost/api/notes/no-file/download') as any, { params: Promise.resolve({ slug: 'no-file' }) })
    expect(res.status).toBe(200)
    expect(fs.readFileSync).toHaveBeenCalled()
  })

  it('returns 404 when no file buffer can be obtained', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'empty-note', visibility: 'public', pricingType: 'free',
      fullFilePublicId: null, fullFileUrl: null,
    }))
    const { GET } = await import('@/app/api/notes/[slug]/download/route')
    const res = await GET(new NextRequest('http://localhost/api/notes/empty-note/download') as any, { params: Promise.resolve({ slug: 'empty-note' }) })
    expect(res.status).toBe(404)
  })

  it('sets proper cache headers for download', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from('x'))
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'f', visibility: 'public', pricingType: 'free',
      fullFilePublicId: null, fullFileUrl: null,
    }))
    const { GET } = await import('@/app/api/notes/[slug]/download/route')
    const res = await GET(new NextRequest('http://localhost/api/notes/f/download') as any, { params: Promise.resolve({ slug: 'f' }) })
    expect(res.headers.get('Cache-Control')).toBe('private, no-store')
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff')
  })

  it('enforces rate limit', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from('x'))
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'rl', visibility: 'public', pricingType: 'free',
      fullFilePublicId: null, fullFileUrl: null,
    }))
    const { GET } = await import('@/app/api/notes/[slug]/download/route')
    await GET(new NextRequest('http://localhost/api/notes/rl/download') as any, { params: Promise.resolve({ slug: 'rl' }) })
    expect(enforceRateLimit).toHaveBeenCalledWith('noteDownload', null, expect.objectContaining({ limit: 30 }))
  })
})

// ─── GET /api/notes/[slug]/preview ─────────────────────────────────────────────

describe('GET /api/notes/[slug]/preview', () => {
  it('returns 400 when slug is missing', async () => {
    const { GET } = await import('@/app/api/notes/[slug]/preview/route')
    const req = new NextRequest('http://localhost/api/notes//preview')
    const res = await GET(req as any, { params: Promise.resolve({ slug: '' }) })
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })

  it('returns 404 when note not found', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain(null))
    const { GET } = await import('@/app/api/notes/[slug]/preview/route')
    const req = new NextRequest('http://localhost/api/notes/nope/preview')
    const res = await GET(req as any, { params: Promise.resolve({ slug: 'nope' }) })
    expect(res.status).toBe(404)
  })

  it('returns 404 when no preview URL available', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain({ _id: 'n1', slug: 'n', previewFileUrl: null, fullFileUrl: null }))
    const { GET } = await import('@/app/api/notes/[slug]/preview/route')
    const req = new NextRequest('http://localhost/api/notes/n/preview')
    const res = await GET(req as any, { params: Promise.resolve({ slug: 'n' }) })
    expect(res.status).toBe(404)
  })

  it('returns PDF preview content successfully', async () => {
    const buf = Buffer.from('preview-pdf')
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'n', previewFileUrl: null, fullFileUrl: 'https://cdn/test.pdf',
    }))
    global.fetch = vi.fn().mockResolvedValue({ ok: true, arrayBuffer: () => Promise.resolve(buf.buffer) })
    const { GET } = await import('@/app/api/notes/[slug]/preview/route')
    const req = new NextRequest('http://localhost/api/notes/n/preview')
    const res = await GET(req as any, { params: Promise.resolve({ slug: 'n' }) })
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/pdf')
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600')
  })

  it('redirects when PDF fetch fails', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'n', previewFileUrl: null, fullFileUrl: 'https://cdn/test.pdf',
    }))
    global.fetch = vi.fn().mockResolvedValue({ ok: false })
    const { GET } = await import('@/app/api/notes/[slug]/preview/route')
    const req = new NextRequest('http://localhost/api/notes/n/preview')
    const res = await GET(req as any, { params: Promise.resolve({ slug: 'n' }) })
    expect(res.status).toBe(307)
  })

  it('returns inline content-disposition when mode=view', async () => {
    const buf = Buffer.from('preview-pdf')
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'n', previewFileUrl: null, fullFileUrl: 'https://cdn/test.pdf',
    }))
    global.fetch = vi.fn().mockResolvedValue({ ok: true, arrayBuffer: () => Promise.resolve(buf.buffer) })
    const { GET } = await import('@/app/api/notes/[slug]/preview/route')
    const req = new NextRequest('http://localhost/api/notes/n/preview?mode=view')
    const res = await GET(req as any, { params: Promise.resolve({ slug: 'n' }) })
    expect(res.headers.get('Content-Disposition')).toBe('inline')
  })

  it('uses previewFileUrl over fullFileUrl when both present', async () => {
    const buf = Buffer.from('preview-pdf')
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'n', previewFileUrl: 'https://cdn/preview.pdf', fullFileUrl: 'https://cdn/full.pdf',
    }))
    global.fetch = vi.fn().mockResolvedValue({ ok: true, arrayBuffer: () => Promise.resolve(buf.buffer) })
    const { GET } = await import('@/app/api/notes/[slug]/preview/route')
    await GET(new NextRequest('http://localhost/api/notes/n/preview') as any, { params: Promise.resolve({ slug: 'n' }) })
    expect(global.fetch).toHaveBeenCalledWith('https://cdn/preview.pdf')
  })

  it('handles internal server errors gracefully', async () => {
    const crashChain = {
      populate: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockRejectedValue(new Error('db crash')),
    }
    ;(Note.findOne as any).mockReturnValue(crashChain)
    const { GET } = await import('@/app/api/notes/[slug]/preview/route')
    const req = new NextRequest('http://localhost/api/notes/n/preview')
    const res = await GET(req as any, { params: Promise.resolve({ slug: 'n' }) })
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('INTERNAL_ERROR')
  })
})
