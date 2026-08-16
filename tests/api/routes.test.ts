import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/server/lib/razorpay', () => ({
  getRazorpayKeyId: vi.fn(() => 'rzp_test_key'),
  verifyWebhookSignature: vi.fn(() => true),
  razorpay: { orders: { create: vi.fn() } },
}))

vi.mock('@/server/db/connect', () => ({
  connectDb: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/server/db/models/note.model', () => ({
  Note: {
    find: vi.fn(),
    countDocuments: vi.fn(),
    aggregate: vi.fn(),
    findOne: vi.fn(),
  },
}))

vi.mock('@/server/db/models/group.model', () => ({
  Group: {
    find: vi.fn(),
    countDocuments: vi.fn(),
    findOne: vi.fn(),
  },
}))

vi.mock('@/server/db/models/category.model', () => ({
  Category: {
    find: vi.fn(),
    countDocuments: vi.fn(),
  },
}))

vi.mock('@/server/db/models/order.model', () => ({
  Order: {
    countDocuments: vi.fn(),
  },
}))

vi.mock('@/server/mappers/note.mapper', () => ({
  toPublicNote: vi.fn((n) => n),
}))

vi.mock('@/server/mappers/group.mapper', () => ({
  toPublicGroup: vi.fn((g) => g),
}))

vi.mock('@/server/mappers/category.mapper', () => ({
  toPublicCategory: vi.fn((c) => c),
}))

vi.mock('@/server/lib/query', () => ({
  parsePagination: vi.fn(() => ({ page: 1, limit: 12, skip: 0 })),
  buildPagination: vi.fn(() => ({ page: 1, limit: 12, total: 0, totalPages: 1, hasNext: false, hasPrev: false })),
  buildNoteFilter: vi.fn(() => ({})),
  buildNoteSort: vi.fn(() => ({ createdAt: -1 })),
  resolveCategoryIds: vi.fn(async () => undefined),
  parseArrayParam: vi.fn(() => []),
  parseBooleanParam: vi.fn(() => undefined),
  parseNumberParam: vi.fn(() => undefined),
}))

function mockLeanExec(data: any[]) {
  return { lean: () => ({ exec: vi.fn().mockResolvedValue(data) }) }
}

function mockCount(count: number) {
  return { exec: vi.fn().mockResolvedValue(count) }
}

const { Note } = await import('@/server/db/models/note.model')
const { Group } = await import('@/server/db/models/group.model')
const { Category } = await import('@/server/db/models/category.model')
const { Order } = await import('@/server/db/models/order.model')
const { parsePagination, buildPagination, buildNoteFilter, buildNoteSort, resolveCategoryIds, parseArrayParam, parseBooleanParam, parseNumberParam } = await import('@/server/lib/query')

