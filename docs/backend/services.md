# Backend Services

## Server Architecture

The server layer lives in `src/server/` and contains all code that runs exclusively on the server. It is organized into four directories:

```
src/server/
├── db/
│   └── models/          # Mongoose model definitions
├── services/            # Business logic functions
├── mappers/             # Data transformation (DB doc → API response)
└── lib/                 # Cross-cutting utilities
```

---

## Services (`src/server/services/`)

### Note Service (`note.service.ts`)

Handles all note-related business logic.

**Functions:**
| Function | Description |
|----------|-------------|
| `createNote(data, admin)` | Creates a new note document with validation |
| `updateNote(id, data, admin)` | Updates an existing note, cleans up old Cloudinary assets |
| `deleteNote(id, admin)` | Deletes a note and removes associated Cloudinary files; returns affected group IDs |
| `getNoteById(id)` | Finds a single note by ID |
| `getNoteBySlug(slug)` | Finds a single public note by slug |
| `listNotes(filters, pagination)` | Lists notes with filtering, sorting, and pagination |
| `searchNotes(query)` | Full-text search using MongoDB text index |
| `getFeaturedNotes(limit)` | Returns featured notes sorted by creation date |
| `getLatestNotes(limit)` | Returns newest notes |
| `getFreeNotes(limit)` | Returns all free notes |
| `incrementDownloadCount(slug)` | Increments download count for free notes |
| `incrementPurchaseCount(id, itemType)` | Increments purchase count and revenue on a note or group |
| `getRelatedNotes(slug, limit)` | Finds notes sharing the same category |
| `getNotesWithGroups(slug)` | Finds notes that belong to any group |

### Group Service (`group.service.ts`)

Handles group bundle business logic.

**Functions:**
| Function |
|----------|
| `createGroup(data, admin)` |
| `updateGroup(id, data, admin)` |
| `deleteGroup(id, admin)` — requires head admin or creator |
| `getGroupById(id)` |
| `getGroupBySlug(slug)` |
| `listGroups(filters, pagination)` |
| `getFeaturedGroups(limit)` |
| `getRelatedGroups(slug, limit)` |

### Category Service (`category.service.ts`)

Handles category CRUD operations.

**Functions:**
| Function |
|----------|
| `createCategory(data, admin)` — auto-generates unique slug |
| `updateCategory(id, data, admin)` |
| `deleteCategory(id, admin)` — requires head admin and no referencing notes/groups |
| `listCategories()` |
| `getCategoryById(id)` |
| `getCategoryBySlug(slug)` |

### Order Service (`order.service.ts`)

Handles order creation and payment flow.

**Functions:**
| Function |
|----------|
| `createOrder(itemType, itemId, buyerInfo, ip, userAgent)` — creates Razorpay order + Order document |
| `getOrderById(orderId)` |
| `getOrderNumber()` — generates unique order number via Counter model |
| `verifyPayment(orderId, paymentId, signature)` — verifies Razorpay signature |
| `listOrders(filters, pagination)` — admin order listing |

### Upload Service (`upload.service.ts`)

Handles Cloudinary file uploads and deletions.

**Functions:**
| Function |
|----------|
| `uploadFile(fileBuffer, kind, folder)` — validates type/size, uploads to Cloudinary |
| `deleteUpload(publicId)` — destroys file from Cloudinary (head admin only) |
| `getSignedUrl(publicId, kind)` — generates time-limited signed URL |

### Dashboard Service (`dashboard.service.ts`)

Aggregates data for the admin dashboard.

**Functions:**
| Function |
|----------|
| `getDashboardStats()` — revenue totals, order counts, catalog stats |
| `getRevenueSeries(days)` — daily revenue for chart |
| `getTopNotes(limit)` — most purchased notes |
| `getCategoryBreakdown()` — revenue per category |
| `getRecentOrders(limit)` |
| `getRecentActivities(limit)` |

### Activity Service (`activity.service.ts`)

Logs admin actions to the AdminActivity collection.

