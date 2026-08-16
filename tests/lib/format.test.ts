import { describe, it, expect, vi } from 'vitest';
import {
  formatPrice,
  formatDate,
  formatDateTime,
  formatRelative,
  formatRelativeTime,
  formatCompactNumber,
  formatFileSize,
  formatDiscount,
  rupeesToPaise,
  paiseToRupees,
  formatPriceLabel,
  formatFileSizeLabel,
  toIsoString,
  toIsoStringRequired,
  toDateKey,
  normalizeSocialHandle,
  isValidSocialHandle,
  maskSocialHandle,
} from '../../src/lib/format';

vi.stubGlobal('Intl', Intl);

describe('formatPrice', () => {
  it('formats 0 paise as zero rupees', () => {
    expect(formatPrice(0)).toBe('₹0');
  });

  it('formats 100 paise as 1 rupee', () => {
    expect(formatPrice(100)).toBe('₹1');
  });

  it('formats 1000 paise as 10 rupees', () => {
    expect(formatPrice(1000)).toBe('₹10');
  });

  it('rounds 99 paise to nearest rupee', () => {
    expect(formatPrice(99)).toBe('₹1');
  });

  it('rounds 12345 paise to nearest rupee', () => {
    expect(formatPrice(12345)).toBe('₹123');
  });

  it('formats 100000 paise as ₹1,000', () => {
    expect(formatPrice(100000)).toBe('₹1,000');
  });

  it('formats large values with Indian numbering', () => {
    expect(formatPrice(1000000)).toBe('₹10,000');
  });

  it('handles negative paise values', () => {
    expect(formatPrice(-500)).toContain('-');
  });

  it('rounds 1234 paise to nearest rupee', () => {
    expect(formatPrice(1234)).toBe('₹12');
  });
});

describe('formatDate', () => {
  it('formats a valid date string', () => {
    const localDate = new Date('2024-06-15T10:00:00');
    expect(formatDate(localDate.toISOString())).toBe('15 Jun 2024');
  });

  it('formats dates in different months', () => {
    const jan = new Date('2024-01-01T00:00:00');
    const dec = new Date('2024-12-31T23:59:59');
    expect(formatDate(jan.toISOString())).toBe('01 Jan 2024');
    expect(formatDate(dec.toISOString())).toBe('31 Dec 2024');
  });

  it('handles single-digit days with leading zero', () => {
    const date = new Date('2024-03-05T12:00:00');
    expect(formatDate(date.toISOString())).toBe('05 Mar 2024');
  });

  it('throws for invalid date strings', () => {
    expect(() => formatDate('not-a-date')).toThrow();
  });

  it('throws for empty string', () => {
    expect(() => formatDate('')).toThrow();
  });
});

describe('formatDateTime', () => {
  it('formats a valid date with time', () => {
    const date = new Date('2024-06-15T10:30:00');
    const result = formatDateTime(date.toISOString());
    expect(result).toContain('Jun 2024');
  });

  it('formats afternoon times correctly', () => {
    const date = new Date('2024-06-15T14:30:00');
    const result = formatDateTime(date.toISOString());
    expect(result).toContain('PM');
  });

  it('formats morning times correctly', () => {
    const date = new Date('2024-06-15T02:30:00');
    const result = formatDateTime(date.toISOString());
    expect(result).toContain('AM');
  });

  it('throws for invalid date strings', () => {
    expect(() => formatDateTime('invalid')).toThrow();
  });
});

describe('formatRelative', () => {
  it('returns a relative time string with suffix for past dates', () => {
    const past = new Date(Date.now() - 3600000).toISOString();
    const result = formatRelative(past);
    expect(result).toContain('ago');
  });

  it('returns a relative time string for future dates', () => {
    const future = new Date(Date.now() + 3600000).toISOString();
    const result = formatRelative(future);
    expect(result).toContain('in');
  });

  it('throws for invalid date strings', () => {
    expect(() => formatRelative('not-a-date')).toThrow();
  });
});

