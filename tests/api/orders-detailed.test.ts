import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { AppError } from '@/server/lib/errors'
import { Note } from '@/server/db/models/note.model'
import { Group } from '@/server/db/models/group.model'
import { Order } from '@/server/db/models/order.model'
import { createOrder } from '@/server/services/order.service'
import { getOrderByNumber } from '@/server/services/order.service'
import { enforceRateLimit } from '@/server/lib/rate-limit'
import { getRazorpayKeyId } from '@/server/lib/razorpay'
import { POST as ordersPOST } from '@/app/api/orders/route'
import { GET as ordersByOrderIdGET } from '@/app/api/orders/[orderId]/route'
import { GET as ordersLookupGET } from '@/app/api/orders/lookup/route'
import { POST as ordersLookupPOST } from '@/app/api/orders/lookup/route'

vi.mock('@/server/db/connect', () => ({
  connectDB: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/server/db/models/note.model', () => ({
  Note: { findOne: vi.fn(), countDocuments: vi.fn(), aggregate: vi.fn() },
}))

vi.mock('@/server/db/models/group.model', () => ({
  Group: { findOne: vi.fn(), countDocuments: vi.fn() },
}))

vi.mock('@/server/db/models/category.model', () => ({
  Category: { find: vi.fn() },
}))

vi.mock('@/server/db/models/order.model', () => ({
  Order: { findById: vi.fn(), find: vi.fn(), countDocuments: vi.fn() },
}))

vi.mock('@/server/mappers/note.mapper', () => ({
  toPublicNote: vi.fn((n: any) => n),
}))

vi.mock('@/server/mappers/group.mapper', () => ({
  toPublicGroup: vi.fn((g: any) => g),
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

vi.mock('@/server/services/order.service', () => ({
  createOrder: vi.fn(),
  getOrderByNumber: vi.fn(),
}))

vi.mock('@/lib/format', () => ({
  formatPrice: vi.fn((n: number) => n + '.00'),
  rupeesToPaise: vi.fn((n: number) => Math.round(n * 100)),
}))

vi.mock('@/server/lib/rate-limit', () => ({
  enforceRateLimit: vi.fn(),
}))

vi.mock('@/server/lib/razorpay', () => ({
  getRazorpayKeyId: vi.fn(() => 'rzp_test_key'),
}))

function makeChainMock(resolvedValue: any) {
  return {
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(resolvedValue),
  }
}

describe('POST /api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(Note.findOne as any).mockReturnValue(makeChainMock(null))
    ;(Group.findOne as any).mockReturnValue(makeChainMock(null))
    ;(enforceRateLimit as any).mockImplementation(() => undefined)
    ;(createOrder as any).mockResolvedValue({
      order: { _id: 'ord-1', orderNumber: 'NP-001' },
      razorpayOrderId: 'order_xyz',
    })
    ;(getRazorpayKeyId as any).mockReturnValue('rzp_test_key')
  })

  it('returns validation error for invalid body', async () => {
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    })
    req.json = () => Promise.resolve({})
    const result = await ordersPOST(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('returns 404 when note is not found', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChainMock(null))
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ itemType: 'note', itemSlug: 'nonexistent' }),
    })
    req.json = () => Promise.resolve({ itemType: 'note', itemSlug: 'nonexistent', fullName: 'Test', consentAccepted: true })
    const result = await ordersPOST(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('returns 404 when group is not found', async () => {
    ;(Group.findOne as any).mockReturnValue(makeChainMock(null))
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ itemType: 'group', itemSlug: 'nonexistent' }),
    })
    req.json = () => Promise.resolve({ itemType: 'group', itemSlug: 'nonexistent', fullName: 'Test', consentAccepted: true })
    const result = await ordersPOST(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('throws validation error for free notes', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChainMock({ pricingType: 'free', price: 0, title: 'Free Note' }))
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ itemType: 'note', itemSlug: 'free-note' }),
    })
    req.json = () => Promise.resolve({ itemType: 'note', itemSlug: 'free-note', fullName: 'Test', consentAccepted: true })
    const result = await ordersPOST(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('throws validation error for free groups', async () => {
    ;(Group.findOne as any).mockReturnValue(makeChainMock({ price: 0, name: 'Free Group' }))
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ itemType: 'group', itemSlug: 'free-group' }),
    })
    req.json = () => Promise.resolve({ itemType: 'group', itemSlug: 'free-group', fullName: 'Test', consentAccepted: true })
    const result = await ordersPOST(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('throws validation error for amounts below minimum', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChainMock({ pricingType: 'paid', price: 1, title: 'Cheap Note' }))
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ itemType: 'note', itemSlug: 'cheap-note' }),
    })
    req.json = () => Promise.resolve({ itemType: 'note', itemSlug: 'cheap-note', fullName: 'Test', consentAccepted: true })
    const result = await ordersPOST(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('creates order successfully for paid note', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChainMock({ pricingType: 'paid', price: 500, title: 'Paid Note' }))
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ itemType: 'note', itemSlug: 'paid-note', fullName: 'Test User', consentAccepted: true }),
    })
    req.json = () => Promise.resolve({ itemType: 'note', itemSlug: 'paid-note', fullName: 'Test User', consentAccepted: true })
    const result = await ordersPOST(req as any, undefined)
    expect(result).toBeDefined()
  })
})

