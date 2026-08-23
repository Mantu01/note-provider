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
import { requireAdmin } from '@/server/lib/auth-guard'
import { POST as ordersPOST } from '@/app/api/orders/route'
import { GET as ordersByOrderIdGET } from '@/app/api/orders/[orderId]/route'
import { GET as ordersLookupGET } from '@/app/api/orders/lookup/route'
import { POST as ordersLookupPOST } from '@/app/api/orders/lookup/route'
import { checkoutSchema } from '@/lib/schemas/checkout.schema'
import { uploadFile, deleteUpload } from '@/server/services/upload.service'
import { destroyAsset } from '@/server/lib/cloudinary'
import { buildOrderFilter, buildOrderSort } from '@/server/lib/query'
import { UPLOAD_LIMITS } from '@/lib/constants'
import { logActivity } from '@/server/services/activity.service'
import { updateNoteSchema } from '@/lib/schemas/note.schema'
import { updateGroupSchema } from '@/lib/schemas/group.schema'

vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(() => ({ value: 'test-token' })),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}))
vi.mock('@/server/lib/jwt', () => ({
  verifyAdminToken: vi.fn().mockResolvedValue({ sub: 'a1', email: 'a@b.com', name: 'Admin', isHead: false }),
}))
vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))

vi.mock('@/server/db/models/note.model', () => ({
  Note: { findOne: vi.fn(), countDocuments: vi.fn(), aggregate: vi.fn(), findById: vi.fn(), find: vi.fn(), findByIdAndUpdate: vi.fn(), findByIdAndDelete: vi.fn() },
}))

vi.mock('@/server/db/models/group.model', () => ({
  Group: { findOne: vi.fn(), countDocuments: vi.fn(), findById: vi.fn(), find: vi.fn(), findByIdAndUpdate: vi.fn(), findByIdAndDelete: vi.fn(), distinct: vi.fn() },
}))

vi.mock('@/server/db/models/category.model', () => ({
  Category: { find: vi.fn(), countDocuments: vi.fn(), findById: vi.fn(), findByIdAndUpdate: vi.fn(), findByIdAndDelete: vi.fn(), create: vi.fn() },
}))

vi.mock('@/server/db/models/order.model', () => ({
  Order: { findById: vi.fn(), find: vi.fn(), countDocuments: vi.fn(), findOneAndUpdate: vi.fn() },
}))

vi.mock('@/server/db/models/admin-activity.model', () => ({
  AdminActivity: { find: vi.fn(), countDocuments: vi.fn() },
}))

vi.mock('@/server/mappers/note.mapper', () => ({
  toPublicNote: vi.fn((n: any) => n),
  toAdminNote: vi.fn((n: any) => n),
}))

vi.mock('@/server/mappers/group.mapper', () => ({
  toPublicGroup: vi.fn((g: any, notes?: any[]) => ({ ...g, _notes: notes ?? [] })),
  toAdminGroup: vi.fn((g: any) => g),
}))

vi.mock('@/server/mappers/category.mapper', () => ({
  toPublicCategory: vi.fn((c: any, count?: number) => c),
  toAdminCategory: vi.fn((c: any) => c),
}))

vi.mock('@/server/mappers/order.mapper', () => ({
  toPublicOrder: vi.fn((o: any) => o),
  toAdminOrder: vi.fn((o: any) => o),
  toAdminLead: vi.fn((o: any) => o),
}))

vi.mock('@/server/mappers/activity.mapper', () => ({
  toAdminProfile: vi.fn((a: any) => a),
  toAdminActivity: vi.fn((a: any) => a),
}))

vi.mock('@/server/services/order.service', () => ({
  createOrder: vi.fn(),
  getOrderByNumber: vi.fn(),
}))

vi.mock('@/server/services/upload.service', () => ({
  uploadFile: vi.fn(),
  deleteUpload: vi.fn(),
}))

vi.mock('@/server/services/activity.service', () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/server/lib/rate-limit', () => ({
  enforceRateLimit: vi.fn(),
}))

