import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Order } from '@/server/db/models/order.model'
import { toPublicOrder } from '@/server/mappers/order.mapper'

vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/order.model', () => ({
  Order: { findById: vi.fn() },
}))
vi.mock('@/server/mappers/order.mapper', () => ({
  toPublicOrder: vi.fn((o: any) => o),
}))

function makeChain(val: unknown) {
  return {
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(val),
  }
}

describe('GET /api/orders/[orderId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns order when found', async () => {
    ;(Order.findById as any).mockReturnValue(makeChain({ _id: 'ord-1', orderNumber: 'NP-001', paymentStatus: 'paid' }))
    const mod = await import('@/app/api/orders/[orderId]/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/orders/ord-1') as any, { params: Promise.resolve({ orderId: 'ord-1' }) })
    expect(res.status).toBe(200)
    expect(Order.findById).toHaveBeenCalledWith('ord-1')
  })

  it('throws not found when order does not exist', async () => {
    ;(Order.findById as any).mockReturnValue(makeChain(null))
    const mod = await import('@/app/api/orders/[orderId]/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/orders/nonexistent') as any, { params: Promise.resolve({ orderId: 'nonexistent' }) })
    expect(res.status).toBe(404)
  })

  it('sets no-store cache header', async () => {
    ;(Order.findById as any).mockReturnValue(makeChain({ _id: 'ord-1' }))
    const mod = await import('@/app/api/orders/[orderId]/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/orders/ord-1') as any, { params: Promise.resolve({ orderId: 'ord-1' }) })
    expect(res.headers.get('Cache-Control')).toBe('no-store, max-age=0')
  })

  it('maps order through toPublicOrder', async () => {
    const order = { _id: 'ord-1', orderNumber: 'NP-001' }
    ;(Order.findById as any).mockReturnValue(makeChain(order))
    const mod = await import('@/app/api/orders/[orderId]/route')
    await mod.GET(new NextRequest('http://localhost/api/orders/ord-1') as any, { params: Promise.resolve({ orderId: 'ord-1' }) })
    expect(toPublicOrder).toHaveBeenCalledWith(order)
  })

  it('returns correct order number in response', async () => {
    ;(Order.findById as any).mockReturnValue(makeChain({ _id: 'ord-1', orderNumber: 'NP-123', paymentStatus: 'created' }))
    const mod = await import('@/app/api/orders/[orderId]/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/orders/ord-1') as any, { params: Promise.resolve({ orderId: 'ord-1' }) })
    const json = await res.json()
    expect(json.data.orderNumber).toBe('NP-123')
  })

  it('handles orders with different payment statuses', async () => {
    ;(Order.findById as any).mockReturnValue(makeChain({ _id: 'ord-1', paymentStatus: 'failed' }))
    const mod = await import('@/app/api/orders/[orderId]/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/orders/ord-1') as any, { params: Promise.resolve({ orderId: 'ord-1' }) })
    expect(res.status).toBe(200)
  })
})
