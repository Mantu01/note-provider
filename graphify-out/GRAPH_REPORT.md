# Graph Report - notes-provider  (2026-09-16)

## Corpus Check
- 217 files · ~59,006 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1125 nodes · 3086 edges · 85 communities (45 shown, 40 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- UI Components — Shared & Checkout
- Home Page & API
- Admin Notes CRUD
- ESLint & Dev Dependencies
- Note Downloads & Previews
- Admin Dashboard Pages
- Notes Catalog API
- Filters & Auth Logout
- Seed Script & Admin Orders
- TypeScript Type References
- Admin Dashboard Recharts Charts
- Admin API Routes (Categories/Groups)
- Layout Components
- Admin Auth (login/me/logout)
- Public Root Layout & Pages
- Zod Schemas & Constants
- Admin Groups Management API
- Public Layout & Error Handling
- Static Public Pages (About/Privacy)
- Order Pages (public & success)
- Constants (leads, pricing, statuses)
- Component Aliases (hooks/lib/utils)
- Checkout & Public Note/Group Pages
- Homepage Section Components
- Admin Tables & Fulfillment
- Admin Tables & Status Badges
- Sheet & Filter Panel UI
- Admin Shell Layout
- Admin Group & Note Forms
- Category Management (admin + hooks)
- PWA Manifest
- New Note Page (admin)
- Cloudinary Upload Helpers
- Badge Components (pricing/level)
- Pagination Components
- Admin Order Detail Page
- Razorpay Webhook Integration
- Shimmer Loaders & Catalog Views
- Empty State Components
- Next.js & Theme Dependencies
- Infrastructure & Deployment Config
- Proxy Middleware
- Root Layout Typography (fonts)
- Contact Page
- Doctor Config Rules
- Category Delete Hook & Admin Page
- Group Edit Hook & Page
- OG Image — Group
- OG Image — Home
- OG Image — Logo
- OG Image — Note
- Next.js Config
- Markdown Preview Component
- Base UI (React)
- Class Variance Authority
- Cloudinary Package
- clsx Utility
- date-fns
- ESLint Config
- React Hook Form Resolvers
- Jose (JWT)
- Lucide React Icons
- Mongoose
- Next Themed/Third Party
- Nodemailer
- Nuqs URL Search Params
- Prisma Client
- Razorpay SDK
- React Core
- React DOM
- React Hook Form
- React Markdown
- React Razorpay
- React Syntax Highlighter
- Recharts Charts
- Rehype KaTeX (math)
- Rehype Raw HTML
- Remark GFM (GitHub Flavored MD)
- Remark Math
- shadcn/ui Primitives
- Sonner Toast
- Tailwind Merge
- TanStack React Query
- Zod Validation
- PostCSS Config

## God Nodes (most connected - your core abstractions)
1. `cn()` - 106 edges
2. `ok()` - 64 edges
3. `prisma` - 46 edges
4. `AppError` - 45 edges
5. `apiClient()` - 40 edges
6. `Button()` - 38 edges
7. `fail()` - 24 edges
8. `webpageJsonLd` - 23 edges
9. `handler()` - 20 edges
10. `rupeesToPaise()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `AboutPage()` --calls--> `webpageJsonLd`  [EXTRACTED]
  src/app/(public)/about/page.tsx → src/components/seo/json-ld-helpers.ts
- `ContactPage()` --calls--> `webpageJsonLd`  [EXTRACTED]
  src/app/(public)/contact/page.tsx → src/components/seo/json-ld-helpers.ts
- `GroupsPageRoute()` --calls--> `webpageJsonLd`  [EXTRACTED]
  src/app/(public)/groups/page.tsx → src/components/seo/json-ld-helpers.ts
- `NotesPage()` --calls--> `webpageJsonLd`  [EXTRACTED]
  src/app/(public)/notes/page.tsx → src/components/seo/json-ld-helpers.ts
- `PrivacyPage()` --calls--> `webpageJsonLd`  [EXTRACTED]
  src/app/(public)/privacy/page.tsx → src/components/seo/json-ld-helpers.ts

## Import Cycles
- None detected.

## Communities (85 total, 40 thin omitted)

### Community 0 - "UI Components — Shared & Checkout"
Cohesion: 0.06
Nodes (46): CheckoutPage(), GroupDetailPage(), GroupCardProps, NoteCardProps, useCreateOrder(), useGroup(), useNote(), ApiError (+38 more)

### Community 1 - "Home Page & API"
Cohesion: 0.09
Nodes (44): dynamic, EMPTY_HOME, GET, revalidate, COMPACT_NUMBER_FORMAT, formatFileSize(), formatFileSizeLabel(), formatPrice() (+36 more)

### Community 2 - "Admin Notes CRUD"
Cohesion: 0.06
Nodes (22): GET, POST, runtime, GET, POST, runtime, rupeesToPaise(), RouteContext (+14 more)

### Community 3 - "ESLint & Dev Dependencies"
Cohesion: 0.05
Nodes (36): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prisma, react-doctor, tailwindcss (+28 more)

### Community 4 - "Note Downloads & Previews"
Cohesion: 0.10
Nodes (25): GET, runtime, dynamic, GET, revalidate, runtime, GET, POST (+17 more)

### Community 5 - "Admin Dashboard Pages"
Cohesion: 0.10
Nodes (26): NoteFormContent(), GroupForm(), NoteForm(), NotesTable(), OrdersTable(), FileUploadField(), FileUploadFieldProps, useAdminCategories() (+18 more)

### Community 6 - "Notes Catalog API"
Cohesion: 0.10
Nodes (29): GET, runtime, GET, GET, dynamic, GET, revalidate, NotesUrlState (+21 more)

### Community 7 - "Filters & Auth Logout"
Cohesion: 0.11
Nodes (25): POST, runtime, GET, runtime, dynamic, GET, revalidate, ADMIN_SESSION_MAX_AGE_SECONDS (+17 more)

### Community 8 - "Seed Script & Admin Orders"
Cohesion: 0.11
Nodes (10): seedDate, runtime, createOrderSchema, POST, runtime, globalForPrisma, prisma, generateOrderNumber() (+2 more)

### Community 9 - "TypeScript Type References"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 10 - "Admin Dashboard Recharts Charts"
Cohesion: 0.16
Nodes (19): metadata, AdminDashboard(), RecentOrders(), RevenueChart(), RevenueChartProps, STAT_CARDS, StatsGrid(), StatsGridProps (+11 more)

### Community 11 - "Admin API Routes (Categories/Groups)"
Cohesion: 0.15
Nodes (24): DELETE, PATCH, runtime, GET, runtime, DELETE, DELETE, GET (+16 more)

### Community 12 - "Layout Components"
Cohesion: 0.14
Nodes (22): Container(), PageHeader(), Section(), FilterPanelProps, CardAction(), CardFooter(), Checkbox(), DialogOverlay() (+14 more)

### Community 13 - "Admin Auth (login/me/logout)"
Cohesion: 0.11
Nodes (22): GET, runtime, POST, runtime, GET, runtime, POST, runtime (+14 more)

### Community 14 - "Public Root Layout & Pages"
Cohesion: 0.20
Nodes (22): RootLayout(), HomePageRoute(), metadata, GroupRoute(), GroupRouteProps, NotePageProps, NoteRoute(), articleJsonLd() (+14 more)

### Community 15 - "Zod Schemas & Constants"
Cohesion: 0.09
Nodes (24): MIN_PAID_PRICE_PAISE, NOTE_PRICING_TYPES, NOTE_VISIBILITIES, CreateGroupInput, CreateGroupPayload, createGroupSchema, groupBaseSchema, priceRupeesSchema (+16 more)

### Community 16 - "Admin Groups Management API"
Cohesion: 0.14
Nodes (16): GET, PATCH, runtime, GET, runtime, dynamic, revalidate, GET (+8 more)

### Community 17 - "Public Layout & Error Handling"
Cohesion: 0.13
Nodes (14): Logo(), LogoProps, sizes, Footer(), FOOTER_LINKS, SOCIAL_LINKS, SocialLink, MobileNav() (+6 more)

### Community 18 - "Static Public Pages (About/Privacy)"
Cohesion: 0.18
Nodes (17): AboutPage(), metadata, metadata, PrivacyPage(), metadata, RefundPolicyPage(), metadata, TermsPage() (+9 more)

### Community 19 - "Order Pages (public & success)"
Cohesion: 0.12
Nodes (13): OrderRouteProps, OrderSuccessRouteProps, NoteDetailPage(), OrderLookupPage(), OrderStatusPage(), CopyButton(), PdfPreviewDialog(), downloadFile() (+5 more)

### Community 20 - "Constants (leads, pricing, statuses)"
Cohesion: 0.09
Nodes (22): ADMIN_PAGE_LIMIT, ERROR_STATUS, FULFILLMENT_STATUS_LABELS, FULL_NAME_PATTERN, LEADS_EXPORT_MAX_ROWS, NOTE_LEVEL_LABELS, ORDER_CURRENCY, PAYMENT_STATUS_LABELS (+14 more)

### Community 21 - "Component Aliases (hooks/lib/utils)"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 22 - "Checkout & Public Note/Group Pages"
Cohesion: 0.11
Nodes (12): metadata, GroupsPageRoute(), metadata, metadata, NotesPage(), metadata, safeQuery(), sitemap() (+4 more)

### Community 23 - "Homepage Section Components"
Cohesion: 0.11
Nodes (10): HeroSection(), HomePage(), CategoryCard(), useHome(), HOME_FAQS, HOME_STATS_CONFIG, HOME_STEPS, HOME_TRUST_ITEMS (+2 more)

### Community 24 - "Admin Tables & Fulfillment"
Cohesion: 0.21
Nodes (12): GroupsTable(), FulfillmentDialog(), FulfillmentDialogProps, Dialog(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader() (+4 more)

### Community 25 - "Admin Tables & Status Badges"
Cohesion: 0.32
Nodes (12): EmptyState(), PaginationBar(), StatusBadge(), StatusBadgeProps, Badge(), badgeVariants, Table(), TableBody() (+4 more)

### Community 26 - "Sheet & Filter Panel UI"
Cohesion: 0.17
Nodes (14): ActiveFilterChips(), FilterPanel(), NotesCatalogue(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader() (+6 more)

### Community 27 - "Admin Shell Layout"
Cohesion: 0.18
Nodes (9): metadata, AdminShell(), navItems, ExportButton(), ThemeToggle(), Button(), buttonVariants, useAdminLogout() (+1 more)

### Community 28 - "Admin Group & Note Forms"
Cohesion: 0.18
Nodes (12): GroupFormProps, NoteMultiSelect(), NoteMultiSelectProps, FileAttachmentsSectionProps, FileFieldSource, FileSource, NoteDetailsSectionProps, PricingVisibilitySectionProps (+4 more)

### Community 29 - "Category Management (admin + hooks)"
Cohesion: 0.15
Nodes (15): CATEGORY_ICON_PRESETS, CategoryDialog(), CategoryDialogProps, useCreateCategory(), useUpdateCategory(), categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload (+7 more)

### Community 30 - "PWA Manifest"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 31 - "New Note Page (admin)"
Cohesion: 0.15
Nodes (11): DynamicNoteForm, FileFieldSource, FileSource, NoteFormProps, FileAttachmentsSection(), NoteDetailsSection(), PricingVisibilitySection(), ServerErrorBanner() (+3 more)

### Community 32 - "Cloudinary Upload Helpers"
Cohesion: 0.26
Nodes (9): DELETE, POST, runtime, UPLOAD_LIMITS, uploadBuffer(), deleteUpload(), uploadFile(), UploadKind (+1 more)

### Community 33 - "Badge Components (pricing/level)"
Cohesion: 0.24
Nodes (8): LEVEL_BADGE, LevelBadge(), LevelBadgeProps, PRICING_BADGE, PricingBadge(), PricingBadgeProps, PriceTag(), formatDiscount()

### Community 34 - "Pagination Components"
Cohesion: 0.24
Nodes (10): PaginationBarProps, Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink(), PaginationLinkProps, PaginationNext() (+2 more)

### Community 35 - "Admin Order Detail Page"
Cohesion: 0.24
Nodes (5): LeadsTable(), OrderDetailView(), useAdminLeads(), useAdminOrder(), formatDateTime()

### Community 36 - "Razorpay Webhook Integration"
Cohesion: 0.31
Nodes (9): dynamic, POST(), runtime, getRazorpayKeyId(), razorpay, requireEnv(), timingSafeCompare(), verifyPaymentSignature() (+1 more)

### Community 37 - "Shimmer Loaders & Catalog Views"
Cohesion: 0.25
Nodes (7): GroupsPage(), GroupCard(), ShimmerGroupCard(), ShimmerLoader(), ShimmerNoteCard(), ShimmerStatCard(), useGroups()

### Community 38 - "Empty State Components"
Cohesion: 0.36
Nodes (8): EmptyStateProps, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 39 - "Next.js & Theme Dependencies"
Cohesion: 0.22
Nodes (9): bcryptjs, next, next-themes, dependencies, bcryptjs, next, next-themes, tw-animate-css (+1 more)

### Community 40 - "Infrastructure & Deployment Config"
Cohesion: 0.22
Nodes (9): Cloudinary File Storage, PostgreSQL Docker Setup, JWT Authentication, Next.js 16 Tech Stack, Notes Provider README, pnpm Workspace Security Config, Prisma ORM with PostgreSQL, Razorpay Payment Integration (+1 more)

### Community 41 - "Proxy Middleware"
Cohesion: 0.38
Nodes (6): config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, unauthorizedJson()

### Community 42 - "Root Layout Typography (fonts)"
Cohesion: 0.33
Nodes (5): caveat, instrumentSans, inter, metadata, outfit

### Community 43 - "Contact Page"
Cohesion: 0.40
Nodes (4): ContactPage(), ICON_MAP, metadata, CONTACT_CHANNELS

### Community 44 - "Doctor Config Rules"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

## Knowledge Gaps
- **295 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+290 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Layout Components` to `Badge Components (pricing/level)`, `Pagination Components`, `Shimmer Loaders & Catalog Views`, `Empty State Components`, `Admin Dashboard Recharts Charts`, `Public Layout & Error Handling`, `Static Public Pages (About/Privacy)`, `Admin Tables & Fulfillment`, `Admin Tables & Status Badges`, `Sheet & Filter Panel UI`, `Admin Shell Layout`, `Admin Group & Note Forms`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `AppError` connect `Note Downloads & Previews` to `Cloudinary Upload Helpers`, `UI Components — Shared & Checkout`, `Admin Notes CRUD`, `Razorpay Webhook Integration`, `Filters & Auth Logout`, `Seed Script & Admin Orders`, `Admin API Routes (Categories/Groups)`, `Admin Auth (login/me/logout)`, `Admin Groups Management API`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `prisma` connect `Seed Script & Admin Orders` to `Cloudinary Upload Helpers`, `Home Page & API`, `Admin Notes CRUD`, `UI Components — Shared & Checkout`, `Note Downloads & Previews`, `Razorpay Webhook Integration`, `Notes Catalog API`, `Filters & Auth Logout`, `Admin API Routes (Categories/Groups)`, `Admin Auth (login/me/logout)`, `Public Root Layout & Pages`, `Admin Groups Management API`, `Order Pages (public & success)`, `Checkout & Public Note/Group Pages`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _295 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components — Shared & Checkout` be split into smaller, more focused modules?**
  _Cohesion score 0.05837173579109063 - nodes in this community are weakly interconnected._
- **Should `Home Page & API` be split into smaller, more focused modules?**
  _Cohesion score 0.08897243107769423 - nodes in this community are weakly interconnected._
- **Should `Admin Notes CRUD` be split into smaller, more focused modules?**
  _Cohesion score 0.061170212765957445 - nodes in this community are weakly interconnected._