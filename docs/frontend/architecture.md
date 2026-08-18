# Frontend Architecture

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 16.2.12 | SSR, ISR, routing, API routes |
| Language | TypeScript | ^5 | Type safety across client/server |
| UI Library | React | 19.2.4 | Component-based UI |
| Styling | Tailwind CSS | ^4 | Utility-first CSS |
| Components | shadcn/ui | ^4.16.1 | Accessible, customizable primitives |
| Icons | Lucide React | ^1.28.0 | Icon library |
| State | TanStack React Query | ^5.101.4 | Server state management |
| Forms | react-hook-form | ^7.84.0 | Form handling |
| Validation | Zod | ^4.4.3 | Schema validation |
| Routing State | nuqs | ^2.9.4 | URL query state synchronization |
| Theming | next-themes | beta.0 | Dark/light mode |
| Charts | Recharts | 3.8.0 | Dashboard visualizations |
| Animations | tw-animate-css | ^1.4.0 | CSS animations |
| Carousel | embla-carousel-react | ^8.6.0 | Image carousels |
| Notifications | sonner | ^2.0.7 | Toast messages |
| Command Palette | cmdk | ^1.1.1 | Keyboard navigation |
| OTP Input | input-otp | ^1.4.2 | Verification code inputs |
| Layout Panels | react-resizable-panels | ^4.12.2 | Resizable admin panels |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (fonts, metadata, providers)
│   ├── not-found.tsx           # 404 page
│   ├── error.tsx               # Global error boundary
│   ├── sitemap.ts              # Dynamic sitemap generation
│   ├── robot.ts                # robots.txt generation
│   ├── manifest.json           # PWA manifest
│   ├── (public)/               # Route group: all customer-facing pages
│   │   ├── page.tsx            # Homepage
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   ├── privacy/            # Privacy policy
│   │   ├── terms/              # Terms of service
│   │   ├── refund-policy/      # Refund policy
│   │   ├── notes/              # Notes catalog + detail pages
│   │   ├── groups/             # Groups catalog + detail pages
│   │   ├── checkout/           # Checkout flow
│   │   └── order/              # Order tracking + detail
│   ├── admin/                  # Route group: admin dashboard
│   │   ├── layout.tsx          # Admin layout (sidebar, nav)
│   │   ├── login/              # Admin login page
│   │   └── dashboard/          # Dashboard pages
│   ├── api/                    # API route handlers
│   │   ├── home/
│   │   ├── notes/
│   │   ├── groups/
│   │   ├── categories/
│   │   ├── filters/
│   │   ├── orders/
│   │   ├── webhooks/
│   │   └── admin/
│   └── og/                     # Dynamic Open Graph images
│       ├── home/
│       ├── note/
│       └── group/
├── components/                 # Shared UI components
│   ├── ui/                     # shadcn/ui primitives
│   ├── layout/                 # Navbar, Footer, Container, Section
│   ├── shared/                 # NoteCard, GroupCard, PriceTag, StatusBadge, etc.
│   ├── brand/                  # Logo, ThemeToggle
│   └── seo/                    # JSON-LD structured data
├── features/                   # Feature modules
│   ├── home/                   # Homepage feature
│   ├── notes/                  # Notes browsing feature
│   ├── groups/                 # Groups browsing feature
│   ├── orders/                 # Order tracking feature
│   ├── checkout/               # Checkout/payment feature
│   └── admin/                  # Admin dashboard feature
├── hooks/                      # Custom React hooks
│   └── use-download-file.ts    # Trigger browser downloads
├── lib/                        # Client-shared utilities
│   ├── types.ts                # All TypeScript type definitions
│   ├── constants.ts            # Business constants and enums
│   ├── schemas/                # Zod validation schemas
│   ├── utils.ts                # General helpers (cn, etc.)
│   ├── format.ts               # Date/price formatting
│   ├── api-client.ts           # Fetch wrapper
│   └── query-keys.ts           # React Query cache keys
├── providers/                  # React context providers
│   ├── app-providers.tsx       # Root provider aggregator
│   ├── query-provider.tsx      # TanStack Query client
│   └── theme-provider.tsx      # Dark/light theme
└── server/                     # Server-only code
    ├── db/models/              # Mongoose models
    ├── services/               # Business logic
    ├── mappers/                # Data transformers
    └── lib/                    # Server utilities
```

---

## Feature Module Pattern

Each feature in `src/features/` follows a consistent structure:

```
src/features/<feature>/
  ├── api/
  │   ├── use-<entity>.ts           # List/query hook
  │   ├── use-<entity>-detail.ts    # Single item hook
  │   └── use-create-<entity>.ts    # Mutation hook
  └── components/
      ├── <page-name>.tsx           # Page component
      ├── <component>.tsx           # Feature-specific component
      └── index.ts                  # Barrel export
