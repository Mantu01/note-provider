# Security Guide

## Authentication & Authorization

### Admin Authentication Flow

The application uses JWT-based session authentication for admin users.

```
┌─────────┐     POST /login      ┌──────────┐     Set-Cookie      ┌─────────┐
│ Browser │ ───────────────────→ │  Server  │ ─────────────────→  │ Cookie  │
│         │                      │          │                     │ jar     │
│         │ ←─────────────────── │          │ ←────────────────── │         │
│  401    │    { token }         │          │   httpOnly cookie   │         │
└─────────┘                      └──────────┘                     └─────────┘
```

1. User submits credentials via `/api/admin/auth/login`
2. Server verifies email/password, signs JWT with HS256
3. Server sets `np_admin_session` cookie: `httpOnly`, `secure` (production only), `sameSite: lax`, `maxAge: 604800s` (7 days)
4. Subsequent requests include the cookie automatically
5. Middleware (`src/proxy.ts`) verifies the JWT and populates `req.admin`
6. Logout clears the cookie via `/api/admin/auth/logout`

### Authorization Levels

| Level | Check | Permissions |
|-------|-------|-------------|
| **Public** | None | Browse notes, groups, categories; create orders |
| **Authenticated Admin** | Valid JWT + active account | View dashboard, CRUD notes/groups/categories, manage orders |
| **Head Admin** | Valid JWT + `isHead: true` | Delete notes/groups, delete orders, delete uploads, deactivate other admins |

Authorization is enforced in three layers:

1. **Middleware** (`src/proxy.ts`) — blocks unauthenticated requests to `/admin/*` and `/api/admin/*`
2. **Route handler** (`src/server/lib/api-handler.ts`) — `requireAdmin()` checks cookie and token on every admin API call
3. **Service layer** — `requireHeadAdmin()` for destructive operations (delete endpoints)

### Password Security

- Hashing: bcrypt with cost factor 12
- Never stored in plaintext
- Never returned in API responses (`select: false` on `passwordHash` field)
- Comparison: `bcryptjs.compare()` — timing-safe

### Registration Security

New admin registration requires a secret header to prevent unauthorized account creation:
```
x-admin-register-secret: <value from ADMIN_REGISTER_SECRET env var>
```
The register endpoint compares this header against the environment variable. No admin can register without knowing this secret.

---

## Payment Security

### Razorpay Integration

All payment processing is handled by Razorpay. The application never touches raw card details.

**Order Creation Flow:**
1. Client sends buyer info to `POST /api/orders`
2. Server creates a Razorpay order with amount in paise
3. Server returns the Razorpay order ID and key to the client
4. Client opens Razorpay checkout modal with the key
5. Customer completes payment through Razorpay's secure UI
6. Razorpay calls the webhook endpoint with the payment result

**Webhook Verification:**
```typescript
const isValid = verifyWebhookSignature(body, signature, process.env.RAZORPAY_WEBHOOK_SECRET!);
```
Uses HMAC-SHA256 with timing-safe comparison. Invalid signatures are rejected with 400.

**Payment Signature Verification:**
After checkout completes, the client sends the Razorpay payment ID and signature back. The server verifies:
```typescript
verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
```

---

## File Security

### Cloudinary Signed URLs

Full PDF downloads use time-limited signed URLs to prevent direct sharing:

```typescript
cloudinary.url(publicId, {
  secure: true,
  expiration: 60,           // 60-second TTL
  signed: true,
  resource_type: 'raw',
});
```

The signed URL expires after 60 seconds. The API route re-generates a fresh URL on each download request.

### Upload Validation

All uploads are validated before reaching Cloudinary:

| Check | Detail |
|-------|--------|
| Size limit | `note_full`: 50 MB, `note_preview`: 20 MB, `cover`: 5 MB |
| Type check | Notes must be PDF (magic bytes `%PDF-` or `.pdf` extension); covers must be PNG/JPEG/WebP |
| Folder isolation | Each upload kind goes to a dedicated Cloudinary folder |
| Authentication | Upload endpoint requires admin session; delete requires head admin |

### Download Rate Limiting

Free note downloads are rate-limited per IP: 30 requests per 10 minutes. This prevents abuse of free content distribution.

---