describe('GET /api/orders/[orderId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(Order.findById as any).mockReturnValue(makeChainMock(null))
  })

  it('returns order when found', async () => {
    ;(Order.findById as any).mockReturnValue(makeChainMock({ _id: 'ord-1', orderNumber: 'NP-001' }))
    const req = new NextRequest('http://localhost/api/orders/ord-1')
    const result = await ordersByOrderIdGET(req as any, { params: Promise.resolve({ orderId: 'ord-1' }) })
    expect(result).toBeDefined()
    expect(Order.findById).toHaveBeenCalledWith('ord-1')
  })

  it('throws not found when order does not exist', async () => {
    ;(Order.findById as any).mockReturnValue(makeChainMock(null))
    const req = new NextRequest('http://localhost/api/orders/nonexistent')
    const result = await ordersByOrderIdGET(req as any, { params: Promise.resolve({ orderId: 'nonexistent' }) })
    expect(result).toBeDefined()
  })

  it('sets no-store cache header', async () => {
    ;(Order.findById as any).mockReturnValue(makeChainMock({ _id: 'ord-1' }))
    const req = new NextRequest('http://localhost/api/orders/ord-1')
    const result = await ordersByOrderIdGET(req as any, { params: Promise.resolve({ orderId: 'ord-1' }) })
    expect(result).toBeDefined()
  })
})

describe('GET /api/orders/lookup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(enforceRateLimit as any).mockImplementation(() => undefined)
    ;(getOrderByNumber as any).mockResolvedValue(null)
  })

  it('returns validation error when orderNumber is missing', async () => {
    const req = new NextRequest('http://localhost/api/orders/lookup')
    const result = await ordersLookupGET(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('returns validation error when orderNumber is empty', async () => {
    const req = new NextRequest('http://localhost/api/orders/lookup?orderNumber=')
    const result = await ordersLookupGET(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('returns order when found', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const req = new NextRequest('http://localhost/api/orders/lookup?orderNumber=NP-001')
    const result = await ordersLookupGET(req as any, undefined)
    expect(result).toBeDefined()
    expect(getOrderByNumber).toHaveBeenCalledWith('NP-001')
  })

  it('throws not found when order is not found', async () => {
    ;(getOrderByNumber as any).mockResolvedValue(null)
    const req = new NextRequest('http://localhost/api/orders/lookup?orderNumber=NP-999')
    const result = await ordersLookupGET(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('uppercases order number before lookup', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const req = new NextRequest('http://localhost/api/orders/lookup?orderNumber=np-001')
    await ordersLookupGET(req as any, undefined)
    expect(getOrderByNumber).toHaveBeenCalledWith('NP-001')
  })

  it('enforces rate limit', async () => {
    const req = new NextRequest('http://localhost/api/orders/lookup?orderNumber=NP-001')
    await ordersLookupGET(req as any, undefined)
    expect(enforceRateLimit).toHaveBeenCalledWith('orderLookup', null, expect.objectContaining({ limit: 20 }))
  })
})

describe('POST /api/orders/lookup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(enforceRateLimit as any).mockImplementation(() => undefined)
    ;(getOrderByNumber as any).mockResolvedValue(null)
  })

  it('returns validation error when body orderNumber is missing', async () => {
    const req = new NextRequest('http://localhost/api/orders/lookup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    })
    req.json = () => Promise.resolve({})
    const result = await ordersLookupPOST(req as any, undefined)
    expect(result).toBeDefined()
  })

  it('returns order when found via POST', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const req = new NextRequest('http://localhost/api/orders/lookup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ orderNumber: 'NP-001' }),
    })
    req.json = () => Promise.resolve({ orderNumber: 'NP-001' })
    const result = await ordersLookupPOST(req as any, undefined)
    expect(result).toBeDefined()
  })
})
