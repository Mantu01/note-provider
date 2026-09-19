# Graph Report - src  (2026-09-18)

## Corpus Check
- Corpus is ~45,423 words - fits in a single context window. You may not need a graph.

## Summary
- 805 nodes · 2620 edges · 44 communities (43 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Admin Note Forms
- Group Detail Page
- API Routes — Admin
- Admin Dashboard Pages
- Public API Handlers
- Admin Dialogs & Forms
- Order API Routes
- Homepage Components
- Data Hooks & Query Keys
- Loading & Layout Skeletons
- Root Layout & Group Routes
- Category API Routes
- Filter & Search UI
- Admin Layout & Error Boundaries
- Admin Home Page
- Detail & Catalogue Views
- Note API Routes
- Admin Order Management
- Static Public Pages
- Status & Level Badges
- Note Edit Pages
- Payment & Checkout APIs
- App Constants
- Home Page Route
- Contact Page
- Checkout Page
- Fonts & Root Font Config
- Navigation Bar
- API Client Library
- Admin Data Hooks
- Multi-Select & Status Badges
- Auth Schemas & Config
- Category Schemas
- Group Edit Pages
- Razorpay Payment Integration
- Admin Auth Middleware
- Group Mapper
- OG Image — Note
- OG Image — Group
- Checkout Route
- OG Image — Logo
- Order Tracking Page
- CSV Utilities
- OG Image — Home

## God Nodes (most connected - your core abstractions)
1. `cn()` - 84 edges
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
- `AboutPage()` --calls--> `webpageJsonLd`  [EXTRACTED]
  src/app/(public)/about/page.tsx → src/components/seo/json-ld-helpers.ts
- `ContactPage()` --calls--> `webpageJsonLd`  [EXTRACTED]
  src/app/(public)/contact/page.tsx → src/components/seo/json-ld-helpers.ts
- `GET` --indirect_call--> `toAdminGroup()`  [INFERRED]
  src/app/api/admin/groups/route.ts → src/helpers/mappers/group.mapper.ts
- `GET` --indirect_call--> `toAdminNote()`  [INFERRED]
  src/app/api/admin/notes/route.ts → src/helpers/mappers/note.mapper.ts
- `GET` --indirect_call--> `toAdminOrder()`  [INFERRED]
  src/app/api/admin/orders/route.ts → src/helpers/mappers/order.mapper.ts

## Import Cycles
- None detected.

## Communities (44 total, 1 thin omitted)

### Community 0 - "Admin Note Forms"
Cohesion: 0.05
Nodes (46): DynamicNoteForm, FileFieldSource, FileSource, NoteFormProps, FileAttachmentsSection(), FileAttachmentsSectionProps, FileFieldSource, FileSource (+38 more)

### Community 1 - "Group Detail Page"
Cohesion: 0.12
Nodes (38): GET, GroupDetailPage(), PriceTag(), toAdminProfile(), toAdminCategory(), toAdminRef(), toCategoryRef(), toPublicCategory() (+30 more)

### Community 2 - "API Routes — Admin"
Cohesion: 0.17
Nodes (20): PATCH, POST, POST, EMPTY_HOME, adminHandler(), AdminRouteContext, buildContext(), getClientIp() (+12 more)

### Community 3 - "Admin Dashboard Pages"
Cohesion: 0.16
Nodes (19): CategoriesTable(), GroupsTable(), NotesTable(), OrdersTable(), PaginationBar(), StatusBadge(), DialogFooter(), Table() (+11 more)

### Community 4 - "Public API Handlers"
Cohesion: 0.14
Nodes (25): GET, DELETE, GET, GET, DELETE, GET, PATCH, DELETE (+17 more)

### Community 5 - "Admin Dialogs & Forms"
Cohesion: 0.14
Nodes (18): CategoryDialog(), CategoryDialogProps, GroupFormProps, PRICING_OPTIONS, ToggleKey, Checkbox(), Input(), Label() (+10 more)

### Community 6 - "Order API Routes"
Cohesion: 0.15
Nodes (16): DELETE, POST, GET, GET, buildSignedUrl(), CloudinaryDeliveryType, CloudinaryResourceType, uploadBuffer() (+8 more)

### Community 7 - "Homepage Components"
Cohesion: 0.09
Nodes (14): HeroSection(), HomePage(), CategoryCard(), CATEGORY_ICON_OPTIONS, CATEGORY_ICONS, CategoryIcon(), useHome(), HOME_FAQS (+6 more)

### Community 8 - "Data Hooks & Query Keys"
Cohesion: 0.12
Nodes (22): NoteCardProps, queryKeys, AdminAuthResponse, AdminRef, ApiFailure, ApiSuccess, CategoryRef, FiltersResponse (+14 more)

### Community 9 - "Loading & Layout Skeletons"
Cohesion: 0.10
Nodes (11): Footer(), AdminDashboardSkeleton(), GroupDetailSkeleton(), GroupsCatalogueSkeleton(), NoteDetailSkeleton(), NotesCatalogueSkeleton(), OrderStatusSkeleton(), ShimmerGroupCard() (+3 more)

### Community 10 - "Root Layout & Group Routes"
Cohesion: 0.18
Nodes (20): RootLayout(), GroupDetail(), GroupRouteProps, GroupWithRelations, NoteDetail(), NotePageProps, articleJsonLd(), breadcrumbJsonLd() (+12 more)

### Community 11 - "Category API Routes"
Cohesion: 0.17
Nodes (17): POST, POST, GET, POST, AdminSession, clearAdminSessionCookie(), requireAdmin(), requireHeadAdmin() (+9 more)

### Community 12 - "Filter & Search UI"
Cohesion: 0.14
Nodes (19): ActiveFilterChips(), FilterPanel(), NoteSearchField(), NotesCatalogue(), Sheet(), SheetClose(), SheetContent(), SheetDescription() (+11 more)

### Community 13 - "Admin Layout & Error Boundaries"
Cohesion: 0.15
Nodes (12): metadata, GlobalErrorProps, AdminShell(), isActiveLink(), NAV_ITEMS, Logo(), LogoProps, sizes (+4 more)

### Community 14 - "Admin Home Page"
Cohesion: 0.16
Nodes (15): metadata, AdminDashboard(), RecentOrders(), RevenueChart(), STAT_CARDS, StatsGrid(), lookupSchema, LookupValues (+7 more)

### Community 15 - "Detail & Catalogue Views"
Cohesion: 0.16
Nodes (16): NoteDetailPage(), EmptyState(), ErrorState(), ErrorStateProps, GroupCard(), codeComponents, codeTheme, MarkdownPreview() (+8 more)

### Community 16 - "Note API Routes"
Cohesion: 0.23
Nodes (15): GET, GET, GET, GET, GET, parseArrayParam(), parseBooleanParam(), parseNumberParam() (+7 more)

### Community 17 - "Admin Order Management"
Cohesion: 0.15
Nodes (9): OrderRouteProps, OrderSuccessRouteProps, OrderDetailView(), OrderStatusPage(), CopyButton(), AdminOrderDetailSkeleton(), useAdminOrder(), useUpdateOrderFulfillment() (+1 more)

### Community 18 - "Static Public Pages"
Cohesion: 0.25
Nodes (13): AboutPage(), metadata, metadata, metadata, metadata, StaticPage(), Accordion(), AccordionContent() (+5 more)

### Community 19 - "Status & Level Badges"
Cohesion: 0.20
Nodes (15): LEVEL_CLASS, LEVEL_LABEL, LevelBadge(), PRICING_CLASS, PricingBadge(), EmptyStateProps, Empty(), EmptyContent() (+7 more)

### Community 20 - "Note Edit Pages"
Cohesion: 0.18
Nodes (14): NoteFormContent(), NoteForm(), FileUploadField(), FileUploadFieldProps, useAdminCategories(), useAdminNote(), useCreateNote(), useDeleteUpload() (+6 more)

### Community 21 - "Payment & Checkout APIs"
Cohesion: 0.22
Nodes (10): GET, POST, POST, generateOrderNumber(), Bucket, enforceRateLimit(), globalStore, createRazorpayOrder() (+2 more)

### Community 22 - "App Constants"
Cohesion: 0.12
Nodes (16): ERROR_STATUS, LEADS_EXPORT_MAX_ROWS, MAX_PAGE_LIMIT, MOBILE_NAV_LINKS, NAV_LINKS, NOTE_LEVEL_LABELS, NOTE_SORT_LABELS, ORDER_CURRENCY (+8 more)

### Community 23 - "Home Page Route"
Cohesion: 0.17
Nodes (13): HomePageRoute(), metadata, GroupsPageRoute(), metadata, metadata, NotesPage(), PrivacyPage(), RefundPolicyPage() (+5 more)

### Community 24 - "Contact Page"
Cohesion: 0.17
Nodes (13): ContactChannel, ContactPage(), ICON_MAP, metadata, FOOTER_LINKS, SOCIAL_LINKS, SocialLink, GithubIcon() (+5 more)

### Community 25 - "Checkout Page"
Cohesion: 0.24
Nodes (9): CheckoutPage(), useCreateOrder(), useGroup(), useNote(), CheckoutOrderResponse, PurchaseItemType, checkoutSchema, CheckoutValues (+1 more)

### Community 26 - "Fonts & Root Font Config"
Cohesion: 0.18
Nodes (8): inter, metadata, outfit, viewport, safeQuery(), sitemap(), STATIC_PAGES, APP_URL

### Community 27 - "Navigation Bar"
Cohesion: 0.35
Nodes (8): isActive(), Navbar(), Dialog(), DialogContent(), DialogDescription(), DialogHeader(), DialogTitle(), DialogTrigger()

### Community 28 - "API Client Library"
Cohesion: 0.23
Nodes (7): ApiError, ApiResult, ErrorCode, AppProviders(), getErrorMessage(), QueryProvider(), ThemeProvider()

### Community 29 - "Admin Data Hooks"
Cohesion: 0.27
Nodes (10): useAdminGroups(), useAdminOrders(), useGroups(), useNotes(), OrderLookupResponse, useOrder(), useOrderLookup(), apiClient() (+2 more)

### Community 30 - "Multi-Select & Status Badges"
Cohesion: 0.31
Nodes (6): NoteMultiSelect(), NoteMultiSelectProps, StatusBadgeProps, Badge(), badgeVariants, useAdminNotes()

### Community 31 - "Auth Schemas & Config"
Cohesion: 0.20
Nodes (9): FULFILLMENT_STATUSES, AdminLoginInput, AdminLoginPayload, adminLoginSchema, AdminRegisterInput, AdminRegisterPayload, adminRegisterSchema, UpdateOrderPayload (+1 more)

### Community 32 - "Category Schemas"
Cohesion: 0.20
Nodes (9): categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload, createCategorySchema, SubjectInput, subjectSchema, UpdateCategoryInput, UpdateCategoryPayload (+1 more)

### Community 33 - "Group Edit Pages"
Cohesion: 0.25
Nodes (5): GroupFormContent(), GroupForm(), useAdminGroup(), useCreateGroup(), useUpdateGroup()

### Community 34 - "Razorpay Payment Integration"
Cohesion: 0.42
Nodes (7): POST(), getRazorpayKeyId(), razorpay, requireEnv(), timingSafeCompare(), verifyPaymentSignature(), verifyWebhookSignature()

### Community 35 - "Admin Auth Middleware"
Cohesion: 0.36
Nodes (7): config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, setSecurityHeaders(), unauthorizedJson()

### Community 36 - "Group Mapper"
Cohesion: 0.38
Nodes (5): GET, GET, CategoryShape, NoteGroupShape, toPublicGroup()

### Community 37 - "OG Image — Note"
Cohesion: 0.33
Nodes (4): contentType, height, Props, width

### Community 38 - "OG Image — Group"
Cohesion: 0.33
Nodes (4): contentType, height, Props, width

### Community 39 - "Checkout Route"
Cohesion: 0.40
Nodes (3): metadata, CheckoutContent(), CheckoutSkeleton()

### Community 40 - "OG Image — Logo"
Cohesion: 0.40
Nodes (3): contentType, height, width

### Community 41 - "Order Tracking Page"
Cohesion: 0.40
Nodes (3): metadata, OrderLookupPage(), OrderLookupSkeleton()

### Community 42 - "CSV Utilities"
Cohesion: 0.67
Nodes (3): escapeCell(), FORMULA_PREFIXES, toCsv()

## Knowledge Gaps
- **123 isolated node(s):** `metadata`, `metadata`, `ICON_MAP`, `metadata`, `ContactChannel` (+118 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Status & Level Badges` to `Admin Dashboard Pages`, `Admin Dialogs & Forms`, `Loading & Layout Skeletons`, `Filter & Search UI`, `Admin Layout & Error Boundaries`, `Admin Home Page`, `Detail & Catalogue Views`, `Static Public Pages`, `Navigation Bar`, `Multi-Select & Status Badges`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `ok()` connect `Public API Handlers` to `Group Detail Page`, `API Routes — Admin`, `Group Mapper`, `Order API Routes`, `Category API Routes`, `Note API Routes`, `Payment & Checkout APIs`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `Button()` connect `Admin Layout & Error Boundaries` to `Admin Note Forms`, `Admin Dashboard Pages`, `Admin Dialogs & Forms`, `Homepage Components`, `Filter & Search UI`, `Admin Home Page`, `Detail & Catalogue Views`, `Admin Order Management`, `Status & Level Badges`, `Note Edit Pages`, `Contact Page`, `Checkout Page`, `Navigation Bar`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `metadata`, `metadata`, `ICON_MAP` to the rest of the system?**
  _123 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Note Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.05079825834542816 - nodes in this community are weakly interconnected._
- **Should `Group Detail Page` be split into smaller, more focused modules?**
  _Cohesion score 0.1246376811594203 - nodes in this community are weakly interconnected._
- **Should `Public API Handlers` be split into smaller, more focused modules?**
  _Cohesion score 0.14015151515151514 - nodes in this community are weakly interconnected._