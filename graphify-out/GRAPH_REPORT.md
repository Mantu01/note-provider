# Graph Report - notes-provider  (2026-09-19)

## Corpus Check
- 211 files · ~51,802 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 993 nodes · 2790 edges · 78 communities (44 shown, 34 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Admin Layout
- Checkout Page
- Linting & Tests
- Admin CRUD APIs
- Admin API Routes
- Admin Dashboard Pages
- Admin Auth
- DOM Refs
- Admin Note APIs
- Admin Group Management
- Admin Category APIs
- Public Groups
- Admin Note Forms
- Home Page
- Pricing Constants
- Loading Components
- Components Index
- Notes Query Hooks
- Edit Group Page
- Order Detail Views
- About Page
- Contact Page
- Admin Dashboard
- Cloudinary Upload
- Admin Dashboard Widgets
- Note Detail
- Admin Category APIs
- Group Components
- App Layout
- PWA Manifest
- Static Pages
- Category Schema
- Next.js Config
- Razorpay Webhooks
- Home API
- Note MultiSelect
- Auth Proxy Middleware
- OG Group Image
- OG Note Image
- OG Home Image
- Doctor Config
- CSV Helper
- Next Config
- Database Seed
- OG Logo
- Base UI
- bcryptjs
- clsx / cva
- Cloudinary
- clsx
- dotenv
- ESLint
- React Hook Form
- jose
- Lucide Icons
- next-themes
- Third-party Scripts
- nuqs
- Prisma Adapter
- React
- React DOM
- react-hook-form
- react-markdown
- react-razorpay
- recharts
- rehype-katex
- rehype-raw
- remark-gfm
- remark-math
- shadcn/ui
- sonner
- tailwind-merge
- TanStack Query
- tw-animate-css
- Zod
- PostCSS

## God Nodes (most connected - your core abstractions)
1. `cn()` - 84 edges
2. `ok()` - 64 edges
3. `AppError` - 43 edges
4. `prisma` - 38 edges
5. `Button()` - 36 edges
6. `apiClient()` - 36 edges
7. `fail()` - 25 edges
8. `webpageJsonLd` - 23 edges
9. `handler()` - 20 edges
10. `APP_URL` - 18 edges

## Surprising Connections (you probably didn't know these)
- `AboutPage()` --calls--> `webpageJsonLd`  [EXTRACTED]
  src/app/(public)/about/page.tsx → src/components/seo/json-ld-helpers.ts
- `ContactPage()` --calls--> `webpageJsonLd`  [EXTRACTED]
  src/app/(public)/contact/page.tsx → src/components/seo/json-ld-helpers.ts
- `GET` --calls--> `ok()`  [EXTRACTED]
  src/app/api/admin/categories/route.ts → src/helpers/api-response.ts
- `GET` --indirect_call--> `toAdminOrder()`  [INFERRED]
  src/app/api/admin/orders/route.ts → src/helpers/mappers/order.mapper.ts
- `GET` --indirect_call--> `toPublicGroup()`  [INFERRED]
  src/app/api/groups/[slug]/route.ts → src/helpers/mappers/group.mapper.ts

## Import Cycles
- None detected.

## Communities (78 total, 34 thin omitted)

### Community 0 - "Admin Layout"
Cohesion: 0.07
Nodes (45): metadata, GlobalErrorProps, AdminShell(), isActiveLink(), NAV_ITEMS, Logo(), LogoProps, sizes (+37 more)

### Community 1 - "Checkout Page"
Cohesion: 0.08
Nodes (34): metadata, CheckoutContent(), CheckoutPage(), CheckoutSkeleton(), useCreateOrder(), useGroup(), useNote(), OrderLookupResponse (+26 more)

### Community 2 - "Linting & Tests"
Cohesion: 0.04
Nodes (47): eslint, eslint-config-next, @next/playwright, devDependencies, eslint, eslint-config-next, @next/playwright, @playwright/test (+39 more)

### Community 3 - "Admin CRUD APIs"
Cohesion: 0.16
Nodes (18): AdminRouteContext, buildContext(), getClientIp(), handler(), NextRouteArgs, parseZodError(), RouteContext, toAppError() (+10 more)

### Community 4 - "Admin API Routes"
Cohesion: 0.12
Nodes (34): GET, toAdminProfile(), toAdminCategory(), toAdminRef(), toCategoryRef(), toPublicCategory(), CategoryShape, toPublicNote() (+26 more)

### Community 5 - "Admin Dashboard Pages"
Cohesion: 0.18
Nodes (20): NotesTable(), OrdersTable(), PaginationBar(), StatusBadge(), StatusBadgeProps, Dialog(), DialogContent(), DialogDescription() (+12 more)

### Community 6 - "Admin Auth"
Cohesion: 0.11
Nodes (25): POST, POST, GET, POST, AdminSession, clearAdminSessionCookie(), requireAdmin(), requireHeadAdmin() (+17 more)

### Community 7 - "DOM Refs"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, ./generated/prisma/client, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+24 more)

### Community 8 - "Admin Note APIs"
Cohesion: 0.14
Nodes (25): GET, PATCH, GET, POST, GET, GET, GET, parseArrayParam() (+17 more)

### Community 9 - "Admin Group Management"
Cohesion: 0.12
Nodes (24): NoteFormContent(), CategoriesTable(), CategoryDialog(), GroupsTable(), NoteForm(), useCategoryDialogState(), useAdminCategories(), useAdminGroups() (+16 more)

### Community 10 - "Admin Category APIs"
Cohesion: 0.16
Nodes (22): GET, DELETE, DELETE, GET, DELETE, DELETE, GET, DELETE (+14 more)

### Community 11 - "Public Groups"
Cohesion: 0.18
Nodes (20): RootLayout(), GroupDetail(), GroupRouteProps, GroupWithRelations, NoteDetail(), NotePageProps, articleJsonLd(), breadcrumbJsonLd() (+12 more)

### Community 12 - "Admin Note Forms"
Cohesion: 0.11
Nodes (19): DynamicNoteForm, NoteFormProps, FileAttachmentsSection(), FileAttachmentsSectionProps, NoteDetailsSection(), NoteDetailsSectionProps, PricingVisibilitySection(), PricingVisibilitySectionProps (+11 more)

### Community 13 - "Home Page"
Cohesion: 0.09
Nodes (12): HomePage(), CategoryCard(), CATEGORY_ICON_OPTIONS, CATEGORY_ICONS, CategoryIcon(), useHome(), HOME_FAQS, HOME_STATS_CONFIG (+4 more)

### Community 14 - "Pricing Constants"
Cohesion: 0.10
Nodes (23): MIN_PAID_PRICE_PAISE, NOTE_PRICING_TYPES, NOTE_VISIBILITIES, CreateGroupInput, CreateGroupPayload, createGroupSchema, groupBaseSchema, refineGroup() (+15 more)

### Community 15 - "Loading Components"
Cohesion: 0.11
Nodes (10): AdminDashboardSkeleton(), GroupDetailSkeleton(), GroupsCatalogueSkeleton(), NoteDetailSkeleton(), NotesCatalogueSkeleton(), OrderStatusSkeleton(), ShimmerGroupCard(), ShimmerLoader() (+2 more)

### Community 16 - "Components Index"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 17 - "Notes Query Hooks"
Cohesion: 0.12
Nodes (19): NotesUrlState, parsers, DEFAULT_PAGE_LIMIT, ERROR_STATUS, LEADS_EXPORT_MAX_ROWS, MOBILE_NAV_LINKS, NAV_LINKS, NOTE_LEVELS (+11 more)

### Community 18 - "Edit Group Page"
Cohesion: 0.18
Nodes (13): GroupFormContent(), CategoryDialogProps, GroupForm(), GroupFormProps, SelectContent(), SelectItem(), SelectTrigger(), SelectValue() (+5 more)

### Community 19 - "Order Detail Views"
Cohesion: 0.16
Nodes (8): OrderRouteProps, OrderSuccessRouteProps, OrderDetailView(), OrderStatusPage(), CopyButton(), AdminOrderDetailSkeleton(), useOrder(), formatDateTime()

### Community 20 - "About Page"
Cohesion: 0.25
Nodes (13): AboutPage(), metadata, metadata, metadata, metadata, StaticPage(), Accordion(), AccordionContent() (+5 more)

### Community 21 - "Contact Page"
Cohesion: 0.14
Nodes (14): ContactChannel, ContactPage(), ICON_MAP, metadata, Footer(), FOOTER_LINKS, SOCIAL_LINKS, SocialLink (+6 more)

### Community 22 - "Admin Dashboard"
Cohesion: 0.18
Nodes (11): metadata, AdminDashboard(), RecentOrders(), RevenueChart(), GroupsPage(), EmptyState(), ErrorState(), ErrorStateProps (+3 more)

### Community 23 - "Cloudinary Upload"
Cohesion: 0.15
Nodes (13): POST, CloudinaryDeliveryType, CloudinaryResourceType, destroyAsset(), uploadBuffer(), UploadResult, deleteUpload(), uploadFile() (+5 more)

### Community 24 - "Admin Dashboard Widgets"
Cohesion: 0.23
Nodes (13): StatsGrid(), HeroSection(), lookupSchema, LookupValues, OrderLookupPage(), Card(), CardContent(), CardDescription() (+5 more)

### Community 25 - "Note Detail"
Cohesion: 0.20
Nodes (14): NoteDetailPage(), LEVEL_CLASS, LEVEL_LABEL, LevelBadge(), PRICING_CLASS, PricingBadge(), NoteCard(), NoteCardProps (+6 more)

### Community 26 - "Admin Category APIs"
Cohesion: 0.29
Nodes (12): PATCH, GET, POST, PATCH, GET, POST, adminHandler(), fail() (+4 more)

### Community 27 - "Group Components"
Cohesion: 0.21
Nodes (12): GroupDetailPage(), GroupCard(), codeComponents, codeTheme, MarkdownPreview(), rehypePlugins, remarkPlugins, PriceTag() (+4 more)

### Community 28 - "App Layout"
Cohesion: 0.13
Nodes (10): inter, metadata, outfit, viewport, metadata, safeQuery(), sitemap(), STATIC_PAGES (+2 more)

### Community 29 - "PWA Manifest"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 30 - "Static Pages"
Cohesion: 0.18
Nodes (12): HomePageRoute(), metadata, GroupsPageRoute(), metadata, metadata, NotesPage(), PrivacyPage(), RefundPolicyPage() (+4 more)

### Community 31 - "Category Schema"
Cohesion: 0.20
Nodes (9): categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload, createCategorySchema, SubjectInput, subjectSchema, UpdateCategoryInput, UpdateCategoryPayload (+1 more)

### Community 32 - "Next.js Config"
Cohesion: 0.22
Nodes (9): next, dependencies, next, pg, razorpay, react-syntax-highlighter, pg, razorpay (+1 more)

### Community 33 - "Razorpay Webhooks"
Cohesion: 0.42
Nodes (7): POST(), getRazorpayKeyId(), razorpay, requireEnv(), timingSafeCompare(), verifyPaymentSignature(), verifyWebhookSignature()

### Community 34 - "Home API"
Cohesion: 0.32
Nodes (6): EMPTY_HOME, GET, CategoryShape, NoteGroupShape, toPublicGroup(), AdminGroup

### Community 35 - "Note MultiSelect"
Cohesion: 0.39
Nodes (5): NoteMultiSelect(), NoteMultiSelectProps, Badge(), badgeVariants, useAdminNotes()

### Community 36 - "Auth Proxy Middleware"
Cohesion: 0.36
Nodes (7): config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, setSecurityHeaders(), unauthorizedJson()

### Community 37 - "OG Group Image"
Cohesion: 0.33
Nodes (4): contentType, height, Props, width

### Community 38 - "OG Note Image"
Cohesion: 0.33
Nodes (4): contentType, height, Props, width

### Community 39 - "OG Home Image"
Cohesion: 0.40
Nodes (3): contentType, height, width

### Community 40 - "Doctor Config"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

### Community 41 - "CSV Helper"
Cohesion: 0.67
Nodes (3): escapeCell(), FORMULA_PREFIXES, toCsv()

## Knowledge Gaps
- **241 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+236 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Admin Layout` to `Note MultiSelect`, `Admin Dashboard Pages`, `Admin Note Forms`, `Loading Components`, `Edit Group Page`, `About Page`, `Admin Dashboard`, `Admin Dashboard Widgets`, `Note Detail`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `ok()` connect `Admin Category APIs` to `Home API`, `Admin CRUD APIs`, `Admin API Routes`, `Admin Auth`, `Admin Note APIs`, `Cloudinary Upload`, `Admin Category APIs`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `Button()` connect `Admin Dashboard` to `Admin Layout`, `Checkout Page`, `Admin Dashboard Pages`, `Admin Note Forms`, `Home Page`, `Edit Group Page`, `Order Detail Views`, `Contact Page`, `Admin Dashboard Widgets`, `Note Detail`, `Group Components`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _241 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.06628621597892889 - nodes in this community are weakly interconnected._
- **Should `Checkout Page` be split into smaller, more focused modules?**
  _Cohesion score 0.07547169811320754 - nodes in this community are weakly interconnected._
- **Should `Linting & Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._