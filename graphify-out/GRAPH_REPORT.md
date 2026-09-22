# Graph Report - notes-provider  (2026-09-23)

## Corpus Check
- 209 files · ~53,322 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1001 nodes · 2819 edges · 83 communities (48 shown, 35 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Data Models & Schemas
- API Routes & Handlers
- React Hooks
- API Routes & Handlers
- UI Components
- Data Models & Schemas
- UI Components
- API Routes & Handlers
- API Routes & Handlers
- React Hooks
- React Hooks
- API Routes & Handlers
- API Routes & Handlers
- React Hooks
- React Hooks
- React Hooks
- API Routes & Handlers
- Data Models & Schemas
- API Routes & Handlers
- React Hooks
- React Hooks
- API Routes & Handlers
- API Routes & Handlers
- API Routes & Handlers
- React Hooks
- API Routes & Handlers
- UI Components
- React Hooks
- Auth & Middleware
- Group 29
- API Routes & Handlers
- React Hooks
- React Hooks
- React Hooks
- React Hooks
- Data Models & Schemas
- React Hooks
- Auth & Middleware
- React Hooks
- UI Components
- API Routes & Handlers
- API Routes & Handlers
- UI Components
- API Routes & Handlers
- API Routes & Handlers
- Data Models & Schemas
- Utilities
- Group 47
- API Routes & Handlers
- Group 49
- Auth & Middleware
- File Uploads
- Group 52
- Group 53
- Group 54
- React Hooks
- Group 56
- Group 57
- Group 58
- Group 59
- Group 60
- Group 61
- Data Models & Schemas
- Payments & Orders
- Group 64
- Group 65
- React Hooks
- Group 67
- Payments & Orders
- Group 69
- Group 70
- Group 71
- Group 72
- Group 73
- Group 74
- Group 75
- Group 76
- Group 77
- Group 78
- Group 79
- Group 80

## God Nodes (most connected - your core abstractions)
1. `cn()` - 86 edges
2. `ok()` - 64 edges
3. `AppError` - 43 edges
4. `prisma` - 39 edges
5. `Button()` - 37 edges
6. `apiClient()` - 36 edges
7. `fail()` - 25 edges
8. `webpageJsonLd` - 23 edges
9. `handler()` - 20 edges
10. `APP_URL` - 18 edges

## Surprising Connections (you probably didn't know these)
- `ContactPage()` --calls--> `webpageJsonLd`  [EXTRACTED]
  src/app/(public)/contact/page.tsx → src/components/seo/json-ld-helpers.ts
- `GET` --calls--> `ok()`  [EXTRACTED]
  src/app/api/admin/categories/route.ts → src/helpers/api-response.ts
- `GET` --indirect_call--> `toAdminOrder()`  [INFERRED]
  src/app/api/admin/orders/route.ts → src/helpers/mappers/order.mapper.ts
- `GET` --indirect_call--> `toPublicNote()`  [INFERRED]
  src/app/api/notes/[slug]/route.ts → src/helpers/mappers/note.mapper.ts
- `GET` --indirect_call--> `toPublicNote()`  [INFERRED]
  src/app/api/notes/route.ts → src/helpers/mappers/note.mapper.ts

## Import Cycles
- None detected.

## Communities (83 total, 35 thin omitted)

### Community 0 - "Data Models & Schemas"
Cohesion: 0.04
Nodes (47): eslint, eslint-config-next, @next/playwright, devDependencies, eslint, eslint-config-next, @next/playwright, @playwright/test (+39 more)

### Community 1 - "API Routes & Handlers"
Cohesion: 0.12
Nodes (37): GET, GET, StatsGrid(), HeroSection(), toAdminProfile(), toAdminCategory(), toAdminRef(), toCategoryRef() (+29 more)

### Community 2 - "React Hooks"
Cohesion: 0.14
Nodes (25): CategoriesTable(), GroupsTable(), NotesTable(), OrdersTable(), PaginationBar(), StatusBadge(), Dialog(), DialogContent() (+17 more)

### Community 3 - "API Routes & Handlers"
Cohesion: 0.16
Nodes (20): main(), seedDate, GET, POST, GET, GET, GET, GET (+12 more)

### Community 4 - "UI Components"
Cohesion: 0.13
Nodes (21): GlobalErrorProps, NAV_ITEMS, Logo(), LogoProps, sizes, ThemeToggle(), isActive(), Navbar() (+13 more)

### Community 5 - "Data Models & Schemas"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, ./generated/prisma/client, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+24 more)

### Community 6 - "UI Components"
Cohesion: 0.12
Nodes (19): LEVEL_CLASS, LEVEL_LABEL, LevelBadge(), PRICING_CLASS, PricingBadge(), GroupCard(), codeComponents, codeTheme (+11 more)

### Community 7 - "API Routes & Handlers"
Cohesion: 0.16
Nodes (18): DELETE, DELETE, GET, PATCH, DELETE, DELETE, GET, GET (+10 more)

### Community 8 - "API Routes & Handlers"
Cohesion: 0.15
Nodes (23): inter, metadata, outfit, RootLayout(), viewport, GroupDetail(), NoteDetail(), NotePageProps (+15 more)

### Community 9 - "React Hooks"
Cohesion: 0.15
Nodes (23): GroupFormContent(), NoteFormContent(), GroupForm(), NoteForm(), GroupsPage(), useAdminCategories(), useAdminGroup(), useAdminGroups() (+15 more)

### Community 10 - "React Hooks"
Cohesion: 0.15
Nodes (11): metadata, metadata, metadata, HomePage(), StaticPage(), Accordion(), AccordionContent(), AccordionItem() (+3 more)

### Community 11 - "API Routes & Handlers"
Cohesion: 0.10
Nodes (11): metadata, AdminDashboardSkeleton(), AdminOrderDetailSkeleton(), GroupsCatalogueSkeleton(), NotesCatalogueSkeleton(), OrderLookupSkeleton(), OrderStatusSkeleton(), ShimmerGroupCard() (+3 more)

### Community 12 - "API Routes & Handlers"
Cohesion: 0.16
Nodes (19): POST, POST, requireAdmin(), requireHeadAdmin(), setAdminSessionCookie(), AdminTokenPayload, getSecret(), signAdminToken() (+11 more)

### Community 13 - "React Hooks"
Cohesion: 0.15
Nodes (19): FilterPanel(), NoteSearchField(), PRICING_OPTIONS, ToggleKey, NotesCatalogue(), EmptyStateProps, CardAction(), CardFooter() (+11 more)

### Community 14 - "React Hooks"
Cohesion: 0.20
Nodes (14): OrderDetailView(), lookupSchema, LookupValues, OrderLookupPage(), OrderStatusPage(), CopyButton(), Card(), CardContent() (+6 more)

### Community 15 - "React Hooks"
Cohesion: 0.12
Nodes (18): DynamicNoteForm, NoteFormProps, FileAttachmentsSection(), FileAttachmentsSectionProps, NoteDetailsSection(), NoteDetailsSectionProps, PricingVisibilitySection(), PricingVisibilitySectionProps (+10 more)

### Community 16 - "API Routes & Handlers"
Cohesion: 0.12
Nodes (18): HomePageRoute(), metadata, AboutPage(), metadata, metadata, GroupsPageRoute(), metadata, metadata (+10 more)

### Community 17 - "Data Models & Schemas"
Cohesion: 0.11
Nodes (22): MIN_PAID_PRICE_PAISE, NOTE_PRICING_TYPES, NOTE_VISIBILITIES, CreateGroupInput, CreateGroupPayload, createGroupSchema, groupBaseSchema, refineGroup() (+14 more)

### Community 18 - "API Routes & Handlers"
Cohesion: 0.23
Nodes (17): PATCH, GET, POST, GET, POST, GET, PATCH, GET (+9 more)

### Community 19 - "React Hooks"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "React Hooks"
Cohesion: 0.20
Nodes (13): CategoryDialog(), CategoryDialogProps, GroupFormProps, NoteMultiSelect(), NoteMultiSelectProps, Input(), SelectContent(), SelectItem() (+5 more)

### Community 21 - "API Routes & Handlers"
Cohesion: 0.21
Nodes (17): GET, GET, NOTE_LEVEL_SET, parseArrayParam(), parseBooleanParam(), parseNumberParam(), SORTS, buildNoteFilter() (+9 more)

### Community 22 - "API Routes & Handlers"
Cohesion: 0.16
Nodes (14): POST, CloudinaryDeliveryType, CloudinaryResourceType, destroyAsset(), uploadBuffer(), UploadResult, deleteUpload(), uploadFile() (+6 more)

### Community 23 - "API Routes & Handlers"
Cohesion: 0.14
Nodes (14): GET, AdminRouteContext, buildContext(), getClientIp(), NextRouteArgs, parseZodError(), RouteContext, toAppError() (+6 more)

### Community 24 - "React Hooks"
Cohesion: 0.13
Nodes (17): NotesUrlState, parsers, DEFAULT_PAGE_LIMIT, HOME_FAQS, HOME_STATS_CONFIG, HOME_STEPS, HOME_TRUST_ITEMS, LEADS_EXPORT_MAX_ROWS (+9 more)

### Community 25 - "API Routes & Handlers"
Cohesion: 0.20
Nodes (13): DELETE, GET, POST(), generateOrderNumber(), createRazorpayOrder(), getRazorpayKeyId(), razorpay, requireEnv() (+5 more)

### Community 26 - "UI Components"
Cohesion: 0.14
Nodes (14): ContactChannel, ContactPage(), ICON_MAP, metadata, Footer(), FOOTER_LINKS, SOCIAL_LINKS, SocialLink (+6 more)

### Community 27 - "React Hooks"
Cohesion: 0.18
Nodes (12): CheckoutContent(), CheckoutPage(), GroupDetailPage(), NoteDetailPage(), useCreateOrder(), useGroup(), useNote(), CheckoutOrderResponse (+4 more)

### Community 28 - "Auth & Middleware"
Cohesion: 0.12
Nodes (16): AdminAuthResponse, AdminCategory, AdminGroup, AdminOrder, AdminProfile, AdminRef, ApiFailure, ApiSuccess (+8 more)

### Community 29 - "Group 29"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 30 - "API Routes & Handlers"
Cohesion: 0.14
Nodes (6): OrderRouteProps, OrderSuccessRouteProps, safeQuery(), sitemap(), STATIC_PAGES, APP_URL

### Community 31 - "React Hooks"
Cohesion: 0.22
Nodes (8): metadata, AdminDashboard(), RecentOrders(), RevenueChart(), EmptyState(), ErrorState(), ErrorStateProps, useDashboard()

### Community 32 - "React Hooks"
Cohesion: 0.21
Nodes (9): OrderLookupResponse, queryKeys, GroupDetailResponse, GroupsQuery, HomeResponse, NotesQuery, PaginatedData, PublicGroup (+1 more)

### Community 33 - "React Hooks"
Cohesion: 0.24
Nodes (8): ActiveFilterChips(), NoteCardProps, useFilters(), NOTE_LEVEL_LABELS, FiltersResponse, NoteDetailResponse, NoteLevel, PublicNote

### Community 34 - "React Hooks"
Cohesion: 0.27
Nodes (6): ApiError, ApiResult, AppProviders(), getErrorMessage(), QueryProvider(), ThemeProvider()

### Community 35 - "Data Models & Schemas"
Cohesion: 0.20
Nodes (9): categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload, createCategorySchema, SubjectInput, subjectSchema, UpdateCategoryInput, UpdateCategoryPayload (+1 more)

### Community 36 - "React Hooks"
Cohesion: 0.22
Nodes (9): @base-ui/react, @next/third-parties, nuqs, dependencies, @base-ui/react, @next/third-parties, nuqs, @tanstack/react-query (+1 more)

### Community 37 - "Auth & Middleware"
Cohesion: 0.36
Nodes (7): config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, setSecurityHeaders(), unauthorizedJson()

### Community 38 - "React Hooks"
Cohesion: 0.43
Nodes (6): PurchaseActions(), PdfPreviewDialog(), downloadFile(), extractDriveId(), triggerBlobDownload(), useDownloadFile()

### Community 39 - "UI Components"
Cohesion: 0.33
Nodes (5): CategoryCard(), CATEGORY_ICON_OPTIONS, CATEGORY_ICONS, CategoryIcon(), PublicCategory

### Community 40 - "API Routes & Handlers"
Cohesion: 0.33
Nodes (4): contentType, height, Props, width

### Community 41 - "API Routes & Handlers"
Cohesion: 0.33
Nodes (4): contentType, height, Props, width

### Community 42 - "UI Components"
Cohesion: 0.40
Nodes (3): metadata, AdminShell(), isActiveLink()

### Community 43 - "API Routes & Handlers"
Cohesion: 0.40
Nodes (3): contentType, height, width

### Community 45 - "Data Models & Schemas"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

### Community 46 - "Utilities"
Cohesion: 0.67
Nodes (3): escapeCell(), FORMULA_PREFIXES, toCsv()

## Knowledge Gaps
- **243 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+238 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `React Hooks` to `API Routes & Handlers`, `React Hooks`, `UI Components`, `React Hooks`, `UI Components`, `UI Components`, `API Routes & Handlers`, `React Hooks`, `React Hooks`, `React Hooks`, `React Hooks`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `ok()` connect `API Routes & Handlers` to `API Routes & Handlers`, `API Routes & Handlers`, `API Routes & Handlers`, `API Routes & Handlers`, `API Routes & Handlers`, `API Routes & Handlers`, `API Routes & Handlers`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `AppError` connect `API Routes & Handlers` to `API Routes & Handlers`, `API Routes & Handlers`, `API Routes & Handlers`, `API Routes & Handlers`, `API Routes & Handlers`, `API Routes & Handlers`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _243 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Data Models & Schemas` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `API Routes & Handlers` be split into smaller, more focused modules?**
  _Cohesion score 0.1178743961352657 - nodes in this community are weakly interconnected._
- **Should `React Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.13704994192799072 - nodes in this community are weakly interconnected._