describe('routes index', () => {
  beforeEach(() => {
  })

  it('has GET handler for home', async () => {
    const mod = await import('@/app/api/home/route')
    expect(mod.GET).toBeDefined()
  })

  it('has GET handler for notes', async () => {
    const mod = await import('@/app/api/notes/route')
    expect(mod.GET).toBeDefined()
  })

  it('has GET handler for notes by slug', async () => {
    const mod = await import('@/app/api/notes/[slug]/route')
    expect(mod.GET).toBeDefined()
  })

  it('has GET handler for groups', async () => {
    const mod = await import('@/app/api/groups/route')
    expect(mod.GET).toBeDefined()
  })

  it('has GET handler for groups by slug', async () => {
    const mod = await import('@/app/api/groups/[slug]/route')
    expect(mod.GET).toBeDefined()
  })

  it('has GET handler for filters', async () => {
    const mod = await import('@/app/api/filters/route')
    expect(mod.GET).toBeDefined()
  })

  it('has POST handler for orders', async () => {
    const mod = await import('@/app/api/orders/route')
    expect(mod.POST).toBeDefined()
  })

  it('has GET handler for orders by orderId', async () => {
    const mod = await import('@/app/api/orders/[orderId]/route')
    expect(mod.GET).toBeDefined()
  })

  it('has GET handler for order lookup', async () => {
    const mod = await import('@/app/api/orders/lookup/route')
    expect(mod.GET).toBeDefined()
  })

  it('has POST handler for order lookup', async () => {
    const mod = await import('@/app/api/orders/lookup/route')
    expect(mod.POST).toBeDefined()
  })

  it('has GET handler for categories', async () => {
    const mod = await import('@/app/api/categories/route')
    expect(mod.GET).toBeDefined()
  })

  it('has POST handler for admin auth login', async () => {
    const mod = await import('@/app/api/admin/auth/login/route')
    expect(mod.POST).toBeDefined()
  })

  it('has POST handler for admin auth logout', async () => {
    const mod = await import('@/app/api/admin/auth/logout/route')
    expect(mod.POST).toBeDefined()
  })

  it('has GET handler for admin auth me', async () => {
    const mod = await import('@/app/api/admin/auth/me/route')
    expect(mod.GET).toBeDefined()
  })

  it('has POST handler for admin auth register', async () => {
    const mod = await import('@/app/api/admin/auth/register/route')
    expect(mod.POST).toBeDefined()
  })

  it('has GET handler for admin dashboard', async () => {
    const mod = await import('@/app/api/admin/dashboard/route')
    expect(mod.GET).toBeDefined()
  })

  it('has GET handler for admin admins', async () => {
    const mod = await import('@/app/api/admin/admins/route')
    expect(mod.GET).toBeDefined()
  })

  it('has GET handler for admin categories', async () => {
    const mod = await import('@/app/api/admin/categories/route')
    expect(mod.GET).toBeDefined()
  })

  it('has POST handler for admin categories', async () => {
    const mod = await import('@/app/api/admin/categories/route')
    expect(mod.POST).toBeDefined()
  })

  it('has PATCH handler for admin categories by id', async () => {
    const mod = await import('@/app/api/admin/categories/[id]/route')
    expect(mod.PATCH).toBeDefined()
  })

  it('has DELETE handler for admin categories by id', async () => {
    const mod = await import('@/app/api/admin/categories/[id]/route')
    expect(mod.DELETE).toBeDefined()
  })

  it('has GET handler for admin groups', async () => {
    const mod = await import('@/app/api/admin/groups/route')
    expect(mod.GET).toBeDefined()
  })

  it('has POST handler for admin groups', async () => {
    const mod = await import('@/app/api/admin/groups/route')
    expect(mod.POST).toBeDefined()
  })

  it('has GET handler for admin groups by id', async () => {
    const mod = await import('@/app/api/admin/groups/[id]/route')
    expect(mod.GET).toBeDefined()
  })

  it('has PATCH handler for admin groups by id', async () => {
    const mod = await import('@/app/api/admin/groups/[id]/route')
    expect(mod.PATCH).toBeDefined()
  })

  it('has DELETE handler for admin groups by id', async () => {
    const mod = await import('@/app/api/admin/groups/[id]/route')
    expect(mod.DELETE).toBeDefined()
  })

  it('has GET handler for admin notes', async () => {
    const mod = await import('@/app/api/admin/notes/route')
    expect(mod.GET).toBeDefined()
  })

  it('has POST handler for admin notes', async () => {
    const mod = await import('@/app/api/admin/notes/route')
    expect(mod.POST).toBeDefined()
  })

  it('has GET handler for admin notes by id', async () => {
    const mod = await import('@/app/api/admin/notes/[id]/route')
    expect(mod.GET).toBeDefined()
  })

  it('has PATCH handler for admin notes by id', async () => {
    const mod = await import('@/app/api/admin/notes/[id]/route')
    expect(mod.PATCH).toBeDefined()
  })

  it('has DELETE handler for admin notes by id', async () => {
    const mod = await import('@/app/api/admin/notes/[id]/route')
    expect(mod.DELETE).toBeDefined()
  })

  it('has GET handler for admin orders', async () => {
    const mod = await import('@/app/api/admin/orders/route')
    expect(mod.GET).toBeDefined()
  })

  it('has GET handler for admin orders by id', async () => {
    const mod = await import('@/app/api/admin/orders/[id]/route')
    expect(mod.GET).toBeDefined()
  })

  it('has PATCH handler for admin orders by id', async () => {
    const mod = await import('@/app/api/admin/orders/[id]/route')
    expect(mod.PATCH).toBeDefined()
  })

  it('has DELETE handler for admin orders by id', async () => {
    const mod = await import('@/app/api/admin/orders/[id]/route')
    expect(mod.DELETE).toBeDefined()
  })

  it('has GET handler for admin leads', async () => {
    const mod = await import('@/app/api/admin/leads/route')
    expect(mod.GET).toBeDefined()
  })

  it('has GET handler for admin leads export', async () => {
    const mod = await import('@/app/api/admin/leads/export/route')
    expect(mod.GET).toBeDefined()
  })

  it('has GET handler for admin activities', async () => {
    const mod = await import('@/app/api/admin/activities/route')
    expect(mod.GET).toBeDefined()
  })

  it('has POST handler for admin uploads', async () => {
    const mod = await import('@/app/api/admin/uploads/route')
    expect(mod.POST).toBeDefined()
  })

  it('has DELETE handler for admin uploads', async () => {
    const mod = await import('@/app/api/admin/uploads/route')
    expect(mod.DELETE).toBeDefined()
  })

  it('has POST handler for razorpay webhook', async () => {
    const mod = await import('@/app/api/webhooks/razorpay/route')
    expect(mod.POST).toBeDefined()
  })

  it('has GET handler for note preview', async () => {
    const mod = await import('@/app/api/notes/[slug]/preview/route')
    expect(mod.GET).toBeDefined()
  })

  it('has GET handler for note download', async () => {
    const mod = await import('@/app/api/notes/[slug]/download/route')
    expect(mod.GET).toBeDefined()
  })
})