vi.mock('@/server/lib/razorpay', () => ({
  getRazorpayKeyId: vi.fn(() => 'rzp_test_key'),
}))

const authMocks = vi.hoisted(() => ({ requireAdmin: vi.fn(), requireHeadAdmin: vi.fn() }))
vi.mock('@/server/lib/auth-guard', () => authMocks)
vi.mock('./auth-guard', () => authMocks)

vi.mock('@/lib/format', () => ({
  formatPrice: vi.fn((n: number) => n + '.00'),
  rupeesToPaise: vi.fn((n: number) => Math.round(n * 100)),
}))

vi.mock('@/lib/schemas/category.schema', () => ({
  createCategorySchema: { safeParse: vi.fn() },
  updateCategorySchema: { safeParse: vi.fn() },
}))

vi.mock('@/lib/schemas/note.schema', () => ({
  createNoteSchema: { safeParse: vi.fn() },
  updateNoteSchema: { safeParse: vi.fn() },
}))

vi.mock('@/lib/schemas/group.schema', () => ({
  createGroupSchema: { safeParse: vi.fn() },
  updateGroupSchema: { safeParse: vi.fn() },
}))

vi.mock('@/server/lib/slug', () => ({
  uniqueSlug: vi.fn(async (m: any, n: string) => n.toLowerCase()),
  slugify: vi.fn(),
}))

vi.mock('@/server/lib/cloudinary', () => ({
  destroyAsset: vi.fn().mockResolvedValue(undefined),
  buildSignedUrl: vi.fn(),
}))

vi.mock('@/server/lib/query', () => ({
  parsePagination: vi.fn(() => ({ page: 1, limit: 20, skip: 0 })),
  buildPagination: vi.fn(() => ({ page: 1, limit: 20, total: 0, totalPages: 1, hasNext: false, hasPrev: false })),
  buildOrderFilter: vi.fn(() => ({})),
  buildOrderSort: vi.fn(() => ({ createdAt: -1 })),
}))

vi.mock('@/server/lib/csv', () => ({ toCsv: vi.fn() }))

const ADMIN = { id: 'a1', name: 'Admin', email: 'a@b.com', isHead: false }
const HEAD_ADMIN = { ...ADMIN, isHead: true }

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

const VALID_BODY = {
  fullName: 'Test User',
  consentAccepted: true,
}

beforeEach(() => {
  vi.clearAllMocks()
  process.env.ADMIN_REGISTER_SECRET = 'test-secret'
  ;(enforceRateLimit as any).mockImplementation(() => undefined)
  ;(getRazorpayKeyId as any).mockReturnValue('rzp_test_key')
  ;(createOrder as any).mockResolvedValue({
    order: { _id: 'ord-1', orderNumber: 'NP-001' },
    razorpayOrderId: 'order_xyz',
  })
  ;(requireAdmin as any).mockResolvedValue(ADMIN)
})

// ─── POST /api/orders ──────────────────────────────────────────────────────────

