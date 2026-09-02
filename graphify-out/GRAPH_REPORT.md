# Graph Report - notes-provider  (2026-09-02)

## Corpus Check
- 446 files · ~180,295 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1637 nodes · 5029 edges · 124 communities (81 shown, 43 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.82)
- Token cost: 2,850 input · 450 output

## Community Hubs (Navigation)
- Startup Runtime
- Admin Activity Tracking
- API Orders Route
- Note Management Pages
- Error Handling React Query
- Infrastructure Build
- Public API Routes
- Admin API Routes
- CRUD API Handlers
- Admin Category Management
- Constants Types
- Layout Components
- Admin Activity Model
- Upload Handling
- Admin Group Management
- Admin Authentication
- Homepage SEO
- TypeScript Configuration
- Admin Dashboard Pages
- Admin Layout
- API Endpoints
- About Page
- Database Seeding
- Checkout Flow
- UI Badges
- Admin Hooks
- Navigation Routing
- Component Library Config
- Category UI Components
- Admin Session Auth
- Order Creation Hook
- Order Detail Page
- Admin Login Schema
- Dashboard Hooks
- Admin Notes Hooks
- PWA Manifest
- Static API Routes
- Public Layout
- Filter Hooks
- Group Edit Pages
- File Upload Component
- Pagination UI
- PDF Preview Dialog
- Password Security
- Group Data Hooks
- Admin Leads Management
- Empty State Component
- Groups Catalog
- Admin Database Model
- Code Quality Tools
- Badge Component
- Group Data Layer
- Price Formatting
- Error Handling UI
- App Providers
- Build Scripts
- Loading States
- Category Validation
- Typography Fonts
- Homepage Hooks
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
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
- Community 112
- Community 113
- Community 114