describe('GET /api/home', () => {
  beforeEach(() => {
    ;(Note.find as any).mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
    ;(Category.find as any).mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
    ;(Note.countDocuments as any).mockReturnValue(mockCount(0))
    ;(Note.aggregate as any).mockReturnValue({ then: vi.fn((cb: any) => cb([{ total: 0 }])) })
    ;(Group.find as any).mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
    ;(Order.countDocuments as any).mockReturnValue(mockCount(0))
  })

  it('returns featured notes, latest notes, free notes, featured groups, categories, and stats', async () => {
    const { GET: homeGET } = await import('@/app/api/home/route')
    const req = new NextRequest('http://localhost/api/home')
    const result = await homeGET(req as any, undefined)
    expect(result).toBeDefined()
    expect(Note.find).toHaveBeenCalledTimes(3)
    expect(Category.find).toHaveBeenCalled()
    expect(Note.countDocuments).toHaveBeenCalled()
  })

  it('calls Note.find with correct filters for featured notes', async () => {
    const { GET: homeGET } = await import('@/app/api/home/route')
    const req = new NextRequest('http://localhost/api/home')
    await homeGET(req as any, undefined)
    expect(Note.find).toHaveBeenCalledWith({ isFeatured: true, visibility: 'public' })
  })

  it('calls Note.find with correct filters for public notes', async () => {
    const { GET: homeGET } = await import('@/app/api/home/route')
    const req = new NextRequest('http://localhost/api/home')
    await homeGET(req as any, undefined)
    expect(Note.find).toHaveBeenCalledWith({ visibility: 'public' })
  })

  it('calls Note.find with correct filters for free notes', async () => {
    const { GET: homeGET } = await import('@/app/api/home/route')
    const req = new NextRequest('http://localhost/api/home')
    await homeGET(req as any, undefined)
    expect(Note.find).toHaveBeenCalledWith({ pricingType: 'free', visibility: 'public' })
  })

  it('calls Group.find with correct filters for featured groups', async () => {
    const { GET: homeGET } = await import('@/app/api/home/route')
    const req = new NextRequest('http://localhost/api/home')
    await homeGET(req as any, undefined)
    expect(Group.find).toHaveBeenCalledWith({ isFeatured: true, visibility: 'public' })
  })

  it('calls Category.find with isActive filter', async () => {
    const { GET: homeGET } = await import('@/app/api/home/route')
    const req = new NextRequest('http://localhost/api/home')
    await homeGET(req as any, undefined)
    expect(Category.find).toHaveBeenCalledWith({ isActive: true })
  })

  it('calls Order.countDocuments with paid status filter', async () => {
    const { GET: homeGET } = await import('@/app/api/home/route')
    const req = new NextRequest('http://localhost/api/home')
    await homeGET(req as any, undefined)
    expect(Order.countDocuments).toHaveBeenCalledWith({ paymentStatus: 'paid' })
  })

  it('handles empty aggregate result for total downloads', async () => {
    ;(Note.aggregate as any).mockReturnValue({
      then: vi.fn((cb: any) => cb([])),
    })
    const { GET: homeGET } = await import('@/app/api/home/route')
    const req = new NextRequest('http://localhost/api/home')
    const result = await homeGET(req as any, undefined)
    expect(result).toBeDefined()
  })
})

