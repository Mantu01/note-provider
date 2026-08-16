import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/server/lib/razorpay', () => ({
  getRazorpayKeyId: vi.fn(() => 'rzp_test_key'),
  verifyWebhookSignature: vi.fn(() => true),
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

describe('routes index', () => {
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