describe('POST /api/orders', () => {
  it('returns validation error for empty body', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain(null))
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    })
    req.json = () => Promise.resolve({})
    const result = await ordersPOST(req as any, undefined)
    expect(result.status).toBe(400)
    const json = await result.json()
    expect(json.success).toBe(false)
  })

  it('returns validation error for missing fields', async () => {
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ fullName: 'T' }),
    })
    req.json = () => Promise.resolve({ fullName: 'T' })
    const result = await ordersPOST(req as any, undefined)
    expect(result.status).toBe(400)
  })

  it('returns validation error when consent not accepted', async () => {
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, consentAccepted: false }),
    })
    req.json = () => Promise.resolve({ ...VALID_BODY, consentAccepted: false })
    const result = await ordersPOST(req as any, undefined)
    expect(result.status).toBe(400)
  })

  it('returns 404 when note is not found', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain(null))
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, itemType: 'note', itemSlug: 'nonexistent' }),
    })
    req.json = () => Promise.resolve({ ...VALID_BODY, itemType: 'note', itemSlug: 'nonexistent' })
    const result = await ordersPOST(req as any, undefined)
    expect(result.status).toBe(404)
  })

  it('returns 404 when group is not found', async () => {
    ;(Group.findOne as any).mockReturnValue(makeChain(null))
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, itemType: 'group', itemSlug: 'nonexistent' }),
    })
    req.json = () => Promise.resolve({ ...VALID_BODY, itemType: 'group', itemSlug: 'nonexistent' })
    const result = await ordersPOST(req as any, undefined)
    expect(result.status).toBe(404)
  })

  it('throws validation error for free notes', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain({ pricingType: 'free', price: 0, title: 'Free Note' }))
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, itemType: 'note', itemSlug: 'free-note' }),
    })
    req.json = () => Promise.resolve({ ...VALID_BODY, itemType: 'note', itemSlug: 'free-note' })
    const result = await ordersPOST(req as any, undefined)
    expect(result.status).toBe(400)
  })

  it('throws validation error for free groups', async () => {
    ;(Group.findOne as any).mockReturnValue(makeChain({ price: 0, name: 'Free Group' }))
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, itemType: 'group', itemSlug: 'free-group' }),
    })
    req.json = () => Promise.resolve({ ...VALID_BODY, itemType: 'group', itemSlug: 'free-group' })
    const result = await ordersPOST(req as any, undefined)
    expect(result.status).toBe(400)
  })

  it('throws validation error for amounts below minimum', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain({ pricingType: 'paid', price: 50, title: 'Cheap Note' }))
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, itemType: 'note', itemSlug: 'cheap-note' }),
    })
    req.json = () => Promise.resolve({ ...VALID_BODY, itemType: 'note', itemSlug: 'cheap-note' })
    const result = await ordersPOST(req as any, undefined)
    expect(result.status).toBe(400)
  })

  it('creates order successfully for paid note', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain({ pricingType: 'paid', price: 500, title: 'Paid Note' }))
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, itemType: 'note', itemSlug: 'paid-note' }),
    })
    req.json = () => Promise.resolve({ ...VALID_BODY, itemType: 'note', itemSlug: 'paid-note' })
    const result = await ordersPOST(req as any, undefined)
    expect(result.status).toBe(200)
    const json = await result.json()
    expect(json.data.orderId).toBe('ord-1')
    expect(json.data.amount).toBe(500)
    expect(createOrder).toHaveBeenCalled()
  })

  it('creates order successfully for paid group', async () => {
    ;(Group.findOne as any).mockReturnValue(makeChain({ price: 1000, name: 'Premium Bundle' }))
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, itemType: 'group', itemSlug: 'premium-bundle' }),
    })
    req.json = () => Promise.resolve({ ...VALID_BODY, itemType: 'group', itemSlug: 'premium-bundle' })
    const result = await ordersPOST(req as any, undefined)
    expect(result.status).toBe(200)
    expect(createOrder).toHaveBeenCalled()
  })

  it('uses correct razorpay key ID in response', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain({ pricingType: 'paid', price: 500, title: 'N' }))
    ;(getRazorpayKeyId as any).mockReturnValue('rzp_live_key')
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, itemType: 'note', itemSlug: 'n' }),
    })
    req.json = () => Promise.resolve({ ...VALID_BODY, itemType: 'note', itemSlug: 'n' })
    const result = await ordersPOST(req as any, undefined)
    const json = await result.json()
    expect(json.data.razorpayKeyId).toBe('rzp_live_key')
  })

  it('enforces rate limit', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain({ pricingType: 'paid', price: 500, title: 'N' }))
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, itemType: 'note', itemSlug: 'n' }),
    })
    req.json = () => Promise.resolve({ ...VALID_BODY, itemType: 'note', itemSlug: 'n' })
    await ordersPOST(req as any, undefined)
    expect(enforceRateLimit).toHaveBeenCalledWith('createOrder', null, expect.objectContaining({ limit: 10 }))
  })
})