describe('GET /api/notes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(parsePagination as any).mockReturnValue({ page: 1, limit: 12, skip: 0 })
    ;(buildPagination as any).mockReturnValue({ page: 1, limit: 12, total: 0, totalPages: 1, hasNext: false, hasPrev: false })
    ;(buildNoteFilter as any).mockReturnValue({})
    ;(buildNoteSort as any).mockReturnValue({ createdAt: -1 })
    ;(resolveCategoryIds as any).mockResolvedValue(undefined)
    ;(parseArrayParam as any).mockReturnValue([])
    ;(parseBooleanParam as any).mockReturnValue(undefined)
    ;(parseNumberParam as any).mockReturnValue(undefined)
    ;(Note.find as any).mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
    ;(Note.countDocuments as any).mockReturnValue(mockCount(0))
  })

  it('returns paginated public notes', async () => {
    const { GET: notesGET } = await import('@/app/api/notes/route')
    const req = new NextRequest('http://localhost/api/notes')
    const result = await notesGET(req as any, undefined)
    expect(result).toBeDefined()
    expect(parsePagination).toHaveBeenCalledOnce()
    expect(buildNoteFilter).toHaveBeenCalled()
    expect(buildNoteSort).toHaveBeenCalled()
    expect(Note.find).toHaveBeenCalled()
    expect(Note.countDocuments).toHaveBeenCalled()
  })

  it('parses search params for pagination', async () => {
    const { GET: notesGET } = await import('@/app/api/notes/route')
    const req = new NextRequest('http://localhost/api/notes?page=2&limit=20')
    await notesGET(req as any, undefined)
    expect(parsePagination).toHaveBeenCalledOnce()
  })

  it('handles sort parameter', async () => {
    const { GET: notesGET } = await import('@/app/api/notes/route')
    const req = new NextRequest('http://localhost/api/notes?sort=newest')
    await notesGET(req as any, undefined)
    expect(buildNoteSort).toHaveBeenCalledWith('newest')
  })

  it('defaults sort to newest when not provided', async () => {
    const { GET: notesGET } = await import('@/app/api/notes/route')
    const req = new NextRequest('http://localhost/api/notes')
    await notesGET(req as any, undefined)
    expect(buildNoteSort).toHaveBeenCalledWith('newest')
  })

  it('resolves category IDs when category param is provided', async () => {
    ;(parseArrayParam as any).mockImplementation(() => ['web-dev'])
    ;(resolveCategoryIds as any).mockResolvedValue(['cat-1'])
    const { GET: notesGET } = await import('@/app/api/notes/route')
    const req = new NextRequest('http://localhost/api/notes?category=web-dev')
    await notesGET(req as any, undefined)
    expect(resolveCategoryIds).toHaveBeenCalledWith(expect.anything(), ['web-dev'])
  })

  it('passes categoryIds to filter builder', async () => {
    ;(parseArrayParam as any).mockImplementation(() => ['web-dev'])
    ;(resolveCategoryIds as any).mockResolvedValue(['cat-1'])
    const { GET: notesGET } = await import('@/app/api/notes/route')
    const req = new NextRequest('http://localhost/api/notes?category=web-dev')
    await notesGET(req as any, undefined)
    expect(buildNoteFilter).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ categoryIds: ['cat-1'] }))
  })

  it('handles query with featured flag', async () => {
    (parseBooleanParam as any).mockReturnValue(true)
    const { GET: notesGET } = await import('@/app/api/notes/route')
    const req = new NextRequest('http://localhost/api/notes?featured=true')
    await notesGET(req as any, undefined)
    expect(parseBooleanParam).toHaveBeenCalled()
  })
})

