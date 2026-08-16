import { describe, it, expect } from 'vitest';
import { paginationQuerySchema, noteQuerySchema, orderQuerySchema, leadQuerySchema, activityQuerySchema } from '@/lib/schemas/query.schema';
import { NOTE_SORTS, ORDER_SORTS, PAYMENT_STATUSES, FULFILLMENT_STATUSES, NOTE_LEVELS, NOTE_PRICING_TYPES, NOTE_VISIBILITIES, MAX_PAGE_LIMIT } from '@/lib/constants';

describe('paginationQuerySchema', () => {
  it('accepts valid page and limit', () => {
    const result = paginationQuerySchema.safeParse({ page: '2', limit: '10' });
    expect(result.success).toBe(true);
  });

  it('defaults page to 1', () => {
    const result = paginationQuerySchema.safeParse({});
    if (result.success) expect(result.data.page).toBe(1);
  });

  it('defaults limit to MAX_PAGE_LIMIT', () => {
    const result = paginationQuerySchema.safeParse({});
    if (result.success) expect(result.data.limit).toBe(MAX_PAGE_LIMIT);
  });

  it('accepts max limit', () => {
    const result = paginationQuerySchema.safeParse({ limit: '48' });
    expect(result.success).toBe(true);
  });

  it('accepts limit over max without error (uses catch)', () => {
    const result = paginationQuerySchema.safeParse({ limit: '100' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.limit).toBe(MAX_PAGE_LIMIT);
  });

  it('accepts negative page via coerce and catch to default', () => {
    const result = paginationQuerySchema.safeParse({ page: '-1' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.page).toBe(1);
  });
});

describe('noteQuerySchema', () => {
  it('accepts empty query', () => {
    const result = noteQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts valid sort', () => {
    const result = noteQuerySchema.safeParse({ sort: 'newest' });
    expect(result.success).toBe(true);
  });

  it('accepts invalid sort without error (uses catch)', () => {
    const result = noteQuerySchema.safeParse({ sort: 'invalid' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.sort).toBe('newest');
  });

  it('accepts q parameter', () => {
    const result = noteQuerySchema.safeParse({ q: 'react' });
    expect(result.success).toBe(true);
  });

  it('accepts category array', () => {
    const result = noteQuerySchema.safeParse({ category: ['507f1f77bcf86cd799439011'] });
    expect(result.success).toBe(true);
  });

  it('accepts multiple categories', () => {
    const result = noteQuerySchema.safeParse({ category: ['id1', 'id2'] });
    expect(result.success).toBe(true);
  });

  it('accepts pricing filter', () => {
    const result = noteQuerySchema.safeParse({ pricing: 'paid' });
    expect(result.success).toBe(true);
  });

  it('accepts level as array', () => {
    const result = noteQuerySchema.safeParse({ level: ['intermediate'] });
    expect(result.success).toBe(true);
  });

  it('accepts search query', () => {
    const result = noteQuerySchema.safeParse({ q: 'javascript' });
    expect(result.success).toBe(true);
  });

  it('accepts pagination params', () => {
    const result = noteQuerySchema.safeParse({ page: '1', limit: '20' });
    expect(result.success).toBe(true);
  });

  it('accepts visibility filter', () => {
    const result = noteQuerySchema.safeParse({ visibility: 'public' });
    expect(result.success).toBe(true);
  });

  it('accepts tags array', () => {
    const result = noteQuerySchema.safeParse({ tags: ['react', 'frontend'] });
    expect(result.success).toBe(true);
  });

  it('combines all filters', () => {
    const result = noteQuerySchema.safeParse({
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

describe('orderQuerySchema', () => {
  it('accepts empty query', () => {
    const result = orderQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts valid payment status', () => {
    const result = orderQuerySchema.safeParse({ paymentStatus: 'paid' });
    expect(result.success).toBe(true);
  });

  it('accepts valid fulfillment status', () => {
    const result = orderQuerySchema.safeParse({ fulfillmentStatus: 'pending' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid payment status', () => {
    const result = orderQuerySchema.safeParse({ paymentStatus: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('accepts sort by amount desc', () => {
    const result = orderQuerySchema.safeParse({ sort: 'amount_desc' });
    expect(result.success).toBe(true);
  });

  it('accepts item type', () => {
    const result = orderQuerySchema.safeParse({ itemType: 'note' });
    expect(result.success).toBe(true);
  });

  it('accepts date range', () => {
    const result = orderQuerySchema.safeParse({ from: '2024-01-01', to: '2024-12-31' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid date', () => {
    const result = orderQuerySchema.safeParse({ from: 'not-a-date' });
    expect(result.success).toBe(false);
  });
});

describe('leadQuerySchema', () => {
  it('accepts empty query', () => {
    const result = leadQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts date range', () => {
    const result = leadQuerySchema.safeParse({ from: '2024-01-01', to: '2024-12-31' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid date format', () => {
    const result = leadQuerySchema.safeParse({ from: 'not-a-date' });
    expect(result.success).toBe(false);
  });

  it('accepts social platform filter', () => {
    const result = leadQuerySchema.safeParse({ socialPlatform: 'instagram' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid social platform', () => {
    const result = leadQuerySchema.safeParse({ socialPlatform: 'invalid' });
    expect(result.success).toBe(false);
  });
});

describe('activityQuerySchema', () => {
  it('accepts empty query', () => {
    const result = activityQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts valid adminId', () => {
    const result = activityQuerySchema.safeParse({ adminId: '507f1f77bcf86cd799439011' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid adminId', () => {
    const result = activityQuerySchema.safeParse({ adminId: 'invalid-id' });
    expect(result.success).toBe(false);
  });

  it('accepts valid action', () => {
    const result = activityQuerySchema.safeParse({ action: 'note.create' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid action', () => {
    const result = activityQuerySchema.safeParse({ action: 'invalid-action' });
    expect(result.success).toBe(false);
  });

  it('accepts date range', () => {
    const result = activityQuerySchema.safeParse({ from: '2024-01-01', to: '2024-12-31' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid date', () => {
    const result = activityQuerySchema.safeParse({ to: 'not-a-date' });
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
