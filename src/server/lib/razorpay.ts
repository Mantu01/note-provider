import crypto from "node:crypto";
import Razorpay from "razorpay";
import { AppError } from "./errors";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw AppError.internal("Payments are not configured");
  return value;
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? "",
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? "",
});

export function getRazorpayKeyId(): string {
  return requireEnv("RAZORPAY_KEY_ID");
}

function timingSafeCompare(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");
  if (bufferA.length !== bufferB.length) return false;
  return crypto.timingSafeEqual(bufferA, bufferB);
}

export function verifyPaymentSignature(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const expected = crypto
    .createHmac("sha256", requireEnv("RAZORPAY_KEY_SECRET"))
    .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
    .digest("hex");
  return timingSafeCompare(expected, input.razorpaySignature);
}

export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", requireEnv("RAZORPAY_WEBHOOK_SECRET"))
    .update(rawBody)
    .digest("hex");
  return timingSafeCompare(expected, signature);
}

export async function createRazorpayOrder(input: {
  amount: number;
  receipt: string;
  notes: Record<string, string>;
}): Promise<{ id: string }> {
  try {
    const order = await razorpay.orders.create({
      amount: input.amount,
      currency: "INR",
      receipt: input.receipt,
      notes: input.notes,
    });
    return { id: order.id };
  } catch (error) {
    console.error("[razorpay] order creation failed", error);
    throw AppError.payment("Could not start the payment. Please try again.");
  }
}