describe('GET /api/notes/[slug]', () => {
  beforeEach(() => {
    ;(Note.findOne as any).mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'note-1', slug: 'test-note', title: 'Test Note', visibility: 'public', category: { _id: 'cat-1' } }),
    })
    ;(Group.find as any).mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
    ;(Note.find as any).mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
  })

  it('returns note with related notes and groups', async () => {
    const { GET: noteSlugGET } = await import('@/app/api/notes/[slug]/route')
    const req = new NextRequest('http://localhost/api/notes/test-note')
    const result = await noteSlugGET(req as any, { params: Promise.resolve({ slug: 'test-note' }) })
    expect(result).toBeDefined()
    expect(Note.findOne).toHaveBeenCalledWith({ slug: 'test-note', visibility: 'public' })
  })

  it('throws not found when note does not exist', async () => {
    ;(Note.findOne as any).mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    })
    const { GET: noteSlugGET } = await import('@/app/api/notes/[slug]/route')
    const req = new NextRequest('http://localhost/api/notes/nonexistent')
    const result = await noteSlugGET(req as any, { params: Promise.resolve({ slug: 'nonexistent' }) })
    expect(result).toBeDefined()
  })

  it('queries related notes excluding the current note', async () => {
    const { GET: noteSlugGET } = await import('@/app/api/notes/[slug]/route')
    const req = new NextRequest('http://localhost/api/notes/test-note')
    await noteSlugGET(req as any, { params: Promise.resolve({ slug: 'test-note' }) })
    expect(Note.find).toHaveBeenCalled()
  })

  it('queries groups containing the note', async () => {
    const { GET: noteSlugGET } = await import('@/app/api/notes/[slug]/route')
    const req = new NextRequest('http://localhost/api/notes/test-note')
    await noteSlugGET(req as any, { params: Promise.resolve({ slug: 'test-note' }) })
    expect(Group.find).toHaveBeenCalledWith(expect.anything())
  })
})

describe('GET /api/groups', () => {
  beforeEach(() => {
    (buildPagination as any).mockReturnValue({ page: 1, limit: 12, total: 0, totalPages: 1, hasNext: false, hasPrev: false })
    ;(Group.find as any).mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
    ;(Group.countDocuments as any).mockReturnValue(mockCount(0))
  })

  it('returns paginated public groups', async () => {
    const { GET: groupsGET } = await import('@/app/api/groups/route')
    const req = new NextRequest('http://localhost/api/groups')
    const result = await groupsGET(req as any, undefined)
    expect(result).toBeDefined()
    expect(Group.find).toHaveBeenCalledWith({ visibility: 'public' })
    expect(Group.countDocuments).toHaveBeenCalledWith({ visibility: 'public' })
  })

  it('applies pagination parameters', async () => {
    const { GET: groupsGET } = await import('@/app/api/groups/route')
    const req = new NextRequest('http://localhost/api/groups?page=2&limit=20')
    await groupsGET(req as any, undefined)
    expect(parsePagination).toHaveBeenCalled()
  })
})

