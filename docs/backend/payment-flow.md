# Payment Flow Documentation

## Overview

Payments are processed through **Razorpay**, India's leading payment gateway. The integration follows a server-side order creation pattern with webhook-based payment confirmation.

## Flow Diagram

```
┌──────────┐     1. Fill form      ┌─────────────┐     2. Create      ┌─────────────┐
│  Buyer   │ ───────────────────→  │  Your App   │ ───────────────→   │  Razorpay   │
│          │                       │             │                     │   API       │
└──────────┘                       └──────┬──────┘                     └──────┬──────┘
                                          │                                    │
                                          │ 3. Return order ID                 │ 4. Create order
                                          │    + client key                  │    (amount in paise)
                                          │                                    │
                                          ▼                                    ▼
                                    ┌─────────────┐                     ┌─────────────┐
                                    │  React      │ ←── 5. Open ────── │  Razorpay   │
                                    │  Checkout   │                     │  Checkout   │
                                    │  Modal      │ ←── 6. Pay ─────── │  (UI)       │
                                    └──────┬──────┘                     └──────┬──────┘
                                           │                                   │
                                           │ 7. Callback                     │ 8. Webhook
                                           │                                   │
                                           ▼                                   ▼
                                    ┌─────────────┐                     ┌─────────────┐
                                    │  Your App   │ ── 9. Verify ────→  │  Your App   │
                                    │  (client)   │    signature        │  (webhook)  │
                                    └─────────────┘                     └──────┬──────┘
                                                                              │
                                                                              │ 10. Update order
                                                                              │    → paid
                                                                              │    → notify admins
                                                                              ▼
                                                                        ┌─────────────┐
                                                                        │  Email to   │
                                                                        │  Admins     │
                                                                        └─────────────┘
```

## Step-by-Step Breakdown

### 1. Order Creation (`POST /api/orders`)

When the buyer submits the checkout form, the server:

1. Validates input against `checkoutSchema` (Zod)
2. Normalizes the social handle:
   - Instagram: ensures `@` prefix
   - WhatsApp: adds `+91` prefix if missing
   - Email: lowercases
3. Fetches the note or group by slug to validate it exists and is public
4. Converts price from rupees to paise (`rupeesToPaise()`)
5. Generates a unique order number via `generateOrderNumber()`
6. Creates a Razorpay order via `createRazorpayOrder()`
7. Stores an `Order` document with status `"created"`

```typescript
// src/app/api/orders/route.ts
export async function POST(req: NextRequest) {
  enforceRateLimit('createOrder', ip, { limit: 10, windowMs: 600000 });

  const parsed = checkoutSchema.safeParse(await req.json());
  if (!parsed.success) return fail(AppError.validation(...));

  const { fullName, socialPlatform, socialHandle, consentAccepted } = parsed.data;
  const item = await getItemBySlug(slug);  // note or group

  const orderNumber = await generateOrderNumber();
  const razorpayOrder = await createRazorpayOrder(
    item.price,                        // amount in paise
    orderNumber,                       // receipt
    { buyer: fullName, platform: socialPlatform }  // notes
  );

  const order = await Order.create({
    orderNumber,
    itemType: item.type,
    [item.type]: item.id,
    amount: item.price,
    buyer: { fullName, socialPlatform, socialHandle, consentAccepted, ipAddress, userAgent },
    razorpayOrderId: razorpayOrder.id,
    paymentStatus: 'created',
    fulfillmentStatus: 'pending',
  });

  return ok({ orderId: order._id.toString(), ...razorpayOrder });
}
```

### 2. Client-Side Checkout

The client receives the Razorpay order details and opens the checkout modal:

```typescript
// src/features/checkout/components/checkout-page.tsx
const { data } = useCreateOrder({ slug, buyerInfo });

const openCheckout = async () => {
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: data.amount,
    currency: data.currency,
    name: 'Notes Provider',
    description: data.itemTitle,
    order_id: data.razorpayOrderId,
    handler: function (response: any) {
      // Payment succeeded — verify on our server
      await verifyPayment(data.orderId, response);
    },
    prefill: { name: data.buyer.fullName },
    theme: { color: '#6366f1' },
  };
  const rzp = new window.Razorpay(options);
  rzp.open();
};
```

### 3. Payment Verification

After the buyer completes payment, the client sends the Razorpay response back for verification:

```typescript
// src/app/api/orders/[orderId]/verify/route.ts
export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

  const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!isValid) return fail(AppError.payment('Invalid payment signature'));

  const order = await Order.findByIdAndUpdate(orderId, {
    paymentStatus: 'paid',
    razorpayPaymentId: razorpay_payment_id,
    paidAt: new Date(),
  }, { new: true });

  return ok({ success: true });
}
```

