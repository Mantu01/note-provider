import { describe, it, expect } from 'vitest';
import { checkoutSchema } from '@/lib/schemas/checkout.schema';

describe('checkoutSchema', () => {
  describe('valid inputs', () => {
    it('accepts valid fullName and consent', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        consentAccepted: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('fullName validation', () => {
    it('rejects short names', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'J',
        consentAccepted: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects names longer than 80 characters', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'a'.repeat(81),
        consentAccepted: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects names with invalid characters', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John@Doe',
        consentAccepted: true,
      });
      expect(result.success).toBe(false);
    });

    it('accepts names with apostrophes and periods', () => {
      const result = checkoutSchema.safeParse({
        fullName: "O'Brien Jr.",
        consentAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it('trims whitespace from name', () => {
      const result = checkoutSchema.safeParse({
        fullName: '  John Doe  ',
        consentAccepted: true,
      });
      if (result.success) expect(result.data.fullName).toBe('John Doe');
    });
  });

  describe('consentAccepted validation', () => {
    it('rejects false consent', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        consentAccepted: false,
      });
      expect(result.success).toBe(false);
    });

    it('rejects undefined consent', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        consentAccepted: undefined as any,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('missing fields', () => {
    it('rejects missing fullName', () => {
      const result = checkoutSchema.safeParse({
        consentAccepted: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing consentAccepted', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
      });
      expect(result.success).toBe(false);
    });
  });
});
