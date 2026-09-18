# Graph Report - notes-provider  (2026-09-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1052 nodes · 2865 edges · 81 communities (47 shown, 34 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `58658745`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- devDependencies
- notes-table.tsx
- ok
- cn
- button.tsx
- note-detail-page.tsx
- webpageJsonLd
- compilerOptions
- login/route.ts
- json-ld.tsx
- query.ts
- AppError
- shimmer-loader.tsx
- Notes Provider
- order-status-page.tsx
- constants.ts
- db.ts
- useAdmin.ts
- note.schema.ts
- components.json
- home-page.tsx
- apiClient
- .notFound
- api/orders/route.ts
- footer.tsx
- manifest.json
- checkout-page.tsx
- admin-dashboard.tsx
- APP_URL
- enforceRateLimit
- empty-state.tsx
- app-providers.tsx
- category.schema.ts
- dependencies
- order/[orderId]/page.tsx
- group/[slug]/route.tsx
- note/[slug]/route.tsx
- checkout/[slug]/page.tsx
- groups/[id]/edit/page.tsx
- AdminShell
- OrderDetailView
- home/route.tsx
- doctor.config.json
- note-multi-select.tsx
- csv.ts
- next.config.ts
- logo/route.tsx
- bcryptjs
- class-variance-authority
- cloudinary
- clsx
- date-fns
- dotenv
- eslint.config.mjs
- @hookform/resolvers
- jose
- lucide-react
- next
- next-themes
- pg
- @prisma/adapter-pg
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
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 90 edges
2. `ok()` - 64 edges
3. `AppError` - 43 edges
4. `prisma` - 39 edges
5. `apiClient()` - 38 edges
6. `Button()` - 35 edges
7. `fail()` - 25 edges
8. `webpageJsonLd` - 23 edges
9. `handler()` - 21 edges
10. `APP_URL` - 18 edges

## Surprising Connections (you probably didn't know these)
- `GET` --indirect_call--> `toAdminNote()`  [INFERRED]
  src/app/api/admin/notes/route.ts → src/helpers/mappers/note.mapper.ts
- `GET` --indirect_call--> `toPublicNote()`  [INFERRED]
  src/app/api/home/route.ts → src/helpers/mappers/note.mapper.ts
- `GET` --indirect_call--> `toPublicNote()`  [INFERRED]
  src/app/api/notes/route.ts → src/helpers/mappers/note.mapper.ts
- `GET` --indirect_call--> `toPublicNote()`  [INFERRED]
  src/app/api/notes/[slug]/route.ts → src/helpers/mappers/note.mapper.ts
- `GET` --indirect_call--> `toAdminOrder()`  [INFERRED]
  src/app/api/admin/orders/route.ts → src/helpers/mappers/order.mapper.ts

## Import Cycles
- None detected.

## Communities (81 total, 34 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.06
Nodes (59): CategoryCard(), CATEGORY_ICON_OPTIONS, CATEGORY_ICONS, CategoryIcon(), toAdminProfile(), toAdminRef(), toCategoryRef(), CategoryShape (+51 more)

### Community 1 - "devDependencies"
Cohesion: 0.04
Nodes (47): eslint, eslint-config-next, @next/playwright, devDependencies, eslint, eslint-config-next, @next/playwright, @playwright/test (+39 more)

### Community 2 - "notes-table.tsx"
Cohesion: 0.12
Nodes (27): CategoriesTable(), GroupsTable(), NotesTable(), OrdersTable(), PaginationBar(), Dialog(), DialogContent(), DialogDescription() (+19 more)

### Community 3 - "ok"
Cohesion: 0.13
Nodes (24): GET, POST, GET, GET, GET, GET, GET, EMPTY_HOME (+16 more)

### Community 4 - "cn"
Cohesion: 0.12
Nodes (28): CategoryDialogProps, GroupFormProps, FileAttachmentsSectionProps, FileFieldSource, FileSource, NoteDetailsSectionProps, PricingVisibilitySectionProps, ServerErrorBannerProps (+20 more)

### Community 5 - "button.tsx"
Cohesion: 0.12
Nodes (24): GlobalErrorProps, NAV_ITEMS, Logo(), LogoProps, sizes, ThemeToggle(), isActive(), Navbar() (+16 more)

### Community 6 - "note-detail-page.tsx"
Cohesion: 0.12
Nodes (25): GroupDetailPage(), NoteDetailPage(), LEVEL_CLASS, LEVEL_LABEL, LevelBadge(), PRICING_CLASS, PricingBadge(), GroupCard() (+17 more)

