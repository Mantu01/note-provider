import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateOrderNumber } from '@/server/lib/order-number';
import { Counter } from '@/server/db/models/counter.model';

const mockLean = vi.fn();

vi.mock('@/server/db/models/counter.model', () => ({
  Counter: {
    findOneAndUpdate: vi.fn(() => ({ lean: mockLean })),
  },
}));

describe('order-number', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates order number with current date', async () => {
    const today = new Date('2026-08-15T10:00:00Z');
    mockLean.mockResolvedValue({ seq: 1 });

    const result = await generateOrderNumber(today);
    expect(result).toMatch(/^NP-20260815-0001$/);
  });

  it('generates order number with sequential sequence', async () => {
    const today = new Date('2026-08-15T10:00:00Z');
    mockLean.mockResolvedValue({ seq: 42 });

    const result = await generateOrderNumber(today);
    expect(result).toBe('NP-20260815-0042');
  });

  it('uses sequence 1 when counter is null', async () => {
    const today = new Date('2026-08-15T10:00:00Z');
    mockLean.mockResolvedValue(null);

    const result = await generateOrderNumber(today);
    expect(result).toBe('NP-20260815-0001');
  });

  it('uses sequence 1 when counter has no seq property', async () => {
    const today = new Date('2026-08-15T10:00:00Z');
    mockLean.mockResolvedValue({});

    const result = await generateOrderNumber(today);
    expect(result).toBe('NP-20260815-0001');
  });

  it('formats date correctly for year boundary', async () => {
    const date = new Date('2026-12-31T23:59:59Z');
    mockLean.mockResolvedValue({ seq: 1 });

    const result = await generateOrderNumber(date);
    expect(result).toBe('NP-20261231-0001');
  });

  it('formats date correctly for month boundary', async () => {
    const date = new Date('2026-01-01T00:00:00Z');
    mockLean.mockResolvedValue({ seq: 5 });

    const result = await generateOrderNumber(date);
    expect(result).toBe('NP-20260101-0005');
  });

  it('calls findOneAndUpdate with correct key and upsert', async () => {
    const today = new Date('2026-08-15T10:00:00Z');
    mockLean.mockResolvedValue({ seq: 1 });

    await generateOrderNumber(today);

    expect(Counter.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'order:20260815' },
      { $inc: { seq: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  });

  it('handles large sequence numbers', async () => {
    const today = new Date('2026-08-15T10:00:00Z');
    mockLean.mockResolvedValue({ seq: 9999 });

    const result = await generateOrderNumber(today);
    expect(result).toBe('NP-20260815-9999');
  });

  it('handles single digit sequence with leading zeros', async () => {
    const today = new Date('2026-08-15T10:00:00Z');
    mockLean.mockResolvedValue({ seq: 7 });

    const result = await generateOrderNumber(today);
    expect(result).toBe('NP-20260815-0007');
  });

  it('handles two digit sequence with leading zeros', async () => {
    const today = new Date('2026-08-15T10:00:00Z');
    mockLean.mockResolvedValue({ seq: 77 });

    const result = await generateOrderNumber(today);
    expect(result).toBe('NP-20260815-0077');
  });

  it('handles three digit sequence with leading zeros', async () => {
    const today = new Date('2026-08-15T10:00:00Z');
    mockLean.mockResolvedValue({ seq: 777 });

    const result = await generateOrderNumber(today);
    expect(result).toBe('NP-20260815-0777');
  });

  it('throws when database query fails', async () => {
    const today = new Date('2026-08-15T10:00:00Z');
    mockLean.mockRejectedValue(new Error('db error'));

    await expect(generateOrderNumber(today)).rejects.toThrow('db error');
  });

  it('uses provided Date and not current time', async () => {
    const fixedDate = new Date('2025-01-01T00:00:00Z');
    mockLean.mockResolvedValue({ seq: 1 });

    const result = await generateOrderNumber(fixedDate);
    expect(result).toBe('NP-20250101-0001');
  });
});
