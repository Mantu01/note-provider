# Architecture Overview

## System Overview

Notes Provider is a full-stack Next.js application that follows the **Feature-Branch Architecture** pattern, separating client-facing features from server-side business logic with a dedicated mapper layer for data transformation.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Pages   │  │Features │  │ Components│  │ React Query  │   │
│  │ (Next.js)│  │ (hooks  │  │ (shadcn)  │  │   (cache)    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
└───────┼─────────────┼─────────────┼───────────────┼───────────┘
        │             │             │               │
        └─────────────┴─────────────┴───────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Server (Node.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │  API Routes  │  │  Page SSR/   │  │  Middleware (proxy) │  │
│  │  (Route      │  │  SSG/ISR     │  │  (session auth)     │  │
│  │  Handlers)   │  │              │  │                     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬──────────┘  │
└─────────┼─────────────────┼─────────────────────┼─────────────┘
          │                 │                     │
          └─────────────────┴─────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   MongoDB    │  │   Cloudinary │  │   Razorpay   │
│  (Mongoose)  │  │   (files)    │  │  (payments)  │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Layer Architecture

### 1. Presentation Layer (`src/app/` + `src/components/`)

All user-facing pages and reusable UI components.

- **Pages** use Next.js App Router with Route Groups for public vs. admin isolation
- **Components** follow atomic design: UI primitives → layout → shared → feature-specific
- All pages are Server Components by default; client interactivity is added via `"use client"` where needed

### 2. Feature Layer (`src/features/`)

Each business domain has its own feature module containing:
- **API hooks** — React Query queries/mutations using `@tanstack/react-query`
- **Components** — Page-level and complex interactive components specific to the feature

Features:
| Feature | Responsibility |
|---------|---------------|
| `home` | Homepage hero, featured content, stats |
| `notes` | Notes catalog, detail, filtering, search |
| `groups` | Bundle listing and detail pages |
| `orders` | Order tracking, status display |
| `checkout` | Payment form, Razorpay integration |
| `admin` | Full admin dashboard, CRUD for all entities |

### 3. Server Logic Layer (`src/server/`)

Pure server-side code that never runs in the browser.

- **`db/models/`** — Mongoose schema definitions and model classes
- **`services/`** — Business logic functions (CRUD operations, calculations, workflows)
- **`mappers/`** — Data transformers that convert between database documents and API response shapes
- **`lib/`** — Cross-cutting concerns: auth, payments, storage, email, utilities

### 4. Shared Utility Layer (`src/lib/`)

Code shared between client and server:
- **`types.ts`** — All TypeScript type aliases and interfaces
- **`constants.ts`** — Business constants, enums, labels, rate limits, upload limits
- **`schemas/`** — Zod validation schemas for all input types
- **`utils.ts`** — General helpers (className merging, etc.)
- **`format.ts`** — Date formatting, price conversion, social handle normalization

## Data Flow Patterns

### Client-to-Server (Page Load)

```
User visits /notes
  → Next.js renders Server Component
  → Calls GET /api/notes with query params
  → API handler connects to MongoDB
  → Note service queries with filters/sort/pagination
  → Mapper transforms Mongoose docs to PublicNote shape
  → Response sent back as JSON
  → Page renders with data (ISR caches result)
```

### Client-to-Server (Form Submission)

```
User submits checkout form
  → React hook form validates with Zod
  → POST /api/orders with buyer details
  → Order service creates Razorpay order
  → Returns Razorpay checkout payload
  → react-razorpay opens payment modal
  → User completes payment
  → Razorpay calls webhook POST /api/webhooks/razorpay
  → Webhook verifies signature, updates order status
  → Email notification sent to admins
  → Buyer sees success page
```

### Admin-to-Server (Content Management)

```
Admin edits a note
  → Auth middleware validates JWT cookie
  → PATCH /api/admin/notes/[id]
  → Auth guard checks admin is active (head-only for delete)
  → Note service validates with Zod schema
  → Upload service cleans up old Cloudinary assets
  → New file uploaded if changed
  → Activity logged to AdminActivity collection
  → Response returned with updated note
```

## Routing Strategy

### Route Groups (File System Routing)

| Group | Path Prefix | Purpose |
|-------|------------|---------|
| `(public)` | `/` | All customer-facing pages |
| `admin/` | `/admin` | Admin dashboard pages (requires auth) |
| `api/` | `/api` | All API endpoints |
| `og/` | `/og` | Dynamic Open Graph image generation |

### Revalidation Strategy (ISR)

| Route Pattern | Revalidate Interval | Why |
|--------------|---------------------|-----|
| `/api/home` | 60 seconds | Frequently changing stats |
| `/api/categories` | 60 seconds | Categories change often |
| `/api/filters` | 300 seconds | Aggregate data, less frequent |
| `/api/notes` | 300 seconds | Catalog doesn't change every second |
| `/api/groups` | 300 seconds | Same as notes |
| `/api/notes/[slug]` | 600 seconds | Individual notes are stable |
| `/api/groups/[slug]` | 600 seconds | Individual groups are stable |
| Order/lookup routes | `no-store` | Always fresh data needed |

## Technology Decisions

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | Next.js 16 App Router | SSR, ISR, API routes, routing in one tool |
| Language | TypeScript | Type safety across entire stack |
| Database | MongoDB + Mongoose | Flexible schema for notes/groups, text search built-in |
| ORM | Mongoose v9 | Schema validation, middleware, model inheritance |
| UI Library | shadcn/ui | Accessible, customizable, no vendor lock-in |
| Styling | Tailwind CSS v4 | Utility-first, fast development, small bundle |
| State Management | TanStack React Query | Server state caching, background refetching |
| Forms | react-hook-form + Zod | Performance-focused forms with schema validation |
| Payment | Razorpay | Best Indian payment gateway, webhook support |
| File Storage | Cloudinary | CDN-backed, signed URLs, format optimization |
| Authentication | JWT (jose) | Stateless, HTTP-only cookies, standard approach |
| Testing | Vitest | Fast, native ES modules, React Testing Library |

## File Organization Conventions

Every feature follows this structure:
```
src/features/<feature>/
  ├── api/
  │   ├── use-<entity>.ts       # React Query hooks
  │   └── use-<entity>-detail.ts
  └── components/
      ├── <page-name>.tsx       # Page component
      ├── <component>.tsx       # Feature-specific component
      └── index.ts              # Barrel export
```

Every server module follows:
```
src/server/
  ├── db/models/                # One file per Mongoose model
  ├── services/                 # One file per business domain service
  ├── mappers/                  # One file per entity mapper
  └── lib/                      # Shared utilities (no domain dependency)
```

Tests mirror this exactly under `tests/`:
```
tests/
  ├── api/                      # API route tests
  ├── app/                      # Page/component tests
  ├── features/<feature>/       # Feature-specific tests
  ├── server/services/          # Service logic tests
  ├── server/mappers/           # Mapper transformation tests
  └── lib/                      # Utility tests
```
