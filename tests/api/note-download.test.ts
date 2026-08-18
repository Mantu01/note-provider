import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Note } from '@/server/db/models/note.model'
import { buildSignedUrl } from '@/server/lib/cloudinary'
import { enforceRateLimit } from '@/server/lib/rate-limit'
import { incrementDownloadCount } from '@/server/services/note.service'
import * as fs from 'fs'

vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/note.model', () => ({
  Note: { findOne: vi.fn() },
}))
vi.mock('@/server/mappers/note.mapper', () => ({
  toPublicNote: vi.fn((n: any) => n),
}))
vi.mock('@/server/lib/query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/server/lib/query')>()
  return { ...actual }
})
vi.mock('@/server/lib/cloudinary', () => ({
  buildSignedUrl: vi.fn(),
}))
vi.mock('@/server/lib/rate-limit', () => ({
  enforceRateLimit: vi.fn(),
}))
vi.mock('@/server/services/note.service', () => ({
  incrementDownloadCount: vi.fn().mockResolvedValue(undefined),
}))

const _mockFs = vi.hoisted(() => ({ existsSync: vi.fn(), readFileSync: vi.fn() }))
vi.mock('fs', () => ({
  __esModule: true,
  default: _mockFs,
  ..._mockFs,
}))

function makeChain(val: unknown) {
  return {
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(val),
  }
}

