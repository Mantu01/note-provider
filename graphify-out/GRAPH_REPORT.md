# Graph Report - notes-provider  (2026-08-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1607 nodes · 4942 edges · 122 communities (79 shown, 43 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `49041cde`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- admin-auth-detailed.test.ts
- logActivity
- format.ts
- query.ts
- note.model.ts
- json-ld.tsx
- note-form-sections.tsx
- AppError
- ok
- cn
- orders.test.ts
- compilerOptions
- group.mapper.ts
- notes-catalogue.tsx
- note.schema.ts
- category-dialog.tsx
- checkout-page.tsx
- constants.ts
- Notes Provider
- note.service.ts
- card.tsx
- types.ts
- category.model.ts
- use-admin-groups.ts
- admin-shell.tsx
- use-notes-query-state.ts
- components.json
- home-page.tsx
- file-upload-field.tsx
- hooks-comprehensive.test.tsx
- api-handler.ts
- footer.tsx
- privacy/page.tsx
- notes-table.tsx
- api-client.ts
- use-admin-orders.ts
- counter.model.ts
- home/route.ts
- order-status-page.tsx
- group-card.tsx
- button.tsx
- app/layout.tsx
- manifest.json
- note-detail-page.tsx
- admin.schema.ts
- pagination-bar.tsx
- order.mapper.ts
- contact/page.tsx
- order-lookup-page.tsx
- group-detail.tsx
- group-form.tsx
- category.service.ts
- empty-state.tsx
- order.model.ts
- devDependencies
- shimmer-loader.tsx
- utils.ts
- category.schema.ts
- scripts
- admin.service.ts
- checkout/[slug]/page.tsx
- use-home.ts
- dependencies
- orders-table.test.tsx
- (dashboard)/page.tsx
- proxy.ts
- group/[slug]/route.tsx
- home/route.tsx
- logo/route.tsx
- note/[slug]/route.tsx
- stats-grid.tsx
- doctor.config.json
- package.json
- (public)/notes/page.tsx
- class-variance-authority
- cloudinary
- clsx
- date-fns
- apiClient
- eslint.config.mjs
- @hookform/resolvers
- jsdom
- next
- next.config.ts
- next-themes
- @next/third-parties
- nodemailer
- bcryptjs
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
- tailwindcss
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
- activity.mapper.ts
- react-doctor

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
- `loginHandler` --calls--> `fail()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/lib/api-response.ts
- `meHandler` --calls--> `fail()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/lib/api-response.ts
- `registerHandler` --calls--> `fail()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/lib/api-response.ts
- `loginHandler` --calls--> `logActivity()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/services/activity.service.ts
- `logoutHandler` --calls--> `logActivity()`  [EXTRACTED]
  tests/api/admin-auth-detailed.test.ts → src/server/services/activity.service.ts

## Import Cycles
- None detected.

## Communities (122 total, 43 thin omitted)

### Community 0 - "admin-auth-detailed.test.ts"
Cohesion: 0.09
Nodes (35): GET, runtime, POST, runtime, POST, runtime, GET, POST (+27 more)

### Community 1 - "logActivity"
Cohesion: 0.10
Nodes (36): PATCH, runtime, POST, runtime, PATCH, runtime, POST, runtime (+28 more)

### Community 2 - "format.ts"
Cohesion: 0.06
Nodes (36): AdminActivitiesPage(), AdminLeadsPage(), AdminOrderPage(), PriceTag(), ActivitiesTable(), LeadsTable(), OrderDetailView(), COMPACT_NUMBER_FORMAT (+28 more)

### Community 3 - "query.ts"
Cohesion: 0.12
Nodes (30): GET, runtime, GET, runtime, GET, runtime, GET, dynamic (+22 more)

### Community 4 - "note.model.ts"
Cohesion: 0.09
Nodes (21): dynamic, revalidate, dynamic, GET, revalidate, runtime, dynamic, revalidate (+13 more)

