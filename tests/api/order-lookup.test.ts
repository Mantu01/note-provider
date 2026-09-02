import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { getOrderByNumber } from '@/server/services/order.service'
import { enforceRateLimit } from '@/server/lib/rate-limit'

vi.mock('@/server/db/connect', () => ({ connectDB: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/services/order.service', () => ({
  getOrderByNumber: vi.fn(),
}))
vi.mock('@/server/lib/rate-limit', () => ({
  enforceRateLimit: vi.fn(),
}))

describe('GET /api/orders/lookup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(enforceRateLimit as any).mockImplementation(() => undefined)
  })

  it('returns validation error when orderNumber is missing', async () => {
    const mod = await import('@/app/api/orders/lookup/route')
    const req = new NextRequest('http://localhost/api/orders/lookup')
    const res = await mod.GET(req as any, undefined)
    expect(res.status).toBe(400)
  })

  it('returns validation error when orderNumber is empty', async () => {
    const mod = await import('@/app/api/orders/lookup/route')
    const req = new NextRequest('http://localhost/api/orders/lookup?orderNumber=')
    const res = await mod.GET(req as any, undefined)
    expect(res.status).toBe(400)
  })

  it('returns order when found', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const mod = await import('@/app/api/orders/lookup/route')
    const req = new NextRequest('http://localhost/api/orders/lookup?orderNumber=NP-001')
    const res = await mod.GET(req as any, undefined)
    expect(res.status).toBe(200)
    expect(getOrderByNumber).toHaveBeenCalledWith('NP-001')
  })

  it('throws not found when order is not found', async () => {
    ;(getOrderByNumber as any).mockResolvedValue(null)
    const mod = await import('@/app/api/orders/lookup/route')
    const req = new NextRequest('http://localhost/api/orders/lookup?orderNumber=NP-999')
    const res = await mod.GET(req as any, undefined)
    expect(res.status).toBe(404)
  })

  it('uppercases order number before lookup', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const mod = await import('@/app/api/orders/lookup/route')
    await mod.GET(new NextRequest('http://localhost/api/orders/lookup?orderNumber=np-001') as any, undefined)
    expect(getOrderByNumber).toHaveBeenCalledWith('NP-001')
  })

  it('trims whitespace from order number', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const mod = await import('@/app/api/orders/lookup/route')
    await mod.GET(new NextRequest('http://localhost/api/orders/lookup?orderNumber=%20NP-001%20') as any, undefined)
    expect(getOrderByNumber).toHaveBeenCalledWith('NP-001')
  })

  it('enforces rate limit', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const mod = await import('@/app/api/orders/lookup/route')
    await mod.GET(new NextRequest('http://localhost/api/orders/lookup?orderNumber=NP-001') as any, undefined)
    expect(enforceRateLimit).toHaveBeenCalledWith('orderLookup', null, expect.objectContaining({ limit: 20, windowMs: 60000 }))
  })

  it('returns orderId and orderNumber in response', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const mod = await import('@/app/api/orders/lookup/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/orders/lookup?orderNumber=NP-001') as any, undefined)
    const json = await res.json()
    expect(json.data.orderId).toBe('ord-1')
    expect(json.data.orderNumber).toBe('NP-001')
  })

  it('returns 400 error code for missing orderNumber', async () => {
    const mod = await import('@/app/api/orders/lookup/route')
    const req = new NextRequest('http://localhost/api/orders/lookup')
    const res = await mod.GET(req as any, undefined)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })
})

describe('POST /api/orders/lookup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(enforceRateLimit as any).mockImplementation(() => undefined)
  })

  it('returns validation error when body orderNumber is missing', async () => {
    const mod = await import('@/app/api/orders/lookup/route')
    const req = new NextRequest('http://localhost/api/orders/lookup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    })
    req.json = () => Promise.resolve({})
    const res = await mod.POST(req as any, undefined)
    expect(res.status).toBe(400)
  })

  it('returns validation error when body orderNumber is empty', async () => {
    const mod = await import('@/app/api/orders/lookup/route')
    const req = new NextRequest('http://localhost/api/orders/lookup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ orderNumber: '' }),
    })
    req.json = () => Promise.resolve({ orderNumber: '' })
    const res = await mod.POST(req as any, undefined)
    expect(res.status).toBe(400)
  })

  it('returns order when found via POST', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const mod = await import('@/app/api/orders/lookup/route')
    const req = new NextRequest('http://localhost/api/orders/lookup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ orderNumber: 'NP-001' }),
    })
    req.json = () => Promise.resolve({ orderNumber: 'NP-001' })
    const res = await mod.POST(req as any, undefined)
    expect(res.status).toBe(200)
    expect(getOrderByNumber).toHaveBeenCalledWith('NP-001')
  })

  it('uppercases and trims POST body order number', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const mod = await import('@/app/api/orders/lookup/route')
    const req = new NextRequest('http://localhost/api/orders/lookup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ orderNumber: ' np-001 ' }),
    })
    req.json = () => Promise.resolve({ orderNumber: ' np-001 ' })
    await mod.POST(req as any, undefined)
    expect(getOrderByNumber).toHaveBeenCalledWith('NP-001')
  })

  it('throws not found when order is not found via POST', async () => {
    ;(getOrderByNumber as any).mockResolvedValue(null)
    const mod = await import('@/app/api/orders/lookup/route')
    const req = new NextRequest('http://localhost/api/orders/lookup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ orderNumber: 'NP-999' }),
    })
    req.json = () => Promise.resolve({ orderNumber: 'NP-999' })
    const res = await mod.POST(req as any, undefined)
    expect(res.status).toBe(404)
  })

  it('enforces rate limit on POST', async () => {
    ;(getOrderByNumber as any).mockResolvedValue({ _id: 'ord-1', orderNumber: 'NP-001' })
    const mod = await import('@/app/api/orders/lookup/route')
    const req = new NextRequest('http://localhost/api/orders/lookup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ orderNumber: 'NP-001' }),
    })
    req.json = () => Promise.resolve({ orderNumber: 'NP-001' })
    await mod.POST(req as any, undefined)
    expect(enforceRateLimit).toHaveBeenCalledWith('orderLookup', null, expect.objectContaining({ limit: 20 }))
  })
})
