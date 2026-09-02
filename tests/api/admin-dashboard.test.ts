import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { getDashboardStats } from '@/server/services/dashboard.service'
import { requireAdmin } from '@/server/lib/auth-guard'
import { Note } from '@/server/db/models/note.model'

vi.mock('@/server/db/connect', () => ({ connectDB: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/note.model', () => ({
  Note: { aggregate: vi.fn() },
}))
vi.mock('@/server/services/dashboard.service', () => ({
  getDashboardStats: vi.fn(),
}))
vi.mock('@/server/lib/auth-guard', () => ({
  requireAdmin: vi.fn(),
}))

const ADMIN = { id: 'a1', name: 'Admin', email: 'a@b.com', isHead: false }

function mockReq(method: string, path: string) {
  return new NextRequest(`http://localhost${path}`, { method })
}

describe('GET /api/admin/dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    ;(Note.aggregate as any).mockReturnValue({ then: vi.fn((cb) => cb([[]])) })
  })

  it('returns dashboard stats on success', async () => {
    ;(getDashboardStats as any).mockResolvedValue({ totalNotes: 10, totalGroups: 5 })
    const mod = await import('@/app/api/admin/dashboard/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/dashboard') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.totalNotes).toBe(10)
    expect(getDashboardStats).toHaveBeenCalledOnce()
  })

  it('is protected by admin auth', async () => {
    ;(requireAdmin as any).mockResolvedValue(null)
    const mod = await import('@/app/api/admin/dashboard/route')
    const req = mockReq('GET', '/api/admin/dashboard')
    await mod.GET(req as any, undefined)
    expect(requireAdmin).toHaveBeenCalled()
  })

  it('handles empty stats response', async () => {
    ;(getDashboardStats as any).mockResolvedValue({})
    const mod = await import('@/app/api/admin/dashboard/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/dashboard') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('includes totalRevenue in stats when provided', async () => {
    ;(getDashboardStats as any).mockResolvedValue({
      totalNotes: 42,
      totalGroups: 10,
      totalRevenuePaise: 1500000,
      pendingOrders: 5,
    })
    const mod = await import('@/app/api/admin/dashboard/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/dashboard') as any, undefined)
    const json = await res.json()
    expect(json.data.totalRevenuePaise).toBe(1500000)
    expect(json.data.pendingOrders).toBe(5)
  })
})