describe('formatRelativeTime', () => {
  it('is an alias for formatRelative', () => {
    const past = new Date(Date.now() - 60000).toISOString();
    expect(formatRelativeTime(past)).toBe(formatRelative(past));
  });
});

describe('formatCompactNumber', () => {
  it('formats small numbers as-is', () => {
    expect(formatCompactNumber(500)).toBe('500');
  });

  it('formats thousands with K suffix', () => {
    expect(formatCompactNumber(1500)).toBe('1.5K');
  });

  it('formats large values using Indian numbering system', () => {
    expect(formatCompactNumber(1500000)).toMatch(/L/);
  });

  it('rounds to one decimal place', () => {
    expect(formatCompactNumber(1234)).toBe('1.2K');
  });

  it('handles zero', () => {
    expect(formatCompactNumber(0)).toBe('0');
  });

  it('handles negative numbers', () => {
    expect(formatCompactNumber(-1500)).toMatch(/-1\.5K/);
  });
});

describe('formatFileSize', () => {
  it('formats bytes without decimal', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('formats exactly 1024 bytes as 1 KB', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
  });

  it('formats 1536 bytes as 2 KB', () => {
    expect(formatFileSize(1536)).toBe('2 KB');
  });

  it('formats MB values with one decimal', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB');
  });

  it('formats GB values with one decimal', () => {
    expect(formatFileSize(1073741824)).toBe('1.0 GB');
  });

  it('handles negative values without throwing', () => {
    const result = formatFileSize(-100);
    expect(typeof result).toBe('string');
  });

  it('handles zero without throwing', () => {
    const result = formatFileSize(0);
    expect(typeof result).toBe('string');
  });

  it('formats values close to unit boundaries', () => {
    expect(formatFileSize(1023)).toBe('1023 B');
  });
});

describe('formatDiscount', () => {
  it('returns null when compareAtPrice is null', () => {
    expect(formatDiscount(1000, null)).toBeNull();
  });

  it('returns null when compareAtPrice is zero', () => {
    expect(formatDiscount(1000, 0)).toBeNull();
  });

  it('returns null when compareAtPrice equals price', () => {
    expect(formatDiscount(1000, 1000)).toBeNull();
  });

  it('returns null when compareAtPrice is less than price', () => {
    expect(formatDiscount(1000, 500)).toBeNull();
  });

  it('calculates discount percentage correctly', () => {
    expect(formatDiscount(800, 1000)).toBe('20% OFF');
  });

  it('rounds discount percentage', () => {
    expect(formatDiscount(330, 1000)).toBe('67% OFF');
  });

  it('handles exact 50 percent discount', () => {
    expect(formatDiscount(500, 1000)).toBe('50% OFF');
  });
});

describe('rupeesToPaise', () => {
  it('converts whole rupees to paise', () => {
    expect(rupeesToPaise(10)).toBe(1000);
  });

  it('converts decimal rupees to paise', () => {
    expect(rupeesToPaise(12.5)).toBe(1250);
  });

  it('handles zero', () => {
    expect(rupeesToPaise(0)).toBe(0);
  });

  it('rounds floating point values', () => {
    expect(rupeesToPaise(9.99)).toBe(999);
  });

  it('handles very small values', () => {
    expect(rupeesToPaise(0.01)).toBe(1);
  });
});

describe('paiseToRupees', () => {
  it('converts paise to rupees', () => {
    expect(paiseToRupees(1000)).toBe(10);
  });

  it('converts small paise values', () => {
    expect(paiseToRupees(50)).toBe(0.5);
  });

  it('handles zero', () => {
    expect(paiseToRupees(0)).toBe(0);
  });
});

describe('formatPriceLabel', () => {
  it('returns Free for pricingType free', () => {
    expect(formatPriceLabel(500, 'free')).toBe('Free');
  });

  it('returns Free when paise is zero', () => {
    expect(formatPriceLabel(0, 'paid')).toBe('Free');
  });

  it('returns formatted price for paid notes with non-zero price', () => {
    expect(formatPriceLabel(1000, 'paid')).toBe('₹10');
  });

  it('returns formatted price without pricingType when paise is non-zero', () => {
    expect(formatPriceLabel(1000)).toBe('₹10');
  });

  it('returns Free for pricingType free even with non-zero paise', () => {
    expect(formatPriceLabel(500, 'free')).toBe('Free');
  });
});