// ─── GET /api/orders/[orderId] ─────────────────────────────────────────────────

describe('GET /api/orders/[orderId]', () => {
  it('returns order when found', async () => {
    ;(Order.findById as any).mockReturnValue(makeChain({ _id: 'ord-1', orderNumber: 'NP-001', paymentStatus: 'paid' }))
    const req = new NextRequest('http://localhost/api/orders/ord-1')
    const result = await ordersByOrderIdGET(req as any, { params: Promise.resolve({ orderId: 'ord-1' }) })
    expect(result.status).toBe(200)
    expect(Order.findById).toHaveBeenCalledWith('ord-1')
  })

  it('throws not found when order does not exist', async () => {
    ;(Order.findById as any).mockReturnValue(makeChain(null))
    const req = new NextRequest('http://localhost/api/orders/nonexistent')
    const result = await ordersByOrderIdGET(req as any, { params: Promise.resolve({ orderId: 'nonexistent' }) })
    expect(result.status).toBe(404)
  })

  it('sets no-store cache header', async () => {
    ;(Order.findById as any).mockReturnValue(makeChain({ _id: 'ord-1' }))
    const req = new NextRequest('http://localhost/api/orders/ord-1')
    const result = await ordersByOrderIdGET(req as any, { params: Promise.resolve({ orderId: 'ord-1' }) })
    expect(result.headers.get('Cache-Control')).toBe('no-store, max-age=0')
  })
})

// ─── GET /api/orders/lookup ────────────────────────────────────────────────────

describe('GET /api/orders/lookup', () => {
  it('returns validation error when orderNumber is missing', async () => {
    const req = new NextRequest('http://localhost/api/orders/lookup')
    const result = await ordersLookupGET(req as any, undefined)
    expect(result.status).toBe(400)
  })

  it('returns validation error when orderNumber is empty', async () => {
    const req = new NextRequest('http://localhost/api/orders/lookup?orderNumber=')
    const result = await ordersLookupGET(req as any, undefined)
    expect(result.status).toBe(400)
  })

  it('returns order when found', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const req = new NextRequest('http://localhost/api/orders/lookup?orderNumber=NP-001')
    const result = await ordersLookupGET(req as any, undefined)
    expect(result.status).toBe(200)
    expect(getOrderByNumber).toHaveBeenCalledWith('NP-001')
    const json = await result.json()
    expect(json.data.orderId).toBe('ord-1')
  })

  it('throws not found when order is not found', async () => {
    ;(getOrderByNumber as any).mockResolvedValue(null)
    const req = new NextRequest('http://localhost/api/orders/lookup?orderNumber=NP-999')
    const result = await ordersLookupGET(req as any, undefined)
    expect(result.status).toBe(404)
  })

  it('uppercases order number before lookup', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const req = new NextRequest('http://localhost/api/orders/lookup?orderNumber=np-001')
    await ordersLookupGET(req as any, undefined)
    expect(getOrderByNumber).toHaveBeenCalledWith('NP-001')
  })

  it('trims whitespace from order number', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const req = new NextRequest('http://localhost/api/orders/lookup?orderNumber=%20NP-001%20')
    await ordersLookupGET(req as any, undefined)
    expect(getOrderByNumber).toHaveBeenCalledWith('NP-001')
  })

  it('enforces rate limit', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const req = new NextRequest('http://localhost/api/orders/lookup?orderNumber=NP-001')
    await ordersLookupGET(req as any, undefined)
    expect(enforceRateLimit).toHaveBeenCalledWith('orderLookup', null, expect.objectContaining({ limit: 20, windowMs: 60000 }))
  })
})

// ─── POST /api/orders/lookup ───────────────────────────────────────────────────

