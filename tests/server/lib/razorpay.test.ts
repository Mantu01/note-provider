import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { verifyPaymentSignature, verifyWebhookSignature, createRazorpayOrder, getRazorpayKeyId } from '@/server/lib/razorpay';
import crypto from 'node:crypto';

const mocks = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockRazorpayInstance: {} as any,
}));

vi.mock('razorpay', async (importOriginal) => {
  const actual = await importOriginal<typeof import('razorpay')>();
  return {
    ...actual,
    default: vi.fn().mockImplementation(function (this: any, opts: any) {
      return { orders: { create: mocks.mockCreate } };
    }),
  };
});

describe('razorpay', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RAZORPAY_KEY_ID = 'rzp_test_key123';
    process.env.RAZORPAY_KEY_SECRET = 'test_secret';
    process.env.RAZORPAY_WEBHOOK_SECRET = 'webhook_secret';
  });

  afterEach(() => {
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith('RAZORPAY_')) {
        delete process.env[key];
      }
    });
    Object.assign(process.env, originalEnv);
  });

  describe('getRazorpayKeyId', () => {
    it('returns the Razorpay key ID', () => {
      expect(getRazorpayKeyId()).toBe('rzp_test_key123');
    });

    it('throws when RAZORPAY_KEY_ID is not set', () => {
      delete process.env.RAZORPAY_KEY_ID;
      expect(() => getRazorpayKeyId()).toThrow('Payments are not configured');
    });
  });

  describe('verifyPaymentSignature', () => {
    it('returns true for a valid signature', () => {
      const orderId = 'order_test123';
      const paymentId = 'pay_test456';
      const signature = crypto
        .createHmac('sha256', 'test_secret')
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const result = verifyPaymentSignature({
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
      });
      expect(result).toBe(true);
    });

    it('returns false for an incorrect signature', () => {
      const result = verifyPaymentSignature({
        razorpayOrderId: 'order1',
        razorpayPaymentId: 'pay1',
        razorpaySignature: 'wrong-signature',
      });
      expect(result).toBe(false);
    });

    it('returns false for empty signature', () => {
      const result = verifyPaymentSignature({
        razorpayOrderId: 'order1',
        razorpayPaymentId: 'pay1',
        razorpaySignature: '',
      });
      expect(result).toBe(false);
    });

    it('throws when RAZORPAY_KEY_SECRET is missing', () => {
      delete process.env.RAZORPAY_KEY_SECRET;
      expect(() =>
        verifyPaymentSignature({
          razorpayOrderId: 'order1',
          razorpayPaymentId: 'pay1',
          razorpaySignature: 'sig',
        }),
      ).toThrow('Payments are not configured');
    });

    it('computes signature from orderId|paymentId concatenation', () => {
      const orderId = 'order_abc';
      const paymentId = 'pay_def';
      const expected = crypto
        .createHmac('sha256', 'test_secret')
        .update('order_abc|pay_def')
        .digest('hex');

      expect(verifyPaymentSignature({
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: expected,
      })).toBe(true);
    });
  });

  describe('verifyWebhookSignature', () => {
    it('returns true for a valid webhook signature', () => {
      const rawBody = '{"event":"payment.captured"}';
      const signature = crypto
        .createHmac('sha256', 'webhook_secret')
        .update(rawBody)
        .digest('hex');

      const result = verifyWebhookSignature(rawBody, signature);
      expect(result).toBe(true);
    });

    it('returns false for an invalid webhook signature', () => {
      const result = verifyWebhookSignature('raw-body', 'bad-signature');
      expect(result).toBe(false);
    });

    it('returns false when signature is null', () => {
      const result = verifyWebhookSignature('raw-body', null);
      expect(result).toBe(false);
    });

    it('returns false when signature is undefined', () => {
      const result = verifyWebhookSignature('raw-body', undefined as any);
      expect(result).toBe(false);
    });

    it('returns false when signature is empty string', () => {
      const result = verifyWebhookSignature('raw-body', '');
      expect(result).toBe(false);
    });

    it('uses RAZORPAY_WEBHOOK_SECRET for verification', () => {
      const rawBody = '{"test":true}';
      const signature = crypto
        .createHmac('sha256', 'webhook_secret')
        .update(rawBody)
        .digest('hex');
      expect(verifyWebhookSignature(rawBody, signature)).toBe(true);
    });

    it('throws when RAZORPAY_WEBHOOK_SECRET is missing and signature is provided', () => {
      delete process.env.RAZORPAY_WEBHOOK_SECRET;
      expect(() => verifyWebhookSignature('body', 'sig')).toThrow('Payments are not configured');
    });

    it('does not throw when signature is null even if secret is missing', () => {
      delete process.env.RAZORPAY_WEBHOOK_SECRET;
      expect(verifyWebhookSignature('body', null)).toBe(false);
    });
  });

  describe('createRazorpayOrder', () => {
    it('creates an order and returns its ID', async () => {
      mocks.mockCreate.mockResolvedValue({ id: 'order_test999' });

      const result = await createRazorpayOrder({
        amount: 29900,
        receipt: 'rcpt_001',
        notes: { userId: 'user1' },
      });

      expect(result).toEqual({ id: 'order_test999' });
      expect(mocks.mockCreate).toHaveBeenCalledWith({
        amount: 29900,
        currency: 'INR',
        receipt: 'rcpt_001',
        notes: { userId: 'user1' },
      });
    });

    it('throws payment error when Razorpay API fails', async () => {
      mocks.mockCreate.mockRejectedValue(new Error('API error'));

      await expect(
        createRazorpayOrder({
          amount: 100,
          receipt: 'rcpt_2',
          notes: {},
        }),
      ).rejects.toThrow('Could not start the payment');
    });

    it('throws payment error on network failure', async () => {
      mocks.mockCreate.mockRejectedValue(new Error('network timeout'));

      await expect(
        createRazorpayOrder({
          amount: 500,
          receipt: 'rcpt_3',
          notes: { key: 'value' },
        }),
      ).rejects.toThrow('Could not start the payment');
    });

    it('returns id from response when available', async () => {
      mocks.mockCreate.mockResolvedValue({ id: 'order_test999' });

      const result = await createRazorpayOrder({
        amount: 100,
        receipt: 'rcpt_4',
        notes: {},
      });

      expect(result).toEqual({ id: 'order_test999' });
    });

    it('returns undefined id when response has no id', async () => {
      mocks.mockCreate.mockResolvedValue({});

      const result = await createRazorpayOrder({
        amount: 100,
        receipt: 'rcpt_5',
        notes: {},
      });

      expect(result).toEqual({ id: undefined });
    });

    it('passes amount in paise', async () => {
      mocks.mockCreate.mockResolvedValue({ id: 'order_x' });

      await createRazorpayOrder({
        amount: 99999,
        receipt: 'rcpt_6',
        notes: {},
      });

      expect(mocks.mockCreate).toHaveBeenCalledWith(expect.objectContaining({
        amount: 99999,
      }));
    });
  });
});