## God Nodes (most connected - your core abstractions)
1. `cn()` - 107 edges
2. `ok()` - 74 edges
3. `AppError` - 58 edges
4. `apiClient()` - 54 edges
5. `logActivity()` - 50 edges
6. `Note` - 48 edges
7. `Button()` - 43 edges
8. `Notes Provider` - 35 edges
9. `Group` - 34 edges
10. `fail()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `Notes Provider` --references--> `Apple Touch Icon PNG`  [EXTRACTED]
  README.md → public/apple-touch-icon.png
- `Notes Provider` --references--> `Favicon 16x16 PNG`  [EXTRACTED]
  README.md → public/favicon-16x16.png
- `Notes Provider` --references--> `Favicon 32x32 PNG`  [EXTRACTED]
  README.md → public/favicon-32x32.png
- `Notes Provider` --references--> `File Icon SVG`  [EXTRACTED]
  README.md → public/file.svg
- `Notes Provider` --references--> `Globe Icon SVG`  [EXTRACTED]
  README.md → public/globe.svg

## Import Cycles
- None detected.

## Communities (124 total, 43 thin omitted)

### Community 0 - "Startup Runtime"
Cohesion: 0.07
Nodes (34): seedDate, runtime, GET, runtime, dynamic, GET, revalidate, dynamic (+26 more)

### Community 1 - "Admin Activity Tracking"
Cohesion: 0.07
Nodes (44): AdminActivitiesPage(), ActivitiesTable(), COMPACT_NUMBER_FORMAT, formatDate(), formatDateTime(), formatFileSize(), formatFileSizeLabel(), formatPrice() (+36 more)

### Community 2 - "API Orders Route"
Cohesion: 0.10
Nodes (33): GET, POST, runtime, GET, runtime, POST, runtime, okPaginated() (+25 more)

### Community 3 - "Note Management Pages"
Cohesion: 0.06
Nodes (36): EditNotePage(), NoteFormContent(), DynamicNoteForm, NewNotePage(), FileFieldSource, FileSource, NoteForm(), NoteFormProps (+28 more)

### Community 4 - "Error Handling React Query"
Cohesion: 0.08
Nodes (20): GlobalError(), NotFound(), Button(), buttonVariants, Checkbox(), Label(), ExportButton(), ActiveFilterChips() (+12 more)

### Community 5 - "Infrastructure Build"
Cohesion: 0.06
Nodes (44): MongoDB Service, esbuild, Minimum Release Age Policy, Reject Binary Downloads, Sharp, No Downgrade Trust Policy, unrs-resolver, pnpm Security Hardening (+36 more)

### Community 6 - "Public API Routes"
Cohesion: 0.12
Nodes (30): GET, runtime, GET, runtime, GET, runtime, GET, runtime (+22 more)

### Community 7 - "Admin API Routes"
Cohesion: 0.12
Nodes (28): GET, runtime, dynamic, GET, revalidate, dynamic, GET, revalidate (+20 more)

### Community 8 - "CRUD API Handlers"
Cohesion: 0.15
Nodes (34): DELETE, PATCH, POST, DELETE, GET, PATCH, runtime, GET (+26 more)

### Community 9 - "Admin Category Management"
Cohesion: 0.12
Nodes (26): AdminCategoriesPage(), Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay() (+18 more)

### Community 10 - "Constants Types"
Cohesion: 0.11
Nodes (34): ABOUT_VALUES, ACTIVITY_TARGET_TYPES, ADMIN_ACTIVITY_ACTIONS, ADMIN_PAGE_LIMIT, CONTACT_CHANNELS, DEFAULT_PAGE_LIMIT, ERROR_STATUS, FULFILLMENT_STATUS_LABELS (+26 more)

### Community 11 - "Layout Components"
Cohesion: 0.12
Nodes (20): Container(), MobileNav(), PageHeader(), Section(), Sheet(), SheetClose(), SheetContent(), SheetDescription() (+12 more)

### Community 12 - "Admin Activity Model"
Cohesion: 0.09
Nodes (22): runtime, AdminActivity, AdminActivityDoc, adminActivitySchema, CategoryDoc, slugify(), uniqueSlug(), LogActivityInput (+14 more)

### Community 13 - "Upload Handling"
Cohesion: 0.10
Nodes (21): POST, runtime, UPLOAD_LIMITS, refineNote(), updateNoteSchema, CloudinaryDeliveryType, CloudinaryResourceType, destroyAsset() (+13 more)

### Community 14 - "Admin Group Management"
Cohesion: 0.11
Nodes (22): NewGroupPage(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator() (+14 more)

### Community 15 - "Admin Authentication"
Cohesion: 0.16
Nodes (18): AdminLoginPage(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle() (+10 more)

### Community 16 - "Homepage SEO"
Cohesion: 0.18
Nodes (23): HomePageRoute(), metadata, GroupRoute(), GroupRouteProps, PopulatedGroup, NotePageProps, NoteRoute(), PopulatedNote (+15 more)

### Community 17 - "TypeScript Configuration"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 18 - "Admin Dashboard Pages"
Cohesion: 0.18
Nodes (17): AdminGroupsPage(), AdminNotesPage(), EmptyState(), PaginationBar(), Input(), Table(), TableBody(), TableCaption() (+9 more)

### Community 19 - "Admin Layout"
Cohesion: 0.10
Nodes (17): AdminLayout(), metadata, Logo(), LogoProps, sizes, ThemeToggle(), Navbar(), useAdminLogin() (+9 more)

### Community 20 - "API Endpoints"
Cohesion: 0.11
Nodes (23): GET, runtime, dynamic, revalidate, runtime, buildSignedUrl(), driveToDownloadUrl(), addRevenuePaise() (+15 more)

### Community 21 - "About Page"
Cohesion: 0.16
Nodes (16): AboutPage(), metadata, metadata, PrivacyPage(), metadata, RefundPolicyPage(), metadata, TermsPage() (+8 more)

### Community 22 - "Database Seeding"
Cohesion: 0.18
Nodes (20): seed(), POST, runtime, connectDb(), globalCache, MongooseCache, adminHandler(), AdminRouteContext (+12 more)

### Community 23 - "Checkout Flow"
Cohesion: 0.11
Nodes (13): CheckoutRoute(), metadata, GroupsPageRoute(), metadata, metadata, NotesPage(), metadata, TrackOrderRoute() (+5 more)

### Community 24 - "UI Badges"
Cohesion: 0.16
Nodes (14): LEVEL_BADGE, LevelBadge(), LevelBadgeProps, PRICING_BADGE, PricingBadge(), PricingBadgeProps, GroupCard(), GroupCardProps (+6 more)

### Community 25 - "Admin Hooks"
Cohesion: 0.09
Nodes (20): useAdminActivities(), ActivityTargetType, AdminActivity, AdminActivityAction, AdminProfile, AdminRef, ApiFailure, ApiSuccess (+12 more)

### Community 26 - "Navigation Routing"
Cohesion: 0.09
Nodes (11): contentType, runtime, contentType, runtime, contentType, runtime, OrderLookupPage(), mockImageResponse (+3 more)

### Community 27 - "Component Library Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 28 - "Category UI Components"
Cohesion: 0.11
Nodes (8): CategoryCard(), HeroSection(), HOME_FAQS, HOME_STATS_CONFIG, HOME_STEPS, HOME_TRUST_ITEMS, formatCompactNumber(), PublicCategory

### Community 29 - "Admin Session Auth"
Cohesion: 0.18
Nodes (13): POST, runtime, ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_SECONDS, AdminSession, clearAdminSessionCookie(), getOptionalAdmin(), requireAdmin() (+5 more)

### Community 30 - "Order Creation Hook"
Cohesion: 0.12
Nodes (13): CreateOrderInput, useCreateOrder(), CheckoutPage(), useNote(), CheckoutOrderResponse, NoteDetailResponse, PurchaseItemType, mockUseCreateOrder (+5 more)

### Community 31 - "Order Detail Page"
Cohesion: 0.15
Nodes (7): dynamic, OrderRoute(), OrderRouteProps, OrderSuccessRouteProps, CopyButton(), OrderStatusPage(), mockUseOrder

### Community 32 - "Admin Login Schema"
Cohesion: 0.16
Nodes (11): runtime, AdminLoginInput, AdminLoginPayload, adminLoginSchema, AdminRegisterInput, AdminRegisterPayload, adminRegisterSchema, UpdateOrderPayload (+3 more)

### Community 33 - "Dashboard Hooks"
Cohesion: 0.17
Nodes (8): useDashboard(), useNotes(), OrderLookupResponse, useOrderLookup(), queryKeys, NotesQuery, mockApiClient, mockApiClient

### Community 34 - "Admin Notes Hooks"
Cohesion: 0.24
Nodes (11): useAdminNote(), useAdminNotes(), useCreateNote(), useDeleteNote(), useUpdateNote(), useAdminOrder(), useAdminOrders(), useUpdateOrderFulfillment() (+3 more)

### Community 35 - "PWA Manifest"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 36 - "Static API Routes"
Cohesion: 0.22
Nodes (8): GET, runtime, GET, runtime, toAdminProfile(), ADMIN, loginHandler, meHandler

### Community 37 - "Public Layout"
Cohesion: 0.24
Nodes (9): PublicLayout(), Footer(), FOOTER_LINKS, SOCIAL_LINKS, SocialLink, GithubIcon(), InstagramIcon(), XIcon() (+1 more)

### Community 38 - "Filter Hooks"
Cohesion: 0.17
Nodes (5): useFilters(), useOrder(), FiltersResponse, mockApiClient, mockApiClient

### Community 39 - "Group Edit Pages"
Cohesion: 0.23
Nodes (9): EditGroupPage(), GroupFormContent(), useAdminGroup(), useAdminGroups(), useCreateGroup(), useDeleteGroup(), useUpdateGroup(), AdminGroup (+1 more)

### Community 40 - "File Upload Component"
Cohesion: 0.23
Nodes (9): FileUploadField(), FileUploadFieldProps, useDeleteUpload(), useFileUpload(), UploadKind, UploadResponse, mockApiClient, mockToastError (+1 more)

### Community 41 - "Pagination UI"
Cohesion: 0.29
Nodes (10): PaginationBarProps, Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink(), PaginationLinkProps, PaginationNext() (+2 more)

### Community 42 - "PDF Preview Dialog"
Cohesion: 0.19
Nodes (9): PdfPreviewDialog(), NoteDetailPage(), downloadFile(), useDownloadFile(), mockUseNote, mockUseNote, mockToast, mockUseMutation (+1 more)

### Community 43 - "Password Security"
Cohesion: 0.23
Nodes (6): POST, hashPassword(), verifyPassword(), adminLoginSchema, adminRegisterSchema, registerHandler

### Community 44 - "Group Data Hooks"
Cohesion: 0.23
Nodes (6): useGroup(), ApiError, ApiResult, ErrorCode, GroupDetailResponse, mockApiClient

### Community 45 - "Admin Leads Management"
Cohesion: 0.23
Nodes (6): AdminLeadsPage(), useAdminLeads(), LeadsTable(), buildQueryString(), mockUseAdminLeads, mockApiClient

### Community 46 - "Empty State Component"
Cohesion: 0.36
Nodes (8): EmptyStateProps, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 47 - "Groups Catalog"
Cohesion: 0.27
Nodes (6): useGroups(), GroupsPage(), GroupsQuery, mockUseGroups, mockUseGroups, mockApiClient

### Community 48 - "Admin Database Model"
Cohesion: 0.29
Nodes (9): Admin, AdminDoc, adminSchema, createAdmin(), getAdminByEmail(), getAdminById(), getAllAdmins(), updateLastLogin() (+1 more)

### Community 49 - "Code Quality Tools"
Cohesion: 0.18
Nodes (11): eslint-config-next, devDependencies, eslint-config-next, @testing-library/react, tsx, @types/react-dom, @vitest/ui, @testing-library/react (+3 more)

### Community 50 - "Badge Component"
Cohesion: 0.29
Nodes (6): Badge(), badgeVariants, NoteMultiSelect(), NoteMultiSelectProps, mockUseAdminNotes, mockUseQueryStates

### Community 51 - "Group Data Layer"
Cohesion: 0.29
Nodes (9): GroupDoc, deleteGroup(), getFeaturedGroups(), getGroupById(), getGroupBySlug(), getRelatedGroups(), listGroups(), mockCtx (+1 more)

### Community 52 - "Price Formatting"
Cohesion: 0.27
Nodes (7): GET, runtime, formatPaise(), getCategoryBreakdown(), getDashboardStats(), getTopNotes(), ADMIN

### Community 53 - "Error Handling UI"
Cohesion: 0.29
Nodes (5): ErrorState(), ErrorStateProps, GroupDetailPage(), mockUseGroup, mockUseGroup

### Community 54 - "App Providers"
Cohesion: 0.29
Nodes (5): AppProviders(), getErrorMessage(), QueryProvider(), ThemeProvider(), mockNextThemesProvider

### Community 55 - "Build Scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, seed, start, test, test:coverage (+1 more)

### Community 56 - "Loading States"
Cohesion: 0.39
Nodes (5): NotesLoading(), ShimmerGroupCard(), ShimmerLoader(), ShimmerNoteCard(), ShimmerStatCard()

### Community 57 - "Category Validation"
Cohesion: 0.31
Nodes (7): categoryBaseSchema, CreateCategoryPayload, createCategorySchema, SubjectInput, subjectSchema, UpdateCategoryInput, UpdateCategoryPayload

### Community 58 - "Typography Fonts"
Cohesion: 0.32
Nodes (6): caveat, instrumentSans, inter, metadata, outfit, RootLayout()

### Community 59 - "Homepage Hooks"
Cohesion: 0.36
Nodes (4): useHome(), HomePage(), HomeResponse, mockApiClient

### Community 60 - "Community 60"
Cohesion: 0.39
Nodes (5): Counter, CounterDoc, counterSchema, generateOrderNumber(), mockLean

### Community 61 - "Community 61"
Cohesion: 0.29
Nodes (7): lucide-react, dependencies, bcryptjs, lucide-react, mongoose, bcryptjs, mongoose

### Community 62 - "Community 62"
Cohesion: 0.33
Nodes (3): AdminOrderPage(), OrderDetailView(), mockUseAdminOrder

### Community 63 - "Community 63"
Cohesion: 0.33
Nodes (4): AdminOrdersPage(), OrdersTable(), mockPush, mockUseAdminOrders

### Community 64 - "Community 64"
Cohesion: 0.33
Nodes (4): AdminPage(), metadata, AdminDashboard(), mockUseDashboard

### Community 65 - "Community 65"
Cohesion: 0.38
Nodes (6): config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, unauthorizedJson()

### Community 66 - "Community 66"
Cohesion: 0.52
Nodes (5): AdminTokenPayload, getSecret(), signAdminToken(), verifyAdminToken(), mocks

### Community 67 - "Community 67"
Cohesion: 0.48
Nodes (5): exportOrders(), getLeadCount(), getTodayLeadCount(), listOrders(), mockOrder

### Community 68 - "Community 68"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 69 - "Community 69"
Cohesion: 0.40
Nodes (4): ContactPage(), ICON_MAP, metadata, mockIcons

### Community 70 - "Community 70"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

### Community 71 - "Community 71"
Cohesion: 0.50
Nodes (3): name, private, version

## Knowledge Gaps
- **418 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+413 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **43 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Layout Components` to `Error Handling React Query`, `Community 72`, `Admin Category Management`, `Pagination UI`, `Empty State Component`, `Admin Authentication`, `Admin Group Management`, `Badge Component`, `Admin Layout`, `Admin Dashboard Pages`, `About Page`, `UI Badges`, `Loading States`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `ok()` connect `CRUD API Handlers` to `Admin Login Schema`, `Startup Runtime`, `API Orders Route`, `Static API Routes`, `Public API Routes`, `Admin API Routes`, `Password Security`, `Admin Activity Model`, `Upload Handling`, `Price Formatting`, `Database Seeding`, `Admin Session Auth`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `Button()` connect `Error Handling React Query` to `Note Management Pages`, `Community 69`, `File Upload Component`, `Admin Category Management`, `Pagination UI`, `Layout Components`, `Admin Group Management`, `Admin Authentication`, `Admin Dashboard Pages`, `Admin Layout`, `Error Handling UI`, `UI Badges`, `Category UI Components`, `Order Detail Page`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _418 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Startup Runtime` be split into smaller, more focused modules?**
  _Cohesion score 0.0650103519668737 - nodes in this community are weakly interconnected._
- **Should `Admin Activity Tracking` be split into smaller, more focused modules?**
  _Cohesion score 0.0711864406779661 - nodes in this community are weakly interconnected._
- **Should `API Orders Route` be split into smaller, more focused modules?**
  _Cohesion score 0.1048265460030166 - nodes in this community are weakly interconnected._