# API Reference

Base URL: `http://localhost:3000` (development) or `https://yourdomain.com` (production)

All API responses follow this envelope format:
```json
{ "success": true, "data": { ... } }
// or
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": { "email": "..." } } }
```

Paginated responses include a `pagination` object:
```json
{ "success": true, "data": { "items": [...], "pagination": { "page": 1, "limit": 12, "total": 48, "totalPages": 4, "hasNext": true, "hasPrev": false } } }
```

---

## Public APIs

### Get Homepage Data
```
GET /api/home
```
Returns featured notes, latest notes, free notes, groups, categories, and site statistics. ISR revalidates every 60 seconds.

**Response:** `HomeResponse` object containing arrays of notes, groups, categories, and stats.

### Get Filters
```
GET /api/filters?category=electronics&level=basics
```
Returns filter facets: category counts, level distribution, tag cloud, subject list, and price ranges. ISR revalidates every 300 seconds.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category slug |
| `level` | string | Filter by difficulty level |

**Response:** `FiltersResponse` with `categories`, `levels`, `subjects`, `tags`, `priceRange`, `pricingCounts`.

### List Categories
```
GET /api/categories
```
Returns all active categories with note counts. ISR revalidates every 60 seconds.

### List Notes
```
GET /api/notes?page=1&limit=12&q=lucene-search&category=maths&level=basics&pricing=free&sort=newest&featured=true
```
Paginated notes catalog with full filtering. ISR revalidates every 300 seconds.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | int | 1 | Page number (>= 1) |
| `limit` | int | 12 | Items per page (max 48) |
| `q` | string | - | Full-text search query |
| `category` | string[] | - | Category slugs to filter |
| `level` | string[] | - | Difficulty levels: basics, intermediate, advance |
| `subject` | string | - | Subject slug within category |
| `tags` | string[] | - | Note tags to filter |
| `pricing` | string | - | "free" or "paid" |
| `minPrice` | int | - | Minimum price in rupees |
| `maxPrice` | int | - | Maximum price in rupees |
| `sort` | string | newest | Sort: newest, oldest, price_asc, price_desc, popular, title_asc |
| `featured` | boolean | - | Only show featured notes |

**Response:** Paginated `PublicNote[]`.

### Get Note Detail
```
GET /api/notes/[slug]
```
Returns a single note with related notes and groups containing it. ISR revalidates every 600 seconds.

**Response:** `{ note: PublicNote, relatedNotes: PublicNote[], groups: PublicGroup[] }`

### Preview Note PDF
```
GET /api/notes/[slug]/preview
```
Returns the preview PDF inline (Cache-Control: public, max-age=3600). Bypasses auth middleware.

### Download Free Note
```
GET /api/notes/[slug]/download
```
Returns the full PDF for free notes via signed Cloudinary URL (rate-limited: 30 requests per 10 minutes). Increments `downloadCount`.

---

### List Groups
```
GET /api/groups?page=1&limit=12&q=search-term&category=maths&featured=true
```
Paginated groups catalog. ISR revalidates every 300 seconds.

**Query Parameters:** Same as notes listing (`page`, `limit`, `q`, `category`, `featured`).

**Response:** Paginated `PublicGroup[]`.

### Get Group Detail
```
GET /api/groups/[slug]
```
Returns a single group with included notes and related groups. ISR revalidates every 600 seconds.

**Response:** `{ group: PublicGroup, relatedGroups: PublicGroup[] }`

---

### Create Order (Checkout)
```
POST /api/orders
Content-Type: application/json

Rate limit: 10 requests per 10 minutes per IP
```
**Body:**
```json
{
  "fullName": "John Doe",
  "socialPlatform": "whatsapp",
  "socialHandle": "+919876543210",
  "consentAccepted": true
}
```

**Response:** `{ success: true, data: { orderId, razorpayOrderId, amount, currency, key, options } }`

### Get Order Status
```
GET /api/orders/[orderId]
```
Returns order status and payment info. No-store cache.

**Response:** `PublicOrder` object with masked buyer info.

### Lookup Order
```
GET /api/orders/lookup?orderNumber=NP-20240101-0001
POST /api/orders/lookup
Content-Type: application/json
{ "orderNumber": "NP-20240101-0001" }

Rate limit: 20 requests per 1 minute per IP
```
Returns order ID and order number only (no buyer details exposed).

---

### Razorpay Webhook
```
POST /api/webhooks/razorpay
Content-Type: application/json
```
Processes Razorpay payment events. Verifies HMAC-SHA256 signature using `RAZORPAY_WEBHOOK_SECRET`.

**Event Types Handled:**
| Event | Action |
|-------|--------|
| `payment.captured` | Mark order paid, increment revenue, notify admins |
| `order.paid` | Same as payment.captured |
| `payment.failed` | Mark order failed with reason |
| `payment.canceled` | Mark order failed |
| `order.canceled` | Mark order failed |

---

## Admin APIs (Require Authentication)

All admin endpoints require a valid `np_admin_session` JWT cookie. The middleware (`src/proxy.ts`) enforces this automatically for `/admin` pages and `/api/admin/*` routes.

### Register Admin
```
POST /api/admin/auth/register
Content-Type: application/json
x-admin-register-secret: YOUR_SECRET
```
Creates a new admin account. Requires the secret header. Head admin status is optional.

**Body:**
```json
{
  "name": "New Admin",
  "email": "admin@example.com",
  "password": "SecurePass123",
  "isHead": false
}
```