**Functions:**
| Function |
|----------|
| `logActivity(action, admin, targetType, targetId, targetLabel, description, metadata?, ip?, userAgent?)` — fire-and-forget |

### Lead Service (`lead.service.ts`)

Manages lead extraction and CSV export.

**Functions:**
| Function |
|----------|
| `listLeads(filters, pagination)` |
| `exportLeads(filters)` — generates CSV (max 10,000 rows) |

### Admin Service (`admin.service.ts`)

Admin authentication and management.

**Functions:**
| Function |
|----------|
| `registerAdmin(data)` — creates admin with bcrypt-hashed password |
| `loginAdmin(email, password)` — verifies credentials, returns token payload |
| `getAdminByEmail(email)` |
| `getAdminById(id)` |
| `getAllAdmins()` |
| `updateAdmin(id, data)` |
| `deactivateAdmin(id, admin)` — requires head admin |

---

## Mappers (`src/server/mappers/`)

Convert Mongoose documents to typed API responses. Each mapper handles both individual items and arrays.

| Mapper File | Functions | Purpose |
|------------|-----------|---------|
| `note.mapper.ts` | `toPublicNote()`, `toAdminNote()` | Note → Public/Admin response shape |
| `group.mapper.ts` | `toPublicGroup()`, `toAdminGroup()` | Group → Public/Admin response shape |
| `category.mapper.ts` | `toPublicCategory()`, `toAdminCategory()` | Category → Public/Admin response shape |
| `order.mapper.ts` | `toPublicOrder()`, `toAdminOrder()`, `toAdminLead()` | Order → Public/Admin/Lead response shape |
| `activity.mapper.ts` | `toAdminActivity()`, `toAdminProfile()` | Activity/Admin → Admin response shape |

### Mapping Patterns

All mappers follow this pattern:
1. Accept a Mongoose document (with `_id` as ObjectId)
2. Convert `_id` to string
3. Format derived fields (prices, dates, labels)
4. Return a plain object matching the TypeScript type

Example — `toPublicNote()`:
```typescript
export function toPublicNote(note: NoteDoc): PublicNote {
  return {
    id: note._id.toString(),
    slug: note.slug,
    title: note.title,
    description: note.description,
    level: note.level,
    category: { id: note.category.toString(), name: note.categoryName, slug: note.categorySlug, icon: note.categoryIcon ?? null },
    pricingType: note.pricingType,
    price: note.price,
    priceLabel: formatPrice(note.price),
    compareAtPrice: note.compareAtPrice,
    coverImageUrl: note.coverImageUrl ?? null,
    pageCount: note.pageCount,
    fileSizeLabel: formatFileSize(note.fullFileBytes),
    isLocked: note.pricingType === 'paid',
    hasPreview: !!note.previewFileUrl,
    tags: note.tags,
    isFeatured: note.isFeatured,
    downloadCount: note.downloadCount,
    purchaseCount: note.purchaseCount,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}
```

---

## Server Utilities (`src/server/lib/`)

### API Handler (`api-handler.ts`)

Centralized request wrapper used by all API routes.

```typescript
// Basic handler (public routes)
export async function handler(fn: HandlerFunction) {
  await connectDb();
  return fn({ req, res, query, params });
}

// Authenticated handler (admin routes)
export async function adminHandler(fn: AdminHandlerFunction) {
  await connectDb();
  const admin = await requireAdmin(req);
  return fn({ req, res, query, params, admin });
}

// Head admin handler (destructive operations)
export async function headAdminHandler(fn: HeadAdminHandlerFunction) {
  await connectDb();
  const admin = await requireHeadAdmin(req);
  return fn({ req, res, query, params, admin });
}
```

### Auth Guard (`auth-guard.ts`)

Cookie and session management utilities.

```typescript
export async function requireAdmin(req: NextRequest): Promise<AdminDoc>
export async function requireHeadAdmin(req: NextRequest): Promise<AdminDoc>
export async function getOptionalAdmin(req: NextRequest): Promise<AdminDoc | null>
export function setSessionCookie(res: NextResponse, token: string): void
export function clearSessionCookie(res: NextResponse): void
```