describe('GET /api/notes/[slug]/download', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(enforceRateLimit as any).mockImplementation(() => undefined)
    vi.mocked(_mockFs.existsSync).mockReturnValue(false)
  })

  it('returns 404 when note is not found', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain(null))
    const mod = await import('@/app/api/notes/[slug]/download/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/gone/download') as any, { params: Promise.resolve({ slug: 'gone' }) })
    expect(res.status).toBe(404)
  })

  it('returns 403 for paid notes', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain({ _id: 'n1', slug: 'paid-note', visibility: 'public', pricingType: 'paid' }))
    const mod = await import('@/app/api/notes/[slug]/download/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/paid-note/download') as any, { params: Promise.resolve({ slug: 'paid-note' }) })
    expect(res.status).toBe(403)
  })

  it('downloads free note via cloudinary signed URL', async () => {
    const fakeBuffer = Buffer.from('fake-pdf')
    vi.mocked(_mockFs.readFileSync).mockReturnValue(fakeBuffer)
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'free-note', visibility: 'public', pricingType: 'free',
      fullFilePublicId: 'pub/n1', fullFileUrl: null,
    }))
    ;(buildSignedUrl as any).mockReturnValue('https://signed-url.com/n1.pdf')
    global.fetch = vi.fn().mockResolvedValue({ ok: true, arrayBuffer: () => Promise.resolve(fakeBuffer.buffer) })

    const mod = await import('@/app/api/notes/[slug]/download/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/free-note/download') as any, { params: Promise.resolve({ slug: 'free-note' }) })
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/pdf')
    expect(incrementDownloadCount).toHaveBeenCalledWith('n1')
  })

  it('falls back to fullFileUrl when cloudinary fails', async () => {
    const fakeBuffer = Buffer.from('fallback-pdf')
    vi.mocked(_mockFs.readFileSync).mockReturnValue(fakeBuffer)
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'free-note', visibility: 'public', pricingType: 'free',
      fullFilePublicId: 'pub/n1', fullFileUrl: 'https://example.com/n1.pdf',
    }))
    ;(buildSignedUrl as any).mockReturnValue('https://signed-url.com/n1.pdf')
    global.fetch = vi.fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({ ok: true, arrayBuffer: () => Promise.resolve(fakeBuffer.buffer) })

    const mod = await import('@/app/api/notes/[slug]/download/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/free-note/download') as any, { params: Promise.resolve({ slug: 'free-note' }) })
    expect(res.status).toBe(200)
  })

  it('reads sample.pdf when no other source available', async () => {
    vi.mocked(_mockFs.existsSync).mockReturnValue(true)
    const sampleBuffer = Buffer.from('sample-pdf')
    vi.mocked(_mockFs.readFileSync).mockReturnValue(sampleBuffer)
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'no-file', visibility: 'public', pricingType: 'free',
      fullFilePublicId: null, fullFileUrl: null,
    }))

    const mod = await import('@/app/api/notes/[slug]/download/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/no-file/download') as any, { params: Promise.resolve({ slug: 'no-file' }) })
    expect(res.status).toBe(200)
    expect(_mockFs.readFileSync).toHaveBeenCalled()
  })

  it('returns 404 when no file buffer can be obtained', async () => {
    vi.mocked(_mockFs.existsSync).mockReturnValue(false)
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'empty-note', visibility: 'public', pricingType: 'free',
      fullFilePublicId: null, fullFileUrl: null,
    }))
    const mod = await import('@/app/api/notes/[slug]/download/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/empty-note/download') as any, { params: Promise.resolve({ slug: 'empty-note' }) })
    expect(res.status).toBe(404)
  })

  it('sets proper cache headers for download', async () => {
    vi.mocked(_mockFs.existsSync).mockReturnValue(true)
    vi.mocked(_mockFs.readFileSync).mockReturnValue(Buffer.from('x'))
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'f', visibility: 'public', pricingType: 'free',
      fullFilePublicId: null, fullFileUrl: null,
    }))
    const mod = await import('@/app/api/notes/[slug]/download/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/f/download') as any, { params: Promise.resolve({ slug: 'f' }) })
    expect(res.headers.get('Cache-Control')).toBe('private, no-store')
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff')
  })

  it('enforces rate limit', async () => {
    vi.mocked(_mockFs.existsSync).mockReturnValue(true)
    vi.mocked(_mockFs.readFileSync).mockReturnValue(Buffer.from('x'))
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'rl', visibility: 'public', pricingType: 'free',
      fullFilePublicId: null, fullFileUrl: null,
    }))
    const mod = await import('@/app/api/notes/[slug]/download/route')
    await mod.GET(new NextRequest('http://localhost/api/notes/rl/download') as any, { params: Promise.resolve({ slug: 'rl' }) })
    expect(enforceRateLimit).toHaveBeenCalledWith('noteDownload', null, expect.objectContaining({ limit: 30 }))
  })

  it('sets Content-Disposition attachment header', async () => {
    vi.mocked(_mockFs.existsSync).mockReturnValue(true)
    vi.mocked(_mockFs.readFileSync).mockReturnValue(Buffer.from('x'))
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'dl-test', visibility: 'public', pricingType: 'free',
      fullFilePublicId: null, fullFileUrl: null,
    }))
    const mod = await import('@/app/api/notes/[slug]/download/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/dl-test/download') as any, { params: Promise.resolve({ slug: 'dl-test' }) })
    expect(res.headers.get('Content-Disposition')).toContain('attachment')
    expect(res.headers.get('Content-Disposition')).toContain('dl-test.pdf')
  })

  it('increments download count on successful download', async () => {
    vi.mocked(_mockFs.existsSync).mockReturnValue(true)
    vi.mocked(_mockFs.readFileSync).mockReturnValue(Buffer.from('x'))
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'dc', visibility: 'public', pricingType: 'free',
      fullFilePublicId: null, fullFileUrl: null,
    }))
    const mod = await import('@/app/api/notes/[slug]/download/route')
    await mod.GET(new NextRequest('http://localhost/api/notes/dc/download') as any, { params: Promise.resolve({ slug: 'dc' }) })
    expect(incrementDownloadCount).toHaveBeenCalledWith('n1')
  })

  it('uses fullFileUrl when no publicId but url present', async () => {
    const buf = Buffer.from('direct-pdf')
    vi.mocked(_mockFs.readFileSync).mockReturnValue(buf)
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'direct', visibility: 'public', pricingType: 'free',
      fullFilePublicId: null, fullFileUrl: 'https://cdn.com/file.pdf',
    }))
    global.fetch = vi.fn().mockResolvedValue({ ok: true, arrayBuffer: () => Promise.resolve(buf.buffer) })
    const mod = await import('@/app/api/notes/[slug]/download/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/direct/download') as any, { params: Promise.resolve({ slug: 'direct' }) })
    expect(res.status).toBe(200)
    expect(global.fetch).toHaveBeenCalledWith('https://cdn.com/file.pdf')
  })
})
