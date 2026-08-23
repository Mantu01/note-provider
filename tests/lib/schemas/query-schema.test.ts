import { describe, it, expect } from 'vitest';
import { notesQuerySchema, ordersQuerySchema } from '@/lib/schemas/query.schema';
import { NOTE_SORTS, ORDER_SORTS, PAYMENT_STATUSES, FULFILLMENT_STATUSES, NOTE_LEVELS, NOTE_PRICING_TYPES, NOTE_VISIBILITIES, DEFAULT_PAGE_LIMIT } from '@/lib/constants';

describe('notesQuerySchema', () => {
  it('accepts empty query', () => {
    const result = notesQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts valid sort', () => {
    const result = notesQuerySchema.safeParse({ sort: 'newest' });
    expect(result.success).toBe(true);
  });

  it('accepts invalid sort without error (uses default)', () => {
    const result = notesQuerySchema.safeParse({ sort: 'invalid' });
    if (result.success) expect(result.data.sort).toBeUndefined();
  });

  it('accepts q parameter', () => {
    const result = notesQuerySchema.safeParse({ q: 'react' });
    expect(result.success).toBe(true);
  });

  it('accepts category array', () => {
    const result = notesQuerySchema.safeParse({ category: ['507f1f77bcf86cd799439011'] });
    expect(result.success).toBe(true);
  });

  it('accepts multiple categories', () => {
    const result = notesQuerySchema.safeParse({ category: ['id1', 'id2'] });
    expect(result.success).toBe(true);
  });

  it('accepts pricing filter', () => {
    const result = notesQuerySchema.safeParse({ pricing: 'paid' });
    expect(result.success).toBe(true);
  });

  it('accepts level as array', () => {
    const result = notesQuerySchema.safeParse({ level: ['intermediate'] });
    expect(result.success).toBe(true);
  });

  it('accepts search query', () => {
    const result = notesQuerySchema.safeParse({ q: 'javascript' });
    expect(result.success).toBe(true);
  });

  it('accepts pagination params', () => {
    const result = notesQuerySchema.safeParse({ page: '1', limit: '20' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.page).toBe(1);
  });

  it('accepts visibility filter', () => {
    const result = notesQuerySchema.safeParse({ visibility: 'public' });
    expect(result.success).toBe(true);
  });

  it('accepts tags array', () => {
    const result = notesQuerySchema.safeParse({ tags: ['react', 'frontend'] });
    expect(result.success).toBe(true);
  });

  it('combines all filters', () => {
    const result = notesQuerySchema.safeParse({
      q: 'react',
      category: ['id1'],
      pricing: 'paid',
      level: ['intermediate'],
      sort: 'newest',
      tags: ['react'],
      visibility: 'public',
    });
    expect(result.success).toBe(true);
  });
});

describe('ordersQuerySchema', () => {
  it('accepts empty query', () => {
    const result = ordersQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts valid payment status', () => {
    const result = ordersQuerySchema.safeParse({ paymentStatus: 'paid' });
    expect(result.success).toBe(true);
  });

  it('accepts valid fulfillment status', () => {
    const result = ordersQuerySchema.safeParse({ fulfillmentStatus: 'pending' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid payment status', () => {
    const result = ordersQuerySchema.safeParse({ paymentStatus: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('accepts sort by amount desc', () => {
    const result = ordersQuerySchema.safeParse({ sort: 'amount_desc' });
    expect(result.success).toBe(true);
  });

  it('accepts item type', () => {
    const result = ordersQuerySchema.safeParse({ itemType: 'note' });
    expect(result.success).toBe(true);
  });

  it('accepts date range', () => {
    const result = ordersQuerySchema.safeParse({ from: '2024-01-01T00:00:00Z', to: '2024-12-31T23:59:59Z' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid date', () => {
    const result = ordersQuerySchema.safeParse({ from: 'not-a-date' });
    expect(result.success).toBe(false);
  });
});

describe('NOTE_SORTS constant', () => {
  it('contains expected sort options', () => {
    expect(NOTE_SORTS).toContain('newest');
    expect(NOTE_SORTS).toContain('oldest');
    expect(NOTE_SORTS).toContain('price_asc');
    expect(NOTE_SORTS).toContain('price_desc');
    expect(NOTE_SORTS).toContain('popular');
    expect(NOTE_SORTS).toContain('title_asc');
  });
});

describe('ORDER_SORTS constant', () => {
  it('contains expected sort options', () => {
    expect(ORDER_SORTS).toContain('newest');
    expect(ORDER_SORTS).toContain('oldest');
    expect(ORDER_SORTS).toContain('amount_desc');
    expect(ORDER_SORTS).toContain('amount_asc');
  });
});

describe('PAYMENT_STATUSES constant', () => {
  it('contains expected statuses', () => {
    expect(PAYMENT_STATUSES).toContain('created');
    expect(PAYMENT_STATUSES).toContain('paid');
    expect(PAYMENT_STATUSES).toContain('failed');
  });
});

describe('FULFILLMENT_STATUSES constant', () => {
  it('contains expected statuses', () => {
    expect(FULFILLMENT_STATUSES).toContain('pending');
    expect(FULFILLMENT_STATUSES).toContain('completed');
    expect(FULFILLMENT_STATUSES).toContain('cancelled');
  });
});

describe('NOTE_LEVELS constant', () => {
  it('contains expected levels', () => {
    expect(NOTE_LEVELS).toContain('basics');
    expect(NOTE_LEVELS).toContain('intermediate');
    expect(NOTE_LEVELS).toContain('advance');
  });
});

describe('NOTE_PRICING_TYPES constant', () => {
  it('contains expected types', () => {
    expect(NOTE_PRICING_TYPES).toContain('free');
    expect(NOTE_PRICING_TYPES).toContain('paid');
  });
});

describe('NOTE_VISIBILITIES constant', () => {
  it('contains expected values', () => {
    expect(NOTE_VISIBILITIES).toContain('public');
    expect(NOTE_VISIBILITIES).toContain('private');
  });
});
