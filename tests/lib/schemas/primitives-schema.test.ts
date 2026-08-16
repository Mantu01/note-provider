import { describe, it, expect, vi } from 'vitest';
import {
  id,
  str,
  nullableStr,
  num,
  nullableNum,
  bool,
  isPopulated,
  toIdList,
} from '@/server/mappers/primitives';

describe('primitives', () => {
  describe('id', () => {
    it('converts string to string', () => {
      expect(id('507f1f77bcf86cd799439011')).toBe('507f1f77bcf86cd799439011');
    });

    it('converts number to string', () => {
      expect(id(123)).toBe('123');
    });

    it('returns empty string for null', () => {
      expect(id(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(id(undefined)).toBe('');
    });
  });

  describe('str', () => {
    it('returns string as-is', () => {
      expect(str('hello')).toBe('hello');
    });

    it('returns empty string for null', () => {
      expect(str(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(str(undefined)).toBe('');
    });

    it('returns empty string for non-string', () => {
      expect(str(123)).toBe('');
      expect(str({})).toBe('');
    });
  });

  describe('nullableStr', () => {
    it('returns string if non-empty', () => {
      expect(nullableStr('hello')).toBe('hello');
    });

    it('returns null for empty string', () => {
      expect(nullableStr('')).toBeNull();
    });

    it('returns null for null', () => {
      expect(nullableStr(null)).toBeNull();
    });

    it('returns null for undefined', () => {
      expect(nullableStr(undefined)).toBeNull();
    });

    it('returns null for non-string', () => {
      expect(nullableStr(123)).toBeNull();
    });
  });

  describe('num', () => {
    it('returns number as-is', () => {
      expect(num(42)).toBe(42);
    });

    it('returns 0 for null', () => {
      expect(num(null)).toBe(0);
    });

    it('returns 0 for undefined', () => {
      expect(num(undefined)).toBe(0);
    });

    it('returns 0 for non-number', () => {
      expect(num('hello')).toBe(0);
      expect(num(null)).toBe(0);
    });

    it('returns 0 for NaN', () => {
      expect(num(NaN)).toBe(0);
    });

    it('returns 0 for Infinity', () => {
      expect(num(Infinity)).toBe(0);
    });
  });

  describe('nullableNum', () => {
    it('returns number as-is', () => {
      expect(nullableNum(42)).toBe(42);
    });

    it('returns null for null', () => {
      expect(nullableNum(null)).toBeNull();
    });

    it('returns null for undefined', () => {
      expect(nullableNum(undefined)).toBeNull();
    });

    it('returns null for non-number', () => {
      expect(nullableNum('hello')).toBeNull();
    });

    it('returns null for NaN', () => {
      expect(nullableNum(NaN)).toBeNull();
    });
  });

  describe('bool', () => {
    it('returns true for true', () => {
      expect(bool(true)).toBe(true);
    });

    it('returns false for false', () => {
      expect(bool(false)).toBe(false);
    });

    it('returns false for null', () => {
      expect(bool(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(bool(undefined)).toBe(false);
    });

    it('returns false for non-boolean', () => {
      expect(bool('true')).toBe(false);
      expect(bool(1)).toBe(false);
    });
  });

  describe('isPopulated', () => {
    it('returns true for populated doc with populated field', () => {
      const doc = { category: { _id: 'id1', name: 'Frontend' } };
      expect(isPopulated(doc.category)).toBe(true);
    });

    it('returns false for ref string', () => {
      const doc = { category: '507f1f77bcf86cd799439011' };
      expect(isPopulated(doc.category)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isPopulated(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isPopulated(undefined)).toBe(false);
    });

    it('returns false for string', () => {
      expect(isPopulated('507f1f77bcf86cd799439011')).toBe(false);
    });

    it('returns false for array', () => {
      expect(isPopulated(['id1'])).toBe(false);
    });
  });

  describe('toIdList', () => {
    it('converts populated array to string ids', () => {
      const items = [
        { _id: 'id1', name: 'A' },
        { _id: 'id2', name: 'B' },
      ];
      expect(toIdList(items)).toEqual(['id1', 'id2']);
    });

    it('handles string array', () => {
      expect(toIdList(['id1', 'id2'])).toEqual(['id1', 'id2']);
    });

    it('handles mixed array', () => {
      const mixed = ['id1', { _id: 'id2' }];
      expect(toIdList(mixed)).toEqual(['id1', 'id2']);
    });

    it('returns empty array for empty input', () => {
      expect(toIdList([])).toEqual([]);
    });

    it('returns empty array for non-array input', () => {
      expect(toIdList(null)).toEqual([]);
      expect(toIdList('not-array')).toEqual([]);
    });

    it('handles single populated item', () => {
      expect(toIdList([{ _id: 'id1' }])).toEqual(['id1']);
    });
  });
});
