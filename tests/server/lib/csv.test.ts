import { describe, it, expect } from 'vitest'
import { toCsv } from '../../../src/server/lib/csv'

describe('csv', () => {
  describe('toCsv', () => {
    it('produces header and rows separated by commas', () => {
      const rows = [
        { name: 'Alice', age: '30' },
        { name: 'Bob', age: '25' },
      ]
      const csv = toCsv(rows)
      expect(csv).toContain('name,age')
      expect(csv).toContain('Alice,30')
      expect(csv).toContain('Bob,25')
    })

    it('includes UTF-8 BOM at the start', () => {
      const csv = toCsv([{ a: '1' }])
      expect(csv.charCodeAt(0)).toBe(0xfeff)
    })

    it('joins rows with CRLF', () => {
      const rows = [
        { a: '1', b: '2' },
        { a: '3', b: '4' },
      ]
      const csv = toCsv(rows)
      const lines = csv.slice(1).split('\r\n')
      expect(lines).toHaveLength(3)
      expect(lines[0]).toBe('a,b')
      expect(lines[1]).toBe('1,2')
      expect(lines[2]).toBe('3,4')
    })

    it('quotes cells containing commas', () => {
      const csv = toCsv([{ value: 'hello, world' }])
      expect(csv).toContain('"hello, world"')
    })

    it('quotes cells containing newlines', () => {
      const csv = toCsv([{ value: 'hello\nworld' }])
      expect(csv).toContain('"hello\nworld"')
    })

    it('quotes cells containing carriage returns', () => {
      const csv = toCsv([{ value: 'hello\rworld' }])
      expect(csv).toContain('"hello\rworld"')
    })

    it('quotes cells containing double quotes', () => {
      const csv = toCsv([{ value: 'say "hello"' }])
      expect(csv).toContain('"say ""hello"""')
    })

    it('escapes formula-prefix cells starting with equals sign', () => {
      const csv = toCsv([{ formula: '=SUM(A1:B2)' }])
      expect(csv).toContain("'=SUM(A1:B2)")
    })

    it('escapes formula-prefix cells starting with plus sign', () => {
      const csv = toCsv([{ formula: '+1+2' }])
      expect(csv).toContain("'+1+2")
    })

    it('escapes formula-prefix cells starting with minus sign', () => {
      const csv = toCsv([{ formula: '-100' }])
      expect(csv).toContain("'-100")
    })

    it('escapes formula-prefix cells starting with at sign', () => {
      const csv = toCsv([{ formula: '@handle' }])
      expect(csv).toContain("'@handle")
    })

    it('quotes cells that contain both formula prefix and comma', () => {
      const csv = toCsv([{ value: '=SUM(A1,A2)' }])
      expect(csv).toContain("\"'=SUM(A1,A2)\"")
    })

    it('converts null and undefined values to empty strings', () => {
      const csv = toCsv([{ a: null, b: undefined, c: 'val' }])
      expect(csv).toContain(',,val')
    })

    it('handles empty rows array', () => {
      const csv = toCsv([])
      const lines = csv.slice(1).split('\r\n')
      expect(lines).toHaveLength(1)
      expect(lines[0]).toBe('')
    })

    it('uses keys from first row as header', () => {
      const csv = toCsv([{ z: '1', a: '2' }])
      expect(csv).toContain('z,a')
    })

    it('handles rows with different key orders', () => {
      const rows = [
        { a: '1', b: '2' },
        { b: '3', a: '4' },
      ]
      const csv = toCsv(rows)
      const lines = csv.slice(1).split('\r\n')
      expect(lines[1]).toBe('1,2')
      expect(lines[2]).toBe('3,4')
    })

    it('handles numeric values', () => {
      const csv = toCsv([{ count: 42 }])
      expect(csv).toContain('42')
    })

    it('handles boolean values', () => {
      const csv = toCsv([{ flag: true }])
      expect(csv).toContain('true')
    })

    it('escapes values with both comma and quote', () => {
      const csv = toCsv([{ value: 'a,"b"' }])
      expect(csv).toContain(`"a,""b"""`)
    })
  })
})