describe('formatFileSizeLabel', () => {
  it('returns null for undefined', () => {
    expect(formatFileSizeLabel(undefined)).toBeNull();
  });

  it('returns null for null', () => {
    expect(formatFileSizeLabel(null)).toBeNull();
  });

  it('returns null for zero', () => {
    expect(formatFileSizeLabel(0)).toBeNull();
  });

  it('returns null for negative values', () => {
    expect(formatFileSizeLabel(-100)).toBeNull();
  });

  it('returns formatted size for valid positive bytes', () => {
    const result = formatFileSizeLabel(1024);
    expect(result).toBe('1 KB');
  });

  it('returns formatted size for 500 bytes', () => {
    expect(formatFileSizeLabel(500)).toBe('500 B');
  });
});

describe('toIsoString', () => {
  it('returns ISO string for a Date object', () => {
    const date = new Date('2024-06-15T10:00:00.000Z');
    expect(toIsoString(date)).toBe(date.toISOString());
  });

  it('returns ISO string for a valid ISO string', () => {
    expect(toIsoString('2024-06-15T10:00:00.000Z')).toBe('2024-06-15T10:00:00.000Z');
  });

  it('returns null for undefined', () => {
    expect(toIsoString(undefined)).toBeNull();
  });

  it('returns null for null', () => {
    expect(toIsoString(null)).toBeNull();
  });

  it('returns null for invalid date string', () => {
    expect(toIsoString('not-a-date')).toBeNull();
  });

  it('returns null for NaN-like values', () => {
    expect(toIsoString('Invalid Date')).toBeNull();
  });
});

describe('toIsoStringRequired', () => {
  it('returns ISO string for a valid Date', () => {
    const date = new Date('2024-06-15T10:00:00.000Z');
    expect(toIsoStringRequired(date)).toBe(date.toISOString());
  });

  it('returns ISO string for a valid string', () => {
    expect(toIsoStringRequired('2024-06-15T10:00:00.000Z')).toBe('2024-06-15T10:00:00.000Z');
  });

  it('falls back to epoch for invalid date string', () => {
    expect(toIsoStringRequired('not-a-date')).toBe(new Date(0).toISOString());
  });

  it('falls back to epoch for empty string', () => {
    expect(toIsoStringRequired('')).toBe(new Date(0).toISOString());
  });
});

describe('toDateKey', () => {
  it('returns date key in YYYY-MM-DD format', () => {
    const date = new Date('2024-06-15T10:00:00.000Z');
    expect(toDateKey(date)).toBe('2024-06-15');
  });

  it('handles different months', () => {
    const date = new Date('2024-01-05T00:00:00.000Z');
    expect(toDateKey(date)).toBe('2024-01-05');
  });

  it('handles single digit months with leading zero', () => {
    const date = new Date('2024-03-01T12:00:00.000Z');
    expect(toDateKey(date)).toBe('2024-03-01');
  });
});

