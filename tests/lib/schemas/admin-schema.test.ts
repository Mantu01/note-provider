
import { describe, it, expect } from 'vitest';
import { adminRegisterSchema, adminLoginSchema, updateOrderSchema } from '@/lib/schemas/admin.schema';

describe('adminRegisterSchema', () => {
  describe('valid inputs', () => {
    it('accepts a valid registration with all fields', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'StrongPass1',
        isHead: true,
      });
      expect(result.success).toBe(true);
    });

    it('accepts registration without isHead field', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'StrongPass1',
      });
      expect(result.success).toBe(true);
    });

    it('accepts isHead as false', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'StrongPass1',
        isHead: false,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('name validation', () => {
    it('rejects names shorter than 2 characters', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'A',
        email: 'a@example.com',
        password: 'StrongPass1',
      });
      expect(result.success).toBe(false);
    });

    it('rejects names longer than 60 characters', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'a'.repeat(61),
        email: 'a@example.com',
        password: 'StrongPass1',
      });
      expect(result.success).toBe(false);
    });

    it('trims whitespace from name', () => {
      const result = adminRegisterSchema.safeParse({
        name: '  Admin User  ',
        email: 'admin@example.com',
        password: 'StrongPass1',
      });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.name).toBe('Admin User');
    });
  });

  describe('email validation', () => {
    it('rejects invalid email addresses', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'Admin User',
        email: 'not-an-email',
        password: 'StrongPass1',
      });
      expect(result.success).toBe(false);
    });

    it('rejects email with spaces', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'Admin User',
        email: 'admin @example.com',
        password: 'StrongPass1',
      });
      expect(result.success).toBe(false);
    });

    it('accepts valid lowercase email', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'StrongPass1',
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid email', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'StrongPass1',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('password validation', () => {
    it('rejects passwords shorter than 8 characters', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Short1',
      });
      expect(result.success).toBe(false);
    });

    it('rejects passwords longer than 128 characters', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'a'.repeat(129),
      });
      expect(result.success).toBe(false);
    });

    it('rejects passwords without a letter', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'Admin User',
        email: 'admin@example.com',
        password: '12345678',
      });
      expect(result.success).toBe(false);
    });

    it('rejects passwords without a number', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'StrongPass',
      });
      expect(result.success).toBe(false);
    });

    it('accepts passwords with letters and numbers', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'StrongPass1',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('missing fields', () => {
    it('rejects missing name', () => {
      const result = adminRegisterSchema.safeParse({
        email: 'admin@example.com',
        password: 'StrongPass1',
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing email', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'Admin User',
        password: 'StrongPass1',
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing password', () => {
      const result = adminRegisterSchema.safeParse({
        name: 'Admin User',
        email: 'admin@example.com',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('adminLoginSchema', () => {
  describe('valid inputs', () => {
    it('accepts valid login credentials', () => {
      const result = adminLoginSchema.safeParse({
        email: 'admin@example.com',
        password: 'StrongPass1',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('email validation', () => {
    it('rejects invalid email', () => {
      const result = adminLoginSchema.safeParse({
        email: 'not-an-email',
        password: 'StrongPass1',
      });
      expect(result.success).toBe(false);
    });

    it('accepts valid lowercase email', () => {
      const result = adminLoginSchema.safeParse({
        email: 'admin@example.com',
        password: 'StrongPass1',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('password validation', () => {
    it('rejects empty password', () => {
      const result = adminLoginSchema.safeParse({
        email: 'admin@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });

    it('rejects passwords longer than 128 characters', () => {
      const result = adminLoginSchema.safeParse({
        email: 'admin@example.com',
        password: 'a'.repeat(129),
      });
      expect(result.success).toBe(false);
    });

    it('accepts passwords without numbers', () => {
      const result = adminLoginSchema.safeParse({
        email: 'admin@example.com',
        password: 'StrongPassword',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('missing fields', () => {
    it('rejects missing email', () => {
      const result = adminLoginSchema.safeParse({
        password: 'StrongPass1',
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing password', () => {
      const result = adminLoginSchema.safeParse({
        email: 'admin@example.com',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty object', () => {
      const result = adminLoginSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});

describe('updateOrderSchema', () => {
  describe('valid inputs', () => {
    it('accepts update with fulfillmentStatus only', () => {
      const result = updateOrderSchema.safeParse({
        fulfillmentStatus: 'completed',
      });
      expect(result.success).toBe(true);
    });

    it('accepts update with adminNote only', () => {
      const result = updateOrderSchema.safeParse({
        adminNote: 'Sent to customer',
      });
      expect(result.success).toBe(true);
    });

    it('accepts update with both fields', () => {
      const result = updateOrderSchema.safeParse({
        fulfillmentStatus: 'completed',
        adminNote: 'Sent to customer',
      });
      expect(result.success).toBe(true);
    });

    it('accepts null adminNote', () => {
      const result = updateOrderSchema.safeParse({
        adminNote: null,
      });
      expect(result.success).toBe(true);
    });

    it('accepts fulfillmentStatus cancelled', () => {
      const result = updateOrderSchema.safeParse({
        fulfillmentStatus: 'cancelled',
      });
      expect(result.success).toBe(true);
    });

    it('accepts fulfillmentStatus pending', () => {
      const result = updateOrderSchema.safeParse({
        fulfillmentStatus: 'pending',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('rejects empty object', () => {
      const result = updateOrderSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('rejects object with only undefined values', () => {
      const result = updateOrderSchema.safeParse({
        fulfillmentStatus: undefined,
        adminNote: undefined,
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid fulfillmentStatus', () => {
      const result = updateOrderSchema.safeParse({
        fulfillmentStatus: 'invalid' as 'pending',
      });
      expect(result.success).toBe(false);
    });

    it('rejects adminNote over 1000 characters', () => {
      const result = updateOrderSchema.safeParse({
        adminNote: 'a'.repeat(1001),
      });
      expect(result.success).toBe(false);
    });

    it('trims whitespace from adminNote', () => {
      const result = updateOrderSchema.safeParse({
        adminNote: '  Sent note  ',
      });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.adminNote).toBe('Sent note');
    });
  });
});
