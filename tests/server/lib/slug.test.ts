import { describe, it, expect, vi, beforeEach } from 'vitest'
import { slugify, uniqueSlug } from '../../../src/server/lib/slug'
import type { Model, QueryFilter } from 'mongoose'

describe('slug', () => {
  describe('slugify', () => {
    it('converts uppercase to lowercase', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('removes diacritics', () => {
      expect(slugify('cafe')).toBe('cafe')
      expect(slugify('eleve')).toBe('eleve')
      expect(slugify('strasse')).toBe('strasse')
    })

    it('replaces special characters with hyphens', () => {
      expect(slugify('hello@world!')).toBe('hello-world')
      expect(slugify('a+b=c')).toBe('a-b-c')
      expect(slugify('foo#bar')).toBe('foo-bar')
    })

    it('collapses multiple hyphens into one', () => {
      expect(slugify('hello  world')).toBe('hello-world')
      expect(slugify('hello---world')).toBe('hello-world')
      expect(slugify('hello...world')).toBe('hello-world')
    })

    it('trims leading and trailing hyphens', () => {
      expect(slugify('-hello-')).toBe('hello')
      expect(slugify('---hello---')).toBe('hello')
    })

    it('returns empty string for empty input', () => {
      expect(slugify('')).toBe('')
    })

    it('returns empty string for input with only special characters', () => {
      expect(slugify('   ')).toBe('')
      expect(slugify('---')).toBe('')
    })

    it('handles mixed case with special characters', () => {
      expect(slugify('Hello World! 123')).toBe('hello-world-123')
    })

    it('preserves numbers', () => {
      expect(slugify('note 42')).toBe('note-42')
    })

    it('handles unicode characters without diacritics', () => {
      expect(slugify('foo')).toBe('foo')
    })
  })

  describe('uniqueSlug', () => {
    function makeQueryResult(doc: any | null) {
      const result: any = {
        _id: doc?._id,
        then(onfulfilled: any, onrejected: any) {
          Promise.resolve(doc).then(onfulfilled, onrejected)
        },
      }
      return result
    }

    function makeChain(doc: any | null) {
      const r = makeQueryResult(doc)
      r.select = vi.fn().mockReturnValue(r)
      r.lean = vi.fn().mockReturnValue(r)
      return r
    }

    const mockModel = {
      findOne: vi.fn(),
    } as unknown as Model<any>

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('returns base slug when no existing document found', async () => {
      (mockModel.findOne as any).mockReturnValue(makeChain(null))
      const slug = await uniqueSlug(mockModel as any, 'My Note')
      expect(slug).toBe('my-note')
    })

    it('returns base slug when excludeId matches existing document', async () => {
      (mockModel.findOne as any).mockReturnValue(makeChain({ _id: 'existing-id' }))
      const slug = await uniqueSlug(mockModel as any, 'My Note', 'existing-id')
      expect(slug).toBe('my-note')
    })

    it('appends suffix when slug already exists', async () => {
      (mockModel.findOne as any)
        .mockReturnValueOnce(makeChain({ _id: 'other-id' }))
        .mockReturnValueOnce(makeChain(null))
      const slug = await uniqueSlug(mockModel as any, 'My Note')
      expect(slug).toBe('my-note-2')
    })

    it('increments suffix until unique slug is found', async () => {
      (mockModel.findOne as any)
        .mockReturnValueOnce(makeChain({ _id: 'other-id-1' }))
        .mockReturnValueOnce(makeChain({ _id: 'other-id-2' }))
        .mockReturnValueOnce(makeChain({ _id: 'other-id-3' }))
        .mockReturnValueOnce(makeChain(null))
      const slug = await uniqueSlug(mockModel as any, 'My Note')
      expect(slug).toBe('my-note-4')
    })

    it('uses slugified base as root for suffix incrementing', async () => {
      (mockModel.findOne as any)
        .mockReturnValueOnce(makeChain({ _id: 'id-1' }))
        .mockReturnValueOnce(makeChain({ _id: 'id-2' }))
        .mockReturnValueOnce(makeChain(null))
      const slug = await uniqueSlug(mockModel as any, 'Hello  World!!')
      expect(slug).toBe('hello-world-3')
    })

    it('falls back to "item" when slugify produces empty string', async () => {
      (mockModel.findOne as any).mockReturnValue(makeChain(null))
      const slug = await uniqueSlug(mockModel as any, '!!!')
      expect(slug).toBe('item')
    })

    it('uses "item" as root and appends suffix when slugify is empty', async () => {
      (mockModel.findOne as any)
        .mockReturnValueOnce(makeChain({ _id: 'id-1' }))
        .mockReturnValueOnce(makeChain(null))
      const slug = await uniqueSlug(mockModel as any, '!!!')
      expect(slug).toBe('item-2')
    })

    it('skips existing document with matching excludeId', async () => {
      (mockModel.findOne as any)
        .mockReturnValueOnce(makeChain({ _id: 'other-id' }))
        .mockReturnValueOnce(makeChain({ _id: 'same-id' }))
        .mockReturnValueOnce(makeChain(null))
      const slug = await uniqueSlug(mockModel as any, 'My Note', 'same-id')
      expect(slug).toBe('my-note-2')
    })

    it('calls findOne with correct query filter', async () => {
      (mockModel.findOne as any).mockReturnValue(makeChain(null))
      await uniqueSlug(mockModel as any, 'Test Note')
      expect(mockModel.findOne).toHaveBeenCalledWith(
        { slug: 'test-note' } as QueryFilter<any>,
      )
    })

    it('passes excludeId as string for comparison', async () => {
      (mockModel.findOne as any)
        .mockReturnValueOnce(makeChain({ _id: 'abc123' }))
        .mockReturnValueOnce(makeChain(null))
      const slug = await uniqueSlug(mockModel as any, 'Test', 'abc123')
      expect(slug).toBe('test')
    })
  })
})
