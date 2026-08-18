# Constants & Types Reference

## TypeScript Types (`src/lib/types.ts`)

### Status Enums

```typescript
type NoteVisibility = 'public' | 'private';
type NoteLevel = 'basics' | 'intermediate' | 'advance';
type NotePricingType = 'free' | 'paid';
type PurchaseItemType = 'note' | 'group';
type PaymentStatus = 'created' | 'paid' | 'failed';
type FulfillmentStatus = 'pending' | 'completed' | 'cancelled';
type SocialPlatform = 'instagram' | 'whatsapp' | 'email';
type NoteSort = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular' | 'title_asc';
type OrderSort = 'newest' | 'oldest' | 'amount_desc' | 'amount_asc';
type UploadKind = 'note_full' | 'note_preview' | 'cover';
type ActivityTargetType = 'note' | 'group' | 'category' | 'order' | 'admin';
type ErrorCode = 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'PAYLOAD_TOO_LARGE' | 'UNSUPPORTED_MEDIA_TYPE' | 'RATE_LIMITED' | 'PAYMENT_ERROR' | 'INTERNAL_ERROR';
type StatusType = 'payment' | 'fulfillment' | 'pricing' | 'level';
```

### Admin Activity Actions

```typescript
type AdminActivityAction =
  | 'admin.login'
  | 'admin.logout'
  | 'admin.register'
  | 'note.create'
  | 'note.update'
  | 'note.delete'
  | 'group.create'
  | 'group.update'
  | 'group.delete'
  | 'category.create'
  | 'category.update'
  | 'category.delete'
  | 'order.update_fulfillment'
  | 'order.delete'
  | 'upload.delete';
```

### API Response Types

```typescript
type ApiSuccess<T> = { success: true; data: T };
type ApiFailure = { success: false; error: { code: ErrorCode; message: string; fields?: Record<string, string> } };
type ApiResult<T> = ApiSuccess<T> | ApiFailure;
type PaginatedData<T> = { items: T[]; pagination: Pagination };
type Pagination = { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean };
```

### Public-Facing Types

```typescript
type PublicNote = {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: NoteLevel;
  category: CategoryRef;
  pricingType: NotePricingType;
  price: number;        // in paise
  priceLabel: string;   // formatted (e.g., "₹199")
  compareAtPrice: number | null;
  coverImageUrl: string | null;
  pageCount: number | null;
  fileSizeLabel: string | null;
  isLocked: boolean;    // true if paid
  hasPreview: boolean;  // true if preview PDF exists
  tags: string[];
  isFeatured: boolean;
  downloadCount: number;
  purchaseCount: number;
  createdAt: string;
  updatedAt: string;
};

type PublicGroup = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: CategoryRef;
  price: number;
  priceLabel: string;
  compareAtPrice: number | null;
  coverImageUrl: string | null;
  noteCount: number;
  notes: PublicNote[];
  isFeatured: boolean;
  createdAt: string;
};

type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  subjects: SubjectItem[];
  noteCount: number;
};

type PublicOrder = {
  id: string;
  orderNumber: string;
  itemType: PurchaseItemType;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  buyerFull: string;           // masked: "J*** Doe"
  socialHandle: string;        // masked: "+9198***43210"
  deliveryEta: string;         // e.g., "Within 6 hours"
  itemTitle: string;
  createdAt: string;
  paidAt: string | null;
  completedAt: string | null;
};
```

### Admin Types

```typescript
type AdminNote = PublicNote & {
  visibility: NoteVisibility;
  fullFileUrl: string;
  fullFilePublicId: string;
  fullFileBytes: number;
  previewFileUrl: string | null;
  previewFilePublicId: string | null;
  previewFileBytes: number | null;
  coverImagePublicId: string | null;
  createdBy: AdminRef | null;
  updatedBy: AdminRef | null;
};

type AdminGroup = PublicGroup & {
  visibility: NoteVisibility;
  noteIds: string[];
  coverImagePublicId: string | null;
  revenuePaise: number;
  purchaseCount: number;
  createdBy: AdminRef | null;
  updatedBy: AdminRef | null;
  updatedAt: string;
};

type AdminCategory = PublicCategory & {
  order: number;
  isActive: boolean;
  groupCount: number;
  createdAt: string;
  updatedAt: string;
};

type AdminOrder = PublicOrder & {
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  paymentMethod: string | null;
  failureReason: string | null;
  item: { title: string; slug: string; price: number; noteIds: string[] };
  adminNote: string | null;
  completedBy: AdminRef | null;
  updatedAt: string;
};

type AdminLead = Omit<PublicOrder, 'socialHandle'> & {
  socialHandle: string;      // NOT masked for leads (needed for delivery)
  fullName: string;          // NOT masked for leads
  buyerFull: string;
};

type AdminProfile = {
  id: string;
  name: string;
  email: string;
  isHead: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

type AdminActivity = {
  id: string;
  action: AdminActivityAction;
  targetType: ActivityTargetType | null;
  targetLabel: string | null;
  description: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
  admin: AdminProfile;
};
```

