import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Order } from '@/server/db/models/order.model'
import { toAdminOrder } from '@/server/mappers/order.mapper'
import { fulfillOrder, deleteOrder } from '@/server/services/order.service'
import { updateOrderSchema } from '@/lib/schemas/admin.schema'
import { requireAdmin } from '@/server/lib/auth-guard'

vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/order.model', () => ({
  Order: { findById: vi.fn() },
}))
vi.mock('@/server/mappers/order.mapper', () => ({
  toAdminOrder: vi.fn((o: any) => o),
}))
vi.mock('@/server/services/order.service', () => ({
  fulfillOrder: vi.fn(),
  deleteOrder: vi.fn(),
}))
vi.mock('@/lib/schemas/admin.schema', () => ({
  updateOrderSchema: { safeParse: vi.fn() },
}))
vi.mock('@/server/lib/auth-guard', () => ({
  requireAdmin: vi.fn(),
}))

const ADMIN = { id: '507f1f77bcf86cd799439011', name: 'Admin', email: 'a@b.com', isHead: false }
const HEAD_ADMIN = { ...ADMIN, isHead: true }
const ADMIN_ID = ADMIN.id

function makeChain(val: unknown) {
  return {
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(val),
  }
}

function mockReq(method: string, path: string, body?: unknown) {
  const req = new NextRequest(`http://localhost${path}`, { method })
  if (body !== undefined) {
    req.headers.set('content-type', 'application/json')
    req.json = () => Promise.resolve(body as any)
  }
  return req
}

describe('GET /api/admin/orders/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
  })

  it('returns order when found', async () => {
    const order = { _id: 'ord-1', orderNumber: 'NP-001', paymentStatus: 'paid', amount: 50000 }
    ;(Order.findById as any).mockReturnValue(makeChain(order))
    const mod = await import('@/app/api/admin/orders/[id]/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/orders/ord-1') as any, { params: Promise.resolve({ id: 'ord-1' }) })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.orderNumber).toBe('NP-001')
    expect(Order.findById).toHaveBeenCalledWith('ord-1')
  })

  it('returns 404 when order does not exist', async () => {
    ;(Order.findById as any).mockReturnValue(makeChain(null))
    const mod = await import('@/app/api/admin/orders/[id]/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/orders/nonexistent') as any, { params: Promise.resolve({ id: 'nonexistent' }) })
    expect(res.status).toBe(404)
  })

  it('is protected by admin auth', async () => {
    ;(requireAdmin as any).mockResolvedValue(null)
    const mod = await import('@/app/api/admin/orders/[id]/route')
    const req = mockReq('GET', '/api/admin/orders/ord-1')
    await mod.GET(req as any, { params: Promise.resolve({ id: 'ord-1' }) })
    expect(requireAdmin).toHaveBeenCalled()
  })

  it('maps order through toAdminOrder mapper', async () => {
    const order = { _id: 'ord-1', orderNumber: 'NP-002' }
    ;(Order.findById as any).mockReturnValue(makeChain(order))
    const mod = await import('@/app/api/admin/orders/[id]/route')
    await mod.GET(mockReq('GET', '/api/admin/orders/ord-1') as any, { params: Promise.resolve({ id: 'ord-1' }) })
    expect(toAdminOrder).toHaveBeenCalledWith(order)
  })
})

describe('PATCH /api/admin/orders/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    ;(updateOrderSchema.safeParse as any).mockReturnValue({ success: false, error: { issues: [{ path: ['fulfillmentStatus'], message: 'required' }] } })
  })

  it('returns validation error for invalid body', async () => {
    const mod = await import('@/app/api/admin/orders/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/orders/ord-1', { invalid: true }) as any, { params: Promise.resolve({ id: 'ord-1' }) })
    expect(res.status).toBe(400)
  })

  it('fulfills order successfully', async () => {
    ;(updateOrderSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { fulfillmentStatus: 'completed' },
    })
    ;(fulfillOrder as any).mockResolvedValue({ _id: 'ord-1', fulfillmentStatus: 'completed' })
    const mod = await import('@/app/api/admin/orders/[id]/route')
    const res = await mod.PATCH(mockReq('PATCH', '/api/admin/orders/ord-1', { fulfillmentStatus: 'completed' }) as any, { params: Promise.resolve({ id: 'ord-1' }) })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.fulfillmentStatus).toBe('completed')
    expect(fulfillOrder).toHaveBeenCalledWith('ord-1', { fulfillmentStatus: 'completed' }, expect.objectContaining({ admin: expect.objectContaining({ _id: expect.anything() }) }))
  })

  it('passes ctx to fulfillOrder', async () => {
    ;(updateOrderSchema.safeParse as any).mockReturnValue({ success: true, data: { fulfillmentStatus: 'shipped' } })
    ;(fulfillOrder as any).mockResolvedValue({ _id: 'ord-1' })
    const mod = await import('@/app/api/admin/orders/[id]/route')
    await mod.PATCH(mockReq('PATCH', '/api/admin/orders/ord-1', { fulfillmentStatus: 'shipped' }) as any, { params: Promise.resolve({ id: 'ord-1' }) })
    expect(fulfillOrder).toHaveBeenCalledWith('ord-1', expect.anything(), expect.anything())
  })

  it('passes admin id to service context', async () => {
    ;(updateOrderSchema.safeParse as any).mockReturnValue({ success: true, data: { fulfillmentStatus: 'shipped' } })
    ;(fulfillOrder as any).mockResolvedValue({ _id: 'ord-1' })
    const mod = await import('@/app/api/admin/orders/[id]/route')
    await mod.PATCH(mockReq('PATCH', '/api/admin/orders/ord-1', { fulfillmentStatus: 'shipped' }) as any, { params: Promise.resolve({ id: 'ord-1' }) })
    const ctx = (fulfillOrder as any).mock.calls[0][2]
    expect(ctx.admin._id).toBeDefined()
  })
})

describe('DELETE /api/admin/orders/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
  })

  it('returns forbidden for non-head admin', async () => {
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    const mod = await import('@/app/api/admin/orders/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/orders/ord-1') as any, { params: Promise.resolve({ id: 'ord-1' }) })
    expect(res.status).toBe(403)
  })

  it('deletes order successfully as head admin', async () => {
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    ;(deleteOrder as any).mockResolvedValue({})
    const mod = await import('@/app/api/admin/orders/[id]/route')
    const res = await mod.DELETE(mockReq('DELETE', '/api/admin/orders/ord-1') as any, { params: Promise.resolve({ id: 'ord-1' }) })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.deleted).toBe(true)
    expect(deleteOrder).toHaveBeenCalledWith('ord-1', expect.objectContaining({ admin: expect.objectContaining({ _id: expect.anything() }) }))
  })

  it('is protected by admin auth', async () => {
    ;(requireAdmin as any).mockResolvedValue(null)
    const mod = await import('@/app/api/admin/orders/[id]/route')
    const req = mockReq('DELETE', '/api/admin/orders/ord-1')
    await mod.DELETE(req as any, { params: Promise.resolve({ id: 'ord-1' }) })
    expect(requireAdmin).toHaveBeenCalled()
  })
})