describe('POST /api/orders/lookup', () => {
  it('returns validation error when body orderNumber is missing', async () => {
    const req = new NextRequest('http://localhost/api/orders/lookup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    })
    req.json = () => Promise.resolve({})
    const result = await ordersLookupPOST(req as any, undefined)
    expect(result.status).toBe(400)
  })

  it('returns validation error when body orderNumber is empty', async () => {
    const req = new NextRequest('http://localhost/api/orders/lookup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ orderNumber: '' }),
    })
    req.json = () => Promise.resolve({ orderNumber: '' })
    const result = await ordersLookupPOST(req as any, undefined)
    expect(result.status).toBe(400)
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
    expect(result.status).toBe(200)
    expect(getOrderByNumber).toHaveBeenCalledWith('NP-001')
  })

  it('uppercases and trims POST body order number', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const req = new NextRequest('http://localhost/api/orders/lookup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ orderNumber: ' np-001 ' }),
    })
    req.json = () => Promise.resolve({ orderNumber: ' np-001 ' })
    await ordersLookupPOST(req as any, undefined)
    expect(getOrderByNumber).toHaveBeenCalledWith('NP-001')
  })

  it('throws not found when order is not found via POST', async () => {
    ;(getOrderByNumber as any).mockResolvedValue(null)
    const req = new NextRequest('http://localhost/api/orders/lookup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ orderNumber: 'NP-999' }),
    })
    req.json = () => Promise.resolve({ orderNumber: 'NP-999' })
    const result = await ordersLookupPOST(req as any, undefined)
    expect(result.status).toBe(404)
  })
})

// ─── POST /api/admin/uploads ───────────────────────────────────────────────────

describe('POST /api/admin/uploads', () => {
  beforeEach(() => {
    ;(uploadFile as any).mockResolvedValue({
      url: 'https://cdn/test.pdf',
      publicId: 'pub/test',
      bytes: 1024,
      format: 'pdf',
      pageCount: 10,
      resourceType: 'raw',
    })
    ;(createOrder as any).mockResolvedValue({
      order: { _id: 'ord-1', orderNumber: 'NP-001' },
      razorpayOrderId: 'order_xyz',
    })
  })

  it('uploads file successfully', async () => {
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    const form = new FormData()
    form.append('file', new Blob(['pdf-data'], { type: 'application/pdf' }), 'test.pdf')
    form.append('kind', 'note_full')
    const req = new NextRequest('http://localhost/api/admin/uploads', { method: 'POST', body: form })
    ;(req as any).formData = () => Promise.resolve(form)
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.POST as any)(req as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.url).toBe('https://cdn/test.pdf')
    expect(uploadFile).toHaveBeenCalledWith(expect.any(Buffer), 'note_full', 'test.pdf')
  })

  it('returns validation error when no file provided', async () => {
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    const form = new FormData()
    form.append('kind', 'note_full')
    const req = new NextRequest('http://localhost/api/admin/uploads', { method: 'POST', body: form })
    ;(req as any).formData = () => Promise.resolve(form)
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.POST as any)(req as any, undefined)
    expect(res.status).toBe(400)
  })

  it('returns validation error for invalid kind', async () => {
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    const form = new FormData()
    form.append('file', new Blob(['x'], { type: 'application/pdf' }), 'x.pdf')
    form.append('kind', 'invalid_kind')
    const req = new NextRequest('http://localhost/api/admin/uploads', { method: 'POST', body: form })
    ;(req as any).formData = () => Promise.resolve(form)
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.POST as any)(req as any, undefined)
    expect(res.status).toBe(400)
  })

  it('returns 413 when file exceeds size limit', async () => {
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    const kind = Object.keys(UPLOAD_LIMITS)[0] as keyof typeof UPLOAD_LIMITS
    const maxSize = UPLOAD_LIMITS[kind].maxBytes + 1
    const bigBuffer = Buffer.alloc(maxSize, 'x')
    const form = new FormData()
    form.append('file', new Blob([bigBuffer]), 'big.pdf')
    form.append('kind', kind)
    const req = new NextRequest('http://localhost/api/admin/uploads', { method: 'POST', body: form })
    ;(req as any).formData = () => Promise.resolve(form)
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.POST as any)(req as any, undefined)
    expect(res.status).toBe(413)
  })

  it('is protected by admin auth', async () => {
    // requireAdmin is invoked by adminHandler — verify it was called.
    ;(requireAdmin as any).mockResolvedValue(null)
    const form = new FormData()
    form.append('file', new Blob(['x']), 'x.pdf')
    form.append('kind', 'note_full')
    const req = new NextRequest('http://localhost/api/admin/uploads', { method: 'POST', body: form })
    ;(req as any).formData = () => Promise.resolve(form)
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.POST as any)(req as any, undefined)
    expect(res.status).toBe(200)
    expect(requireAdmin).toHaveBeenCalled()
  })
})

