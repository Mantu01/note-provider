import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { uploadFile, deleteUpload } from '@/server/services/upload.service'
import { destroyAsset } from '@/server/lib/cloudinary'
import { enforceRateLimit } from '@/server/lib/rate-limit'
import { UPLOAD_LIMITS } from '@/lib/constants'
import { requireAdmin } from '@/server/lib/auth-guard'

vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/services/upload.service', () => ({
  uploadFile: vi.fn(),
  deleteUpload: vi.fn(),
}))
vi.mock('@/server/lib/cloudinary', () => ({
  destroyAsset: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/server/lib/rate-limit', () => ({
  enforceRateLimit: vi.fn(),
}))
vi.mock('@/server/lib/auth-guard', () => ({
  requireAdmin: vi.fn(),
}))

const HEAD_ADMIN = { id: 'a1', name: 'Admin', email: 'a@b.com', isHead: true }
const ADMIN = { id: 'a1', name: 'Admin', email: 'a@b.com', isHead: false }

function mockJsonReq(method: string, path: string, body?: unknown, extraHeaders?: Record<string, string>) {
  const headers = new Headers({ 'content-type': 'application/json', ...extraHeaders })
  const req = new NextRequest(`http://localhost${path}`, { method, headers })
  if (body !== undefined) req.json = () => Promise.resolve(body as any)
  return req
}

describe('POST /api/admin/uploads', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(enforceRateLimit as any).mockImplementation(() => undefined)
    ;(uploadFile as any).mockResolvedValue({
      url: 'https://cdn/test.pdf',
      publicId: 'pub/test',
      bytes: 1024,
      format: 'pdf',
      pageCount: 10,
      resourceType: 'raw',
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

  it('is protected by admin auth — requires valid session', async () => {
    ;(requireAdmin as any).mockResolvedValue(null)
    const form = new FormData()
    form.append('file', new Blob(['x']), 'x.pdf')
    form.append('kind', 'note_full')
    const req = new NextRequest('http://localhost/api/admin/uploads', { method: 'POST', body: form })
    ;(req as any).formData = () => Promise.resolve(form)
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.POST as any)(req as any, undefined)
    expect(requireAdmin).toHaveBeenCalled()
    expect(res.status).toBe(200)
  })

  it('uploads sample preview file', async () => {
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    const form = new FormData()
    form.append('file', new Blob(['preview-data']), 'sample.pdf')
    form.append('kind', 'note_preview')
    const req = new NextRequest('http://localhost/api/admin/uploads', { method: 'POST', body: form })
    ;(req as any).formData = () => Promise.resolve(form)
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.POST as any)(req as any, undefined)
    expect(res.status).toBe(200)
    expect(uploadFile).toHaveBeenCalledWith(expect.any(Buffer), 'note_preview', 'sample.pdf')
  })

  it('uploads cover image file', async () => {
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    const form = new FormData()
    form.append('file', new Blob(['image-data'], { type: 'image/jpeg' }), 'cover.jpg')
    form.append('kind', 'cover')
    const req = new NextRequest('http://localhost/api/admin/uploads', { method: 'POST', body: form })
    ;(req as any).formData = () => Promise.resolve(form)
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.POST as any)(req as any, undefined)
    expect(res.status).toBe(200)
    expect(uploadFile).toHaveBeenCalledWith(expect.any(Buffer), 'cover', 'cover.jpg')
  })
})

describe('DELETE /api/admin/uploads', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(destroyAsset as any).mockResolvedValue(undefined)
    ;(deleteUpload as any).mockResolvedValue(undefined)
  })

  it('deletes upload successfully', async () => {
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    const req = mockJsonReq('DELETE', '/api/admin/uploads', { publicId: 'pub/123', resourceType: 'raw' })
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.DELETE as any)(req as any, undefined)
    expect(res.status).toBe(200)
    expect(deleteUpload).toHaveBeenCalledWith('pub/123', 'raw')
  })

  it('returns validation error when no publicId', async () => {
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    const req = mockJsonReq('DELETE', '/api/admin/uploads', {})
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.DELETE as any)(req as any, undefined)
    expect(res.status).toBe(400)
  })

  it('returns validation error when no resourceType', async () => {
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    const req = mockJsonReq('DELETE', '/api/admin/uploads', { publicId: 'pub/123' })
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.DELETE as any)(req as any, undefined)
    expect(res.status).toBe(400)
  })

  it('returns forbidden for non-head admin', async () => {
    ;(requireAdmin as any).mockResolvedValue(ADMIN)
    const req = mockJsonReq('DELETE', '/api/admin/uploads', { publicId: 'pub/123', resourceType: 'raw' })
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.DELETE as any)(req as any, undefined)
    expect(res.status).toBe(403)
  })

  it('deletes resourceType=image uploads', async () => {
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    const req = mockJsonReq('DELETE', '/api/admin/uploads', { publicId: 'pub/img', resourceType: 'image' })
    const mod = await import('@/app/api/admin/uploads/route')
    const res = await (mod.DELETE as any)(req as any, undefined)
    expect(res.status).toBe(200)
    expect(deleteUpload).toHaveBeenCalledWith('pub/img', 'image')
  })

  it('does not call destroyAsset when cloudinary is not configured', async () => {
    vi.unstubAllEnvs()
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN)
    const req = mockJsonReq('DELETE', '/api/admin/uploads', { publicId: 'pub/456', resourceType: 'raw' })
    const mod = await import('@/app/api/admin/uploads/route')
    await (mod.DELETE as any)(req as any, undefined)
    expect(destroyAsset).not.toHaveBeenCalled()
  })
})