### Dashboard Types

```typescript
type RevenueStats = {
  total: number;       // in paise
  totalLabel: string;  // formatted (e.g., "₹50,000")
  today: number;
  todayLabel: string;
};

type OrderStats = {
  paid: number;
  pendingFulfillment: number;
  failed: number;
};

type CatalogStats = {
  totalNotes: number;
  paidNotes: number;
  freeNotes: number;
};

type LeadStats = {
  total: number;
  today: number;
};

type RevenueSeriesPoint = { label: string; revenue: number };
type TopNote = { title: string; purchaseCount: number; revenuePaise: number };
type CategoryBreakdown = { name: string; revenuePaise: number };
type RecentOrder = Pick<AdminOrder, 'id' | 'orderNumber' | 'itemTitle' | 'amount' | 'paymentStatus' | 'fulfillmentStatus' | 'createdAt'>;
type RecentActivity = Pick<AdminActivity, 'id' | 'action' | 'description' | 'createdAt' | 'admin'>;

type DashboardStats = {
  revenue: RevenueStats;
  orders: OrderStats;
  catalog: CatalogStats;
  leads: LeadStats;
  revenueSeries: RevenueSeriesPoint[];
  topNotes: TopNote[];
  categoryBreakdown: CategoryBreakdown[];
  recentOrders: RecentOrder[];
  recentActivities: RecentActivity[];
};
```

### Query Types

```typescript
type NotesQuery = {
  page?: number;
  limit?: number;
  q?: string;
  category?: string[];
  level?: string[];
  subject?: string;
  tags?: string[];
  pricing?: 'free' | 'paid';
  minPrice?: number;
  maxPrice?: number;
  sort?: NoteSort;
  featured?: boolean;
};

type GroupsQuery = {
  page?: number;
  limit?: number;
  q?: string;
  category?: string[];
  featured?: boolean;
};

type OrdersQuery = {
  page?: number;
  limit?: number;
  q?: string;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  itemType?: PurchaseItemType;
  from?: string;
  to?: string;
  sort?: OrderSort;
};

type LeadsQuery = {
  page?: number;
  limit?: number;
  q?: string;
  socialPlatform?: SocialPlatform;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  from?: string;
  to?: string;
};

type ActivitiesQuery = {
  page?: number;
  limit?: number;
  adminId?: string;
  action?: AdminActivityAction;
  from?: string;
  to?: string;
};
```

### Other Types

```typescript
type CategoryRef = { id: string; name: string; slug: string; icon: string | null };
type SubjectItem = { id: string; name: string; slug: string; order: number; isActive: boolean };
type AdminRef = { id: string; name: string };
type UploadedFile = { url: string; publicId: string; bytes: number };
type UploadResponse = { url: string; publicId: string; bytes: number };
type NoteDeleteResponse = { deleted: true; affectedGroups: { id: string; name: string }[] };
type CheckoutOrderResponse = { orderId: string; razorpayOrderId: string; amount: number; currency: string; key: string; options: Record<string, unknown> };
type FiltersResponse = {
  categories: { id: string; name: string; slug: string; noteCount: number }[];
  levels: { value: string; label: string; count: number }[];
  subjects: { id: string; name: string; slug: string; categoryId: string }[];
  tags: { tag: string; count: number }[];
  priceRange: { min: number; max: number };
  pricingCounts: { free: number; paid: number };
};
type HomeResponse = {
  featuredNotes: PublicNote[];
  latestNotes: PublicNote[];
  freeNotes: PublicNote[];
  featuredGroups: PublicGroup[];
  categories: PublicCategory[];
  stats: { totalNotes: number; totalGroups: number; totalOrders: number; totalRevenue: number };
};
type NoteDetailResponse = { note: PublicNote; relatedNotes: PublicNote[]; groups: PublicGroup[] };
type GroupDetailResponse = { group: PublicGroup; relatedGroups: PublicGroup[] };
```

---

## Constants (`src/lib/constants.ts`)