// ─── DELETE /api/admin/uploads ─────────────────────────────────────────────────

describe('DELETE /api/admin/uploads', () => {
  beforeEach(() => {
    ;(destroyAsset as any).mockResolvedValue(undefined)
    ;(deleteUpload as any).mockResolvedValue(undefined)
  })

  it('deletes upload successfully', async () => {
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    const req = new NextRequest('http://localhost/api/admin/uploads', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ publicId: 'pub/123', resourceType: 'raw' }),
    })
    ;(req as any).json = () => Promise.resolve({ publicId: 'pub/123', resourceType: 'raw' })
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.DELETE as any)(req as any, undefined)
    expect(res.status).toBe(200)
    expect(deleteUpload).toHaveBeenCalledWith('pub/123', 'raw')
  })

  it('returns validation error when no publicId', async () => {
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    const req = new NextRequest('http://localhost/api/admin/uploads', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    })
    ;(req as any).json = () => Promise.resolve({})
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.DELETE as any)(req as any, undefined)
    expect(res.status).toBe(400)
  })

  it('returns forbidden for non-head admin', async () => {
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    const req = new NextRequest('http://localhost/api/admin/uploads', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ publicId: 'pub/123', resourceType: 'raw' }),
    })
    ;(req as any).json = () => Promise.resolve({ publicId: 'pub/123', resourceType: 'raw' })
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.DELETE as any)(req as any, undefined)
    expect(res.status).toBe(403)
  })
})

// ─── GET /api/admin/orders ─────────────────────────────────────────────────────

describe('GET /api/admin/orders', () => {
  beforeEach(() => {
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    ;(Order.find as any).mockReturnValue(makeChain([]))
    ;(Order.countDocuments as any).mockReturnValue(makeChain(0))
  })

  it('returns paginated orders with summary', async () => {
    const mod = await import('@/app/api/admin/orders/route')
    const res = await (mod.GET as any)(new NextRequest('http://localhost/api/admin/orders') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.summary).toBeDefined()
    expect(json.data.pagination).toBeDefined()
  })

  it('computes revenue from paid orders', async () => {
    const orders = [
      { _id: 'o1', paymentStatus: 'paid', amount: 50000 },
      { _id: 'o2', paymentStatus: 'paid', amount: 30000 },
      { _id: 'o3', paymentStatus: 'failed', amount: 10000 },
    ]
    ;(Order.find as any).mockReturnValue(makeChain(orders))
    ;(Order.countDocuments as any).mockReturnValue(makeChain(3))
    const mod = await import('@/app/api/admin/orders/route')
    const res = await (mod.GET as any)(new NextRequest('http://localhost/api/admin/orders') as any, undefined)
    const json = await res.json()
    expect(json.data.summary.totalRevenuePaise).toBe(80000)
    expect(json.data.summary.paidCount).toBe(2)
    expect(json.data.summary.failedCount).toBe(1)
  })

  it('applies filter query parameters', async () => {
    ;(buildOrderFilter as any).mockReturnValue({ paymentStatus: 'paid' })
    const mod = await import('@/app/api/admin/orders/route')
    await (mod.GET as any)(
      new NextRequest('http://localhost/api/admin/orders?paymentStatus=paid&itemType=note&sort=amount_desc') as any,
      undefined,
    )
    expect(buildOrderFilter).toHaveBeenCalledWith(expect.objectContaining({ paymentStatus: 'paid', itemType: 'note', sort: 'amount_desc' }))
  })

  it('is protected by admin auth', async () => {
    // Same pattern — requireAdmin is invoked by adminHandler on the route.
    ;(requireAdmin as any).mockResolvedValue(null)
    const mod = await import('@/app/api/admin/orders/route')
    const res = await (mod.GET as any)(new NextRequest('http://localhost/api/admin/orders') as any, undefined)
    expect(res.status).toBe(200)
    expect(requireAdmin).toHaveBeenCalled()
  })
})

