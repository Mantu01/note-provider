# Graph Report - notes-provider  (2026-09-16)

## Corpus Check
- 211 files · ~55,851 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1060 nodes · 2932 edges · 86 communities (44 shown, 42 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Mappers & API Home
- Note/Group Form Schemas
- Admin Data Tables
- Public Notes/Groups API
- package.json Config
- Upload & Error Helpers
- Admin CRUD Routes
- UI Utils & Shared States
- tsconfig Config
- Admin Auth & JWT
- API Handler & Response
- DB & Prisma Layer
- Admin Hooks & API Client
- Home Page & Shimmer
- Admin Dialogs & Inputs
- Button, Navbar & Logo
- Types & Catalogue Hooks
- Constants & Checkout
- Card, Dashboard & Orders
- Components Alias Config
- Legal & SEO Pages
- Notes Catalogue & Filters
- JSON-LD & Public Lists
- Order Status & Lookup
- JSON-LD Helpers
- Checkout Page & Schema
- PWA Manifest
- Note Detail & Cards
- Layout, Providers & API Error
- Footer & Social Icons
- Order Lookup & Rate Limit
- Item Detail Pages & JSON-LD
- Pagination UI
- Razorpay & Webhook
- Sitemap, Robots & Track
- Category Schema
- package Dependencies Core
- Dashboard Service
- Item Slug Routes
- Groups Catalogue & Error
- Proxy & Admin Session
- File Upload Hook & Field
- React Doctor Config
- Admin Group Edit
- Admin Note Edit
- Admin Order Detail
- Admin Dashboard Page
- OG Group Route
- OG Home Route
- OG Logo Route
- OG Note Route
- next.config
- Markdown Preview
- bcryptjs
- class-variance-authority
- cloudinary
- clsx
- date-fns
- dotenv
- eslint config
- react-hook-form resolvers
- jose
- lucide-react
- next
- next-themes
- pg
- prisma adapter pg
- razorpay
- react
- react-dom
- react-hook-form
- react-markdown
- react-razorpay
- react-syntax-highlighter
- recharts
- rehype-katex
- rehype-raw
- remark-gfm
- remark-math
- shadcn
- sonner
- tailwind-merge
- tw-animate-css
- zod
- postcss config

## God Nodes (most connected - your core abstractions)
1. `cn()` - 106 edges
2. `ok()` - 64 edges
3. `AppError` - 41 edges
4. `prisma` - 40 edges
5. `apiClient()` - 40 edges
6. `Button()` - 38 edges
7. `webpageJsonLd` - 23 edges
8. `fail()` - 23 edges
9. `handler()` - 20 edges
10. `adminHandler()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `GET` --indirect_call--> `toAdminLead()`  [INFERRED]
  src/app/api/admin/leads/route.ts → src/helpers/mappers/order.mapper.ts
- `GET` --calls--> `ok()`  [EXTRACTED]
  src/app/api/categories/route.ts → src/helpers/api-response.ts
- `GET` --calls--> `ok()`  [EXTRACTED]
  src/app/api/filters/route.ts → src/helpers/api-response.ts
- `GET` --indirect_call--> `toPublicGroup()`  [INFERRED]
  src/app/api/groups/route.ts → src/helpers/mappers/group.mapper.ts
- `GET` --indirect_call--> `toPublicNote()`  [INFERRED]
  src/app/api/notes/[slug]/route.ts → src/helpers/mappers/note.mapper.ts

## Import Cycles
- None detected.

## Communities (86 total, 42 thin omitted)

### Community 0 - "Mappers & API Home"
Cohesion: 0.09
Nodes (43): GET, GET, dynamic, EMPTY_HOME, GET, revalidate, GroupDetailPage(), toAdminProfile() (+35 more)

### Community 1 - "Note/Group Form Schemas"
Cohesion: 0.06
Nodes (43): DynamicNoteForm, FileFieldSource, FileSource, NoteFormProps, FileAttachmentsSection(), FileAttachmentsSectionProps, FileFieldSource, FileSource (+35 more)

### Community 2 - "Admin Data Tables"
Cohesion: 0.13
Nodes (21): LeadsTable(), OrdersTable(), EmptyState(), PaginationBar(), StatusBadge(), StatusBadgeProps, Badge(), badgeVariants (+13 more)

### Community 3 - "Public Notes/Groups API"
Cohesion: 0.10
Nodes (31): GET, runtime, GET, runtime, dynamic, GET, revalidate, dynamic (+23 more)

### Community 4 - "package.json Config"
Cohesion: 0.05
Nodes (38): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prisma, @prisma/client, react-doctor (+30 more)

### Community 5 - "Upload & Error Helpers"
Cohesion: 0.10
Nodes (23): DELETE, POST, runtime, GET, runtime, dynamic, GET, revalidate (+15 more)

### Community 6 - "Admin CRUD Routes"
Cohesion: 0.15
Nodes (28): DELETE, PATCH, DELETE, GET, PATCH, runtime, GET, runtime (+20 more)

### Community 7 - "UI Utils & Shared States"
Cohesion: 0.10
Nodes (26): Container(), PageHeader(), Section(), EmptyStateProps, CardAction(), CardFooter(), Checkbox(), DialogOverlay() (+18 more)

### Community 8 - "tsconfig Config"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, ./generated/prisma/client, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+24 more)

### Community 9 - "Admin Auth & JWT"
Cohesion: 0.12
Nodes (25): POST, runtime, POST, runtime, AdminSession, getOptionalAdmin(), requireAdmin(), requireHeadAdmin() (+17 more)

### Community 10 - "API Handler & Response"
Cohesion: 0.11
Nodes (22): runtime, POST, runtime, GET, runtime, GET, runtime, dynamic (+14 more)

### Community 11 - "DB & Prisma Layer"
Cohesion: 0.15
Nodes (18): seedDate, runtime, GET, POST, runtime, createOrderSchema, POST, runtime (+10 more)

### Community 12 - "Admin Hooks & API Client"
Cohesion: 0.15
Nodes (26): AdminShell(), CategoriesTable(), GroupForm(), GroupsTable(), NoteMultiSelect(), NoteForm(), NotesTable(), useAdminCategories() (+18 more)

### Community 13 - "Home Page & Shimmer"
Cohesion: 0.09
Nodes (14): HeroSection(), HomePage(), CategoryCard(), ShimmerGroupCard(), ShimmerLoader(), ShimmerNoteCard(), ShimmerStatCard(), useHome() (+6 more)

### Community 14 - "Admin Dialogs & Inputs"
Cohesion: 0.17
Nodes (19): CATEGORY_ICON_PRESETS, CategoryDialog(), CategoryDialogProps, GroupFormProps, NoteMultiSelectProps, FulfillmentDialog(), FulfillmentDialogProps, FilterPanelProps (+11 more)

### Community 15 - "Button, Navbar & Logo"
Cohesion: 0.14
Nodes (11): metadata, navItems, ExportButton(), Logo(), LogoProps, sizes, ThemeToggle(), CopyButton() (+3 more)

### Community 16 - "Types & Catalogue Hooks"
Cohesion: 0.14
Nodes (20): useGroups(), useFilters(), queryKeys, AdminAuthResponse, ApiFailure, ApiResult, ApiSuccess, FiltersResponse (+12 more)

### Community 17 - "Constants & Checkout"
Cohesion: 0.08
Nodes (21): metadata, CheckoutContent(), ADMIN_PAGE_LIMIT, ERROR_STATUS, FULFILLMENT_STATUS_LABELS, FULL_NAME_PATTERN, LEADS_EXPORT_MAX_ROWS, NOTE_LEVEL_LABELS (+13 more)

### Community 18 - "Card, Dashboard & Orders"
Cohesion: 0.20
Nodes (16): RecentOrders(), RevenueChart(), RevenueChartProps, STAT_CARDS, StatsGrid(), StatsGridProps, lookupSchema, LookupValues (+8 more)

### Community 19 - "Components Alias Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Legal & SEO Pages"
Cohesion: 0.21
Nodes (15): metadata, metadata, metadata, metadata, StaticPage(), Accordion(), AccordionContent(), AccordionItem() (+7 more)

### Community 21 - "Notes Catalogue & Filters"
Cohesion: 0.17
Nodes (15): MobileNav(), ActiveFilterChips(), FilterPanel(), NotesCatalogue(), Sheet(), SheetContent(), SheetDescription(), SheetFooter() (+7 more)

### Community 22 - "JSON-LD & Public Lists"
Cohesion: 0.13
Nodes (16): AboutPage(), ContactPage(), ICON_MAP, metadata, GroupsPageRoute(), metadata, metadata, NotesPage() (+8 more)

### Community 23 - "Order Status & Lookup"
Cohesion: 0.16
Nodes (9): OrderRouteProps, OrderSuccessRouteProps, OrderStatusPage(), PdfPreviewDialog(), downloadFile(), useDownloadFile(), OrderLookupResponse, useOrder() (+1 more)

### Community 24 - "JSON-LD Helpers"
Cohesion: 0.31
Nodes (13): RootLayout(), HomePageRoute(), metadata, collectionPageJsonLd(), faqJsonLd(), getAppUrl(), howToJsonLd(), JsonLdReturn (+5 more)

### Community 25 - "Checkout Page & Schema"
Cohesion: 0.20
Nodes (10): CheckoutPage(), NoteDetailPage(), useCreateOrder(), useGroup(), useNote(), CheckoutOrderResponse, PurchaseItemType, checkoutSchema (+2 more)

### Community 26 - "PWA Manifest"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 27 - "Note Detail & Cards"
Cohesion: 0.24
Nodes (11): LEVEL_BADGE, LevelBadge(), LevelBadgeProps, PRICING_BADGE, PricingBadge(), PricingBadgeProps, NoteCard(), NoteCardProps (+3 more)

### Community 28 - "Layout, Providers & API Error"
Cohesion: 0.18
Nodes (10): caveat, instrumentSans, inter, metadata, outfit, ApiError, AppProviders(), getErrorMessage() (+2 more)

### Community 29 - "Footer & Social Icons"
Cohesion: 0.22
Nodes (9): Footer(), FOOTER_LINKS, SOCIAL_LINKS, SocialLink, Navbar(), GithubIcon(), InstagramIcon(), XIcon() (+1 more)

### Community 30 - "Order Lookup & Rate Limit"
Cohesion: 0.26
Nodes (8): GET, POST, runtime, Bucket, enforceRateLimit(), globalStore, prune(), getOrderByNumber()

### Community 31 - "Item Detail Pages & JSON-LD"
Cohesion: 0.30
Nodes (8): GroupRoute(), GroupRouteProps, NotePageProps, NoteRoute(), articleJsonLd(), breadcrumbJsonLd(), courseJsonLd(), productJsonLd()

### Community 32 - "Pagination UI"
Cohesion: 0.24
Nodes (10): PaginationBarProps, Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink(), PaginationLinkProps, PaginationNext() (+2 more)

### Community 33 - "Razorpay & Webhook"
Cohesion: 0.31
Nodes (9): dynamic, POST(), runtime, getRazorpayKeyId(), razorpay, requireEnv(), timingSafeCompare(), verifyPaymentSignature() (+1 more)

### Community 34 - "Sitemap, Robots & Track"
Cohesion: 0.22
Nodes (5): metadata, safeQuery(), sitemap(), STATIC_PAGES, APP_URL

### Community 35 - "Category Schema"
Cohesion: 0.20
Nodes (9): categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload, createCategorySchema, SubjectInput, subjectSchema, UpdateCategoryInput, UpdateCategoryPayload (+1 more)

### Community 36 - "package Dependencies Core"
Cohesion: 0.22
Nodes (9): @base-ui/react, @next/third-parties, nuqs, dependencies, @base-ui/react, @next/third-parties, nuqs, @tanstack/react-query (+1 more)

### Community 37 - "Dashboard Service"
Cohesion: 0.39
Nodes (7): GET, runtime, generateRevenueSeries(), getCategoryBreakdown(), getDashboardStats(), getTopNotes(), toDateKey()

### Community 38 - "Item Slug Routes"
Cohesion: 0.28
Nodes (7): GET, revalidate, runtime, GET, revalidate, runtime, toPublicGroup()

### Community 39 - "Groups Catalogue & Error"
Cohesion: 0.36
Nodes (5): ErrorState(), ErrorStateProps, GroupCard(), GroupCardProps, PublicGroup

### Community 40 - "Proxy & Admin Session"
Cohesion: 0.32
Nodes (7): ADMIN_SESSION_COOKIE, config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, unauthorizedJson()

### Community 41 - "File Upload Hook & Field"
Cohesion: 0.47
Nodes (5): FileUploadField(), FileUploadFieldProps, useDeleteUpload(), useFileUpload(), UploadKind

### Community 42 - "React Doctor Config"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

## Knowledge Gaps
- **287 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+282 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Utils & Shared States` to `Pagination UI`, `Admin Data Tables`, `Groups Catalogue & Error`, `Admin Hooks & API Client`, `Home Page & Shimmer`, `Admin Dialogs & Inputs`, `Button, Navbar & Logo`, `Card, Dashboard & Orders`, `Legal & SEO Pages`, `Notes Catalogue & Filters`, `Note Detail & Cards`, `Footer & Social Icons`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `ok()` connect `Admin CRUD Routes` to `Mappers & API Home`, `Public Notes/Groups API`, `Dashboard Service`, `Upload & Error Helpers`, `Item Slug Routes`, `Admin Auth & JWT`, `API Handler & Response`, `DB & Prisma Layer`, `Order Lookup & Rate Limit`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button, Navbar & Logo` to `Pagination UI`, `Note/Group Form Schemas`, `Admin Data Tables`, `Groups Catalogue & Error`, `UI Utils & Shared States`, `File Upload Hook & Field`, `Home Page & Shimmer`, `Admin Dialogs & Inputs`, `Card, Dashboard & Orders`, `Notes Catalogue & Filters`, `JSON-LD & Public Lists`, `Order Status & Lookup`, `Checkout Page & Schema`, `Note Detail & Cards`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _287 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Mappers & API Home` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Note/Group Form Schemas` be split into smaller, more focused modules?**
  _Cohesion score 0.055272108843537414 - nodes in this community are weakly interconnected._
- **Should `Admin Data Tables` be split into smaller, more focused modules?**
  _Cohesion score 0.12896405919661733 - nodes in this community are weakly interconnected._