# Graph Report - notes-provider  (2026-09-16)

## Corpus Check
- 221 files · ~57,829 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1126 nodes · 3283 edges · 74 communities (42 shown, 32 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Admin Dashboard Pages
- Admin API Routes
- Home & Format Utils
- Admin UI Components
- Public API CRUD Routes
- Order Admin UI
- Error Handling & Shell
- Admin Delete/Get Routes
- ESLint Config
- Admin Edit Pages
- Groups Catalogue Hooks
- Orders & Webhooks
- Upload & Download APIs
- Public Layout & Groups
- Home Page Components
- TypeScript References
- Admin CRUD Route Handlers
- Schemas & Constants
- Auth & Order Lookup APIs
- Public Content Pages
- Note Detail & Badges
- Component Aliases
- Admin Note Forms
- API Handler & Auth
- Admin Management APIs
- Legal Static Pages
- Sitemap & Categories
- File Upload & Category Schema
- App Constants
- Web Manifest
- Public Layout Components
- API Client & Types
- Checkout Components
- Admin Schemas
- Proxy Middleware
- Package Dependencies Core
- Checkout Hooks & Schema
- Layout Fonts
- Admin Shell Navigation
- Admin Dashboard Core
- Checkout Route
- Doctor Config
- OG Group Image
- OG Home Image
- OG Logo Image
- OG Note Image
- Next.js Config
- Base UI React
- BcryptJS
- Clsx Utility
- Date FNS
- ESLint Config Object
- Jose JWT
- Lucide React Icons
- Next.js Framework
- Next Themes
- Next Third Parties
- Nodemailer
- Nuqs URL State
- Mongoose ODM
- Razorpay Payments
- React Core
- React DOM
- React Hook Form
- React Razorpay
- Recharts Charts
- Shadcn UI
- Sonner Toasts
- Tailwind Merge
- TanStack Query
- TW Animate CSS
- Zod Validation
- PostCSS Config

## God Nodes (most connected - your core abstractions)
1. `cn()` - 106 edges
2. `ok()` - 65 edges
3. `AppError` - 45 edges
4. `apiClient()` - 40 edges
5. `Button()` - 38 edges
6. `Note` - 27 edges
7. `fail()` - 26 edges
8. `webpageJsonLd` - 23 edges
9. `rupeesToPaise()` - 21 edges
10. `handler()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `seed()` --calls--> `connectDB()`  [EXTRACTED]
  seed.ts → src/server/db/connect.ts
- `GET` --indirect_call--> `toAdminLead()`  [INFERRED]
  src/app/api/admin/leads/route.ts → src/server/mappers/order.mapper.ts
- `GET` --indirect_call--> `toAdminNote()`  [INFERRED]
  src/app/api/admin/notes/route.ts → src/server/mappers/note.mapper.ts
- `GET` --indirect_call--> `toAdminOrder()`  [INFERRED]
  src/app/api/admin/orders/route.ts → src/server/mappers/order.mapper.ts
- `GET` --indirect_call--> `toPublicNote()`  [INFERRED]
  src/app/api/groups/[slug]/route.ts → src/server/mappers/note.mapper.ts

## Import Cycles
- None detected.

## Communities (74 total, 32 thin omitted)

### Community 0 - "Admin Dashboard Pages"
Cohesion: 0.06
Nodes (54): GroupsTable(), NoteMultiSelect(), NoteMultiSelectProps, ExportButton(), LeadsTable(), NotesTable(), OrdersTable(), EmptyState() (+46 more)

### Community 1 - "Admin API Routes"
Cohesion: 0.05
Nodes (53): GET, runtime, GET, runtime, GET, runtime, GET, runtime (+45 more)

### Community 2 - "Home & Format Utils"
Cohesion: 0.10
Nodes (48): dynamic, EMPTY_HOME, fetchHomeData(), GET, revalidate, COMPACT_NUMBER_FORMAT, formatFileSize(), formatFileSizeLabel() (+40 more)

### Community 3 - "Admin UI Components"
Cohesion: 0.12
Nodes (30): CATEGORY_ICON_PRESETS, CategoryDialogProps, GroupFormProps, FulfillmentDialog(), FulfillmentDialogProps, Container(), PageHeader(), Section() (+22 more)

### Community 4 - "Public API CRUD Routes"
Cohesion: 0.07
Nodes (17): dynamic, revalidate, dynamic, revalidate, revalidate, runtime, GET, revalidate (+9 more)

### Community 5 - "Order Admin UI"
Cohesion: 0.12
Nodes (26): RecentOrders(), RevenueChart(), RevenueChartProps, STAT_CARDS, StatsGrid(), StatsGridProps, OrderDetailView(), lookupSchema (+18 more)

### Community 6 - "Error Handling & Shell"
Cohesion: 0.11
Nodes (20): navItems, Logo(), LogoProps, sizes, ThemeToggle(), MobileNav(), ActiveFilterChips(), CopyButton() (+12 more)

### Community 7 - "Admin Delete/Get Routes"
Cohesion: 0.10
Nodes (29): DELETE, GET, DELETE, GET, GET, DELETE, GET, PATCH (+21 more)

### Community 8 - "ESLint Config"
Cohesion: 0.06
Nodes (34): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, react-doctor, tailwindcss, @tailwindcss/postcss (+26 more)

### Community 9 - "Admin Edit Pages"
Cohesion: 0.10
Nodes (25): GroupFormContent(), NoteFormContent(), CategoriesTable(), CategoryDialog(), GroupForm(), NoteForm(), useAdminCategories(), useAdminGroup() (+17 more)

### Community 10 - "Groups Catalogue Hooks"
Cohesion: 0.09
Nodes (29): GroupsPage(), GroupCardProps, useGroups(), useNotes(), buildQueryString(), queryKeys, AdminRef, ApiFailure (+21 more)

### Community 11 - "Orders & Webhooks"
Cohesion: 0.11
Nodes (22): seed(), seedDate, POST, runtime, dynamic, POST(), runtime, connectDB() (+14 more)

### Community 12 - "Upload & Download APIs"
Cohesion: 0.12
Nodes (21): DELETE, POST, runtime, GET, runtime, dynamic, GET, revalidate (+13 more)

### Community 13 - "Public Layout & Groups"
Cohesion: 0.17
Nodes (23): RootLayout(), HomePageRoute(), metadata, GroupRoute(), GroupRouteProps, PopulatedGroup, NotePageProps, NoteRoute() (+15 more)

### Community 14 - "Home Page Components"
Cohesion: 0.09
Nodes (14): HeroSection(), HomePage(), CategoryCard(), ShimmerGroupCard(), ShimmerLoader(), ShimmerNoteCard(), ShimmerStatCard(), useHome() (+6 more)

### Community 15 - "TypeScript References"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+19 more)

### Community 16 - "Admin CRUD Route Handlers"
Cohesion: 0.19
Nodes (19): PATCH, runtime, POST, runtime, PATCH, runtime, POST, runtime (+11 more)

### Community 17 - "Schemas & Constants"
Cohesion: 0.08
Nodes (26): MIN_PAID_PRICE_PAISE, NOTE_PRICING_TYPES, NOTE_VISIBILITIES, CreateGroupInput, CreateGroupPayload, createGroupSchema, groupBaseSchema, priceRupeesSchema (+18 more)

### Community 18 - "Auth & Order Lookup APIs"
Cohesion: 0.14
Nodes (18): POST, runtime, POST, runtime, GET, POST, runtime, setAdminSessionCookie() (+10 more)

### Community 19 - "Public Content Pages"
Cohesion: 0.11
Nodes (18): AboutPage(), metadata, ContactPage(), ICON_MAP, metadata, GroupsPageRoute(), metadata, metadata (+10 more)

### Community 20 - "Note Detail & Badges"
Cohesion: 0.16
Nodes (16): NoteDetailPage(), LEVEL_BADGE, LevelBadge(), LevelBadgeProps, PRICING_BADGE, PricingBadge(), PricingBadgeProps, GroupCard() (+8 more)

### Community 21 - "Component Aliases"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 22 - "Admin Note Forms"
Cohesion: 0.13
Nodes (17): DynamicNoteForm, FileFieldSource, FileSource, NoteFormProps, FileAttachmentsSection(), FileAttachmentsSectionProps, FileFieldSource, FileSource (+9 more)

### Community 23 - "API Handler & Auth"
Cohesion: 0.19
Nodes (17): POST, runtime, ADMIN_SESSION_MAX_AGE_SECONDS, buildContext(), getClientIp(), handler(), headAdminHandler(), NextRouteArgs (+9 more)

### Community 24 - "Admin Management APIs"
Cohesion: 0.17
Nodes (8): GET, runtime, GET, runtime, Admin, AdminDoc, adminSchema, toAdminProfile()

### Community 25 - "Legal Static Pages"
Cohesion: 0.30
Nodes (11): metadata, metadata, metadata, StaticPage(), JsonLd(), safeStringifyJsonLd(), Accordion(), AccordionContent() (+3 more)

### Community 26 - "Sitemap & Categories"
Cohesion: 0.16
Nodes (9): safeQuery(), sitemap(), STATIC_PAGES, Category, CategoryDoc, categorySchema, createCategory(), deleteCategory() (+1 more)

### Community 27 - "File Upload & Category Schema"
Cohesion: 0.13
Nodes (14): FileUploadField(), FileUploadFieldProps, useDeleteUpload(), useFileUpload(), categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload, createCategorySchema (+6 more)

### Community 28 - "App Constants"
Cohesion: 0.12
Nodes (15): ADMIN_PAGE_LIMIT, ERROR_STATUS, FULFILLMENT_STATUS_LABELS, FULL_NAME_PATTERN, LEADS_EXPORT_MAX_ROWS, NOTE_LEVEL_LABELS, PAYMENT_STATUS_LABELS, PRICING_TYPE_LABELS (+7 more)

### Community 29 - "Web Manifest"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 30 - "Public Layout Components"
Cohesion: 0.22
Nodes (9): Footer(), FOOTER_LINKS, SOCIAL_LINKS, SocialLink, Navbar(), GithubIcon(), InstagramIcon(), XIcon() (+1 more)

### Community 31 - "API Client & Types"
Cohesion: 0.23
Nodes (7): ApiError, ApiResult, ErrorCode, AppProviders(), getErrorMessage(), QueryProvider(), ThemeProvider()

### Community 32 - "Checkout Components"
Cohesion: 0.31
Nodes (5): CheckoutPage(), GroupDetailPage(), useCreateOrder(), useGroup(), useNote()

### Community 33 - "Admin Schemas"
Cohesion: 0.22
Nodes (8): AdminLoginInput, AdminLoginPayload, adminLoginSchema, AdminRegisterInput, AdminRegisterPayload, adminRegisterSchema, UpdateOrderPayload, updateOrderSchema

### Community 34 - "Proxy Middleware"
Cohesion: 0.32
Nodes (7): ADMIN_SESSION_COOKIE, config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, unauthorizedJson()

### Community 35 - "Package Dependencies Core"
Cohesion: 0.29
Nodes (7): class-variance-authority, cloudinary, @hookform/resolvers, dependencies, class-variance-authority, cloudinary, @hookform/resolvers

### Community 36 - "Checkout Hooks & Schema"
Cohesion: 0.33
Nodes (5): checkoutSchema, CheckoutValues, CreateOrderPayload, CheckoutOrderResponse, PurchaseItemType

### Community 37 - "Layout Fonts"
Cohesion: 0.33
Nodes (5): caveat, instrumentSans, inter, metadata, outfit

### Community 38 - "Admin Shell Navigation"
Cohesion: 0.40
Nodes (3): metadata, AdminShell(), useAdminLogout()

### Community 39 - "Admin Dashboard Core"
Cohesion: 0.40
Nodes (3): metadata, AdminDashboard(), useDashboard()

### Community 41 - "Doctor Config"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

## Knowledge Gaps
- **287 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+282 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Admin UI Components` to `Admin Dashboard Pages`, `Order Admin UI`, `Admin Shell Navigation`, `Error Handling & Shell`, `Home Page Components`, `Note Detail & Badges`, `Legal Static Pages`, `Public Layout Components`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `ok()` connect `Admin Delete/Get Routes` to `Admin API Routes`, `Home & Format Utils`, `Public API CRUD Routes`, `Orders & Webhooks`, `Upload & Download APIs`, `Admin CRUD Route Handlers`, `Auth & Order Lookup APIs`, `API Handler & Auth`, `Admin Management APIs`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `AppError` connect `Upload & Download APIs` to `Public API CRUD Routes`, `Admin Delete/Get Routes`, `Orders & Webhooks`, `Admin CRUD Route Handlers`, `Auth & Order Lookup APIs`, `API Handler & Auth`, `Admin Management APIs`, `Sitemap & Categories`, `API Client & Types`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _287 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Dashboard Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.06049382716049383 - nodes in this community are weakly interconnected._
- **Should `Admin API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.05081081081081081 - nodes in this community are weakly interconnected._
- **Should `Home & Format Utils` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._