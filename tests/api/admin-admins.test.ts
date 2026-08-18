import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Admin } from '@/server/db/models/admin.model'
import { toAdminProfile } from '@/server/mappers/activity.mapper'
import { requireAdmin } from '@/server/lib/auth-guard'

vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/admin.model', () => ({
  Admin: { find: vi.fn() },
}))
vi.mock('@/server/mappers/activity.mapper', () => ({
  toAdminProfile: vi.fn((a: any) => a),
}))
vi.mock('@/server/lib/auth-guard', () => ({
  requireAdmin: vi.fn(),
}))

const ADMIN = { id: 'a1', name: 'Admin', email: 'a@b.com', isHead: false }

function mockReq(method: string, path: string) {
  return new NextRequest(`http://localhost${path}`, { method })
}

describe('GET /api/admin/admins', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    ;(Admin.find as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })
    ;(toAdminProfile as any).mockImplementation((a: any) => a)
  })

  it('returns list of admins without password hashes', async () => {
    const mod = await import('@/app/api/admin/admins/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/admins') as any, undefined)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toEqual([])
    expect(Admin.find).toHaveBeenCalledWith({}, { passwordHash: 0 })
  })

  it('is protected by admin auth', async () => {
    ;(requireAdmin as any).mockResolvedValue(null)
    const mod = await import('@/app/api/admin/admins/route')
    const req = mockReq('GET', '/api/admin/admins')
    await mod.GET(req as any, undefined)
    expect(requireAdmin).toHaveBeenCalled()
  })

  it('maps admins through toAdminProfile', async () => {
    const admins = [
      { _id: 'a1', name: 'Admin1', email: 'a1@test.com' },
      { _id: 'a2', name: 'Admin2', email: 'a2@test.com' },
    ]
    ;(Admin.find as any).mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(admins),
    })
    const mod = await import('@/app/api/admin/admins/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/admins') as any, undefined)
    const json = await res.json()
    expect(json.data).toHaveLength(2)
    expect(toAdminProfile).toHaveBeenCalledTimes(2)
  })

  it('sorts by createdAt ascending', async () => {
    const mod = await import('@/app/api/admin/admins/route')
    await mod.GET(mockReq('GET', '/api/admin/admins') as any, undefined)
    expect(Admin.find).toHaveBeenCalledWith({}, { passwordHash: 0 })
  })

  it('excludes passwordHash from returned admins', async () => {
    const adminWithHash = { _id: 'a1', name: 'Test', email: 't@t.com' }
    ;(Admin.find as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([adminWithHash]),
    })
    const mod = await import('@/app/api/admin/admins/route')
    const res = await mod.GET(mockReq('GET', '/api/admin/admins') as any, undefined)
    const json = await res.json()
    expect(json.data[0].passwordHash).toBeUndefined()
  })
})
