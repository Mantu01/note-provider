import { describe, it, expect } from 'vitest';
import { cn } from '../../src/lib/utils';

describe('cn', () => {
  it('returns a single class when given one string', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('merges multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('merges class arrays', () => {
    expect(cn(['foo', 'bar'], ['baz'])).toBe('foo bar baz');
  });

  it('does not merge duplicate classes without Tailwind conflicts', () => {
    expect(cn('foo', 'foo')).toBe('foo foo');
  });

  it('resolves clsx truthy/falsy values', () => {
    expect(cn('foo', false, 'bar', null, undefined)).toBe('foo bar');
  });

  it('resolves clsx object values', () => {
    expect(cn('foo', { bar: true, baz: false })).toBe('foo bar');
  });

  it('merges conflicting Tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('merges conflicting text color classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('preserves non-conflicting Tailwind classes', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
    expect(cn([])).toBe('');
  });

  it('handles mixed valid and invalid inputs', () => {
    expect(cn('foo', 0, 'bar', NaN, 'baz')).toBe('foo bar baz');
  });

  it('sorts classes deterministically via twMerge', () => {
    expect(cn('z-10', 'z-20')).toBe('z-20');
  });
});
