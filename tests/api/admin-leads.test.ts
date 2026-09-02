import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Order } from '@/server/db/models/order.model'
import { toAdminLead } from '@/server/mappers/order.mapper'
import { parsePagination, buildPagination, buildOrderFilter, buildOrderSort } from '@/server/lib/query'
import { requireAdmin } from '@/server/lib/auth-guard'

vi.mock('@/server/db/connect', () => ({ connectDB: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/order.model', () => ({
  Order: { find: vi.fn(), countDocuments: vi.fn() },
}))
vi.mock('@/server/mappers/order.mapper', () => ({
  toAdminLead: vi.fn((o: any) => o),
}))
vi.mock('@/server/lib/query', () => ({
  parsePagination: vi.fn(() => ({ page: 1, limit: 20, skip: 0 })),
  buildPagination: vi.fn(() => ({ page: 1, limit: 20, total: 0, totalPages: 1, hasNext: false, hasPrev: false })),
  buildOrderFilter: vi.fn(() => ({})),
  buildOrderSort: vi.fn(() => ({ createdAt: -1 })),
}))
vi.mock('@/server/lib/auth-guard', () => ({
  requireAdmin: vi.fn(),
}))

const ADMIN = { id: 'a1', name: 'Admin', email: 'a@b.com', isHead: false }

function mockReq(method: string, path: string) {
  return new NextRequest(`http://localhost${path}`, { method })
}

describe('GET /api/admin/leads', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    ;(Order.find as any).mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
    ;(Order.countDocuments as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(0) })
    ;(buildOrderFilter as any).mockReturnValue({ paymentStatus: 'pending', fulfillmentStatus: 'unfulfilled' })
    ;(buildOrderSort as any).mockReturnValue({ createdAt: -1 })
  })

  it('returns paginated pending unfulfilled orders as leads', async () => {
    const mod = await import('@/app/api/admin/leads/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/leads') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(Order.find).toHaveBeenCalledWith({ paymentStatus: 'pending', fulfillmentStatus: 'unfulfilled' })
  })

  it('applies filter query parameters', async () => {
    const mod = await import('@/app/api/admin/leads/route')
    await mod.GET(mockReq('GET', '/api/admin/leads?paymentStatus=paid&itemType=note') as any, undefined)
    expect(buildOrderFilter).toHaveBeenCalledWith(expect.objectContaining({ paymentStatus: 'paid', itemType: 'note' }))
  })

  it('returns leads mapped through toAdminLead', async () => {
    const leads = [{ _id: 'l1', orderNumber: 'NP-001' }]
    ;(Order.find as any).mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(leads),
    })
    const mod = await import('@/app/api/admin/leads/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/leads') as any, undefined)
    const json = await res.json()
    expect(json.data.items).toHaveLength(1)
    const callArgs = (toAdminLead as any).mock.calls[0]
    expect(callArgs[0]).toEqual(expect.objectContaining({ _id: 'l1', orderNumber: 'NP-001' }))
  })

  it('is protected by admin auth', async () => {
    ;(requireAdmin as any).mockResolvedValue(null)
    const mod = await import('@/app/api/admin/leads/route')
    await mod.GET(mockReq('GET', '/api/admin/leads') as any, undefined)
    expect(requireAdmin).toHaveBeenCalled()
  })

  it('supports date range filtering', async () => {
    const mod = await import('@/app/api/admin/leads/route')
    await mod.GET(mockReq('GET', '/api/admin/leads?from=2024-01-01&to=2024-12-31') as any, undefined)
    const filterCall = (buildOrderFilter as any).mock.calls[0][0]
    expect(typeof filterCall.from).toBe('string')
    expect(typeof filterCall.to).toBe('string')
  })

  it('supports sort parameter', async () => {
    const mod = await import('@/app/api/admin/leads/route')
    await mod.GET(mockReq('GET', '/api/admin/leads?sort=amount_desc') as any, undefined)
    expect(buildOrderSort).toHaveBeenCalledWith('amount_desc')
  })
})