// ─── GET /api/admin/leads ──────────────────────────────────────────────────────

describe('GET /api/admin/leads', () => {
  beforeEach(() => {
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    ;(Order.find as any).mockReturnValue(makeChain([]))
    ;(Order.countDocuments as any).mockReturnValue(makeChain(0))
    ;(buildOrderFilter as any).mockReturnValue({ paymentStatus: 'pending', fulfillmentStatus: 'unfulfilled' })
  })

  it('returns pending unfulfilled orders as leads', async () => {
    const mod = await import('@/app/api/admin/leads/route')
    const res = await (mod.GET as any)(new NextRequest('http://localhost/api/admin/leads') as any, undefined)
    expect(res.status).toBe(200)
    expect(Order.find).toHaveBeenCalledWith({ paymentStatus: 'pending', fulfillmentStatus: 'unfulfilled' })
  })
})

// ─── PATCH /api/admin/notes/[id] ───────────────────────────────────────────────

describe('PATCH /api/admin/notes/[id]', () => {
  beforeEach(() => {
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    ;(updateNoteSchema.safeParse as any).mockReturnValue({ success: false, error: { issues: [{ path: ['title'], message: 'required' }] } })
    ;(Note.findById as any).mockReturnValue(makeChain(null))
  })

  it('returns validation error for invalid body', async () => {
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const req = new NextRequest('http://localhost/api/admin/notes/n1', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ invalid: true }),
    })
    ;(req as any).json = () => Promise.resolve({ invalid: true })
    const res = await (mod.PATCH as any)(req as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(400)
  })

  it('returns not found when note does not exist', async () => {
    ;(updateNoteSchema.safeParse as any).mockReturnValue({ success: true, data: { title: 'Updated' } })
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const req = new NextRequest('http://localhost/api/admin/notes/n1', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Updated' }),
    })
    ;(req as any).json = () => Promise.resolve({ title: 'Updated' })
    const res = await (mod.PATCH as any)(req as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(404)
  })

  it('logs activity on successful update', async () => {
    ;(updateNoteSchema.safeParse as any).mockReturnValue({ success: true, data: { title: 'New Title' } })
    const updatedNote = { _id: 'n1', title: 'New Title', category: null, createdBy: null }
    ;(Note.findById as any).mockReturnValue(makeChain(updatedNote))
    ;(Note.findByIdAndUpdate as any).mockReturnValue(makeChain(updatedNote))
    ;(Note.findById as any).mockReturnValue(makeChain(updatedNote))
    const mod = await import('@/app/api/admin/notes/[id]/route')
    const req = new NextRequest('http://localhost/api/admin/notes/n1', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'New Title' }),
    })
    ;(req as any).json = () => Promise.resolve({ title: 'New Title' })
    const res = await (mod.PATCH as any)(req as any, { params: Promise.resolve({ id: 'n1' }) })
    expect(res.status).toBe(200)
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: 'note.update' }))
  })
})

// ─── PATCH /api/admin/groups/[id] ──────────────────────────────────────────────