```

This pattern separates data fetching (React Query hooks) from presentation (components), making both testable independently.

### Example: Notes Feature

```typescript
// src/features/notes/api/use-notes.ts
export function useNotes(query: NotesQuery) {
  return useQuery({
    queryKey: queryKeys.notes.list(query),
    queryFn: () => fetchNotes(query),
    staleTime: 5 * 60 * 1000,
  });
}

// src/features/notes/components/notes-catalogue.tsx
export function NotesCatalogue() {
  const { page, search } = useNotesQueryState();
  const { data, isLoading } = useNotes({ page, search });
  return <>{/* render */}</>;
}
```

---

## State Management Strategy

| Concern | Solution | Why |
|---------|----------|-----|
| Server data | TanStack React Query | Caching, background refetch, pagination |
| URL state | nuqs | Search params reflected in URL (shareable, bookmarkable) |
| Form state | react-hook-form | Performance, validation, uncontrolled inputs |
| Theme | next-themes + React Context | Persistent light/dark preference |
| UI feedback | sonner toasts | Non-intrusive notifications |

### React Query Configuration

```typescript
// src/providers/query-provider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,     // Consider data fresh for 1 minute
      retry: 1,                  // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch on focus
    },
  },
});
```

Cache keys are organized in `src/lib/query-keys.ts`:
```typescript
export const queryKeys = {
  notes: { all: ['notes'], list: (q) => ['notes', 'list', q], detail: (slug) => ['notes', slug] },
  groups: { all: ['groups'], list: (q) => ['groups', 'list', q], detail: (slug) => ['groups', slug] },
  home: { all: ['home'], data: ['home'] },
  orders: { lookup: (num) => ['orders', 'lookup', num] },
};
```

---

## Form Patterns

All forms use react-hook-form with Zod resolvers:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(createNoteSchema),
  defaultValues: { title: '', description: '', ... },
});

// In template:
<input {...form.register('title')} />
{form.formState.errors.title?.message && (
  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
)}
```

---

## Component Library

### shadcn/ui Primitives (`src/components/ui/`)

These are individually installed and customizable components built on Radix UI:

| Component | Usage |
|-----------|-------|
| `Button` | Primary actions, CTAs, form submissions |
| `Card` | Content containers, note/group cards |
| `Dialog` | Modals for confirmations, previews |
| `Input` | Text fields, search boxes |
| `Select` | Dropdowns for filters, categorization |
| `Table` | Admin data tables |
| `Badge` | Status indicators, tags |
| `Checkbox` | Consent checkboxes, multi-select filters |
| `Skeleton` | Loading placeholders |
| `Switch` | Toggle switches (featured, isActive) |
| `Pagination` | Page navigation controls |
| `Sheet` | Mobile side drawers |
| `Accordion` | FAQ sections, collapsible content |
| `Label` | Form field labels |
| `Textarea` | Multi-line descriptions |
| `Empty` | Empty state shells |

### Shared Components (`src/components/shared/`)

Business-specific components built on top of shadcn/ui:

| Component | Usage |
|-----------|-------|
| `NoteCard` | Product card for individual notes |
| `GroupCard` | Product card for note bundles |
| `CategoryCard` | Category browse card |
| `PriceTag` | Price display with optional strikethrough |
| `StatusBadge` | Colored badge for payment/fulfillment status |
| `PaginationBar` | Paginated results navigation |
| `PDFPreviewDialog` | Modal for previewing PDFs |
| `CopyButton` | One-click clipboard copy |
| `ShimmerLoader` | Skeleton loading animation |
| `FileUploadField` | Drag-and-drop file upload control |
| `EmptyState` | Placeholder when no results exist |
| `ErrorState` | Error display fallback |
| `SocialIcons` | Social media link icons |

### Layout Components (`src/components/layout/`)

| Component | Usage |
|-----------|-------|
| `Navbar` | Desktop navigation with logo, links, theme toggle |
| `MobileNav` | Hamburger menu for mobile screens |
| `Footer` | Site footer with links and copyright |
| `Container` | Max-width content wrapper |
| `Section` | Section wrapper with padding |
| `PageHeader` | Page title and breadcrumb area |
| `StaticPage` | Layout wrapper for static content pages |

---

## Responsive Design

The project uses Tailwind CSS breakpoint classes:

| Breakpoint | Class | Min Width |
|-----------|-------|-----------|
| Mobile | — | 0px |
| Tablet | `sm:` | 640px |
| Desktop | `md:` | 768px |
| Large | `lg:` | 1024px |
| XL | `xl:` | 1280px |
| 2XL | `2xl:` | 1536px |

Mobile-first approach: base styles apply to all sizes, `md:` and above enhance for larger screens.

---

## Accessibility

- All interactive elements are keyboard accessible
- ARIA labels on icon-only buttons
- Focus-visible styles on all interactive elements
- Color contrast meets WCAG AA standards
- Semantic HTML (header, main, nav, footer, article)
- Screen reader friendly status updates via live regions