### Community 7 - "webpageJsonLd"
Cohesion: 0.13
Nodes (26): AboutPage(), metadata, ContactChannel, ContactPage(), ICON_MAP, metadata, metadata, NotesPage() (+18 more)

### Community 8 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, ./generated/prisma/client, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+24 more)

### Community 9 - "login/route.ts"
Cohesion: 0.11
Nodes (24): POST, GET, POST, AdminSession, requireAdmin(), requireHeadAdmin(), setAdminSessionCookie(), AdminTokenPayload (+16 more)

### Community 10 - "json-ld.tsx"
Cohesion: 0.13
Nodes (25): inter, metadata, outfit, RootLayout(), viewport, GroupDetail(), GroupRouteProps, GroupWithRelations (+17 more)

### Community 11 - "query.ts"
Cohesion: 0.12
Nodes (25): GET, GET, GET, GET, GET, parseArrayParam(), parseBooleanParam(), parseNumberParam() (+17 more)

### Community 12 - "AppError"
Cohesion: 0.13
Nodes (19): DELETE, POST, GET, GET, buildSignedUrl(), CloudinaryDeliveryType, CloudinaryResourceType, uploadBuffer() (+11 more)

### Community 13 - "shimmer-loader.tsx"
Cohesion: 0.09
Nodes (13): metadata, OrderLookupPage(), AdminDashboardSkeleton(), AdminOrderDetailSkeleton(), GroupDetailSkeleton(), GroupsCatalogueSkeleton(), NotesCatalogueSkeleton(), OrderLookupSkeleton() (+5 more)

### Community 14 - "Notes Provider"
Cohesion: 0.07
Nodes (26): Adding a First Admin Account, Available Scripts, Buying Notes, Deploy on Vercel (Recommended), Deployment, Docker, Environment Variables, For Buyers (+18 more)

### Community 15 - "order-status-page.tsx"
Cohesion: 0.17
Nodes (18): STAT_CARDS, StatsGrid(), lookupSchema, LookupValues, CopyButton(), StatusBadge(), StatusBadgeProps, Card() (+10 more)

### Community 16 - "constants.ts"
Cohesion: 0.08
Nodes (25): ERROR_STATUS, FULFILLMENT_STATUS_LABELS, LEADS_EXPORT_MAX_ROWS, MIN_PAID_PRICE_PAISE, MOBILE_NAV_LINKS, NAV_LINKS, NOTE_LEVEL_LABELS, NOTE_LEVELS_ARRAY (+17 more)

### Community 17 - "db.ts"
Cohesion: 0.15
Nodes (20): main(), seedDate, PATCH, POST, GET, PATCH, POST, adminHandler() (+12 more)

### Community 18 - "useAdmin.ts"
Cohesion: 0.12
Nodes (20): DynamicNoteForm, CategoryDialog(), FileFieldSource, FileSource, NoteForm(), NoteFormProps, FileAttachmentsSection(), NoteDetailsSection() (+12 more)

### Community 19 - "note.schema.ts"
Cohesion: 0.09
Nodes (22): NOTE_PRICING_TYPES, config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, setSecurityHeaders(), unauthorizedJson() (+14 more)

### Community 20 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 21 - "home-page.tsx"
Cohesion: 0.11
Nodes (9): HeroSection(), HomePage(), useHome(), HOME_FAQS, HOME_STATS_CONFIG, HOME_STEPS, HOME_TRUST_ITEMS, formatCompactNumber() (+1 more)

### Community 22 - "apiClient"
Cohesion: 0.23
Nodes (14): useAdminGroups(), useAdminOrders(), useFileUpload(), useGroups(), useNotes(), OrderLookupResponse, useOrder(), useOrderLookup() (+6 more)

### Community 23 - ".notFound"
Cohesion: 0.19
Nodes (14): DELETE, DELETE, DELETE, GET, PATCH, DELETE, GET, PATCH (+6 more)

### Community 24 - "api/orders/route.ts"
Cohesion: 0.24
Nodes (11): POST, POST(), generateOrderNumber(), createRazorpayOrder(), getRazorpayKeyId(), razorpay, requireEnv(), timingSafeCompare() (+3 more)

### Community 25 - "footer.tsx"
Cohesion: 0.17
Nodes (11): HomePageRoute(), metadata, Footer(), FOOTER_LINKS, SOCIAL_LINKS, SocialLink, GithubIcon(), InstagramIcon() (+3 more)