### 4. Webhook Handler (Alternative Path)

Razorpay also sends a webhook to confirm payment. The webhook handler:

```typescript
// src/app/api/webhooks/razorpay/route.ts
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-razorpay-signature') || '';

  const isValid = verifyWebhookSignature(body, signature, process.env.RAZORPAY_WEBHOOK_SECRET!);
  if (!isValid) return new Response('Invalid signature', { status: 400 });

  const event = JSON.parse(body);

  if (event.event === 'payment.captured' || event.event === 'order.paid') {
    const payment = event.payload.payment.entity;
    const order = await Order.findOne({ razorpayOrderId: payment.order_id });

    if (order) {
      await Order.findByIdAndUpdate(order._id, {
        paymentStatus: 'paid',
        razorpayPaymentId: payment.id,
        paymentMethod: payment.method,
        paidAt: new Date(payment.updated_at * 1000),
      });

      // Increment purchase count and revenue on the item
      await incrementPurchaseCount(order.note?.toString() || order.group?.toString(), order.itemType);

      // Notify admins via email
      await notifyAdminsOnPurchase(order);
    }
  }

  if (event.event === 'payment.failed' || event.event === 'payment.canceled' || event.event === 'order.canceled') {
    const order = await Order.findOne({ razorpayOrderId: event.payload.order?.entity?.id });
    if (order) {
      await Order.findByIdAndUpdate(order._id, {
        paymentStatus: 'failed',
        failureReason: event.payload.payment?.entity?.error_description,
      });
    }
  }

  return ok({ received: true });
}
```

### 5. Fulfillment Workflow

Once payment is confirmed, the order appears in the admin dashboard with `fulfillmentStatus: "pending"`. The admin:

1. Reviews the order details
2. Selects the delivery method (Instagram/WhatsApp/Email) from the buyer's info
3. Delivers the note PDF through the chosen channel
4. Marks the order as completed in the dashboard

```typescript
// PATCH /api/admin/orders/[id]
const order = await Order.findOneAndUpdate(
  { _id: id },
  {
    fulfillmentStatus: 'completed',
    completedAt: new Date(),
    completedBy: admin.id,
    adminNote: data.adminNote ?? undefined,
  },
  { new: true }
);
```

## Payment States

```
         ┌─────────┐
         │ created │  ← Order created, waiting for payment
         └────┬────┘
              │ payment succeeds
              ▼
         ┌─────────┐
         │  paid   │  ← Payment received, awaiting fulfillment
         └────┬────┘
              │ admin delivers
              ▼
         ┌─────────────┐
         │ completed   │  ← Order fulfilled
         └─────────────┘

         ┌─────────┐
         │ created │
         └────┬────┘
              │ payment fails
              ▼
         ┌─────────┐
         │  failed │  ← Payment failed, no charge
         └─────────┘

         ┌─────────────┐
         │ completed   │
         └──────┬──────┘
                │ admin cancels
                ▼
           ┌───────────┐
           │ cancelled │
           └───────────┘
```

## Amount Handling

All monetary values are stored in **paise** (1/100th of a rupee) as integers to avoid floating-point precision issues.

```typescript
// Conversion utilities in src/lib/format.ts
function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

function paiseToRupees(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

// Example: Rs. 199 → 19900 paise for Razorpay
const amountInPaise = rupeesToPaise(199);  // 19900
```

## Razorpay Test Mode

For development and testing, use Razorpay's test mode:

**Test Cards:**
| Card Type | Number | CVV | OTP |
|-----------|--------|-----|-----|
| Success | 4111 1111 1111 1111 | Any 3 digits | Any 6 digits |
| Failed | 4111 1111 1111 1112 | Any 3 digits | Any 6 digits |
| Wallet | 4566 4566 4566 4566 | Any 3 digits | Any 6 digits |

**Test Mode Keys:**
- Key ID: `rzp_test_...` (starts with `rzp_test_`)
- These keys work only in test mode

## Common Issues

### Issue: Payment not reflected in dashboard
**Cause:** Webhook not configured or signature mismatch
**Fix:** Verify `RAZORPAY_WEBHOOK_SECRET` matches the secret configured in Razorpay dashboard

### Issue: Order stuck in "created" state
**Cause:** Client-side verification failed or webhook not triggered
**Fix:** Check the verify endpoint was called; inspect webhook logs in Razorpay dashboard

### Issue: Amount is 100x too small/large
**Cause:** Paise conversion error
**Fix:** Ensure amount is passed in paise (multiply rupees by 100) when calling Razorpay API

### Issue: Duplicate order numbers
**Cause:** Counter race condition
**Fix:** Counter model uses MongoDB atomic `$inc` — this should not happen. Check if the counter collection is accessible.
