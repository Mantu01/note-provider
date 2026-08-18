import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Order } from '@/server/db/models/order.model'
import { toCsv } from '@/server/lib/csv'
import { buildOrderFilter, buildOrderSort } from '@/server/lib/query'
import { requireAdmin } from '@/server/lib/auth-guard'

vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/order.model', () => ({
  Order: { find: vi.fn() },
}))
vi.mock('@/server/lib/csv', () => ({
  toCsv: vi.fn((rows: any[]) => rows.map((r: any) => Object.values(r).join(',')).join('\n')),
}))
vi.mock('@/server/lib/query', () => ({
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

describe('GET /api/admin/leads/export', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    ;(Order.find as any).mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
  })

  it('returns CSV content with header row', async () => {
    const mod = await import('@/app/api/admin/leads/export/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/leads/export') as any, undefined)
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toContain('text/csv')
    expect(res.headers.get('Content-Disposition')).toMatch(/notes-provider-leads-/)
  })

  it('returns forbidden for non-admin request', async () => {
    ;(requireAdmin as any).mockResolvedValue(null)
    const mod = await import('@/app/api/admin/leads/export/route')
    const req = mockReq('GET', '/api/admin/leads/export')
    await mod.GET(req as any, undefined)
    expect(requireAdmin).toHaveBeenCalled()
  })

  it('includes buyer details in CSV columns', async () => {
    const orders = [
      {
        _id: 'o1',
        orderNumber: 'NP-001',
        createdAt: new Date('2024-06-15'),
        buyer: { fullName: 'John Doe', socialPlatform: 'email', socialHandle: 'john@example.com' },
        itemType: 'note',
        itemSnapshot: { title: 'React Notes' },
        amount: 50000,
        paymentStatus: 'paid',
        fulfillmentStatus: 'completed',
      },
    ]
    ;(Order.find as any).mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(orders),
    })
    const mod = await import('@/app/api/admin/leads/export/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/leads/export') as any, undefined)
    const csvText = await res.text()
    expect(csvText).toContain('John Doe')
    expect(csvText).toContain('NP-001')
    expect(csvText).toContain('React Notes')
  })

  it('applies filter query params to exported data', async () => {
    const mod = await import('@/app/api/admin/leads/export/route')
    await mod.GET(mockReq('GET', '/api/admin/leads/export?paymentStatus=paid&itemType=note') as any, undefined)
    expect(buildOrderFilter).toHaveBeenCalledWith(expect.objectContaining({ paymentStatus: 'paid', itemType: 'note' }))
  })

  it('limits export to 10000 records', async () => {
    const mod = await import('@/app/api/admin/leads/export/route')
    await mod.GET(mockReq('GET', '/api/admin/leads/export') as any, undefined)
    expect((Order.find as any).mock.calls[0][0]).not.toHaveProperty('limit')
  })

  it('returns CSV with amount in INR (divided by 100)', async () => {
    const orders = [
      { _id: 'o1', orderNumber: 'NP-001', createdAt: new Date(), buyer: { fullName: 'A', socialPlatform: 'email', socialHandle: 'a@b.com' }, itemType: 'note', itemSnapshot: { title: 'Note' }, amount: 50000, paymentStatus: 'paid', fulfillmentStatus: 'completed' },
    ]
    ;(Order.find as any).mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(orders),
    })
    const mod = await import('@/app/api/admin/leads/export/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/leads/export') as any, undefined)
    const csvText = await res.text()
    expect(csvText).toContain('500.00')
  })

  it('handles empty order list gracefully', async () => {
    ;(Order.find as any).mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
    const mod = await import('@/app/api/admin/leads/export/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/leads/export') as any, undefined)
    expect(res.status).toBe(200)
    const csvText = await res.text()
    expect(csvText).toBeDefined()
  })

  it('sets correct Content-Disposition attachment filename with date', async () => {
    const mod = await import('@/app/api/admin/leads/export/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/leads/export') as any, undefined)
    const disposition = res.headers.get('Content-Disposition')
    expect(disposition).toMatch(/attachment/)
    expect(disposition).toMatch(/\.csv/)
  })

  it('supports fulfillmentStatus filter', async () => {
    const mod = await import('@/app/api/admin/leads/export/route')
    await mod.GET(mockReq('GET', '/api/admin/leads/export?fulfillmentStatus=pending') as any, undefined)
    const filterCall = (buildOrderFilter as any).mock.calls[0][0]
    expect(filterCall.fulfillmentStatus).toBe('pending')
  })
})
