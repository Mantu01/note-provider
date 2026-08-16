import { describe, it, expect } from 'vitest';
import { checkoutSchema } from '@/lib/schemas/checkout.schema';

describe('checkoutSchema', () => {
  describe('valid inputs', () => {
    it('accepts valid instagram handle', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'instagram',
        socialHandle: '@johndoe',
        consentAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid email handle', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'email',
        socialHandle: 'john@example.com',
        consentAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid whatsapp handle', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'whatsapp',
        socialHandle: '9876543210',
        consentAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it('accepts consent as true', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'instagram',
        socialHandle: '@johndoe',
        consentAccepted: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('fullName validation', () => {
    it('rejects short names', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'J',
        socialPlatform: 'instagram',
        socialHandle: '@johndoe',
        consentAccepted: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects names longer than 80 characters', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'a'.repeat(81),
        socialPlatform: 'instagram',
        socialHandle: '@johndoe',
        consentAccepted: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects names with invalid characters', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John@Doe',
        socialPlatform: 'instagram',
        socialHandle: '@johndoe',
        consentAccepted: true,
      });
      expect(result.success).toBe(false);
    });

    it('accepts names with apostrophes and periods', () => {
      const result = checkoutSchema.safeParse({
        fullName: "O'Brien Jr.",
        socialPlatform: 'instagram',
        socialHandle: '@johndoe',
        consentAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it('trims whitespace from name', () => {
      const result = checkoutSchema.safeParse({
        fullName: '  John Doe  ',
        socialPlatform: 'instagram',
        socialHandle: '@johndoe',
        consentAccepted: true,
      });
      if (result.success) expect(result.data.fullName).toBe('John Doe');
    });
  });

  describe('socialPlatform validation', () => {
    it('accepts instagram', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'instagram',
        socialHandle: '@johndoe',
        consentAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it('accepts whatsapp', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'whatsapp',
        socialHandle: '9876543210',
        consentAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it('accepts email', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'email',
        socialHandle: 'john@example.com',
        consentAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid social platform', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'twitter' as any,
        socialHandle: '@johndoe',
        consentAccepted: true,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('socialHandle validation', () => {
    it('validates instagram handle format', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'instagram',
        socialHandle: '@johndoe',
        consentAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid instagram handle', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'instagram',
        socialHandle: 'john@doe',
        consentAccepted: true,
      });
      expect(result.success).toBe(false);
    });

    it('validates email handle format', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'email',
        socialHandle: 'john@example.com',
        consentAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email handle', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'email',
        socialHandle: 'not-an-email',
        consentAccepted: true,
      });
      expect(result.success).toBe(false);
    });

    it('validates whatsapp handle format', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'whatsapp',
        socialHandle: '9876543210',
        consentAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid whatsapp handle', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'whatsapp',
        socialHandle: '12345',
        consentAccepted: true,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('consentAccepted validation', () => {
    it('rejects false consent', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'instagram',
        socialHandle: '@johndoe',
        consentAccepted: false,
      });
      expect(result.success).toBe(false);
    });

    it('rejects undefined consent', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'instagram',
        socialHandle: '@johndoe',
        consentAccepted: undefined as any,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('missing fields', () => {
    it('rejects missing fullName', () => {
      const result = checkoutSchema.safeParse({
        socialPlatform: 'instagram',
        socialHandle: '@johndoe',
        consentAccepted: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing socialPlatform', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialHandle: '@johndoe',
        consentAccepted: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing socialHandle', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'instagram',
        consentAccepted: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing consentAccepted', () => {
      const result = checkoutSchema.safeParse({
        fullName: 'John Doe',
        socialPlatform: 'instagram',
        socialHandle: '@johndoe',
      });
      expect(result.success).toBe(false);
    });
  });
});