### Numeric Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `DEFAULT_PAGE_LIMIT` | `12` | Default items per page for public listings |
| `ADMIN_PAGE_LIMIT` | `20` | Default items per page for admin listings |
| `MAX_PAGE_LIMIT` | `48` | Maximum allowed items per page |
| `DELIVERY_ETA_HOURS` | `6` | Expected delivery time in hours |
| `ADMIN_SESSION_MAX_AGE_SECONDS` | `604800` | 7 days in seconds |
| `SIGNED_URL_TTL_SECONDS` | `60` | Cloudinary signed URL expiration |
| `LEADS_EXPORT_MAX_ROWS` | `10000` | Maximum rows in CSV export |
| `MIN_PAID_PRICE_PAISE` | `100` | Minimum price for paid items (Rs. 1) |

### String Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `ADMIN_SESSION_COOKIE` | `"np_admin_session"` | Session cookie name |
| `ORDER_CURRENCY` | `"INR"` | Default currency code |

### Label Maps

```typescript
const NOTE_LEVEL_LABELS: Record<NoteLevel, string> = {
  basics: 'Basics',
  intermediate: 'Intermediate',
  advance: 'Advanced',
};

const PRICING_TYPE_LABELS: Record<NotePricingType, string> = {
  free: 'Free',
  paid: 'Paid',
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  created: 'Awaiting payment',
  paid: 'Paid',
  failed: 'Failed',
};

const FULFILLMENT_STATUS_LABELS: Record<FulfillmentStatus, string> = {
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  email: 'Email',
};
```

### Status Config (for table rendering)

```typescript
const STATUS_CONFIG: Record<StatusType, Record<string, { label: string; className: string }>> = {
  payment: {
    created: { label: 'Awaiting payment', className: 'bg-yellow-100 text-yellow-800' },
    paid: { label: 'Paid', className: 'bg-green-100 text-green-800' },
    failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
  },
  fulfillment: {
    pending: { label: 'Pending', className: 'bg-orange-100 text-orange-800' },
    completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-800' },
  },
  pricing: {
    free: { label: 'Free', className: 'bg-green-100 text-green-800' },
    paid: { label: 'Paid', className: 'bg-blue-100 text-blue-800' },
  },
  level: {
    basics: { label: 'Basics', className: 'bg-blue-100 text-blue-800' },
    intermediate: { label: 'Intermediate', className: 'bg-yellow-100 text-yellow-800' },
    advance: { label: 'Advanced', className: 'bg-red-100 text-red-800' },
  },
};
```

### Upload Limits

```typescript
const UPLOAD_LIMITS: Record<UploadKind, { maxBytes: number; mimeTypes: string[]; folder: string }> = {
  note_full: {
    maxBytes: 50 * 1024 * 1024,  // 50 MB
    mimeTypes: ['application/pdf'],
    folder: 'notes-provider/notes/full',
  },
  note_preview: {
    maxBytes: 20 * 1024 * 1024,  // 20 MB
    mimeTypes: ['application/pdf'],
    folder: 'notes-provider/notes/preview',
  },
  cover: {
    maxBytes: 5 * 1024 * 1024,   // 5 MB
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    folder: 'notes-provider/covers',
  },
};
```

### Rate Limits

```typescript
const RATE_LIMITS = {
  adminLogin: { limit: 5, windowMs: 10 * 60 * 1000 },      // 5 per 10 min
  adminRegister: { limit: 3, windowMs: 60 * 60 * 1000 },   // 3 per 1 hour
  createOrder: { limit: 10, windowMs: 10 * 60 * 1000 },    // 10 per 10 min
  noteDownload: { limit: 30, windowMs: 10 * 60 * 1000 },   // 30 per 10 min
};
```

### Validation Patterns

```typescript
const SOCIAL_HANDLE_PATTERNS: Record<SocialPlatform, RegExp> = {
  instagram: /^@?[a-zA-Z0-9._]{1,30}$/,
  whatsapp: /^(?:\+?91|0)?[6-9]\d{9}$/,
  email: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
};

const FULL_NAME_PATTERN = /^[\p{L}\s.'-]+$/u;  // Unicode-aware letters, spaces, apostrophes, periods, hyphens
```

### Brand & SEO

```typescript
const BRAND = {
  name: 'Notes Provider',
  tagline: 'Premium Study Notes & Materials',
  description: 'Discover and download high-quality study notes, solved papers, and exam preparation materials.',
};

const SEO = {
  defaultTitle: 'Notes Provider — Premium Study Notes & Materials',
  defaultDescription: 'Browse, preview, and download quality study notes for all subjects and levels.',
  siteName: 'Notes Provider',
  locale: 'en_IN',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  social: { x: '@notesprovider', github: 'notes-provider' },
  contactEmail: 'support@notesprovider.com',
};
```