### Community 26 - "manifest.json"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 27 - "checkout-page.tsx"
Cohesion: 0.26
Nodes (8): CheckoutPage(), useCreateOrder(), useNote(), CheckoutOrderResponse, PurchaseItemType, checkoutSchema, CheckoutValues, CreateOrderPayload

### Community 28 - "admin-dashboard.tsx"
Cohesion: 0.17
Nodes (10): NoteFormContent(), metadata, AdminDashboard(), RecentOrders(), RevenueChart(), EmptyState(), ErrorState(), ErrorStateProps (+2 more)

### Community 29 - "APP_URL"
Cohesion: 0.20
Nodes (7): GroupsPageRoute(), metadata, safeQuery(), sitemap(), STATIC_PAGES, GroupsPage(), APP_URL

### Community 30 - "enforceRateLimit"
Cohesion: 0.29
Nodes (7): GET, POST, Bucket, enforceRateLimit(), globalStore, prune(), getOrderByNumber()

### Community 31 - "empty-state.tsx"
Cohesion: 0.36
Nodes (8): EmptyStateProps, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 32 - "app-providers.tsx"
Cohesion: 0.24
Nodes (6): ApiError, ErrorCode, AppProviders(), getErrorMessage(), QueryProvider(), ThemeProvider()

### Community 33 - "category.schema.ts"
Cohesion: 0.20
Nodes (9): categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload, createCategorySchema, SubjectInput, subjectSchema, UpdateCategoryInput, UpdateCategoryPayload (+1 more)

### Community 34 - "dependencies"
Cohesion: 0.22
Nodes (9): @base-ui/react, @next/third-parties, nuqs, dependencies, @base-ui/react, @next/third-parties, nuqs, @tanstack/react-query (+1 more)

### Community 35 - "order/[orderId]/page.tsx"
Cohesion: 0.22
Nodes (3): OrderRouteProps, OrderSuccessRouteProps, OrderStatusPage()

### Community 37 - "group/[slug]/route.tsx"
Cohesion: 0.33
Nodes (4): contentType, height, Props, width

### Community 38 - "note/[slug]/route.tsx"
Cohesion: 0.33
Nodes (4): contentType, height, Props, width

### Community 39 - "checkout/[slug]/page.tsx"
Cohesion: 0.40
Nodes (3): metadata, CheckoutContent(), CheckoutSkeleton()

### Community 40 - "groups/[id]/edit/page.tsx"
Cohesion: 0.25
Nodes (5): GroupFormContent(), GroupForm(), useAdminGroup(), useCreateGroup(), useUpdateGroup()

### Community 41 - "AdminShell"
Cohesion: 0.40
Nodes (3): metadata, AdminShell(), isActiveLink()

### Community 42 - "OrderDetailView"
Cohesion: 0.40
Nodes (3): OrderDetailView(), useAdminOrder(), useUpdateOrderFulfillment()

### Community 43 - "home/route.tsx"
Cohesion: 0.40
Nodes (3): contentType, height, width

### Community 44 - "doctor.config.json"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

### Community 45 - "note-multi-select.tsx"
Cohesion: 0.67
Nodes (3): NoteMultiSelect(), NoteMultiSelectProps, useAdminNotes()

### Community 46 - "csv.ts"
Cohesion: 0.67
Nodes (3): escapeCell(), FORMULA_PREFIXES, toCsv()

## Knowledge Gaps
- **277 isolated node(s):** `CategoryShape`, `Lean`, `AdminAuthResponse`, `NoteDeleteResponse`, `OrderSummary` (+272 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `notes-table.tsx`, `button.tsx`, `note-detail-page.tsx`, `webpageJsonLd`, `AdminShell`, `shimmer-loader.tsx`, `order-status-page.tsx`, `empty-state.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `ok()` connect `ok` to `login/route.ts`, `query.ts`, `AppError`, `db.ts`, `.notFound`, `api/orders/route.ts`, `enforceRateLimit`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `prisma` connect `db.ts` to `types.ts`, `ok`, `order/[orderId]/page.tsx`, `login/route.ts`, `json-ld.tsx`, `query.ts`, `AppError`, `.notFound`, `api/orders/route.ts`, `APP_URL`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `CategoryShape`, `Lean`, `AdminAuthResponse` to the rest of the system?**
  _277 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06335403726708075 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `notes-table.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11884057971014493 - nodes in this community are weakly interconnected._