# Database Models

## Overview

The application uses MongoDB with Mongoose v9 as the ODM. All models are defined in `src/server/db/models/`. Mongoose connections are cached globally via the `globalThis.__mongoose` singleton pattern to avoid reconnecting on every request.

---

## Admin Model

**Collection:** `Admin`
**File:** `src/server/db/models/admin.model.ts`

Represents an admin user who can access the dashboard.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Full name (2-60 chars, trimmed) |
| `email` | String | Yes | Email address (unique, lowercase, indexed) |
| `passwordHash` | String | Yes | Bcrypt-hashed password (`select: false` — never returned in queries) |
| `lastLoginAt` | Date | No | Timestamp of last successful login |
| `isActive` | Boolean | No | Whether the account is active (default: true) |
| `isHead` | Boolean | No | Head admin privilege for destructive operations (default: false) |

**Indexes:** Implicit unique index on `email`.

---

## Admin Activity Model

**Collection:** `AdminActivity`
**File:** `src/server/db/models/admin-activity.model.ts`

Audit trail of every action performed by admins in the dashboard.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `admin` | ObjectId (ref: Admin) | Yes | The admin who performed the action |
| `action` | String enum | Yes | Action type (see `ADMIN_ACTIVITY_ACTIONS` constant) |
| `targetType` | String enum \| null | No | Target entity type: note, group, category, order, admin |
| `targetId` | ObjectId | No | ID of the target entity |
| `targetLabel` | String | No | Human-readable label of the target (e.g., note title) |
| `description` | String | Yes | Human-readable description of the action |
| `metadata` | Mixed | No | Additional contextual data (JSON object) |
| `ipAddress` | String | No | Client IP address from x-forwarded-for / x-real-ip |
| `userAgent` | String | No | Browser user-agent string |

**Action Types:** `admin.login`, `admin.logout`, `admin.register`, `note.create`, `note.update`, `note.delete`, `group.create`, `group.update`, `group.delete`, `category.create`, `category.update`, `category.delete`, `order.update_fulfillment`, `order.delete`, `upload.delete`

**Indexes:** `{ createdAt: -1 }`, `{ admin: 1, createdAt: -1 }`

---

## Category Model

**Collection:** `Category`
**File:** `src/server/db/models/category.model.ts`

Organizational structure for notes and groups. Categories contain sub-documents called "subjects."

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Category name (unique, 2-60 chars, trimmed) |
| `slug` | String | Yes | URL-friendly slug (unique, indexed) |
| `description` | String | No | Category description (max 300 chars) |
| `icon` | String | No | Icon identifier string (max 60 chars) |
| `order` | Number | No | Display order (default: 0) |
| `isActive` | Boolean | No | Whether the category is visible (default: true) |
| `subjects` | Array of subdocs | No | Nested subject items within this category |
| `createdBy` | ObjectId (ref: Admin) | No | Admin who created the category |
| `updatedBy` | ObjectId (ref: Admin) | No | Admin who last updated the category |

**Subject Subdocument:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Subject name (1-100 chars) |
| `slug` | String | Yes | Subject slug (lowercase, trimmed) |
| `order` | Number | No | Display order within category (default: 0) |
| `isActive` | Boolean | No | Whether subject is active (default: true) |

**Indexes:** `{ order: 1, name: 1 }`, `{ "subjects.slug": 1 }`

---

## Counter Model

**Collection:** `Counter`
**File:** `src/server/db/models/counter.model.ts`

MongoDB-based sequence generator for creating unique order numbers (e.g., `NP-20240101-0001`).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | String | Yes | Unique counter key (e.g., `"order"`) |
| `seq` | Number | Yes | Current sequence number (default: 0) |

**Usage:** The `generateOrderNumber()` function atomically increments the counter using `$inc` and formats it into a human-readable order number with date prefix.

**Indexes:** Unique index on `key`.

---

## Group Model

**Collection:** `Group`
**File:** `src/server/db/models/group.model.ts`

A bundle of multiple notes sold together as a single product.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Group title (3-160 chars, trimmed) |
| `slug` | String | Yes | URL-friendly slug (unique, indexed) |
| `description` | String | Yes | Group description (10-5000 chars) |
| `category` | ObjectId (ref: Category) | Yes | Parent category |
| `price` | Number | Yes | Price in paise (integer, min 100 = Rs. 1) |
| `compareAtPrice` | Number | No | Original price for displaying discount (min 0) |
| `notes` | [ObjectId] (ref: Note) | No | Array of included note IDs |
| `coverImageUrl` | String | No | Cloudinary URL for cover image |
| `coverImagePublicId` | String | No | Cloudinary public ID (for deletion) |
| `visibility` | String enum | No | `public` or `private` (default: `public`) |
| `isFeatured` | Boolean | No | Whether to feature on homepage (default: false) |
| `purchaseCount` | Number | No | Number of times purchased (default: 0) |
| `revenuePaise` | Number | No | Total revenue generated (default: 0) |
| `createdBy` | ObjectId (ref: Admin) | No | Admin who created the group |
| `updatedBy` | ObjectId (ref: Admin) | No | Admin who last updated the group |

**Indexes:** `{ visibility: 1, createdAt: -1 }`, `{ category: 1, visibility: 1 }`, `{ isFeatured: -1, createdAt: -1 }`

---

## Note Model

**Collection:** `Note`
**File:** `src/server/db/models/note.model.ts`