### JWT (`jwt.ts`)

Token signing and verification.

```typescript
export async function signAdminToken(payload: AdminTokenPayload): Promise<string>
export async function verifyAdminToken(token: string): Promise<AdminTokenPayload>
```

### Password (`password.ts`)

Password hashing with bcrypt.

```typescript
export async function hashPassword(password: string): Promise<string>
export async function comparePassword(password: string, hash: string): Promise<boolean>
```

### Rate Limiter (`rate-limit.ts`)

In-memory token bucket rate limiter.

```typescript
export async function enforceRateLimit(
  routeKey: string,
  ip: string,
  options: { limit: number; windowMs: number }
): Promise<void>
```

Rate limit store is stored in `globalThis.__rateLimitStore` and auto-pruned when exceeding 5000 entries.

### Razorpay (`razorpay.ts`)

Payment gateway integration.

```typescript
export function getRazorpayKeyId(): string
export async function createRazorpayOrder(amount: number, receipt: string, notes: Record<string, string>): Promise<RazorpayOrder>
export function verifyWebhookSignature(body: string, signature: string, secret: string): boolean
export function verifyPaymentSignature(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): boolean
```

### Cloudinary (`cloudinary.ts`)

Cloudinary SDK initialization and configuration.

```typescript
export const cloudinary: CloudinaryInstance
export function getCloudinaryConfig(): CloudinaryConfig | null
```

Includes graceful fallback to demo URLs when Cloudinary credentials are not configured (useful for development).

### Mailer (`mailer.ts`)

Email sending utility using Nodemailer.

```typescript
export async function sendEmail(to: string, subject: string, html: string): Promise<void>
export async function notifyAdminsOnPurchase(order: OrderDoc): Promise<void>
export function getMailerConfig(): NodeMailerConfig
```

Templates are defined in `templates.ts` using template literals with dark-themed HTML.

### Slug Generator (`slug.ts`)

URL-safe slug creation with uniqueness guarantee.

```typescript
export function slugify(text: string): string
export async function uniqueSlug(model: Model<any>, baseSlug: string): Promise<string>
```

`uniqueSlug` appends `-2`, `-3`, etc. until an unused slug is found.

### Query Parser (`query.ts`)

Pagination and sorting helper for Mongoose queries.

```typescript
export function applyPagination(query: any, page: number, limit: number): { skip: number; limit: number }
export function applySorting(query: any, sort: string, defaultSort: string): any
export function parseDateRange(from?: string, to?: string): { createdAt: { $gte?: Date; $lte?: Date } }
```

### CSV (`csv.ts`)

CSV export utility for lead data.

```typescript
export function toCsv(rows: Record<string, string>[]): string
```

### Error Classes (`errors.ts`)

Centralized error hierarchy.

```typescript
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly fields?: Record<string, string>;
}

// Factory methods:
AppError.validation(fields?, message?)   // 400
AppError.unauthorized(message?)          // 401
AppError.forbidden(message?)             // 403
AppError.notFound(entity?)               // 404
AppError.conflict(message)               // 409
AppError.payment(message?)               // 402
AppError.rateLimited(message?)           // 429
AppError.payloadTooLarge(message)        // 413
AppError.unsupportedMediaType(message)   // 415
AppError.internal(message?)              // 500
```

### API Response (`api-response.ts`)

Standardized response builders.

```typescript
export function ok<T>(data: T, status = 200): NextResponse
export function okPaginated<T>(items: T[], pagination: Pagination, status = 200): NextResponse
export function fail(error: AppError): NextResponse
```

Auto-clears session cookie on 401 responses.

---

## Database Connection (`src/server/db/connect.ts`)

Singleton connection pattern to avoid reconnecting on every request:

```typescript
let cached: Mongoose | null = null;

export async function connectDb(): Promise<void> {
  if (cached?.connection?.state === 1) return;
  cached = await mongoose.connect(process.env.MONGODB_URI!, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
}
```