## Rate Limiting

All sensitive endpoints are protected by an in-memory token bucket rate limiter:

| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| Admin login | 5 | 10 minutes | Prevent brute force |
| Admin register | 3 | 1 hour | Prevent spam accounts |
| Order creation | 10 | 10 minutes | Prevent payment abuse |
| Note download | 30 | 10 minutes | Prevent bandwidth abuse |
| Order lookup | 20 | 1 minute | Prevent enumeration |

The rate limit store uses `globalThis.__rateLimitStore` with automatic pruning when entries exceed 5000.

---

## Input Validation

Every API endpoint validates its input using Zod schemas before processing:

```typescript
const parsed = schema.safeParse(body);
if (!parsed.success) {
  const fields: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path.join('.') || 'form';
    if (!fields[key]) fields[key] = issue.message;
  }
  return fail(AppError.validation(fields, 'Validation failed'));
}
```

Validation covers:
- Field presence and types
- String length constraints
- Email format
- Password strength (letter + digit, 8-128 chars)
- Price ranges (must be ≥ Rs. 1 for paid items)
- MongoDB ObjectId format (24 hex characters)
- Social handle format (regex per platform)
- Consent checkbox must be true

---

## Security Headers & Configuration

### Configured Protections

| Measure | Implementation |
|---------|---------------|
| `X-Powered-By` | Removed via `poweredByHeader: false` in next.config.ts |
| HTTP-only cookies | JWT session cookies are `httpOnly: true` |
| Secure cookies (prod) | `secure: process.env.NODE_ENV === 'production'` |
| SameSite policy | `sameSite: 'lax'` on session cookies |
| Referrer policy | `<meta name="referrer" content="strict-origin-when-cross-origin">` |
| Robots.txt | Blocks AI crawlers (CCBot, GPTBot, Claude, etc.) and sensitive paths |
| Content-Type | All API responses set `Content-Type: application/json` |
| MongoDB injection | Parameterized queries via Mongoose (no raw query strings) |
| XSS prevention | React auto-escapes interpolated values; no `dangerouslySetInnerHTML` except JSON-LD (server-generated, trusted data) |

### Known Gaps

| Gap | Risk | Mitigation |
|-----|------|------------|
| No CSP header | Potential XSS surface | Rely on React escaping + input sanitization |
| No CSRF tokens | CSRF on state-changing operations | `sameSite: lax` cookies reduce risk; admin routes require JWT |
| No HSTS | SSL stripping possible | Deploy behind HTTPS-only reverse proxy |
| No X-Frame-Options | Clickjacking possible | Admin pages use full-screen layout; consider adding in production |

---

## Data Privacy

### Buyer Data Handling

Personal data collected during checkout:
- Full name (stored, shown to admin)
- Social platform handle (stored, shown to admin for delivery)
- IP address and user agent (stored for fraud prevention)
- Consent acceptance (recorded as boolean)

Data is retained in the Order collection and is accessible only to authenticated admins. The public order lookup endpoint (`/api/orders/lookup`) returns only the order ID and number — no personal data is exposed.

### Admin Data Handling

- Password hashes are stored with bcrypt (cost 12)
- Session tokens expire after 7 days
- Activity logs record IP addresses and user agents for all admin actions
- Admin deactivation revokes session access immediately

### Email Notifications

Purchase notification emails are sent to all active admins. The email contains:
- Order number
- Item name and price
- Buyer's chosen social handle
- Admin dashboard link

No customer payment details (Razorpay ID, signature) are included in email notifications.

---

## Security Checklist for Deployment

Before deploying to production, ensure:

- [ ] `JWT_SECRET` is a strong, unique random string (32+ characters)
- [ ] `ADMIN_REGISTER_SECRET` is set and kept confidential
- [ ] `NODE_ENV` is set to `production`
- [ ] HTTPS is enforced (SSL certificate installed)
- [ ] MongoDB connection uses a dedicated database user (not root)
- [ ] Razorpay webhook secret is configured and verified
- [ ] `.env` file is excluded from version control (in `.gitignore`)
- [ ] Environment-specific secrets are used (dev ≠ prod)
- [ ] Regular security audits of dependencies: `pnpm audit`
- [ ] Admin activity log is monitored periodically