Individual study notes (PDF documents) available for free or paid download.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | Yes | Note title (3-160 chars, trimmed) |
| `slug` | String | Yes | URL-friendly slug (unique, indexed) |
| `description` | String | Yes | Note description (10-5000 chars) |
| `category` | ObjectId (ref: Category) | Yes | Parent category |
| `level` | String enum | Yes | Difficulty: `basics`, `intermediate`, `advance` |
| `visibility` | String enum | No | `public` or `private` (default: `public`) |
| `pricingType` | String enum | Yes | `free` or `paid` |
| `price` | Number | Yes | Price in paise (integer, min 0) |
| `compareAtPrice` | Number | No | Original price for discount display (min 0) |
| `fullFileUrl` | String | Yes | Cloudinary URL for full PDF |
| `fullFilePublicId` | String | Yes | Cloudinary public ID |
| `fullFileBytes` | Number | Yes | File size in bytes |
| `previewFileUrl` | String | No | Cloudinary URL for preview PDF |
| `previewFilePublicId` | String | No | Cloudinary public ID for preview |
| `previewFileBytes` | Number | No | Preview file size in bytes |
| `coverImageUrl` | String | No | Cover image URL |
| `coverImagePublicId` | String | No | Cover image public ID |
| `pageCount` | Number | No | Number of pages (1-20000) |
| `tags` | [String] | No | Search tags (max 20, 1-40 chars each) |
| `isFeatured` | Boolean | No | Featured on homepage (default: false) |
| `downloadCount` | Number | No | Times downloaded (free notes only, default: 0) |
| `purchaseCount` | Number | No | Times purchased (paid notes, default: 0) |
| `revenuePaise` | Number | No | Revenue generated (default: 0) |
| `createdBy` | ObjectId (ref: Admin) | No | Admin who created the note |
| `updatedBy` | ObjectId (ref: Admin) | No | Admin who last updated the note |

**Text Search Index:** `{ title: "text", description: "text", tags: "text" }` with weights `{ title: 3, tags: 2, description: 1 }` named `note_search_index`.

**Indexes:**
- `{ visibility: 1, createdAt: -1 }` — listing by recency
- `{ category: 1, level: 1, pricingType: 1 }` — filtered catalog queries
- `{ price: 1 }` — price range filtering
- `{ isFeatured: -1, createdAt: -1 }` — featured notes sorting

---

## Order Model

**Collection:** `Order`
**File:** `src/server/db/models/order.model.ts`

Purchase transactions between buyers and the platform. Tracks payment status, fulfillment status, and buyer contact information.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `orderNumber` | String | Yes | Unique order number (e.g., `NP-20240101-0001`, unique, indexed) |
| `itemType` | String enum | Yes | `note` or `group` |
| `note` | ObjectId (ref: Note) | No | Purchased note ID |
| `group` | ObjectId (ref: Group) | No | Purchased group ID |
| `itemSnapshot` | Subdoc | Yes | Frozen snapshot of item at purchase time (title, slug, price, noteIds) |
| `amount` | Number | Yes | Amount charged in paise |
| `currency` | String | No | Currency code (default: `INR`) |
| `buyer.fullName` | String | Yes | Buyer's full name (2-80 chars) |
| `buyer.socialPlatform` | String enum | Yes | `instagram`, `whatsapp`, or `email` |
| `buyer.socialHandle` | String | Yes | Contact handle (validated per platform) |
| `buyer.consentAccepted` | Boolean | Yes | GDPR-style consent checkbox |
| `buyer.ipAddress` | String | No | Buyer's IP address |
| `buyer.userAgent` | String | No | Buyer's browser user-agent |
| `razorpayOrderId` | String | Yes | Razorpay order ID (unique, sparse) |
| `razorpayPaymentId` | String | No | Razorpay payment ID after capture |
| `razorpaySignature` | String | No | Razorpay signature for verification |
| `paymentMethod` | String | No | Payment method used (UPI, card, etc.) |
| `paymentStatus` | String enum | No | `created`, `paid`, `failed` |
| `fulfillmentStatus` | String enum | No | `pending`, `completed`, `cancelled` |
| `failureReason` | String | No | Reason for payment failure |
| `adminNote` | String | No | Internal admin note (max 1000 chars) |
| `paidAt` | Date | No | Timestamp when payment was captured |
| `completedAt` | Date | No | Timestamp when order was fulfilled |
| `completedBy` | ObjectId (ref: Admin) | No | Admin who marked as completed |

**Indexes:**
- `{ paymentStatus: 1, fulfillmentStatus: 1, createdAt: -1 }` — admin order listing
- `{ createdAt: -1 }` — chronological queries
- `{ "buyer.socialHandle": 1 }` — lookup by buyer contact

---

## Model Relationships Diagram

```
                    ┌─────────────┐
                    │   Admin     │
                    │  (id, name, │
                    │  email,     │
                    │  isHead)    │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌───────────┐   ┌───────────┐   ┌──────────────┐
    │  Category │   │   Note    │   │   Admin      │
    │  (id,     │   │  (id,     │   │  Activity    │
    │   name,   │   │   title,  │   │  (id,        │
    │   slug)   │   │   slug)   │   │   admin_ref, │
    └─────┬─────┘   └─────┬─────┘   │   action)    │
          │               │         └──────────────┘
          │               │
          │         ┌─────┴──────┐
          │         │    Order   │
          │         │  (id,      │
    ┌─────┴─────┐   │   buyer,  │
    │  Group    │◄──│   payment,│
    │ (id,      │   │   fulfill)│
    │  name,    │   └───────────┘
    │  notes[] │
    └───────────┘
```

**Key Relationships:**
- Admin creates/updates/deletes Notes, Groups, Categories, and Orders
- Category contains multiple Notes and Groups
- Group references multiple Notes
- Order references either a Note or a Group (not both)
- AdminActivity references an Admin and optionally a target entity
