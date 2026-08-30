# Graph Report - notes-provider  (2026-08-30)

## Corpus Check
- 450 files · ~181,235 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1620 nodes · 4980 edges · 122 communities (78 shown, 44 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
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
- `seed()` --calls--> `connectDb()`  [EXTRACTED]
  seed.ts → src/server/db/connect.ts
- `mountHook()` --calls--> `useDownloadFile()`  [EXTRACTED]
  tests/hooks/use-download-file.test.tsx → src/hooks/use-download-file.ts
- `logoutHandler` --calls--> `ok()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/lib/api-response.ts
- `meHandler` --calls--> `ok()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/lib/api-response.ts
- `meHandler` --calls--> `fail()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/lib/api-response.ts

## Import Cycles
- None detected.

## Communities (122 total, 44 thin omitted)

### Community 0 - "Home & Public API"
Cohesion: 0.08
Nodes (57): GET, dynamic, GET, revalidate, PriceTag(), COMPACT_NUMBER_FORMAT, formatDate(), formatDateTime() (+49 more)

### Community 1 - "Uploads API"
Cohesion: 0.07
Nodes (37): POST, runtime, GET, runtime, dynamic, revalidate, runtime, GET (+29 more)

### Community 2 - "Layout Components"
Cohesion: 0.08
Nodes (34): Container(), links, MobileNav(), PageHeader(), Section(), EmptyStateProps, Checkbox(), Empty() (+26 more)

### Community 3 - "Admin API"
Cohesion: 0.08
Nodes (34): GET, runtime, POST, runtime, POST, runtime, GET, runtime (+26 more)

### Community 4 - "Auth & Categories API"
Cohesion: 0.11
Nodes (42): POST, DELETE, PATCH, POST, DELETE, GET, PATCH, runtime (+34 more)

### Community 5 - "Database Seed"
Cohesion: 0.09
Nodes (33): seed(), seedDate, dynamic, revalidate, POST, runtime, dynamic, POST() (+25 more)

### Community 6 - "Admin Activities & Categories"
Cohesion: 0.06
Nodes (32): runtime, runtime, GET, runtime, GET, runtime, dynamic, GET (+24 more)

### Community 7 - "Note Edit Page"
Cohesion: 0.06
Nodes (41): EditNotePage(), NoteFormContent(), DynamicNoteForm, NewNotePage(), useAdminNote(), useCreateNote(), useUpdateNote(), FileFieldSource (+33 more)

### Community 8 - "Admin Login"
Cohesion: 0.13
Nodes (22): AdminLoginPage(), CopyButton(), ErrorState(), ErrorStateProps, Button(), Card(), CardAction(), CardContent() (+14 more)

### Community 9 - "Notes Dashboard"
Cohesion: 0.14
Nodes (24): AdminNotesPage(), EmptyState(), PaginationBar(), StatusBadge(), StatusBadgeProps, Badge(), badgeVariants, Input() (+16 more)

### Community 10 - "Notes Query State"
Cohesion: 0.11
Nodes (36): NotesUrlState, parsers, ABOUT_VALUES, ACTIVITY_TARGET_TYPES, ADMIN_ACTIVITY_ACTIONS, ADMIN_PAGE_LIMIT, ADMIN_SESSION_MAX_AGE_SECONDS, CONTACT_CHANNELS (+28 more)

### Community 11 - "Root Layout"
Cohesion: 0.13
Nodes (28): inter, metadata, outfit, RootLayout(), HomePageRoute(), metadata, GroupRoute(), GroupRouteProps (+20 more)

### Community 12 - "Public Notes Loading"
Cohesion: 0.08
Nodes (16): NotesLoading(), CategoryCard(), GroupCard(), GroupCardProps, NoteCardSkeleton(), ShimmerLoader(), ShimmerNoteCard(), ShimmerStatCard() (+8 more)

### Community 13 - "UI Primitives (Label, Select)"
Cohesion: 0.10
Nodes (25): Label(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator() (+17 more)

### Community 14 - "Categories API"
Cohesion: 0.11
Nodes (27): dynamic, GET, revalidate, dynamic, revalidate, runtime, dynamic, revalidate (+19 more)

### Community 15 - "PDF Preview Dialog"
Cohesion: 0.14
Nodes (23): PdfPreviewDialog(), Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay() (+15 more)

### Community 16 - "Checkout Order Hook"
Cohesion: 0.09
Nodes (18): CreateOrderInput, useCreateOrder(), CheckoutPage(), useGroup(), GroupDetailPage(), checkoutSchema, CheckoutValues, CheckoutOrderResponse (+10 more)

### Community 17 - "Ref Dom / DOM Utils"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 18 - "README Documentation"
Cohesion: 0.07
Nodes (26): Adding a First Admin Account, Available Scripts, Buying Notes, Deploy on Vercel (Recommended), Deployment, Docker, Environment Variables, For Buyers (+18 more)

### Community 19 - "Error Handling"
Cohesion: 0.13
Nodes (10): GlobalError(), NotFound(), Logo(), LogoProps, sizes, ThemeToggle(), NAV_LINKS, Navbar() (+2 more)

### Community 20 - "Group Edit Page"
Cohesion: 0.14
Nodes (14): EditGroupPage(), GroupFormContent(), NewGroupPage(), AdminGroupsPage(), useAdminGroup(), useAdminGroups(), useCreateGroup(), useDeleteGroup() (+6 more)

### Community 21 - "Privacy Page"
Cohesion: 0.20
Nodes (13): metadata, PrivacyPage(), metadata, RefundPolicyPage(), metadata, TermsPage(), StaticPage(), Accordion() (+5 more)

### Community 22 - "Config Aliases"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 23 - "Order Detail Page"
Cohesion: 0.12
Nodes (11): AdminOrderPage(), AdminOrdersPage(), useAdminOrder(), useAdminOrders(), OrderDetailView(), OrdersTable(), AdminOrder, mockUseAdminOrder (+3 more)

### Community 24 - "Leads Dashboard"
Cohesion: 0.16
Nodes (10): AdminLeadsPage(), useAdminLeads(), LeadsTable(), ApiError, buildQueryString(), AdminLead, ApiResult, ErrorCode (+2 more)

### Community 25 - "Public Layout & Footer"
Cohesion: 0.19
Nodes (14): PublicLayout(), Footer(), FOOTER_LINKS, SOCIAL_LINKS, AppleIcon(), FacebookIcon(), GithubIcon(), GoogleIcon() (+6 more)

### Community 26 - "Admin Leads API"
Cohesion: 0.23
Nodes (12): GET, GET, runtime, GET, runtime, GET, buildOrderFilter(), buildOrderSort() (+4 more)

### Community 27 - "Order Success Page"
Cohesion: 0.16
Nodes (11): OrderSuccessRouteProps, buyerSchema, itemSnapshotSchema, Order, OrderDoc, orderSchema, exportOrders(), getLeadCount() (+3 more)

### Community 28 - "Admin Dashboard Layout"
Cohesion: 0.18
Nodes (11): AdminLayout(), metadata, useAdminLogin(), useAdminLogout(), useAdminProfile(), AdminShell(), navItems, AdminProfile (+3 more)

### Community 29 - "About Page"
Cohesion: 0.16
Nodes (11): AboutPage(), metadata, ContactPage(), ICON_MAP, metadata, GroupsPageRoute(), metadata, metadata (+3 more)

### Community 30 - "Home Feature API"
Cohesion: 0.15
Nodes (7): useHome(), HomePage(), useFilters(), FiltersResponse, HomeResponse, mockApiClient, mockApiClient

### Community 31 - "Type Definitions"
Cohesion: 0.11
Nodes (17): ActivityTargetType, AdminActivityAction, AdminGroup, AdminRef, ApiFailure, ApiSuccess, CategoryRef, FulfillmentStatus (+9 more)

### Community 32 - "Note Service & Model"
Cohesion: 0.21
Nodes (15): NoteDoc, addRevenuePaise(), deleteNote(), getFeaturedNotes(), getFreeNotes(), getGroupsByNoteId(), getLatestNotes(), getNoteById() (+7 more)

### Community 33 - "Categories Dashboard"
Cohesion: 0.19
Nodes (9): AdminCategoriesPage(), useAdminCategories(), useCreateCategory(), useDeleteCategory(), useUpdateCategory(), CategoriesTable(), CategoryDialog(), mockUseAdminCategories (+1 more)

### Community 34 - "Dashboard API Route"
Cohesion: 0.22
Nodes (9): GET, runtime, formatPaise(), generateRevenueSeries(), getCategoryBreakdown(), getDashboardStats(), getTopNotes(), toDateKey() (+1 more)

### Community 35 - "Web Manifest"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 36 - "Notes API Route"
Cohesion: 0.35
Nodes (11): dynamic, GET, revalidate, buildNoteFilter(), buildNoteSort(), escapeRegex(), parseArrayParam(), parseBooleanParam() (+3 more)

### Community 37 - "Admin Schema"
Cohesion: 0.17
Nodes (10): AdminLoginInput, AdminLoginPayload, adminLoginSchema, AdminRegisterInput, AdminRegisterPayload, adminRegisterSchema, UpdateOrderPayload, updateOrderSchema (+2 more)

### Community 38 - "File Upload Field"
Cohesion: 0.23
Nodes (9): FileUploadField(), FileUploadFieldProps, useDeleteUpload(), useFileUpload(), UploadKind, UploadResponse, mockApiClient, mockToastError (+1 more)

### Community 39 - "Pagination Bar"
Cohesion: 0.29
Nodes (10): PaginationBarProps, Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink(), PaginationLinkProps, PaginationNext() (+2 more)

### Community 40 - "Activities Dashboard"
Cohesion: 0.19
Nodes (7): AdminActivitiesPage(), useAdminActivities(), ActivitiesTable(), AdminActivity, PaginatedData, mockUseAdminActivities, mockApiClient

### Community 41 - "Admin Dashboard Feature"
Cohesion: 0.22
Nodes (6): useDashboard(), AdminDashboard(), queryKeys, NotesQuery, mockUseDashboard, mockApiClient

### Community 42 - "Groups Catalogue"
Cohesion: 0.27
Nodes (6): useGroups(), GroupsPage(), GroupsQuery, mockUseGroups, mockUseGroups, mockApiClient

### Community 43 - "Order Lookup"
Cohesion: 0.24
Nodes (7): OrderLookupResponse, useOrderLookup(), lookupSchema, LookupValues, OrderLookupPage(), mockUseOrderLookup, mockApiClient

### Community 44 - "ESLint Config"
Cohesion: 0.18
Nodes (11): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tsx, @types/react-dom, @vitest/ui (+3 more)

### Community 45 - "Leads Export API"
Cohesion: 0.29
Nodes (6): GET, runtime, escapeCell(), FORMULA_PREFIXES, toCsv(), ADMIN

### Community 46 - "Single Note Detail"
Cohesion: 0.24
Nodes (6): useNote(), NoteDetailPage(), NoteDetailResponse, mockUseNote, mockUseNote, mockApiClient

### Community 47 - "Group Service & Model"
Cohesion: 0.29
Nodes (9): GroupDoc, deleteGroup(), getFeaturedGroups(), getGroupById(), getGroupBySlug(), getRelatedGroups(), listGroups(), mockCtx (+1 more)

### Community 48 - "Category Schema"
Cohesion: 0.27
Nodes (8): categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload, createCategorySchema, SubjectInput, subjectSchema, UpdateCategoryInput, UpdateCategoryPayload

### Community 49 - "App Providers"
Cohesion: 0.29
Nodes (5): AppProviders(), getErrorMessage(), QueryProvider(), ThemeProvider(), mockNextThemesProvider

### Community 50 - "NPM Scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, seed, start, test, test:coverage (+1 more)

### Community 51 - "Order Status Page"
Cohesion: 0.28
Nodes (5): useOrder(), OrderStatusPage(), PublicOrder, mockUseOrder, mockApiClient

### Community 52 - "Admin Service & Model"
Cohesion: 0.36
Nodes (7): AdminDoc, createAdmin(), getAdminByEmail(), getAdminById(), getAllAdmins(), updateLastLogin(), mockAdmin

### Community 53 - "Checkout Page"
Cohesion: 0.32
Nodes (5): CheckoutRoute(), metadata, CheckoutContent(), mockSearchParams, mockUseParams

### Community 54 - "Counter Model"
Cohesion: 0.39
Nodes (5): Counter, CounterDoc, counterSchema, generateOrderNumber(), mockLean

### Community 55 - "External Dependencies"
Cohesion: 0.29
Nodes (7): lucide-react, next, dependencies, lucide-react, mongoose, next, mongoose

### Community 56 - "Proxy Config"
Cohesion: 0.38
Nodes (6): config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, unauthorizedJson()

### Community 57 - "Leads Export Button"
Cohesion: 0.40
Nodes (3): ExportButton(), mockMutate, mockUseMutation

### Community 58 - "OG Group Image"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 59 - "OG Home Image"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 60 - "OG Logo Image"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 61 - "OG Note Image"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 62 - "Public Order Page"
Cohesion: 0.40
Nodes (3): dynamic, OrderRoute(), OrderRouteProps

### Community 63 - "Note Card Component"
Cohesion: 0.53
Nodes (3): NoteCard(), NoteCardProps, PublicNote

### Community 64 - "Admin CRUD Tests"
Cohesion: 0.33
Nodes (3): ADMIN, authMocks, HEAD_ADMIN

### Community 65 - "Community 65"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

### Community 66 - "Community 66"
Cohesion: 0.50
Nodes (3): name, private, version

## Knowledge Gaps
- **419 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+414 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 2` to `Community 39`, `Community 8`, `Community 9`, `Community 12`, `Community 13`, `Community 15`, `Community 19`, `Community 21`, `Community 28`, `Community 63`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 8` to `Community 2`, `Community 38`, `Community 39`, `Community 7`, `Community 9`, `Community 43`, `Community 12`, `Community 13`, `Community 15`, `Community 16`, `Community 19`, `Community 57`, `Community 28`, `Community 29`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `ok()` connect `Community 4` to `Community 0`, `Community 1`, `Community 34`, `Community 3`, `Community 36`, `Community 5`, `Community 6`, `Community 14`, `Community 26`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _419 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07797537619699042 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07486338797814207 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07853107344632769 - nodes in this community are weakly interconnected._