describe('GET /api/groups/[slug]', () => {
  beforeEach(() => {
    ;(Group.findOne as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'group-1', slug: 'test-group', name: 'Test Group', visibility: 'public', notes: ['note-1'], category: { _id: 'cat-1' } }),
    })
    ;(Note.find as any).mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
    ;(Group.find as any).mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
  })

  it('returns group with notes and related groups', async () => {
    const { GET: groupSlugGET } = await import('@/app/api/groups/[slug]/route')
    const req = new NextRequest('http://localhost/api/groups/test-group')
    const result = await groupSlugGET(req as any, { params: Promise.resolve({ slug: 'test-group' }) })
    expect(result).toBeDefined()
    expect(Group.findOne).toHaveBeenCalledWith({ slug: 'test-group', visibility: 'public' })
  })

  it('throws not found when group does not exist', async () => {
    ;(Group.findOne as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    })
    const { GET: groupSlugGET } = await import('@/app/api/groups/[slug]/route')
    const req = new NextRequest('http://localhost/api/groups/nonexistent')
    const result = await groupSlugGET(req as any, { params: Promise.resolve({ slug: 'nonexistent' }) })
    expect(result).toBeDefined()
  })

  it('queries notes belonging to the group', async () => {
    const { GET: groupSlugGET } = await import('@/app/api/groups/[slug]/route')
    const req = new NextRequest('http://localhost/api/groups/test-group')
    await groupSlugGET(req as any, { params: Promise.resolve({ slug: 'test-group' }) })
    expect(Note.find).toHaveBeenCalled()
  })

  it('queries related groups in same category', async () => {
    const { GET: groupSlugGET } = await import('@/app/api/groups/[slug]/route')
    const req = new NextRequest('http://localhost/api/groups/test-group')
    await groupSlugGET(req as any, { params: Promise.resolve({ slug: 'test-group' }) })
    expect(Group.find).toHaveBeenCalled()
  })
})

describe('GET /api/filters', () => {
  beforeEach(() => {
    ;(Category.find as any).mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
    ;(Note.aggregate as any).mockReturnValue([
      {
        categories: [],
        levels: [],
        subjects: [],
        tags: [],
        priceRange: [],
        pricing: [],
      },
    ])
  })

  it('returns categories and filter facets', async () => {
    const { GET: filtersGET } = await import('@/app/api/filters/route')
    const req = new NextRequest('http://localhost/api/filters')
    const result = await filtersGET(req as any, undefined)
    expect(result).toBeDefined()
    expect(Category.find).toHaveBeenCalledWith({ isActive: true })
  })

  it('returns price range in paise', async () => {
    ;(Note.aggregate as any).mockReturnValue([
      {
        categories: [],
        levels: [],
        subjects: [],
        tags: [],
        priceRange: [{ _id: null, min: 100, max: 50000 }],
        pricing: [],
      },
    ])
    const { GET: filtersGET } = await import('@/app/api/filters/route')
    const req = new NextRequest('http://localhost/api/filters')
    const result = await filtersGET(req as any, undefined)
    expect(result).toBeDefined()
  })
})

describe('GET /api/categories', () => {
  beforeEach(() => {
    ;(Category.find as any).mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
    ;(Note.aggregate as any).mockReturnValue([])
  })

  it('returns active categories with note counts', async () => {
    const { GET: categoriesGET } = await import('@/app/api/categories/route')
    const req = new NextRequest('http://localhost/api/categories')
    const result = await categoriesGET(req as any, undefined)
    expect(result).toBeDefined()
    expect(Category.find).toHaveBeenCalledWith({ isActive: true })
  })
})

vi.mock('@/server/services/order.service', () => ({
  createOrder: vi.fn(),
  getOrderByNumber: vi.fn(),
  fulfillOrder: vi.fn(),
  deleteOrder: vi.fn(),
}))

vi.mock('@/server/mappers/order.mapper', () => ({
  toPublicOrder: vi.fn((o) => o),
  toAdminOrder: vi.fn((o) => o),
}))
