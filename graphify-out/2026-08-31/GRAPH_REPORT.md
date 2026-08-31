# Graph Report - notes-provider  (2026-08-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1609 nodes · 4947 edges · 127 communities (80 shown, 47 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `49041cde`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api-response.ts
- admin-auth-detailed.test.ts
- AppError
- note.model.ts
- note.service.ts
- ok
- format.ts
- note-form-sections.tsx
- cn
- category-dialog.tsx
- json-ld.tsx
- compilerOptions
- constants.ts
- note-detail-page.tsx
- group.mapper.ts
- admin-crud-detailed.test.ts
- group.model.ts
- types.ts
- checkout-page.tsx
- Notes Provider
- api-handler.ts
- group.service.ts
- notes-table.tsx
- group-form.tsx
- order-status-page.tsx
- notes-catalogue.tsx
- navbar.tsx
- apiClient
- privacy/page.tsx
- components.json
- home-page.tsx
- use-admin-orders.ts
- orders/[id]/route.ts
- footer.tsx
- order.model.ts
- dashboard.service.ts
- button.tsx
- app/layout.tsx
- hooks-comprehensive.test.tsx
- manifest.json
- use-admin-groups.ts
- download/route.ts
- order.mapper.ts
- pagination-bar.tsx
- file-upload-field.tsx
- query-keys.ts
- revenue-chart.tsx
- order-detail-view.tsx
- empty-state.tsx
- devDependencies
- shimmer-loader.tsx
- badge.tsx
- use-notes-query-state.ts
- auth-guard.test.ts
- category.schema.ts
- order-lookup-page.tsx
- query-schema.test.ts
- scripts
- groups-catalogue.tsx
- admin.service.ts
- checkout/[slug]/page.tsx
- use-home.ts
- counter.model.ts
- dependencies
- orders-table.test.tsx
- (dashboard)/page.tsx
- GroupsTable
- NotesTable
- group/[slug]/route.tsx
- home/route.tsx
- logo/route.tsx
- note/[slug]/route.tsx
- section.tsx
- admin-activity.model.ts
- export-button.tsx
- admin-groups.test.ts
- doctor.config.json
- package.json
- (public)/notes/page.tsx
- groups/new/page.tsx
- errors.test.ts
- class-variance-authority
- cloudinary
- clsx
- date-fns
- eslint
- eslint.config.mjs
- @hookform/resolvers
- next
- next.config.ts
- next-themes
- @next/third-parties
- nodemailer
- jose
- nuqs
- razorpay
- react
- react-dom
- react-hook-form
- react-razorpay
- recharts
- shadcn
- sonner
- tailwind-merge
- @tanstack/react-query
- tw-animate-css
- zod
- react-doctor
- jsdom
- @tailwindcss/postcss
- @testing-library/jest-dom
- @testing-library/react
- @testing-library/user-event
- @types/bcryptjs
- @types/node
- @types/nodemailer
- @types/react
- typescript
- @vitejs/plugin-react
- vitest
- vitest-canvas-mock
- postcss.config.mjs
- bcryptjs

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
- `registerHandler` --calls--> `hashPassword()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/lib/password.ts
- `registerHandler` --calls--> `toAdminProfile()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/mappers/activity.mapper.ts
- `loginHandler` --calls--> `enforceRateLimit()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/lib/rate-limit.ts
- `registerHandler` --calls--> `enforceRateLimit()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/lib/rate-limit.ts
- `seed()` --calls--> `connectDb()`  [EXTRACTED]
  seed.ts → src/server/db/connect.ts

## Import Cycles
- None detected.

## Communities (127 total, 47 thin omitted)

### Community 0 - "api-response.ts"
Cohesion: 0.10
Nodes (34): GET, runtime, GET, runtime, GET, runtime, GET, runtime (+26 more)

### Community 1 - "admin-auth-detailed.test.ts"
Cohesion: 0.10
Nodes (31): GET, runtime, POST, runtime, POST, runtime, GET, runtime (+23 more)

### Community 2 - "AppError"
Cohesion: 0.10
Nodes (30): GET, POST, runtime, POST, runtime, checkoutSchema, CheckoutValues, AppError (+22 more)

