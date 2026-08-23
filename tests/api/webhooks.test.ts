import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/webhooks/razorpay/route'
import { verifyWebhookSignature } from '@/server/lib/razorpay'
import { Order } from '@/server/db/models/order.model'
import { Note } from '@/server/db/models/note.model'
import { Group } from '@/server/db/models/group.model'

vi.mock('@/server/db/connect', () => ({
  connectDb: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/server/lib/razorpay', () => ({
  getRazorpayKeyId: vi.fn(() => 'rzp_test_key'),
  verifyWebhookSignature: vi.fn(),
}))
vi.mock('@/server/db/models/order.model', () => ({
  Order: { findOneAndUpdate: vi.fn() },
}))
vi.mock('@/server/db/models/note.model', () => ({
  Note: { findByIdAndUpdate: vi.fn() },
}))
vi.mock('@/server/db/models/group.model', () => ({
  Group: { findByIdAndUpdate: vi.fn() },
}))

describe('POST /api/webhooks/razorpay', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(verifyWebhookSignature as any).mockReturnValue(true)
    ;(Order.findOneAndUpdate as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    })
  })

  it('returns 400 when signature header is missing', async () => {
    const body = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_1' } } } })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    })
    req.text = () => Promise.resolve(body)
    const result = await POST(req as any)
    expect(result.status).toBe(400)
    const json = await result.json()
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })

  it('returns 400 when signature is invalid', async () => {
    ;(verifyWebhookSignature as any).mockReturnValue(false)
    const body = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_1' } } } })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'invalid-signature' },
      body,
    })
    req.text = () => Promise.resolve(body)
    const result = await POST(req as any)
    expect(result.status).toBe(400)
    const json = await result.json()
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })

  it('returns 200 with received true for valid webhook without payment entity', async () => {
    const body = JSON.stringify({ event: 'order.paid' })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'valid' },
      body,
    })
    req.text = () => Promise.resolve(body)
    const result = await POST(req as any)
    expect(result.status).toBe(200)
    const json = await result.json()
    expect(json.data.received).toBe(true)
  })

  it('updates order to paid on payment.captured event', async () => {
    const paymentOrder = { id: 'pay_1', order_id: 'order_abc', method: 'upi' }
    const body = JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: paymentOrder } },
    })
    ;(Order.findOneAndUpdate as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'ord-1', itemType: 'note', note: 'note-1', amount: 50000 }),
    })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'valid' },
      body,
    })
    req.text = () => Promise.resolve(body)
    const result = await POST(req as any)
    expect(result.status).toBe(200)
    expect(Order.findOneAndUpdate).toHaveBeenCalledWith(
      { razorpayOrderId: 'order_abc', paymentStatus: { $ne: 'paid' } },
      expect.objectContaining({ paymentStatus: 'paid' }),
      expect.anything(),
    )
  })

  it('updates note purchase count on payment.captured', async () => {
    const paymentOrder = { id: 'pay_1', order_id: 'order_abc', method: 'upi' }
    const body = JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: paymentOrder } },
    })
    ;(Order.findOneAndUpdate as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'ord-1', itemType: 'note', note: 'note-1', amount: 50000 }),
    })
    ;(Note.findByIdAndUpdate as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({}) })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'valid' },
      body,
    })
    req.text = () => Promise.resolve(body)
    await POST(req as any)
    expect(Note.findByIdAndUpdate).toHaveBeenCalledWith('note-1', expect.objectContaining({ $inc: expect.anything() }))
  })

  it('updates group purchase count on payment.captured', async () => {
    const paymentOrder = { id: 'pay_1', order_id: 'order_abc', method: 'card' }
    const body = JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: paymentOrder } },
    })
    ;(Order.findOneAndUpdate as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'ord-1', itemType: 'group', group: 'group-1', amount: 100000 }),
    })
    ;(Group.findByIdAndUpdate as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({}) })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'valid' },
      body,
    })
    req.text = () => Promise.resolve(body)
    await POST(req as any)
    expect(Group.findByIdAndUpdate).toHaveBeenCalledWith('group-1', expect.objectContaining({ $inc: expect.anything() }))
  })

  it('updates note purchase count on successful payment', async () => {
    const paymentOrder = { id: 'pay_1', order_id: 'order_abc', amount: 50000 }
    const body = JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: paymentOrder } },
    })
    ;(Order.findOneAndUpdate as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'ord-1', itemType: 'note', note: 'note-1', amount: 50000 }),
    })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'valid' },
      body,
    })
    req.text = () => Promise.resolve(body)
    await POST(req as any)
    expect(Note.findByIdAndUpdate).toHaveBeenCalledWith('note-1', {
      $inc: { purchaseCount: 1, revenuePaise: 50000 },
    })
  })

  it('marks order as failed on payment.failed event', async () => {
    const paymentOrder = { id: 'pay_1', order_id: 'order_abc', error_description: 'Card declined' }
    const body = JSON.stringify({
      event: 'payment.failed',
      payload: { payment: { entity: paymentOrder } },
    })
    ;(Order.findOneAndUpdate as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({}) })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'valid' },
      body,
    })
    req.text = () => Promise.resolve(body)
    const result = await POST(req as any)
    expect(result.status).toBe(200)
    expect(Order.findOneAndUpdate).toHaveBeenCalledWith(
      { razorpayOrderId: 'order_abc', paymentStatus: 'created' },
      expect.objectContaining({ paymentStatus: 'failed' }),
    )
  })

  it('handles payment.canceled event same as payment.failed', async () => {
    const paymentOrder = { id: 'pay_1', order_id: 'order_abc', error_description: 'User canceled' }
    const body = JSON.stringify({
      event: 'payment.canceled',
      payload: { payment: { entity: paymentOrder } },
    })
    ;(Order.findOneAndUpdate as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({}) })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'valid' },
      body,
    })
    req.text = () => Promise.resolve(body)
    const result = await POST(req as any)
    expect(result.status).toBe(200)
  })

  it('handles order.paid event same as payment.captured', async () => {
    const paymentOrder = { id: 'pay_1', order_id: 'order_abc' }
    const body = JSON.stringify({
      event: 'order.paid',
      payload: { payment: { entity: paymentOrder } },
    })
    ;(Order.findOneAndUpdate as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'ord-1', itemType: 'note', note: 'note-1', amount: 50000 }),
    })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'valid' },
      body,
    })
    req.text = () => Promise.resolve(body)
    const result = await POST(req as any)
    expect(result.status).toBe(200)
  })

  it('returns 200 even when Order.findOneAndUpdate resolves to null', async () => {
    const paymentOrder = { id: 'pay_1', order_id: 'order_abc' }
    const body = JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: paymentOrder } },
    })
    ;(Order.findOneAndUpdate as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'valid' },
      body,
    })
    req.text = () => Promise.resolve(body)
    const result = await POST(req as any)
    expect(result.status).toBe(200)
    const json = await result.json()
    expect(json.data.received).toBe(true)
  })

  it('returns 200 when webhook handler throws an error', async () => {
    ;(verifyWebhookSignature as any).mockReturnValue(true)
    ;(Order.findOneAndUpdate as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockRejectedValue(new Error('db error')),
    })
    const body = JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: { id: 'pay_1', order_id: 'order_abc' } } },
    })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'valid' },
      body,
    })
    req.text = () => Promise.resolve(body)
    const result = await POST(req as any)
    expect(result.status).toBe(200)
    const json = await result.json()
    expect(json.data.received).toBe(true)
  })

  it('sets paymentMethod from payment entity', async () => {
    const paymentOrder = { id: 'pay_1', order_id: 'order_abc', method: 'netbanking' }
    const body = JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: paymentOrder } },
    })
    ;(Order.findOneAndUpdate as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'ord-1', itemType: 'note', note: 'note-1', amount: 50000 }),
    })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'valid' },
      body,
    })
    req.text = () => Promise.resolve(body)
    await POST(req as any)
    expect(Order.findOneAndUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ paymentMethod: 'netbanking' }),
      expect.anything(),
    )
  })

  it('defaults paymentMethod to online when not provided', async () => {
    const paymentOrder = { id: 'pay_1', order_id: 'order_abc' }
    const body = JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: paymentOrder } },
    })
    ;(Order.findOneAndUpdate as any).mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({ _id: 'ord-1', itemType: 'note', note: 'note-1', amount: 50000 }),
    })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'valid' },
      body,
    })
    req.text = () => Promise.resolve(body)
    await POST(req as any)
    expect(Order.findOneAndUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ paymentMethod: 'online' }),
      expect.anything(),
    )
  })

  it('handles order.canceled event', async () => {
    const paymentOrder = { id: 'pay_1', order_id: 'order_abc' }
    const body = JSON.stringify({
      event: 'order.canceled',
      payload: { payment: { entity: paymentOrder } },
    })
    ;(Order.findOneAndUpdate as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({}) })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'valid' },
      body,
    })
    req.text = () => Promise.resolve(body)
    const result = await POST(req as any)
    expect(result.status).toBe(200)
  })

  it('does not update order when payment entity is missing', async () => {
    const body = JSON.stringify({ event: 'payment.captured' })
    const req = new NextRequest('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'valid' },
      body,
    })
    req.text = () => Promise.resolve(body)
    const result = await POST(req as any)
    expect(result.status).toBe(200)
    expect(Order.findOneAndUpdate).not.toHaveBeenCalled()
  })
})