describe('normalizeSocialHandle', () => {
  it('normalizes instagram handle by adding @ prefix and removing existing @', () => {
    expect(normalizeSocialHandle('instagram', 'johndoe')).toBe('@johndoe');
    expect(normalizeSocialHandle('instagram', '@johndoe')).toBe('@johndoe');
  });

  it('trims whitespace from instagram handle', () => {
    expect(normalizeSocialHandle('instagram', '  johndoe  ')).toBe('@johndoe');
  });

  it('normalizes email to lowercase', () => {
    expect(normalizeSocialHandle('email', 'John@Example.COM')).toBe('john@example.com');
  });

  it('trims whitespace from email handle', () => {
    expect(normalizeSocialHandle('email', '  test@example.com  ')).toBe('test@example.com');
  });

  it('normalizes whatsapp handle by stripping non-digits and formatting', () => {
    expect(normalizeSocialHandle('whatsapp', '+919876543210')).toBe('+919876543210');
    expect(normalizeSocialHandle('whatsapp', '919876543210')).toBe('+919876543210');
    expect(normalizeSocialHandle('whatsapp', '09876543210')).toBe('+919876543210');
  });

  it('takes last 10 digits for whatsapp handles longer than 10 digits', () => {
    expect(normalizeSocialHandle('whatsapp', '+9198765432101234')).toBe('+915432101234');
  });

  it('strips non-digit characters from whatsapp handle', () => {
    expect(normalizeSocialHandle('whatsapp', '+91-98765-43210')).toBe('+919876543210');
  });
});

describe('isValidSocialHandle', () => {
  it('validates instagram handle with @ prefix', () => {
    expect(isValidSocialHandle('instagram', '@johndoe')).toBe(true);
  });

  it('validates instagram handle without @ prefix', () => {
    expect(isValidSocialHandle('instagram', 'johndoe')).toBe(true);
  });

  it('rejects instagram handle that is too long', () => {
    expect(isValidSocialHandle('instagram', 'a'.repeat(31))).toBe(false);
  });

  it('rejects invalid instagram handle with special characters', () => {
    expect(isValidSocialHandle('instagram', 'john@doe')).toBe(false);
  });

  it('validates valid email addresses', () => {
    expect(isValidSocialHandle('email', 'user@example.com')).toBe(true);
  });

  it('rejects invalid email addresses', () => {
    expect(isValidSocialHandle('email', 'not-an-email')).toBe(false);
    expect(isValidSocialHandle('email', 'user@')).toBe(false);
    expect(isValidSocialHandle('email', '@example.com')).toBe(false);
  });

  it('validates valid indian whatsapp numbers with +91', () => {
    expect(isValidSocialHandle('whatsapp', '+919876543210')).toBe(true);
  });

  it('validates valid indian whatsapp numbers without +91', () => {
    expect(isValidSocialHandle('whatsapp', '9876543210')).toBe(true);
  });

  it('validates valid indian whatsapp numbers with 0 prefix', () => {
    expect(isValidSocialHandle('whatsapp', '09876543210')).toBe(true);
  });

  it('rejects whatsapp numbers starting with invalid digit after removing prefix', () => {
    expect(isValidSocialHandle('whatsapp', '+915876543210')).toBe(false);
  });

  it('rejects whatsapp numbers that are too short', () => {
    expect(isValidSocialHandle('whatsapp', '987654321')).toBe(false);
  });

  it('rejects empty strings for all platforms', () => {
    expect(isValidSocialHandle('instagram', '')).toBe(false);
    expect(isValidSocialHandle('email', '')).toBe(false);
    expect(isValidSocialHandle('whatsapp', '')).toBe(false);
  });
});

describe('maskSocialHandle', () => {
  it('masks instagram handle showing first 2 and last 2 characters', () => {
    expect(maskSocialHandle('instagram', '@johndoe')).toBe('@jo***oe');
  });

  it('masks instagram handle when name is too short', () => {
    expect(maskSocialHandle('instagram', '@ab')).toBe('@**');
  });

  it('masks whatsapp number showing last 4 digits with +91 prefix', () => {
    expect(maskSocialHandle('whatsapp', '+919876543210')).toBe('+91******3210');
  });

  it('masks short whatsapp numbers appropriately', () => {
    expect(maskSocialHandle('whatsapp', '+9198')).toBe('+919198');
  });

  it('masks email showing first 2 characters of local part', () => {
    expect(maskSocialHandle('email', 'john@example.com')).toBe('jo**@example.com');
  });

  it('masks email without domain using maskMiddle', () => {
    expect(maskSocialHandle('email', 'johndoe')).toBe('jo*****');
  });

  it('handles very short instagram names', () => {
    expect(maskSocialHandle('instagram', '@a')).toBe('@*');
  });
});