### Community 3 - "note.model.ts"
Cohesion: 0.09
Nodes (22): seedDate, runtime, GET, runtime, dynamic, GET, revalidate, dynamic (+14 more)

### Community 4 - "note.service.ts"
Cohesion: 0.08
Nodes (34): ActivityTargetType, AdminActivityAction, CategoryDoc, NoteDoc, slugify(), uniqueSlug(), LogActivityInput, createCategory() (+26 more)

### Community 5 - "ok"
Cohesion: 0.15
Nodes (32): POST, DELETE, PATCH, POST, DELETE, GET, PATCH, runtime (+24 more)

### Community 6 - "format.ts"
Cohesion: 0.09
Nodes (30): AdminActivitiesPage(), ActivitiesTable(), COMPACT_NUMBER_FORMAT, formatDate(), formatDateTime(), formatDiscount(), formatFileSize(), formatFileSizeLabel() (+22 more)

### Community 7 - "note-form-sections.tsx"
Cohesion: 0.08
Nodes (32): DynamicNoteForm, NewNotePage(), FileFieldSource, FileSource, NoteFormProps, FileAttachmentsSection(), FileAttachmentsSectionProps, FileFieldSource (+24 more)

### Community 8 - "cn"
Cohesion: 0.12
Nodes (21): PageHeader(), Checkbox(), Label(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton() (+13 more)

### Community 9 - "category-dialog.tsx"
Cohesion: 0.13
Nodes (22): AdminCategoriesPage(), PdfPreviewDialog(), Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader() (+14 more)

### Community 10 - "json-ld.tsx"
Cohesion: 0.17
Nodes (24): HomePageRoute(), metadata, GroupRoute(), GroupRouteProps, PopulatedGroup, NotePageProps, NoteRoute(), PopulatedNote (+16 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 12 - "constants.ts"
Cohesion: 0.12
Nodes (26): ABOUT_VALUES, ADMIN_PAGE_LIMIT, CONTACT_CHANNELS, FULFILLMENT_STATUS_LABELS, FULL_NAME_PATTERN, LEADS_EXPORT_MAX_ROWS, MAX_PAGE_LIMIT, MIN_PAID_PRICE_PAISE (+18 more)

### Community 13 - "note-detail-page.tsx"
Cohesion: 0.12
Nodes (14): ErrorState(), ErrorStateProps, GroupCard(), GroupCardProps, NoteCard(), NoteCardProps, PriceTag(), GroupDetailPage() (+6 more)

### Community 14 - "group.mapper.ts"
Cohesion: 0.24
Nodes (19): AdminRef, CategoryRef, PublicNote, SubjectItem, toAdminActivity(), toAdminRef(), toCategoryRef(), toAdminGroup() (+11 more)

### Community 15 - "admin-crud-detailed.test.ts"
Cohesion: 0.14
Nodes (18): POST, runtime, UPLOAD_LIMITS, UploadKind, CloudinaryDeliveryType, CloudinaryResourceType, destroyAsset(), uploadBuffer() (+10 more)

### Community 16 - "group.model.ts"
Cohesion: 0.14
Nodes (16): dynamic, revalidate, dynamic, GET, revalidate, runtime, dynamic, GET (+8 more)

### Community 17 - "types.ts"
Cohesion: 0.16
Nodes (12): useAdminLogin(), useAdminLogout(), useFilters(), ApiError, AdminProfile, ApiResult, ErrorCode, FiltersResponse (+4 more)

### Community 18 - "checkout-page.tsx"
Cohesion: 0.10
Nodes (15): CreateOrderInput, useCreateOrder(), CheckoutPage(), useGroup(), useNote(), CheckoutOrderResponse, GroupDetailResponse, PurchaseItemType (+7 more)

### Community 19 - "Notes Provider"
Cohesion: 0.07
Nodes (26): Adding a First Admin Account, Available Scripts, Buying Notes, Deploy on Vercel (Recommended), Deployment, Docker, Environment Variables, For Buyers (+18 more)

### Community 20 - "api-handler.ts"
Cohesion: 0.17
Nodes (20): seed(), runtime, GET, runtime, connectDb(), globalCache, MongooseCache, adminHandler() (+12 more)

### Community 21 - "group.service.ts"
Cohesion: 0.11
Nodes (20): CreateGroupInput, CreateGroupPayload, createGroupSchema, groupBaseSchema, priceRupeesSchema, refineGroup(), UpdateGroupInput, UpdateGroupPayload (+12 more)

### Community 22 - "notes-table.tsx"
Cohesion: 0.25
Nodes (14): AdminLeadsPage(), EmptyState(), PaginationBar(), Input(), Table(), TableBody(), TableCaption(), TableCell() (+6 more)

### Community 23 - "group-form.tsx"
Cohesion: 0.20
Nodes (13): AdminLoginPage(), AboutPage(), metadata, Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+5 more)

### Community 24 - "order-status-page.tsx"
Cohesion: 0.12
Nodes (12): dynamic, OrderRoute(), OrderRouteProps, OrderSuccessRouteProps, CopyButton(), OrderStatusPage(), downloadFile(), useDownloadFile() (+4 more)

### Community 25 - "notes-catalogue.tsx"
Cohesion: 0.16
Nodes (15): links, MobileNav(), Sheet(), SheetClose(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader() (+7 more)

### Community 26 - "navbar.tsx"
Cohesion: 0.13
Nodes (14): AdminLayout(), metadata, Logo(), LogoProps, sizes, ThemeToggle(), NAV_LINKS, Navbar() (+6 more)

### Community 27 - "apiClient"
Cohesion: 0.17
Nodes (16): EditNotePage(), NoteFormContent(), useAdminCategories(), useCreateCategory(), useDeleteCategory(), useUpdateCategory(), useAdminNote(), useAdminNotes() (+8 more)

### Community 28 - "privacy/page.tsx"
Cohesion: 0.20
Nodes (13): metadata, PrivacyPage(), metadata, RefundPolicyPage(), metadata, TermsPage(), StaticPage(), Accordion() (+5 more)

### Community 29 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 30 - "home-page.tsx"
Cohesion: 0.11
Nodes (8): CategoryCard(), FAQS, HeroSection(), STATS_CONFIG, STEPS, TRUST_ITEMS, formatCompactNumber(), PublicCategory

### Community 31 - "use-admin-orders.ts"
Cohesion: 0.36
Nodes (5): useAdminOrder(), useAdminOrders(), useUpdateOrderFulfillment(), AdminOrder, mockApiClient

### Community 32 - "orders/[id]/route.ts"
Cohesion: 0.15
Nodes (14): DELETE, runtime, toServiceContext(), AdminLoginInput, AdminLoginPayload, adminLoginSchema, AdminRegisterInput, AdminRegisterPayload (+6 more)

### Community 33 - "footer.tsx"
Cohesion: 0.19
Nodes (14): PublicLayout(), Footer(), FOOTER_LINKS, SOCIAL_LINKS, AppleIcon(), FacebookIcon(), GithubIcon(), GoogleIcon() (+6 more)

### Community 34 - "order.model.ts"
Cohesion: 0.18
Nodes (13): dynamic, POST(), runtime, buyerSchema, itemSnapshotSchema, Order, OrderDoc, orderSchema (+5 more)

### Community 35 - "dashboard.service.ts"
Cohesion: 0.20
Nodes (10): GET, runtime, AdminActivity, formatPaise(), generateRevenueSeries(), getCategoryBreakdown(), getDashboardStats(), getTopNotes() (+2 more)

### Community 36 - "button.tsx"
Cohesion: 0.21
Nodes (8): GlobalError(), NotFound(), ContactPage(), ICON_MAP, metadata, Button(), buttonVariants, mockIcons

### Community 37 - "app/layout.tsx"
Cohesion: 0.18
Nodes (10): inter, metadata, outfit, RootLayout(), websiteJsonLd(), AppProviders(), getErrorMessage(), QueryProvider() (+2 more)

### Community 38 - "hooks-comprehensive.test.tsx"
Cohesion: 0.12
Nodes (8): useAdminActivities(), OrderLookupResponse, useOrderLookup(), useOrder(), PublicOrder, mockApiClient, mockApiClient, mockApiClient

### Community 39 - "manifest.json"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 40 - "use-admin-groups.ts"
Cohesion: 0.23
Nodes (10): EditGroupPage(), GroupFormContent(), useAdminGroup(), useAdminGroups(), useCreateGroup(), useDeleteGroup(), useUpdateGroup(), GroupForm() (+2 more)

### Community 41 - "download/route.ts"
Cohesion: 0.22
Nodes (9): GET, runtime, dynamic, revalidate, runtime, buildSignedUrl(), driveToDownloadUrl(), incrementDownloadCount() (+1 more)

### Community 42 - "order.mapper.ts"
Cohesion: 0.35
Nodes (9): GET, runtime, toIsoString(), toIsoStringRequired(), buyerOf(), snapshotOf(), toAdminLead(), toAdminOrder() (+1 more)

### Community 43 - "pagination-bar.tsx"
Cohesion: 0.29
Nodes (10): PaginationBarProps, Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink(), PaginationLinkProps, PaginationNext() (+2 more)

### Community 44 - "file-upload-field.tsx"
Cohesion: 0.24
Nodes (8): FileUploadField(), FileUploadFieldProps, useDeleteUpload(), useFileUpload(), UploadResponse, mockApiClient, mockToastError, mockToastSuccess

### Community 45 - "query-keys.ts"
Cohesion: 0.12
Nodes (15): useDashboard(), useAdminLeads(), useGroups(), useNotes(), buildQueryString(), queryKeys, AdminActivity, AdminLead (+7 more)

### Community 46 - "revenue-chart.tsx"
Cohesion: 0.21
Nodes (8): RevenueAreaChart(), RevenueAreaChartProps, RevenueChart(), RevenueChartProps, STAT_CARDS, StatsGrid(), StatsGridProps, DashboardStats

### Community 47 - "order-detail-view.tsx"
Cohesion: 0.24
Nodes (5): AdminOrderPage(), StatusBadge(), StatusBadgeProps, OrderDetailView(), mockUseAdminOrder

### Community 48 - "empty-state.tsx"
Cohesion: 0.36
Nodes (8): EmptyStateProps, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 49 - "devDependencies"
Cohesion: 0.18
Nodes (11): eslint-config-next, devDependencies, eslint-config-next, tailwindcss, tsx, @types/react-dom, @vitest/ui, tailwindcss (+3 more)

### Community 50 - "shimmer-loader.tsx"
Cohesion: 0.33
Nodes (5): NotesLoading(), NoteCardSkeleton(), ShimmerLoader(), ShimmerNoteCard(), ShimmerStatCard()

### Community 51 - "badge.tsx"
Cohesion: 0.29
Nodes (6): Badge(), badgeVariants, NoteMultiSelect(), NoteMultiSelectProps, mockUseAdminNotes, mockUseQueryStates

### Community 52 - "use-notes-query-state.ts"
Cohesion: 0.29
Nodes (7): ActiveFilterChips(), NotesUrlState, parsers, useNotesQueryState(), DEFAULT_PAGE_LIMIT, NOTE_SORTS, mockUseNotesQueryState

### Community 53 - "auth-guard.test.ts"
Cohesion: 0.22
Nodes (9): ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_SECONDS, config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, unauthorizedJson() (+1 more)

### Community 54 - "category.schema.ts"
Cohesion: 0.25
Nodes (9): categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload, createCategorySchema, SubjectInput, subjectSchema, UpdateCategoryInput, UpdateCategoryPayload (+1 more)

### Community 55 - "order-lookup-page.tsx"
Cohesion: 0.27
Nodes (6): metadata, TrackOrderRoute(), lookupSchema, LookupValues, OrderLookupPage(), mockUseOrderLookup

### Community 56 - "query-schema.test.ts"
Cohesion: 0.29
Nodes (8): FULFILLMENT_STATUSES, NOTE_LEVELS, NOTE_PRICING_TYPES, NOTE_VISIBILITIES, ORDER_SORTS, PAYMENT_STATUSES, NotesQuerySchema, OrdersQuerySchema

### Community 57 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, seed, start, test, test:coverage (+1 more)

### Community 58 - "groups-catalogue.tsx"
Cohesion: 0.31
Nodes (5): GroupsPageRoute(), metadata, GroupsPage(), mockUseGroups, mockUseGroups

### Community 59 - "admin.service.ts"
Cohesion: 0.36
Nodes (7): AdminDoc, createAdmin(), getAdminByEmail(), getAdminById(), getAllAdmins(), updateLastLogin(), mockAdmin

### Community 60 - "checkout/[slug]/page.tsx"
Cohesion: 0.32
Nodes (5): CheckoutRoute(), metadata, CheckoutContent(), mockSearchParams, mockUseParams

### Community 61 - "use-home.ts"
Cohesion: 0.36
Nodes (4): useHome(), HomePage(), HomeResponse, mockApiClient

### Community 62 - "counter.model.ts"
Cohesion: 0.39
Nodes (5): Counter, CounterDoc, counterSchema, generateOrderNumber(), mockLean

### Community 63 - "dependencies"
Cohesion: 0.29
Nodes (7): @base-ui/react, lucide-react, dependencies, @base-ui/react, lucide-react, mongoose, mongoose

### Community 64 - "orders-table.test.tsx"
Cohesion: 0.33
Nodes (4): AdminOrdersPage(), OrdersTable(), mockPush, mockUseAdminOrders

### Community 65 - "(dashboard)/page.tsx"
Cohesion: 0.33
Nodes (4): AdminPage(), metadata, AdminDashboard(), mockUseDashboard

### Community 66 - "GroupsTable"
Cohesion: 0.40
Nodes (3): AdminGroupsPage(), GroupsTable(), mockUseAdminGroups

### Community 67 - "NotesTable"
Cohesion: 0.40
Nodes (3): AdminNotesPage(), NotesTable(), mockUseAdminNotes

### Community 68 - "group/[slug]/route.tsx"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 69 - "home/route.tsx"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 70 - "logo/route.tsx"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 71 - "note/[slug]/route.tsx"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 73 - "admin-activity.model.ts"
Cohesion: 0.33
Nodes (4): ACTIVITY_TARGET_TYPES, ADMIN_ACTIVITY_ACTIONS, AdminActivityDoc, adminActivitySchema

### Community 74 - "export-button.tsx"
Cohesion: 0.50
Nodes (3): ExportButton(), mockMutate, mockUseMutation

### Community 76 - "doctor.config.json"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

### Community 77 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, version

## Knowledge Gaps
- **421 isolated node(s):** `GroupRouteProps`, `PopulatedGroup`, `NotePageProps`, `PopulatedNote`, `ErrorStateProps` (+416 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `button.tsx`, `section.tsx`, `category-dialog.tsx`, `pagination-bar.tsx`, `note-detail-page.tsx`, `empty-state.tsx`, `shimmer-loader.tsx`, `badge.tsx`, `notes-table.tsx`, `group-form.tsx`, `notes-catalogue.tsx`, `navbar.tsx`, `privacy/page.tsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `ok()` connect `ok` to `api-response.ts`, `admin-auth-detailed.test.ts`, `orders/[id]/route.ts`, `note.model.ts`, `dashboard.service.ts`, `AppError`, `order.mapper.ts`, `admin-crud-detailed.test.ts`, `group.model.ts`, `api-handler.ts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `note-form-sections.tsx`, `cn`, `category-dialog.tsx`, `export-button.tsx`, `pagination-bar.tsx`, `file-upload-field.tsx`, `note-detail-page.tsx`, `order-detail-view.tsx`, `checkout-page.tsx`, `use-notes-query-state.ts`, `order-lookup-page.tsx`, `notes-table.tsx`, `group-form.tsx`, `order-status-page.tsx`, `notes-catalogue.tsx`, `navbar.tsx`, `home-page.tsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `GroupRouteProps`, `PopulatedGroup`, `NotePageProps` to the rest of the system?**
  _421 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api-response.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09724238026124818 - nodes in this community are weakly interconnected._
- **Should `admin-auth-detailed.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09959183673469388 - nodes in this community are weakly interconnected._
- **Should `AppError` be split into smaller, more focused modules?**
  _Cohesion score 0.10119047619047619 - nodes in this community are weakly interconnected._