### Login
```
POST /api/admin/auth/login
Content-Type: application/json
```
Authenticates and sets HTTP-only session cookie (7-day expiry).

**Body:**
```json
{ "email": "admin@example.com", "password": "SecurePass123" }
```

### Logout
```
POST /api/admin/auth/logout
```
Clears the session cookie.

### Get Current Admin
```
GET /api/admin/auth/me
```
Returns the authenticated admin's profile.

---

### Dashboard Stats
```
GET /api/admin/dashboard
```
Returns comprehensive stats: revenue totals, order counts, catalog numbers, leads, revenue time series, top notes, category breakdown, recent orders, and activity feed.

**Response:** `DashboardStats` object.

---

### List Notes (Admin)
```
GET /api/admin/notes?page=1&limit=20
```
Returns paginated admin notes with full file metadata (URLs, sizes, visibility).

### Create Note (Admin)
```
POST /api/admin/notes
Content-Type: application/json
```
Creates a new note with uploaded files.

**Body:**
```json
{
  "title": "Note Title",
  "description": "Detailed description...",
  "categoryId": "ObjectId",
  "level": "basics",
  "visibility": "public",
  "pricingType": "paid",
  "price": 19900,
  "compareAtPrice": 29900,
  "tags": ["maths", "calculus"],
  "isFeatured": false,
  "pageCount": 42,
  "fullFile": { "url": "...", "publicId": "...", "bytes": 1234567 },
  "previewFile": { "url": "...", "publicId": "...", "bytes": 234567 },
  "coverImage": { "url": "...", "publicId": "..." }
}
```

### Update Note (Admin)
```
PATCH /api/admin/notes/[id]
Content-Type: application/json
```
Updates note fields. Old Cloudinary assets are cleaned up when replaced. Partial updates supported.

### Delete Note (Admin)
```
DELETE /api/admin/notes/[id]
```
Deletes note and cleans up all associated Cloudinary files. Returns affected group IDs.

---

### List/Update/Delete Groups and Categories

Same CRUD pattern as notes:
- `GET /api/admin/groups` — list groups
- `POST /api/admin/groups` — create group
- `PATCH /api/admin/groups/[id]` — update group
- `DELETE /api/admin/groups/[id]` — delete group (head admin or creator required)
- `GET /api/admin/categories` — list categories
- `POST /api/admin/categories` — create category
- `PATCH /api/admin/categories/[id]` — update category
- `DELETE /api/admin/categories/[id]` — delete category (head admin + no refs required)

---

### Orders Management
```
GET /api/admin/orders?page=1&limit=20&paymentStatus=paid&fulfillmentStatus=pending&from=2024-01-01&to=2024-12-31&sort=newest
```
Paginated order list with revenue summary.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `paymentStatus` | enum | created, paid, failed |
| `fulfillmentStatus` | enum | pending, completed, cancelled |
| `itemType` | enum | note, group |
| `from` | date | Start date filter |
| `to` | date | End date filter |
| `sort` | enum | newest, oldest, amount_desc, amount_asc |

```
GET /api/admin/orders/[id]
```
Single order detail with full buyer info, payment details, and fulfillment history.

```
PATCH /api/admin/orders/[id]
Content-Type: application/json
```
Update order fulfillment status. Only heads can delete orders.

**Body:**
```json
{
  "fulfillmentStatus": "completed",
  "adminNote": "Delivered via WhatsApp"
}
```

### Leads Management
```
GET /api/admin/leads?page=1&limit=20&socialPlatform=whatsapp&paymentStatus=paid&fulfillmentStatus=pending
```
Lists unfulfilled paid orders (leads).

```
GET /api/admin/leads/export?from=2024-01-01&to=2024-12-31
```
Exports leads as CSV (max 10,000 rows). Includes buyer contact info for delivery.

---

### Activity Log
```
GET /api/admin/activities?page=1&limit=20&adminId=ObjectId&action=note.create&from=2024-01-01&to=2024-12-31
```
Paginated audit log of all admin actions with IP and user-agent.

### Manage Admins
```
GET /api/admin/admins
```
Lists all admin profiles (returns only non-sensitive fields).

---

### File Upload
```
POST /api/admin/uploads
Content-Type: multipart/form-data
```
Uploads a file to Cloudinary. Returns `{ url, publicId, bytes }`.

**Form Fields:**
| Field | Description |
|-------|-------------|
| `file` | The file to upload |
| `kind` | Upload type: `note_full` (50MB PDF), `note_preview` (20MB PDF), `cover` (5MB image) |

```
DELETE /api/admin/uploads
Content-Type: application/json
```
Deletes an uploaded file from Cloudinary. Head admin only. Requires `publicId` in body.

---

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "fields": {
      "email": "Invalid email address"
    }
  }
}
```

| Error Code | HTTP Status | Meaning |
|-----------|-------------|---------|
| `VALIDATION_ERROR` | 400 | Input failed Zod validation |
| `UNAUTHORIZED` | 401 | Missing or invalid session token |
| `FORBIDDEN` | 403 | Insufficient permissions (not head admin) |
| `NOT_FOUND` | 404 | Resource does not exist |
| `CONFLICT` | 409 | Duplicate entry (e.g., email already exists) |
| `PAYMENT_ERROR` | 402 | Payment processing failed |
| `RATE_LIMITED` | 429 | Too many requests |
| `PAYLOAD_TOO_LARGE` | 413 | Uploaded file exceeds size limit |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | Invalid file type (e.g., non-PDF for note upload) |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
