import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { Note } from '@/server/db/models/note.model'

vi.mock('@/server/db/connect', () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/server/db/models/note.model', () => ({
  Note: { findOne: vi.fn() },
}))
vi.mock('@/server/mappers/note.mapper', () => ({
  toPublicNote: vi.fn((n: any) => n),
}))

function makeChain(val: unknown) {
  return {
    populate: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(val),
  }
}

describe('GET /api/notes/[slug]/preview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 404 when slug is missing', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain(null))
    const mod = await import('@/app/api/notes/[slug]/preview/route')
    const req = new NextRequest('http://localhost/api/notes//preview')
    const res = await mod.GET(req as any, { params: Promise.resolve({ slug: '' }) })
    expect(res.status).toBe(404)
  })

  it('returns 404 when note not found', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain(null))
    const mod = await import('@/app/api/notes/[slug]/preview/route')
    const req = new NextRequest('http://localhost/api/notes/nope/preview')
    const res = await mod.GET(req as any, { params: Promise.resolve({ slug: 'nope' }) })
    expect(res.status).toBe(404)
  })

  it('returns 404 when no preview URL available', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain({ _id: 'n1', slug: 'n', previewFileUrl: null, fullFileUrl: null }))
    const mod = await import('@/app/api/notes/[slug]/preview/route')
    const req = new NextRequest('http://localhost/api/notes/n/preview')
    const res = await mod.GET(req as any, { params: Promise.resolve({ slug: 'n' }) })
    expect(res.status).toBe(404)
  })

  it('returns PDF preview content successfully', async () => {
    const buf = Buffer.from('preview-pdf')
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'n', previewFileUrl: null, fullFileUrl: 'https://cdn/test.pdf',
    }))
    global.fetch = vi.fn().mockResolvedValue({ ok: true, arrayBuffer: () => Promise.resolve(buf.buffer) })
    const mod = await import('@/app/api/notes/[slug]/preview/route')
    const req = new NextRequest('http://localhost/api/notes/n/preview')
    const res = await mod.GET(req as any, { params: Promise.resolve({ slug: 'n' }) })
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/pdf')
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=60')
  })

  it('redirects when PDF fetch fails', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'n', previewFileUrl: null, fullFileUrl: 'https://cdn/test.pdf',
    }))
    global.fetch = vi.fn().mockResolvedValue({ ok: false })
    const mod = await import('@/app/api/notes/[slug]/preview/route')
    const req = new NextRequest('http://localhost/api/notes/n/preview')
    const res = await mod.GET(req as any, { params: Promise.resolve({ slug: 'n' }) })
    expect(res.status).toBe(500)
  })

  it('returns inline content-disposition when mode=view', async () => {
    const buf = Buffer.from('preview-pdf')
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'n', previewFileUrl: null, fullFileUrl: 'https://cdn/test.pdf',
    }))
    global.fetch = vi.fn().mockResolvedValue({ ok: true, arrayBuffer: () => Promise.resolve(buf.buffer) })
    const mod = await import('@/app/api/notes/[slug]/preview/route')
    const req = new NextRequest('http://localhost/api/notes/n/preview?mode=view')
    const res = await mod.GET(req as any, { params: Promise.resolve({ slug: 'n' }) })
    expect(res.headers.get('Content-Disposition')).toBe('inline')
  })

  it('uses previewFileUrl over fullFileUrl when both present', async () => {
    const buf = Buffer.from('preview-pdf')
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'n', previewFileUrl: 'https://cdn/preview.pdf', fullFileUrl: 'https://cdn/full.pdf',
    }))
    global.fetch = vi.fn().mockResolvedValue({ ok: true, arrayBuffer: () => Promise.resolve(buf.buffer) })
    const mod = await import('@/app/api/notes/[slug]/preview/route')
    await mod.GET(new NextRequest('http://localhost/api/notes/n/preview') as any, { params: Promise.resolve({ slug: 'n' }) })
    expect(global.fetch).toHaveBeenCalledWith('https://cdn/preview.pdf')
  })

  it('handles internal server errors gracefully', async () => {
    const crashChain = {
      populate: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockRejectedValue(new Error('db crash')),
    }
    ;(Note.findOne as any).mockReturnValue(crashChain)
    const mod = await import('@/app/api/notes/[slug]/preview/route')
    const req = new NextRequest('http://localhost/api/notes/n/preview')
    const res = await mod.GET(req as any, { params: Promise.resolve({ slug: 'n' }) })
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('INTERNAL_ERROR')
  })

  it('prefers previewFileUrl for download', async () => {
    const buf = Buffer.from('pdf-data')
    ;(Note.findOne as any).mockReturnValue(makeChain({
      _id: 'n1', slug: 'n', previewFileUrl: 'https://cdn/preview-only.pdf', fullFileUrl: null,
    }))
    global.fetch = vi.fn().mockResolvedValue({ ok: true, arrayBuffer: () => Promise.resolve(buf.buffer) })
    const mod = await import('@/app/api/notes/[slug]/preview/route')
    const res = await mod.GET(new NextRequest('http://localhost/api/notes/n/preview') as any, { params: Promise.resolve({ slug: 'n' }) })
    expect(res.status).toBe(200)
    expect(global.fetch).toHaveBeenCalledWith('https://cdn/preview-only.pdf')
  })

  it('returns not found message when preview unavailable', async () => {
    ;(Note.findOne as any).mockReturnValue(makeChain({ _id: 'n1', slug: 'n', previewFileUrl: null, fullFileUrl: null }))
    const mod = await import('@/app/api/notes/[slug]/preview/route')
    const req = new NextRequest('http://localhost/api/notes/n/preview')
    const res = await mod.GET(req as any, { params: Promise.resolve({ slug: 'n' }) })
    const json = await res.json()
    expect(json.error.message).toContain('Preview not available')
  })
})
