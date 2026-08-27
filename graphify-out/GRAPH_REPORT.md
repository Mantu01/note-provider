# Graph Report - notes-provider  (2026-08-27)

## Corpus Check
- 454 files · ~181,281 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1625 nodes · 4966 edges · 121 communities (75 shown, 46 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Seed & DB Init
- API GET Routes
- Note Edit Pages
- Admin Activity Log
- General API Routes
- Mutation Endpoints
- Category API
- Group API Routes
- Mobile Nav & UI
- Auth Mutation Routes
- Constants & Config
- Homepage & Landing
- Mongoose Models
- Loading Skeletons
- TypeScript Config
- Seed Script Routes
- Admin Data Hooks
- About Page
- Layout Containers
- Admin Notes Mgmt
- Admin Group Mgmt
- Drive Integration
- PDF Preview Dialog
- Error Boundaries
- Admin Layout
- Shared Types
- Component Config
- Next Navigation Utils
- Admin Login Page
- App Providers
- Order Management Pages
- Dashboard Views
- Card Components
- Data Fetching Hooks
- Category Management
- Footer & Social
- Group Edit Pages
- Revenue Analytics
- Checkout Flow UI
- PWA Manifest
- File Upload Field
- Pagination UI
- Admin Schemas
- Checkout Route
- API Client Layer
- Project Docs
- Empty State UI
- Group Detail Hook
- ESLint Config
- Public Layout
- Category Schema
- NPM Scripts
- Order Creation Hook
- Admin Service
- Home Data Hook
- Order Number Counter
- Icon Dependencies
- Auth Middleware
- Lead Export Service
- Leads Management
- Root Layout Fonts
- Logo Component
- Doctor Config
- Package Config
- Order Detail View
- Notes Catalog Page
- Order Tracking Page
- Legal Policies
- CVA Utility
- Cloudinary Storage
- CLSX Utility
- Date Formatting
- ESLint Core
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 108
- Community 109
- Community 110
- Community 111

## God Nodes (most connected - your core abstractions)
1. `cn()` - 100 edges
2. `ok()` - 74 edges
3. `AppError` - 58 edges
4. `apiClient()` - 53 edges
5. `logActivity()` - 50 edges
6. `Note` - 48 edges
7. `Button()` - 43 edges
8. `Group` - 34 edges
9. `fail()` - 31 edges
10. `Order` - 26 edges

## Surprising Connections (you probably didn't know these)
- `seed()` --calls--> `connectDb()`  [EXTRACTED]
  seed.ts → src/server/db/connect.ts
- `mountHook()` --calls--> `useDownloadFile()`  [EXTRACTED]
  tests/hooks/use-download-file.test.tsx → src/hooks/use-download-file.ts
- `logoutHandler` --calls--> `ok()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/lib/api-response.ts
- `loginHandler` --calls--> `setAdminSessionCookie()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/lib/auth-guard.ts
- `loginHandler` --calls--> `signAdminToken()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/lib/jwt.ts

## Import Cycles
- None detected.

## Communities (121 total, 46 thin omitted)

### Community 0 - "Seed & DB Init"
Cohesion: 0.06
Nodes (38): seedDate, runtime, runtime, dynamic, revalidate, dynamic, revalidate, dynamic (+30 more)

### Community 1 - "API GET Routes"
Cohesion: 0.11
Nodes (47): GET, GET, GET, GET, GET, GET, GET, NoteCardProps (+39 more)

### Community 2 - "Note Edit Pages"
Cohesion: 0.06
Nodes (44): EditNotePage(), NoteFormContent(), DynamicNoteForm, NewNotePage(), Switch(), useAdminNote(), useAdminNotes(), useCreateNote() (+36 more)

### Community 3 - "Admin Activity Log"
Cohesion: 0.05
Nodes (34): AdminActivitiesPage(), dynamic, OrderRoute(), OrderRouteProps, OrderSuccessRouteProps, CopyButton(), ActivitiesTable(), NoteDetailPage() (+26 more)

### Community 4 - "General API Routes"
Cohesion: 0.09
Nodes (35): GET, runtime, runtime, POST, runtime, GET, runtime, runtime (+27 more)

### Community 5 - "Mutation Endpoints"
Cohesion: 0.12
Nodes (42): POST, POST, DELETE, PATCH, POST, DELETE, GET, PATCH (+34 more)

### Community 6 - "Category API"
Cohesion: 0.10
Nodes (33): GET, POST, runtime, GET, runtime, POST, runtime, buyerSchema (+25 more)

### Community 7 - "Group API Routes"
Cohesion: 0.11
Nodes (30): GET, runtime, GET, runtime, GET, runtime, GET, runtime (+22 more)

### Community 8 - "Mobile Nav & UI"
Cohesion: 0.09
Nodes (27): links, MobileNav(), Checkbox(), Sheet(), SheetClose(), SheetContent(), SheetDescription(), SheetFooter() (+19 more)

### Community 9 - "Auth Mutation Routes"
Cohesion: 0.10
Nodes (22): runtime, POST, runtime, updateNoteSchema, CloudinaryDeliveryType, CloudinaryResourceType, destroyAsset(), uploadBuffer() (+14 more)

### Community 10 - "Constants & Config"
Cohesion: 0.12
Nodes (34): ABOUT_VALUES, ACTIVITY_TARGET_TYPES, ADMIN_ACTIVITY_ACTIONS, ADMIN_PAGE_LIMIT, CONTACT_CHANNELS, DEFAULT_PAGE_LIMIT, ERROR_STATUS, FULFILLMENT_STATUS_LABELS (+26 more)

### Community 11 - "Homepage & Landing"
Cohesion: 0.16
Nodes (25): HomePageRoute(), metadata, GroupsPageRoute(), metadata, GroupRoute(), GroupRouteProps, PopulatedGroup, NotePageProps (+17 more)

### Community 12 - "Mongoose Models"
Cohesion: 0.09
Nodes (24): AdminActivity, AdminActivityDoc, adminActivitySchema, CategoryDoc, GroupDoc, LogActivityInput, createCategory(), deleteCategory() (+16 more)

### Community 13 - "Loading Skeletons"
Cohesion: 0.09
Nodes (13): NotesLoading(), CategoryCard(), NoteCardSkeleton(), ShimmerLoader(), ShimmerNoteCard(), ShimmerStatCard(), FAQS, HeroSection() (+5 more)

### Community 14 - "TypeScript Config"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 15 - "Seed Script Routes"
Cohesion: 0.15
Nodes (22): seed(), runtime, dynamic, revalidate, runtime, connectDb(), globalCache, MongooseCache (+14 more)

### Community 16 - "Admin Data Hooks"
Cohesion: 0.11
Nodes (11): useAdminLeads(), useNote(), OrderLookupResponse, useOrderLookup(), OrderLookupPage(), queryKeys, NotesQuery, mockApiClient (+3 more)

### Community 17 - "About Page"
Cohesion: 0.16
Nodes (17): AboutPage(), metadata, metadata, PrivacyPage(), metadata, RefundPolicyPage(), metadata, TermsPage() (+9 more)

### Community 18 - "Layout Containers"
Cohesion: 0.15
Nodes (16): Container(), PageHeader(), Section(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton() (+8 more)

### Community 19 - "Admin Notes Mgmt"
Cohesion: 0.24
Nodes (15): AdminNotesPage(), EmptyState(), PaginationBar(), Input(), Table(), TableBody(), TableCaption(), TableCell() (+7 more)

### Community 20 - "Admin Group Mgmt"
Cohesion: 0.11
Nodes (18): GroupFormContent(), AdminGroupsPage(), useAdminGroup(), useAdminGroups(), useDeleteGroup(), GroupsTable(), CreateGroupInput, CreateGroupPayload (+10 more)

### Community 21 - "Drive Integration"
Cohesion: 0.14
Nodes (20): GET, runtime, buildSignedUrl(), driveToDownloadUrl(), addRevenuePaise(), deleteNote(), getFeaturedNotes(), getFreeNotes() (+12 more)

### Community 22 - "PDF Preview Dialog"
Cohesion: 0.23
Nodes (15): PdfPreviewDialog(), Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay() (+7 more)

### Community 23 - "Error Boundaries"
Cohesion: 0.15
Nodes (11): GlobalError(), NotFound(), ContactPage(), ICON_MAP, metadata, Button(), buttonVariants, ExportButton() (+3 more)

### Community 24 - "Admin Layout"
Cohesion: 0.14
Nodes (14): AdminLayout(), metadata, Logo(), LogoProps, sizes, useAdminLogin(), useAdminLogout(), useAdminProfile() (+6 more)

### Community 25 - "Shared Types"
Cohesion: 0.09
Nodes (22): ActivityTargetType, AdminActivityAction, AdminCategory, AdminLead, AdminProfile, AdminRef, ApiFailure, ApiSuccess (+14 more)

### Community 26 - "Component Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 27 - "Next Navigation Utils"
Cohesion: 0.09
Nodes (10): contentType, runtime, contentType, runtime, contentType, runtime, mockUseNote, mockImageResponse (+2 more)

### Community 28 - "Admin Login Page"
Cohesion: 0.23
Nodes (12): AdminLoginPage(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle() (+4 more)

### Community 29 - "App Providers"
Cohesion: 0.12
Nodes (13): AppProviders(), getErrorMessage(), QueryProvider(), ThemeProvider(), mockNuqsAdapter, mockQueryProvider, mockThemeProvider, mockToaster (+5 more)

### Community 30 - "Order Management Pages"
Cohesion: 0.13
Nodes (13): AdminOrdersPage(), useAdminOrder(), useAdminOrders(), useUpdateOrderFulfillment(), FulfillmentDialog(), OrderDetailView(), OrdersTable(), AdminOrder (+5 more)

### Community 31 - "Dashboard Views"
Cohesion: 0.15
Nodes (11): AdminPage(), metadata, AdminDashboard(), RevenueAreaChart(), RevenueAreaChartProps, RevenueChart(), RevenueChartProps, StatsGrid() (+3 more)

### Community 32 - "Card Components"
Cohesion: 0.21
Nodes (8): GroupCard(), GroupCardProps, NoteCard(), StatusBadge(), StatusBadgeProps, Badge(), badgeVariants, PublicGroup

### Community 33 - "Data Fetching Hooks"
Cohesion: 0.16
Nodes (11): useAdminActivities(), useGroups(), GroupsPage(), buildQueryString(), AdminActivity, GroupsQuery, PaginatedData, mockUseGroups (+3 more)

### Community 34 - "Category Management"
Cohesion: 0.21
Nodes (10): AdminCategoriesPage(), useAdminCategories(), useCreateCategory(), useDeleteCategory(), useUpdateCategory(), CategoriesTable(), CategoryDialog(), apiClient() (+2 more)

### Community 35 - "Footer & Social"
Cohesion: 0.23
Nodes (13): Footer(), FOOTER_LINKS, SOCIAL_LINKS, AppleIcon(), FacebookIcon(), GithubIcon(), GoogleIcon(), InstagramIcon() (+5 more)

### Community 36 - "Group Edit Pages"
Cohesion: 0.20
Nodes (8): EditGroupPage(), NewGroupPage(), ErrorState(), ErrorStateProps, useCreateGroup(), useUpdateGroup(), GroupForm(), GroupFormProps

### Community 37 - "Revenue Analytics"
Cohesion: 0.22
Nodes (9): GET, runtime, formatPaise(), generateRevenueSeries(), getCategoryBreakdown(), getDashboardStats(), getTopNotes(), toDateKey() (+1 more)

### Community 38 - "Checkout Flow UI"
Cohesion: 0.17
Nodes (7): Label(), checkoutSchema, CheckoutValues, mockUseCreateOrder, mockUseGroup, mockUseNote, mockUseRouter

### Community 39 - "PWA Manifest"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 40 - "File Upload Field"
Cohesion: 0.23
Nodes (9): FileUploadField(), FileUploadFieldProps, useDeleteUpload(), useFileUpload(), UploadKind, UploadResponse, mockApiClient, mockToastError (+1 more)

### Community 41 - "Pagination UI"
Cohesion: 0.29
Nodes (10): PaginationBarProps, Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink(), PaginationLinkProps, PaginationNext() (+2 more)

### Community 42 - "Admin Schemas"
Cohesion: 0.18
Nodes (9): AdminLoginInput, AdminLoginPayload, AdminRegisterInput, AdminRegisterPayload, adminRegisterSchema, UpdateOrderPayload, updateOrderSchema, ADMIN (+1 more)

### Community 43 - "Checkout Route"
Cohesion: 0.19
Nodes (8): CheckoutRoute(), metadata, CheckoutContent(), mockSearchParams, mockUseParams, mockUseParams, mockUseSearchParams, queryClient

### Community 44 - "API Client Layer"
Cohesion: 0.21
Nodes (5): ApiError, ApiResult, ErrorCode, mockApiClient, mockApiClient

### Community 45 - "Project Docs"
Cohesion: 0.17
Nodes (12): notes-provider, README.md, docker-compose.yml, pnpm-workspace.yaml, apple-touch-icon.png, favicon-16x16.png, favicon-32x32.png, file.svg (+4 more)

### Community 46 - "Empty State UI"
Cohesion: 0.36
Nodes (8): EmptyStateProps, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 47 - "Group Detail Hook"
Cohesion: 0.27
Nodes (6): useGroup(), GroupDetailPage(), GroupDetailResponse, mockUseGroup, mockUseGroup, mockApiClient

### Community 48 - "ESLint Config"
Cohesion: 0.18
Nodes (11): eslint-config-next, jsdom, devDependencies, eslint-config-next, jsdom, tsx, @types/react-dom, @vitest/ui (+3 more)

### Community 49 - "Public Layout"
Cohesion: 0.27
Nodes (5): PublicLayout(), ThemeToggle(), NAV_LINKS, Navbar(), mockUseTheme

### Community 50 - "Category Schema"
Cohesion: 0.27
Nodes (8): categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload, createCategorySchema, SubjectInput, subjectSchema, UpdateCategoryInput, UpdateCategoryPayload

### Community 51 - "NPM Scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, seed, start, test, test:coverage (+1 more)

### Community 52 - "Order Creation Hook"
Cohesion: 0.25
Nodes (6): CreateOrderInput, useCreateOrder(), CheckoutPage(), CheckoutOrderResponse, PurchaseItemType, mockApiClient

### Community 53 - "Admin Service"
Cohesion: 0.36
Nodes (7): AdminDoc, createAdmin(), getAdminByEmail(), getAdminById(), getAllAdmins(), updateLastLogin(), mockAdmin

### Community 54 - "Home Data Hook"
Cohesion: 0.36
Nodes (4): useHome(), HomePage(), HomeResponse, mockApiClient

### Community 55 - "Order Number Counter"
Cohesion: 0.39
Nodes (5): Counter, CounterDoc, counterSchema, generateOrderNumber(), mockLean

### Community 56 - "Icon Dependencies"
Cohesion: 0.29
Nodes (7): @base-ui/react, lucide-react, dependencies, @base-ui/react, lucide-react, mongoose, mongoose

### Community 57 - "Auth Middleware"
Cohesion: 0.38
Nodes (6): config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, unauthorizedJson()

### Community 58 - "Lead Export Service"
Cohesion: 0.48
Nodes (5): exportOrders(), getLeadCount(), getTodayLeadCount(), listOrders(), mockOrder

### Community 59 - "Leads Management"
Cohesion: 0.40
Nodes (3): AdminLeadsPage(), LeadsTable(), mockUseAdminLeads

### Community 60 - "Root Layout Fonts"
Cohesion: 0.47
Nodes (4): inter, metadata, outfit, RootLayout()

### Community 61 - "Logo Component"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 62 - "Doctor Config"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

### Community 63 - "Package Config"
Cohesion: 0.50
Nodes (3): name, private, version

## Knowledge Gaps
- **409 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+404 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Layout Containers` to `Card Components`, `Note Edit Pages`, `Checkout Flow UI`, `Mobile Nav & UI`, `Pagination UI`, `Loading Skeletons`, `Empty State UI`, `Public Layout`, `About Page`, `Admin Notes Mgmt`, `PDF Preview Dialog`, `Error Boundaries`, `Admin Layout`, `Admin Login Page`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `Button()` connect `Error Boundaries` to `Card Components`, `Note Edit Pages`, `Admin Activity Log`, `Group Edit Pages`, `Checkout Flow UI`, `Mobile Nav & UI`, `File Upload Field`, `Pagination UI`, `Loading Skeletons`, `Group Detail Hook`, `Public Layout`, `Layout Containers`, `Admin Notes Mgmt`, `PDF Preview Dialog`, `Admin Layout`, `Admin Login Page`, `Dashboard Views`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `ok()` connect `Mutation Endpoints` to `Seed & DB Init`, `API GET Routes`, `General API Routes`, `Revenue Analytics`, `Category API`, `Group API Routes`, `Auth Mutation Routes`, `Seed Script Routes`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _409 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Seed & DB Init` be split into smaller, more focused modules?**
  _Cohesion score 0.058115025594700394 - nodes in this community are weakly interconnected._
- **Should `API GET Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.10862470862470862 - nodes in this community are weakly interconnected._
- **Should `Note Edit Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.05875706214689266 - nodes in this community are weakly interconnected._