### Community 5 - "json-ld.tsx"
Cohesion: 0.15
Nodes (27): HomePageRoute(), metadata, GroupsPageRoute(), metadata, GroupRoute(), GroupRouteProps, PopulatedGroup, NotePageProps (+19 more)

### Community 6 - "note-form-sections.tsx"
Cohesion: 0.12
Nodes (19): DynamicNoteForm, NewNotePage(), FileFieldSource, FileSource, NoteForm(), NoteFormProps, FileAttachmentsSection(), FileAttachmentsSectionProps (+11 more)

### Community 7 - "AppError"
Cohesion: 0.14
Nodes (24): GET, POST, runtime, POST, runtime, AppError, Bucket, enforceRateLimit() (+16 more)

### Community 8 - "ok"
Cohesion: 0.10
Nodes (27): DELETE, GET, GET, runtime, DELETE, GET, GET, DELETE (+19 more)

### Community 9 - "cn"
Cohesion: 0.15
Nodes (19): PageHeader(), Checkbox(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton() (+11 more)

### Community 10 - "orders.test.ts"
Cohesion: 0.11
Nodes (21): runtime, UPLOAD_LIMITS, UploadKind, CloudinaryDeliveryType, CloudinaryResourceType, destroyAsset(), uploadBuffer(), UploadResult (+13 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 12 - "group.mapper.ts"
Cohesion: 0.23
Nodes (21): dynamic, GET, revalidate, runtime, formatPriceLabel(), PublicNote, toAdminRef(), toCategoryRef() (+13 more)

### Community 13 - "notes-catalogue.tsx"
Cohesion: 0.13
Nodes (18): Logo(), LogoProps, sizes, ThemeToggle(), links, MobileNav(), NAV_LINKS, Navbar() (+10 more)

### Community 14 - "note.schema.ts"
Cohesion: 0.10
Nodes (24): NOTE_VISIBILITIES, CreateGroupPayload, createGroupSchema, groupBaseSchema, priceRupeesSchema, refineGroup(), UpdateGroupPayload, updateGroupSchema (+16 more)

### Community 15 - "category-dialog.tsx"
Cohesion: 0.17
Nodes (18): AdminCategoriesPage(), Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay() (+10 more)

### Community 16 - "checkout-page.tsx"
Cohesion: 0.09
Nodes (18): CreateOrderInput, useCreateOrder(), CheckoutPage(), useGroup(), useNote(), checkoutSchema, CheckoutValues, CheckoutOrderResponse (+10 more)

### Community 17 - "constants.ts"
Cohesion: 0.14
Nodes (26): ABOUT_VALUES, ACTIVITY_TARGET_TYPES, ADMIN_ACTIVITY_ACTIONS, ADMIN_PAGE_LIMIT, CONTACT_CHANNELS, ERROR_STATUS, FULFILLMENT_STATUS_LABELS, FULFILLMENT_STATUSES (+18 more)

### Community 18 - "Notes Provider"
Cohesion: 0.07
Nodes (26): Adding a First Admin Account, Available Scripts, Buying Notes, Deploy on Vercel (Recommended), Deployment, Docker, Environment Variables, For Buyers (+18 more)

### Community 19 - "note.service.ts"
Cohesion: 0.13
Nodes (21): GET, runtime, NoteDoc, buildSignedUrl(), driveToDownloadUrl(), addRevenuePaise(), deleteNote(), getFeaturedNotes() (+13 more)

### Community 20 - "card.tsx"
Cohesion: 0.22
Nodes (12): AdminLoginPage(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle() (+4 more)

### Community 21 - "types.ts"
Cohesion: 0.09
Nodes (19): useFilters(), ActivityTargetType, AdminActivityAction, AdminProfile, AdminRef, ApiFailure, ApiSuccess, CategoryRef (+11 more)

### Community 22 - "category.model.ts"
Cohesion: 0.13
Nodes (13): dynamic, GET, revalidate, Category, categorySchema, formatPaise(), generateRevenueSeries(), getCategoryBreakdown() (+5 more)

### Community 23 - "use-admin-groups.ts"
Cohesion: 0.20
Nodes (10): EditGroupPage(), GroupFormContent(), NewGroupPage(), useAdminGroup(), useAdminGroups(), useCreateGroup(), useDeleteGroup(), useUpdateGroup() (+2 more)

### Community 24 - "admin-shell.tsx"
Cohesion: 0.13
Nodes (13): AdminLayout(), metadata, AdminNotesPage(), useAdminLogin(), useAdminLogout(), useAdminProfile(), AdminShell(), navItems (+5 more)

### Community 25 - "use-notes-query-state.ts"
Cohesion: 0.14
Nodes (15): ActiveFilterChips(), NotesCatalogue(), NotesUrlState, parsers, useNotesQueryState(), DEFAULT_PAGE_LIMIT, NOTE_LEVELS, NOTE_SORTS (+7 more)

### Community 26 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 27 - "home-page.tsx"
Cohesion: 0.11
Nodes (8): CategoryCard(), FAQS, HeroSection(), STATS_CONFIG, STEPS, TRUST_ITEMS, formatCompactNumber(), PublicCategory

### Community 28 - "file-upload-field.tsx"
Cohesion: 0.24
Nodes (8): FileUploadField(), FileUploadFieldProps, useDeleteUpload(), useFileUpload(), UploadResponse, mockApiClient, mockToastError, mockToastSuccess

### Community 29 - "hooks-comprehensive.test.tsx"
Cohesion: 0.12
Nodes (10): useDashboard(), useNotes(), OrderLookupResponse, useOrderLookup(), useOrder(), queryKeys, NotesQuery, mockApiClient (+2 more)

### Community 30 - "api-handler.ts"
Cohesion: 0.15
Nodes (21): seed(), seedDate, runtime, connectDb(), globalCache, MongooseCache, adminHandler(), AdminRouteContext (+13 more)

### Community 31 - "footer.tsx"
Cohesion: 0.19
Nodes (14): PublicLayout(), Footer(), FOOTER_LINKS, SOCIAL_LINKS, AppleIcon(), FacebookIcon(), GithubIcon(), GoogleIcon() (+6 more)

### Community 32 - "privacy/page.tsx"
Cohesion: 0.22
Nodes (12): metadata, PrivacyPage(), metadata, RefundPolicyPage(), metadata, TermsPage(), Accordion(), AccordionContent() (+4 more)

### Community 33 - "notes-table.tsx"
Cohesion: 0.23
Nodes (15): AdminGroupsPage(), EmptyState(), PaginationBar(), StatusBadge(), StatusBadgeProps, Table(), TableBody(), TableCaption() (+7 more)

### Community 34 - "api-client.ts"
Cohesion: 0.17
Nodes (10): useAdminActivities(), useAdminLeads(), ApiError, buildQueryString(), AdminActivity, ApiResult, ErrorCode, PaginatedData (+2 more)

### Community 35 - "use-admin-orders.ts"
Cohesion: 0.29
Nodes (6): useAdminOrder(), useAdminOrders(), useUpdateOrderFulfillment(), FulfillmentDialog(), mockUseUpdateOrderFulfillment, mockApiClient

### Community 36 - "counter.model.ts"
Cohesion: 0.39
Nodes (5): Counter, CounterDoc, counterSchema, generateOrderNumber(), mockLean

### Community 37 - "home/route.ts"
Cohesion: 0.14
Nodes (10): dynamic, GET, revalidate, dynamic, GET, revalidate, toAdminCategory(), toPublicCategory() (+2 more)

### Community 38 - "order-status-page.tsx"
Cohesion: 0.15
Nodes (7): dynamic, OrderRoute(), OrderRouteProps, OrderSuccessRouteProps, CopyButton(), OrderStatusPage(), mockUseOrder

### Community 39 - "group-card.tsx"
Cohesion: 0.18
Nodes (9): GroupCard(), GroupCardProps, useGroups(), GroupsPage(), GroupsQuery, PublicGroup, mockUseGroups, mockUseGroups (+1 more)

### Community 40 - "button.tsx"
Cohesion: 0.21
Nodes (7): GlobalError(), NotFound(), Button(), buttonVariants, ExportButton(), mockMutate, mockUseMutation

### Community 41 - "app/layout.tsx"
Cohesion: 0.18
Nodes (9): inter, metadata, outfit, RootLayout(), AppProviders(), getErrorMessage(), QueryProvider(), ThemeProvider() (+1 more)

### Community 42 - "manifest.json"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 43 - "note-detail-page.tsx"
Cohesion: 0.22
Nodes (9): PdfPreviewDialog(), NoteDetailPage(), downloadFile(), useDownloadFile(), mockUseNote, mockUseNote, mockToast, mockUseMutation (+1 more)

### Community 44 - "admin.schema.ts"
Cohesion: 0.17
Nodes (10): AdminLoginInput, AdminLoginPayload, adminLoginSchema, AdminRegisterInput, AdminRegisterPayload, adminRegisterSchema, UpdateOrderPayload, updateOrderSchema (+2 more)

### Community 45 - "pagination-bar.tsx"
Cohesion: 0.29
Nodes (10): PaginationBarProps, Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink(), PaginationLinkProps, PaginationNext() (+2 more)

### Community 46 - "order.mapper.ts"
Cohesion: 0.32
Nodes (10): formatPrice(), toIsoStringRequired(), AdminLead, AdminOrder, PublicOrder, buyerOf(), snapshotOf(), toAdminLead() (+2 more)

### Community 47 - "contact/page.tsx"
Cohesion: 0.22
Nodes (7): AboutPage(), metadata, ContactPage(), ICON_MAP, metadata, StaticPage(), mockIcons

### Community 48 - "order-lookup-page.tsx"
Cohesion: 0.22
Nodes (7): metadata, TrackOrderRoute(), Label(), lookupSchema, LookupValues, OrderLookupPage(), mockUseOrderLookup

### Community 49 - "group-detail.tsx"
Cohesion: 0.21
Nodes (6): ErrorState(), ErrorStateProps, NoteCard(), GroupDetailPage(), mockUseGroup, mockUseGroup

### Community 50 - "group-form.tsx"
Cohesion: 0.19
Nodes (8): Input(), Switch(), GroupFormProps, NoteMultiSelect(), NoteMultiSelectProps, AdminGroup, mockUseAdminNotes, mockUseQueryStates

### Community 51 - "category.service.ts"
Cohesion: 0.26
Nodes (11): CategoryDoc, createCategory(), deleteCategory(), getCategoryById(), getCategoryBySlug(), getCategoryCounts(), getCategoryWithNoteCount(), listActiveCategories() (+3 more)

### Community 52 - "empty-state.tsx"
Cohesion: 0.36
Nodes (8): EmptyStateProps, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 53 - "order.model.ts"
Cohesion: 0.26
Nodes (9): buyerSchema, itemSnapshotSchema, OrderDoc, orderSchema, exportOrders(), getLeadCount(), getTodayLeadCount(), listOrders() (+1 more)

### Community 54 - "devDependencies"
Cohesion: 0.18
Nodes (11): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tsx, @types/react-dom, @vitest/ui (+3 more)

### Community 55 - "shimmer-loader.tsx"
Cohesion: 0.33
Nodes (5): NotesLoading(), NoteCardSkeleton(), ShimmerLoader(), ShimmerNoteCard(), ShimmerStatCard()

### Community 56 - "utils.ts"
Cohesion: 0.23
Nodes (5): Container(), Section(), NoteCardProps, Badge(), badgeVariants

### Community 57 - "category.schema.ts"
Cohesion: 0.25
Nodes (9): categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload, createCategorySchema, SubjectInput, subjectSchema, UpdateCategoryInput, UpdateCategoryPayload (+1 more)

### Community 58 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, seed, start, test, test:coverage (+1 more)

### Community 59 - "admin.service.ts"
Cohesion: 0.36
Nodes (7): AdminDoc, createAdmin(), getAdminByEmail(), getAdminById(), getAllAdmins(), updateLastLogin(), mockAdmin

### Community 60 - "checkout/[slug]/page.tsx"
Cohesion: 0.32
Nodes (5): CheckoutRoute(), metadata, CheckoutContent(), mockSearchParams, mockUseParams

### Community 61 - "use-home.ts"
Cohesion: 0.36
Nodes (4): useHome(), HomePage(), HomeResponse, mockApiClient

### Community 62 - "dependencies"
Cohesion: 0.29
Nodes (7): @base-ui/react, lucide-react, dependencies, @base-ui/react, lucide-react, mongoose, mongoose

### Community 63 - "orders-table.test.tsx"
Cohesion: 0.33
Nodes (4): AdminOrdersPage(), OrdersTable(), mockPush, mockUseAdminOrders

### Community 64 - "(dashboard)/page.tsx"
Cohesion: 0.33
Nodes (4): AdminPage(), metadata, AdminDashboard(), mockUseDashboard

### Community 65 - "proxy.ts"
Cohesion: 0.38
Nodes (6): config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, unauthorizedJson()

### Community 66 - "group/[slug]/route.tsx"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 67 - "home/route.tsx"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 68 - "logo/route.tsx"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 69 - "note/[slug]/route.tsx"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 70 - "stats-grid.tsx"
Cohesion: 0.40
Nodes (4): STAT_CARDS, StatsGrid(), StatsGridProps, DashboardStats

### Community 71 - "doctor.config.json"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

### Community 72 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 80 - "apiClient"
Cohesion: 0.17
Nodes (15): EditNotePage(), NoteFormContent(), useAdminCategories(), useCreateCategory(), useDeleteCategory(), useUpdateCategory(), useAdminNote(), useAdminNotes() (+7 more)

### Community 120 - "activity.mapper.ts"
Cohesion: 0.29
Nodes (6): GET, runtime, AdminActivity, AdminActivityDoc, adminActivitySchema, toAdminActivity()

## Knowledge Gaps
- **420 isolated node(s):** `LogActivityInput`, `CloudinaryDeliveryType`, `CloudinaryResourceType`, `UploadResult`, `LogoProps` (+415 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **43 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `privacy/page.tsx`, `notes-table.tsx`, `group-card.tsx`, `button.tsx`, `notes-catalogue.tsx`, `pagination-bar.tsx`, `category-dialog.tsx`, `order-lookup-page.tsx`, `group-detail.tsx`, `group-form.tsx`, `card.tsx`, `empty-state.tsx`, `shimmer-loader.tsx`, `utils.ts`, `admin-shell.tsx`, `use-notes-query-state.ts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `notes-table.tsx`, `order-status-page.tsx`, `note-form-sections.tsx`, `cn`, `note-detail-page.tsx`, `notes-catalogue.tsx`, `pagination-bar.tsx`, `contact/page.tsx`, `category-dialog.tsx`, `group-detail.tsx`, `group-form.tsx`, `checkout-page.tsx`, `card.tsx`, `order-lookup-page.tsx`, `admin-shell.tsx`, `use-notes-query-state.ts`, `home-page.tsx`, `file-upload-field.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `AppError` connect `AppError` to `admin-auth-detailed.test.ts`, `logActivity`, `api-client.ts`, `note.model.ts`, `home/route.ts`, `ok`, `orders.test.ts`, `group.mapper.ts`, `note.service.ts`, `category.service.ts`, `admin.service.ts`, `api-handler.ts`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `LogActivityInput`, `CloudinaryDeliveryType`, `CloudinaryResourceType` to the rest of the system?**
  _420 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-auth-detailed.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08650937689050212 - nodes in this community are weakly interconnected._
- **Should `logActivity` be split into smaller, more focused modules?**
  _Cohesion score 0.09831649831649832 - nodes in this community are weakly interconnected._
- **Should `format.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05870020964360587 - nodes in this community are weakly interconnected._