describe('PATCH /api/admin/groups/[id]', () => {
  beforeEach(() => {
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    ;(updateGroupSchema.safeParse as any).mockReturnValue({ success: false, error: { issues: [{ path: ['name'], message: 'required' }] } })
    ;(Group.findById as any).mockReturnValue(makeChain(null))
  })

  it('returns validation error for invalid body', async () => {
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const req = new NextRequest('http://localhost/api/admin/groups/g1', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ invalid: true }),
    })
    ;(req as any).json = () => Promise.resolve({ invalid: true })
    const res = await (mod.PATCH as any)(req as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(400)
  })

  it('returns not found when group does not exist', async () => {
    ;(updateGroupSchema.safeParse as any).mockReturnValue({ success: true, data: { name: 'Updated' } })
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const req = new NextRequest('http://localhost/api/admin/groups/g1', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Updated' }),
    })
    ;(req as any).json = () => Promise.resolve({ name: 'Updated' })
    const res = await (mod.PATCH as any)(req as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(404)
  })

  it('logs activity on successful update', async () => {
    ;(updateGroupSchema.safeParse as any).mockReturnValue({ success: true, data: { name: 'New Bundle' } })
    const updatedGroup = { _id: 'g1', name: 'New Bundle', category: null, createdBy: null }
    ;(Group.findById as any).mockReturnValue(makeChain(updatedGroup))
    ;(Group.findByIdAndUpdate as any).mockReturnValue(makeChain(updatedGroup))
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const req = new NextRequest('http://localhost/api/admin/groups/g1', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'New Bundle' }),
    })
    ;(req as any).json = () => Promise.resolve({ name: 'New Bundle' })
    const res = await (mod.PATCH as any)(req as any, { params: Promise.resolve({ id: 'g1' }) })
    expect(res.status).toBe(200)
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: 'group.update' }))
  })
})

// ─── DELETE /api/admin/groups/[id] ─────────────────────────────────────────────

describe('DELETE /api/admin/groups/[id]', () => {
  beforeEach(() => {
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    ;(Group.findById as any).mockReturnValue(makeChain(null))
  })

  it('returns not found when group does not exist', async () => {
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await (mod.DELETE as any)(
      new NextRequest('http://localhost/api/admin/groups/g1', { method: 'DELETE' }) as any,
      { params: Promise.resolve({ id: 'g1' }) },
    )
    expect(res.status).toBe(404)
  })

  it('returns forbidden for non-head non-creator admin', async () => {
    const group = { _id: 'g1', name: 'Bundle', createdBy: 'other-admin-id' }
    const deleteChain = { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue({}) }
    ;(Group.findById as any).mockReturnValue(makeChain(group))
    ;(Group.findByIdAndDelete as any).mockReturnValue(deleteChain)
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await (mod.DELETE as any)(
      new NextRequest('http://localhost/api/admin/groups/g1', { method: 'DELETE' }) as any,
      { params: Promise.resolve({ id: 'g1' }), admin: ADMIN },
    )
    expect(res.status).toBe(403)
  })

  it('deletes group and logs activity as head admin', async () => {
    const group = { _id: 'g1', name: 'Bundle', createdBy: 'head-admin-id' }
    ;(Group.findById as any).mockReturnValue(makeChain(group))
    ;(Group.findByIdAndDelete as any).mockReturnValue(makeChain({}))
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await (mod.DELETE as any)(
      new NextRequest('http://localhost/api/admin/groups/g1', { method: 'DELETE' }) as any,
      { params: Promise.resolve({ id: 'g1' }), admin: HEAD_ADMIN },
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.deleted).toBe(true)
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: 'group.delete' }))
  })

  it('allows creator to delete their own group', async () => {
    const group = { _id: 'g1', name: 'My Bundle', createdBy: 'a1' }
    ;(Group.findById as any).mockReturnValue(makeChain(group))
    ;(Group.findByIdAndDelete as any).mockReturnValue(makeChain({}))
    const mod = await import('@/app/api/admin/groups/[id]/route')
    const res = await (mod.DELETE as any)(
      new NextRequest('http://localhost/api/admin/groups/g1', { method: 'DELETE' }) as any,
      { params: Promise.resolve({ id: 'g1' }), admin: ADMIN },
    )
    expect(res.status).toBe(200)
    expect(Group.findByIdAndDelete).toHaveBeenCalledWith('g1')
  })
})
