# Graph Report - notes-provider  (2026-08-29)

## Corpus Check
- 452 files · ~181,291 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1624 nodes · 4971 edges · 140 communities (79 shown, 61 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Admin Activity & Leads API
- Admin CRUD API Routes
- Note Creation UI
- Admin Dashboard Pages
- Upload & Download API
- Constants & Enums
- Order Lookup API
- Admin Hooks (API)
- Category Management API
- Admin Notes API
- Brand & Logo Components
- Layout & Form UI
- Admin User Management API
- Public Group APIs
- Public Pages (Home/Groups)
- Formatting Utilities
- TypeScript Lib DOM
- Order Creation API
- Order State Hooks
- Shared UI Components
- Navigation & Routing
- Seed Data & DB Setup
- Card Components
- Dashboard State Hooks
- Admin Login Page
- API Runtime Helpers
- Dialog Components
- Note Edit UI
- Error State Components
- Component Aliases
- Legal & Policy Pages
- Global Error Handling
- Group Edit UI
- Group Pages & Metadata
- Public Layout & Footer
- Seed Data Functions
- Admin Layout
- PWA Manifest
- Zod Validation Schemas
- Admin Categories Pages
- File Upload Fields
- Pagination Components
- About Page
- Revenue Chart Component
- Empty State Components
- Next.js Dependencies
- Admin Order Hooks
- Category Schema
- Dynamic API Routes
- App Providers
- Build & Dev Scripts
- Filter Chips
- Admin Order Detail Page
- Checkout Page
- Home Page Hooks
- Counter Model
- React Core Dependencies
- Admin Orders Table
- Admin Pages
- Proxy & Auth Config
- Buy Model & Storage
- Inter Font & Metadata
- Content Type Helpers
- Section Containers
- Note Card Component
- Group Detail Tests
- Admin Test Helpers
- ESLint Configuration
- Package Config
- Performance Stack
- Notes Page
- Order Tracking Page
- Legal Policies
- New Group Page Tests
- Authority Module
- Cloudinary Integration
- clsx Utility
- Date FNS Utilities
- ESLint Core
- ESLint Config
- Form Resolvers
- JSDOM Environment
- Next Config
- Theme Provider
- Theme Registry
- PartyKit Events
- Nodemailer Integration
- Bcryptjs Hashing
- Jose JWT Library
- Nuqs URL State
- Razorpay Payments
- React Hooks
- DOM Testing
- React Forms
- Razorpay SDK
- Recharts Charts
- shadcn/ui Components
- Sonner Toaster
- Deep Merge Utility
- TanStack Query
- Tailwind CSS
- Zod Validation
- Type Doctor Utility
- PostCSS Processing
- DOM Polyfill
- React Animations
- Event Utilities
- Password Hashing
- Node Utilities
- Email Transport
- React Server
- TypeScript Config
- React Testing
- Vitest Runner
- Mock Helpers
- Dependency Hardening
- Vitest Config
- Auth Strategy
- Vercel Deploy
- Docker Compose
- System Architecture
- App Provider Pattern
- pnpm Workspace
- Monorepo Structure
- Deployment Config
- Test Suite
- File Icons
- Globe Icon
- Window Icon

## God Nodes (most connected - your core abstractions)
1. `cn()` - 102 edges
2. `ok()` - 74 edges
3. `AppError` - 58 edges
4. `apiClient()` - 54 edges
5. `logActivity()` - 50 edges
6. `Note` - 48 edges
7. `Button()` - 43 edges
8. `Group` - 34 edges
9. `fail()` - 31 edges
10. `Order` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Vercel Logo SVG` --references--> `Vercel Deployment`  [INFERRED]
  public/vercel.svg → README.md
- `Next.js Logo SVG` --references--> `Next.js 16 + React 19 Stack`  [INFERRED]
  public/next.svg → README.md
- `seed()` --calls--> `connectDb()`  [EXTRACTED]
  seed.ts → src/server/db/connect.ts
- `mountHook()` --calls--> `useDownloadFile()`  [EXTRACTED]
  tests/hooks/use-download-file.test.tsx → src/hooks/use-download-file.ts
- `loginHandler` --calls--> `ok()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/lib/api-response.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Buy Flow Sequence** — readme_buymodel, readme_razorpay_payment, readme_cloudinary_storage, readme_note [EXTRACTED 1.00]

## Communities (140 total, 61 thin omitted)

### Community 0 - "Admin Activity & Leads API"
Cohesion: 0.06
Nodes (48): GET, runtime, GET, runtime, GET, runtime, GET, runtime (+40 more)

### Community 1 - "Admin CRUD API Routes"
Cohesion: 0.09
Nodes (45): DELETE, PATCH, POST, DELETE, GET, PATCH, runtime, GET (+37 more)

### Community 2 - "Note Creation UI"
Cohesion: 0.06
Nodes (40): DynamicNoteForm, NewNotePage(), Switch(), FileFieldSource, FileSource, NoteFormProps, FileAttachmentsSection(), FileAttachmentsSectionProps (+32 more)

### Community 3 - "Admin Dashboard Pages"
Cohesion: 0.07
Nodes (32): AdminActivitiesPage(), AdminLeadsPage(), PriceTag(), ActivitiesTable(), LeadsTable(), COMPACT_NUMBER_FORMAT, formatDate(), formatDateTime() (+24 more)

### Community 4 - "Upload & Download API"
Cohesion: 0.09
Nodes (26): DELETE, POST, runtime, GET, runtime, dynamic, GET, revalidate (+18 more)

### Community 5 - "Constants & Enums"
Cohesion: 0.10
Nodes (39): ABOUT_VALUES, ACTIVITY_TARGET_TYPES, ADMIN_ACTIVITY_ACTIONS, ADMIN_PAGE_LIMIT, CONTACT_CHANNELS, DEFAULT_PAGE_LIMIT, ERROR_STATUS, FULFILLMENT_STATUS_LABELS (+31 more)

### Community 6 - "Order Lookup API"
Cohesion: 0.12
Nodes (27): GET, POST, runtime, POST, runtime, Bucket, enforceRateLimit(), globalStore (+19 more)

### Community 7 - "Admin Hooks (API)"
Cohesion: 0.09
Nodes (25): useAdminActivities(), useAdminLeads(), useGroups(), useNotes(), ApiError, buildQueryString(), AdminActivity, AdminGroup (+17 more)

### Community 8 - "Category Management API"
Cohesion: 0.11
Nodes (19): runtime, GET, runtime, dynamic, GET, revalidate, dynamic, revalidate (+11 more)

### Community 9 - "Admin Notes API"
Cohesion: 0.10
Nodes (26): runtime, ActivityTargetType, AdminActivityAction, NoteDoc, slugify(), uniqueSlug(), LogActivityInput, addRevenuePaise() (+18 more)

### Community 10 - "Brand & Logo Components"
Cohesion: 0.11
Nodes (20): Logo(), LogoProps, sizes, links, MobileNav(), NAV_LINKS, Navbar(), Sheet() (+12 more)

### Community 11 - "Layout & Form UI"
Cohesion: 0.13
Nodes (20): PageHeader(), Checkbox(), Label(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton() (+12 more)

### Community 12 - "Admin User Management API"
Cohesion: 0.10
Nodes (24): GET, runtime, runtime, Admin, AdminDoc, adminSchema, CategoryDoc, createAdmin() (+16 more)

### Community 13 - "Public Group APIs"
Cohesion: 0.13
Nodes (18): dynamic, revalidate, dynamic, GET, revalidate, runtime, dynamic, GET (+10 more)

### Community 14 - "Public Pages (Home/Groups)"
Cohesion: 0.18
Nodes (23): HomePageRoute(), metadata, GroupRoute(), GroupRouteProps, PopulatedGroup, NotePageProps, NoteRoute(), PopulatedNote (+15 more)

### Community 15 - "Formatting Utilities"
Cohesion: 0.25
Nodes (21): formatPrice(), toIsoString(), toIsoStringRequired(), toAdminActivity(), toAdminRef(), toCategoryRef(), toAdminGroup(), buyerOf() (+13 more)

### Community 16 - "TypeScript Lib DOM"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 17 - "Order Creation API"
Cohesion: 0.16
Nodes (20): POST, runtime, GET, POST, runtime, fail(), setAdminSessionCookie(), AdminTokenPayload (+12 more)

### Community 18 - "Order State Hooks"
Cohesion: 0.09
Nodes (17): CreateOrderInput, useCreateOrder(), CheckoutPage(), useGroup(), useNote(), checkoutSchema, CheckoutValues, CheckoutOrderResponse (+9 more)

### Community 19 - "Shared UI Components"
Cohesion: 0.22
Nodes (16): EmptyState(), PaginationBar(), StatusBadge(), StatusBadgeProps, Badge(), badgeVariants, Input(), Table() (+8 more)

### Community 20 - "Navigation & Routing"
Cohesion: 0.07
Nodes (13): contentType, runtime, contentType, runtime, contentType, runtime, ThemeToggle(), OrderLookupPage() (+5 more)

### Community 21 - "Seed Data & DB Setup"
Cohesion: 0.16
Nodes (20): seed(), runtime, runtime, connectDb(), globalCache, MongooseCache, adminHandler(), AdminRouteContext (+12 more)

### Community 22 - "Card Components"
Cohesion: 0.10
Nodes (11): CategoryCard(), GroupCard(), GroupCardProps, FAQS, HeroSection(), STATS_CONFIG, STEPS, TRUST_ITEMS (+3 more)

### Community 23 - "Dashboard State Hooks"
Cohesion: 0.11
Nodes (11): useDashboard(), useFilters(), OrderLookupResponse, useOrderLookup(), useOrder(), queryKeys, FiltersResponse, PublicOrder (+3 more)

### Community 24 - "Admin Login Page"
Cohesion: 0.22
Nodes (13): AdminLoginPage(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle() (+5 more)

### Community 25 - "API Runtime Helpers"
Cohesion: 0.14
Nodes (17): POST, runtime, ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_SECONDS, ApiFailure, ApiSuccess, okPaginated(), AdminSession (+9 more)

### Community 26 - "Dialog Components"
Cohesion: 0.21
Nodes (17): Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogPortal() (+9 more)

### Community 27 - "Note Edit UI"
Cohesion: 0.14
Nodes (16): EditNotePage(), NoteFormContent(), AdminNotesPage(), useAdminNote(), useAdminNotes(), useCreateNote(), useDeleteNote(), useUpdateNote() (+8 more)

### Community 28 - "Error State Components"
Cohesion: 0.15
Nodes (13): ErrorState(), ErrorStateProps, PdfPreviewDialog(), NoteDetailPage(), OrderStatusPage(), downloadFile(), useDownloadFile(), mockUseNote (+5 more)

### Community 29 - "Component Aliases"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 30 - "Legal & Policy Pages"
Cohesion: 0.20
Nodes (14): metadata, PrivacyPage(), metadata, RefundPolicyPage(), metadata, TermsPage(), JsonLd(), safeStringifyJsonLd() (+6 more)

### Community 31 - "Global Error Handling"
Cohesion: 0.16
Nodes (8): GlobalError(), NotFound(), CopyButton(), Button(), buttonVariants, ExportButton(), mockMutate, mockUseMutation

### Community 32 - "Group Edit UI"
Cohesion: 0.17
Nodes (12): EditGroupPage(), GroupFormContent(), AdminGroupsPage(), useAdminGroup(), useAdminGroups(), useCreateGroup(), useDeleteGroup(), useUpdateGroup() (+4 more)

### Community 33 - "Group Pages & Metadata"
Cohesion: 0.16
Nodes (10): GroupsPageRoute(), metadata, NotesLoading(), NoteCardSkeleton(), ShimmerLoader(), ShimmerNoteCard(), ShimmerStatCard(), GroupsPage() (+2 more)

### Community 34 - "Public Layout & Footer"
Cohesion: 0.19
Nodes (14): PublicLayout(), Footer(), FOOTER_LINKS, SOCIAL_LINKS, AppleIcon(), FacebookIcon(), GithubIcon(), GoogleIcon() (+6 more)

### Community 35 - "Seed Data Functions"
Cohesion: 0.19
Nodes (11): seedDate, GET, AdminActivity, AdminActivityDoc, adminActivitySchema, formatPaise(), generateRevenueSeries(), getCategoryBreakdown() (+3 more)

### Community 36 - "Admin Layout"
Cohesion: 0.20
Nodes (10): AdminLayout(), metadata, useAdminLogin(), useAdminLogout(), useAdminProfile(), AdminShell(), navItems, mockMutate (+2 more)

### Community 37 - "PWA Manifest"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 38 - "Zod Validation Schemas"
Cohesion: 0.17
Nodes (10): AdminLoginInput, AdminLoginPayload, adminLoginSchema, AdminRegisterInput, AdminRegisterPayload, adminRegisterSchema, UpdateOrderPayload, updateOrderSchema (+2 more)

### Community 39 - "Admin Categories Pages"
Cohesion: 0.22
Nodes (8): AdminCategoriesPage(), useAdminCategories(), useCreateCategory(), useDeleteCategory(), useUpdateCategory(), CategoriesTable(), mockUseAdminCategories, mockApiClient

### Community 40 - "File Upload Fields"
Cohesion: 0.23
Nodes (9): FileUploadField(), FileUploadFieldProps, useDeleteUpload(), useFileUpload(), UploadKind, UploadResponse, mockApiClient, mockToastError (+1 more)

### Community 41 - "Pagination Components"
Cohesion: 0.29
Nodes (10): PaginationBarProps, Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink(), PaginationLinkProps, PaginationNext() (+2 more)

### Community 42 - "About Page"
Cohesion: 0.22
Nodes (7): AboutPage(), metadata, ContactPage(), ICON_MAP, metadata, StaticPage(), mockIcons

### Community 43 - "Revenue Chart Component"
Cohesion: 0.21
Nodes (8): RevenueAreaChart(), RevenueAreaChartProps, RevenueChart(), RevenueChartProps, STAT_CARDS, StatsGrid(), StatsGridProps, DashboardStats

### Community 44 - "Empty State Components"
Cohesion: 0.36
Nodes (8): EmptyStateProps, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 45 - "Next.js Dependencies"
Cohesion: 0.18
Nodes (11): eslint-config-next, devDependencies, eslint-config-next, tailwindcss, tsx, @types/react-dom, @vitest/ui, tailwindcss (+3 more)

### Community 46 - "Admin Order Hooks"
Cohesion: 0.25
Nodes (7): useAdminOrder(), useAdminOrders(), useUpdateOrderFulfillment(), FulfillmentDialog(), AdminOrder, mockUseUpdateOrderFulfillment, mockApiClient

### Community 47 - "Category Schema"
Cohesion: 0.25
Nodes (9): categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload, createCategorySchema, SubjectInput, subjectSchema, UpdateCategoryInput, UpdateCategoryPayload (+1 more)

### Community 48 - "Dynamic API Routes"
Cohesion: 0.20
Nodes (5): dynamic, POST(), runtime, ADMIN, HEAD_ADMIN

### Community 49 - "App Providers"
Cohesion: 0.29
Nodes (5): AppProviders(), getErrorMessage(), QueryProvider(), ThemeProvider(), mockNextThemesProvider

### Community 50 - "Build & Dev Scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, seed, start, test, test:coverage (+1 more)

### Community 51 - "Filter Chips"
Cohesion: 0.33
Nodes (5): ActiveFilterChips(), NotesUrlState, parsers, useNotesQueryState(), mockUseNotesQueryState

### Community 52 - "Admin Order Detail Page"
Cohesion: 0.36
Nodes (3): AdminOrderPage(), OrderDetailView(), mockUseAdminOrder

### Community 53 - "Checkout Page"
Cohesion: 0.32
Nodes (5): CheckoutRoute(), metadata, CheckoutContent(), mockSearchParams, mockUseParams

### Community 54 - "Home Page Hooks"
Cohesion: 0.36
Nodes (4): useHome(), HomePage(), HomeResponse, mockApiClient

### Community 55 - "Counter Model"
Cohesion: 0.39
Nodes (5): Counter, CounterDoc, counterSchema, generateOrderNumber(), mockLean

### Community 56 - "React Core Dependencies"
Cohesion: 0.29
Nodes (7): @base-ui/react, lucide-react, dependencies, @base-ui/react, lucide-react, mongoose, mongoose

### Community 57 - "Admin Orders Table"
Cohesion: 0.33
Nodes (4): AdminOrdersPage(), OrdersTable(), mockPush, mockUseAdminOrders

### Community 58 - "Admin Pages"
Cohesion: 0.33
Nodes (4): AdminPage(), metadata, AdminDashboard(), mockUseDashboard

### Community 59 - "Proxy & Auth Config"
Cohesion: 0.38
Nodes (6): config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, unauthorizedJson()

### Community 60 - "Buy Model & Storage"
Cohesion: 0.40
Nodes (6): Buy Flow Model, Cloudinary File Storage, Group (Note Bundle), Note, Razorpay Payment Integration, Sell Flow Model

### Community 61 - "Inter Font & Metadata"
Cohesion: 0.47
Nodes (4): inter, metadata, outfit, RootLayout()

### Community 62 - "Content Type Helpers"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 64 - "Note Card Component"
Cohesion: 0.53
Nodes (3): NoteCard(), NoteCardProps, PublicNote

### Community 65 - "Group Detail Tests"
Cohesion: 0.40
Nodes (3): GroupDetailPage(), mockUseGroup, mockUseGroup

### Community 67 - "ESLint Configuration"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

### Community 68 - "Package Config"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 69 - "Performance Stack"
Cohesion: 0.50
Nodes (4): ISR Performance Strategy, Next.js 16 + React 19 Stack, SEO Optimization, Next.js Logo SVG

## Knowledge Gaps
- **412 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+407 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **61 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Layout & Form UI` to `Note Card Component`, `Group Pages & Metadata`, `Note Creation UI`, `Admin Layout`, `Pagination Components`, `Brand & Logo Components`, `Empty State Components`, `Shared UI Components`, `Card Components`, `Admin Login Page`, `Dialog Components`, `Global Error Handling`, `Legal & Policy Pages`, `Section Containers`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `Button()` connect `Global Error Handling` to `Note Creation UI`, `Admin Layout`, `File Upload Fields`, `Pagination Components`, `About Page`, `Brand & Logo Components`, `Layout & Form UI`, `Order State Hooks`, `Shared UI Components`, `Navigation & Routing`, `Admin Order Detail Page`, `Card Components`, `Filter Chips`, `Admin Login Page`, `Dialog Components`, `Error State Components`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `ok()` connect `Admin CRUD API Routes` to `Admin Activity & Leads API`, `Seed Data Functions`, `Upload & Download API`, `Order Lookup API`, `Category Management API`, `Admin Notes API`, `Admin User Management API`, `Public Group APIs`, `Order Creation API`, `Seed Data & DB Setup`, `API Runtime Helpers`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _412 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Activity & Leads API` be split into smaller, more focused modules?**
  _Cohesion score 0.06027306027306027 - nodes in this community are weakly interconnected._
- **Should `Admin CRUD API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.08700564971751412 - nodes in this community are weakly interconnected._
- **Should `Note Creation UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06196078431372549 - nodes in this community are weakly interconnected._