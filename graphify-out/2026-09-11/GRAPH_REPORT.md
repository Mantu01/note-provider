# Graph Report - notes-provider  (2026-09-11)

## Corpus Check
- 415 files · ~175,067 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1594 nodes · 4697 edges · 114 communities (83 shown, 31 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dd0536fd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- json-ld.tsx
- format.ts
- button.tsx
- group.service.ts
- cn
- auth-guard.ts
- notes-table.tsx
- note-form-sections.tsx
- useAdmin.ts
- admin-crud-detailed.test.ts
- constants.ts
- api-handler.ts
- orders.test.ts
- dependencies
- category-dialog.tsx
- compilerOptions
- Note
- home-page.tsx
- api-client.ts
- Notes Provider
- errors.ts
- ok
- checkout-page.tsx
- useGroups.ts
- note-card.tsx
- types.ts
- Component Library Config
- Order
- group-form.tsx
- admin.schema.ts
- groups/[id]/edit/page.tsx
- public-routes-detailed.test.ts
- admin-shell.tsx
- dashboard.service.ts
- group.model.ts
- note.model.ts
- note.service.ts
- manifest.json
- query.ts
- hooks-comprehensive.test.tsx
- order.model.ts
- category.service.ts
- order/[orderId]/page.tsx
- footer.tsx
- useDownloadFile
- empty-state.tsx
- pagination-bar.tsx
- devDependencies
- export/route.ts
- logo.tsx
- badge.tsx
- file-upload-field.tsx
- use-notes-query-state.ts
- counter.model.ts
- scripts
- jsdom
- navbar.tsx
- useHome.ts
- Minimum Release Age Policy
- [id]/page.tsx
- proxy.ts
- next/navigation
- Razorpay Payment Gateway
- export-button.tsx
- group/[slug]/route.tsx
- home/route.tsx
- logo/route.tsx
- note/[slug]/route.tsx
- SEO Optimization
- doctor.config.json
- package.json
- PWA (Progressive Web App) Support
- connect.test.ts
- Next.js 16
- Notes Catalog
- next.config.ts
- (dashboard)/groups/page.tsx
- date-fns
- eslint.config.mjs
- lucide-react
- mongoose
- react
- react-razorpay
- shadcn
- sonner
- tailwind-merge
- zod
- react-doctor
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
- pnpm Workspace Configuration
- Window/Browser SVG Icon

## God Nodes (most connected - your core abstractions)
1. `cn()` - 107 edges
2. `ok()` - 67 edges
3. `AppError` - 56 edges
4. `Note` - 49 edges
5. `apiClient()` - 41 edges
6. `Button()` - 40 edges
7. `Group` - 35 edges
8. `Notes Provider` - 30 edges
9. `Order` - 27 edges
10. `fail()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `Razorpay Payment Gateway` --semantically_similar_to--> `nodemailer`  [INFERRED] [semantically similar]
  README.md → package.json
- `Globe/Web SVG Icon` --semantically_similar_to--> `Digital Content Marketplace`  [INFERRED] [semantically similar]
  public/globe.svg → README.md
- `File/Document SVG Icon` --semantically_similar_to--> `PDF Delivery Mechanism`  [INFERRED] [semantically similar]
  public/file.svg → README.md
- `Notes Provider` --uses--> `typescript`  [EXTRACTED]
  README.md → package.json
- `Notes Provider` --uses--> `cloudinary`  [EXTRACTED]
  README.md → package.json

## Import Cycles
- None detected.

## Communities (114 total, 31 thin omitted)

### Community 0 - "json-ld.tsx"
Cohesion: 0.05
Nodes (63): caveat, instrumentSans, inter, metadata, outfit, RootLayout(), HomePageRoute(), metadata (+55 more)

### Community 1 - "format.ts"
Cohesion: 0.08
Nodes (52): GET, COMPACT_NUMBER_FORMAT, formatDate(), formatDateTime(), formatFileSize(), formatFileSizeLabel(), formatPrice(), formatPriceLabel() (+44 more)

### Community 2 - "button.tsx"
Cohesion: 0.11
Nodes (25): ContactPage(), ICON_MAP, metadata, RecentOrders(), RevenueChart(), RevenueChartProps, STAT_CARDS, StatsGrid() (+17 more)

### Community 3 - "group.service.ts"
Cohesion: 0.08
Nodes (40): PATCH, runtime, GET, POST, runtime, PATCH, runtime, POST (+32 more)

### Community 4 - "cn"
Cohesion: 0.10
Nodes (23): Container(), MobileNav(), PageHeader(), Section(), FilterPanel(), NotesCatalogue(), Checkbox(), Sheet() (+15 more)

### Community 5 - "auth-guard.ts"
Cohesion: 0.10
Nodes (25): runtime, POST, runtime, ADMIN_SESSION_MAX_AGE_SECONDS, Admin, AdminDoc, adminSchema, AdminSession (+17 more)

### Community 6 - "notes-table.tsx"
Cohesion: 0.13
Nodes (21): AdminLeadsPage(), AdminNotesPage(), AdminOrdersPage(), LeadsTable(), OrdersTable(), EmptyState(), PaginationBar(), StatusBadge() (+13 more)

### Community 7 - "note-form-sections.tsx"
Cohesion: 0.08
Nodes (32): DynamicNoteForm, NewNotePage(), FileFieldSource, FileSource, NoteFormProps, FileAttachmentsSection(), FileAttachmentsSectionProps, FileFieldSource (+24 more)

### Community 8 - "useAdmin.ts"
Cohesion: 0.10
Nodes (26): EditNotePage(), NoteFormContent(), AdminDashboard(), CategoriesTable(), NoteForm(), NotesTable(), useAdminCategories(), useAdminNote() (+18 more)

### Community 9 - "admin-crud-detailed.test.ts"
Cohesion: 0.13
Nodes (19): DELETE, POST, runtime, UPLOAD_LIMITS, UploadKind, CloudinaryDeliveryType, CloudinaryResourceType, destroyAsset() (+11 more)

### Community 10 - "constants.ts"
Cohesion: 0.13
Nodes (30): ABOUT_VALUES, ADMIN_PAGE_LIMIT, CONTACT_CHANNELS, DEFAULT_PAGE_LIMIT, ERROR_STATUS, FULFILLMENT_STATUS_LABELS, FULFILLMENT_STATUSES, FULL_NAME_PATTERN (+22 more)

### Community 11 - "api-handler.ts"
Cohesion: 0.15
Nodes (25): POST, runtime, POST, runtime, runtime, revalidate, runtime, connectDB() (+17 more)

### Community 12 - "orders.test.ts"
Cohesion: 0.12
Nodes (27): GET, POST, runtime, POST, runtime, Bucket, enforceRateLimit(), globalStore (+19 more)

### Community 13 - "dependencies"
Cohesion: 0.06
Nodes (33): @base-ui/react, class-variance-authority, clsx, @hookform/resolvers, next, next-themes, @next/third-parties, dependencies (+25 more)

### Community 14 - "category-dialog.tsx"
Cohesion: 0.15
Nodes (20): AdminCategoriesPage(), CATEGORY_ICON_PRESETS, CategoryDialog(), CategoryDialogProps, FulfillmentDialog(), FulfillmentDialogProps, PdfPreviewDialog(), Dialog() (+12 more)

### Community 15 - "compilerOptions"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 16 - "Note"
Cohesion: 0.12
Nodes (18): dynamic, GET, revalidate, dynamic, GET, revalidate, dynamic, EMPTY_HOME (+10 more)

### Community 17 - "home-page.tsx"
Cohesion: 0.10
Nodes (13): NotesLoading(), HeroSection(), CategoryCard(), ShimmerGroupCard(), ShimmerLoader(), ShimmerNoteCard(), ShimmerStatCard(), HOME_FAQS (+5 more)

### Community 18 - "api-client.ts"
Cohesion: 0.15
Nodes (9): useAdminLeads(), useNotes(), ApiError, buildQueryString(), ApiResult, ErrorCode, mockApiClient, mockApiClient (+1 more)

### Community 19 - "Notes Provider"
Cohesion: 0.08
Nodes (27): Admin Registration Secret, BCrypt Password Hashing, Buyer Role, cloudinary, Dark/Light Theme Support, Digital Content Marketplace, HTTP-only Cookies, Incremental Static Regeneration (ISR) (+19 more)

### Community 20 - "errors.ts"
Cohesion: 0.14
Nodes (12): GET, runtime, revalidate, runtime, ADMIN_SESSION_COOKIE, okPaginated(), AppError, duplicateKeyToAppError() (+4 more)

### Community 21 - "ok"
Cohesion: 0.15
Nodes (21): GET, DELETE, DELETE, GET, GET, DELETE, GET, PATCH (+13 more)

### Community 22 - "checkout-page.tsx"
Cohesion: 0.14
Nodes (13): CheckoutPage(), useCreateOrder(), useGroup(), useNote(), checkoutSchema, CheckoutValues, CreateOrderPayload, PurchaseItemType (+5 more)

### Community 23 - "useGroups.ts"
Cohesion: 0.11
Nodes (12): GroupDetailPage(), GroupsPage(), useGroups(), queryKeys, GroupDetailResponse, GroupsQuery, mockUseGroup, mockUseGroups (+4 more)

### Community 24 - "note-card.tsx"
Cohesion: 0.13
Nodes (14): LEVEL_BADGE, LevelBadge(), LevelBadgeProps, PRICING_BADGE, PricingBadge(), PricingBadgeProps, GroupCard(), GroupCardProps (+6 more)

### Community 25 - "types.ts"
Cohesion: 0.07
Nodes (27): useFilters(), AdminAuthResponse, AdminGroup, AdminLead, AdminOrder, AdminProfile, AdminRef, ApiFailure (+19 more)

### Community 26 - "Component Library Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 27 - "Order"
Cohesion: 0.20
Nodes (14): GET, runtime, GET, runtime, dynamic, GET, revalidate, Order (+6 more)

### Community 28 - "group-form.tsx"
Cohesion: 0.16
Nodes (14): GroupFormProps, FilterPanelProps, Label(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton() (+6 more)

### Community 29 - "admin.schema.ts"
Cohesion: 0.17
Nodes (10): AdminLoginInput, AdminLoginPayload, adminLoginSchema, AdminRegisterInput, AdminRegisterPayload, adminRegisterSchema, UpdateOrderPayload, updateOrderSchema (+2 more)

### Community 30 - "groups/[id]/edit/page.tsx"
Cohesion: 0.14
Nodes (12): EditGroupPage(), GroupFormContent(), NewGroupPage(), GroupForm(), GroupsTable(), useAdminGroup(), useAdminGroups(), useCreateGroup() (+4 more)

### Community 31 - "public-routes-detailed.test.ts"
Cohesion: 0.20
Nodes (10): GET, runtime, dynamic, GET, revalidate, runtime, buildSignedUrl(), driveToDownloadUrl() (+2 more)

### Community 32 - "admin-shell.tsx"
Cohesion: 0.17
Nodes (10): AdminLayout(), metadata, AdminShell(), navItems, useAdminLogin(), useAdminLogout(), useAdminProfile(), mockMutate (+2 more)

### Community 33 - "dashboard.service.ts"
Cohesion: 0.22
Nodes (9): GET, runtime, formatPaise(), generateRevenueSeries(), getCategoryBreakdown(), getDashboardStats(), getTopNotes(), toDateKey() (+1 more)

### Community 34 - "group.model.ts"
Cohesion: 0.15
Nodes (10): seed(), seedDate, dynamic, POST(), runtime, Group, GroupDoc, groupSchema (+2 more)

### Community 35 - "note.model.ts"
Cohesion: 0.20
Nodes (4): NoteDoc, noteSchema, ADMIN, HEAD_ADMIN

### Community 36 - "note.service.ts"
Cohesion: 0.23
Nodes (14): addRevenuePaise(), deleteNote(), getFeaturedNotes(), getFreeNotes(), getGroupsByNoteId(), getLatestNotes(), getNoteById(), getNoteBySlug() (+6 more)

### Community 37 - "manifest.json"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 38 - "query.ts"
Cohesion: 0.34
Nodes (11): dynamic, GET, revalidate, NoteSort, buildNoteFilter(), buildNoteSort(), escapeRegex(), parseArrayParam() (+3 more)

### Community 39 - "hooks-comprehensive.test.tsx"
Cohesion: 0.17
Nodes (6): OrderLookupResponse, useOrder(), useOrderLookup(), PublicOrder, mockApiClient, mockApiClient

### Community 40 - "order.model.ts"
Cohesion: 0.21
Nodes (9): buyerSchema, itemSnapshotSchema, OrderDoc, orderSchema, exportOrders(), getLeadCount(), getTodayLeadCount(), listOrders() (+1 more)

### Community 41 - "category.service.ts"
Cohesion: 0.13
Nodes (20): categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload, createCategorySchema, SubjectInput, subjectSchema, UpdateCategoryInput, UpdateCategoryPayload (+12 more)

### Community 42 - "order/[orderId]/page.tsx"
Cohesion: 0.18
Nodes (5): OrderRoute(), OrderRouteProps, OrderSuccessRouteProps, OrderStatusPage(), mockUseOrder

### Community 43 - "footer.tsx"
Cohesion: 0.30
Nodes (8): Footer(), FOOTER_LINKS, SOCIAL_LINKS, SocialLink, GithubIcon(), InstagramIcon(), XIcon(), YouTubeIcon()

### Community 44 - "useDownloadFile"
Cohesion: 0.23
Nodes (8): NoteDetailPage(), downloadFile(), useDownloadFile(), mockUseNote, mockUseNote, mockToast, mockUseMutation, mountHook()

### Community 45 - "empty-state.tsx"
Cohesion: 0.36
Nodes (8): EmptyStateProps, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 46 - "pagination-bar.tsx"
Cohesion: 0.35
Nodes (9): PaginationBarProps, Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink(), PaginationLinkProps, PaginationNext() (+1 more)

### Community 47 - "devDependencies"
Cohesion: 0.18
Nodes (11): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tsx, @types/react-dom, @vitest/ui (+3 more)

### Community 48 - "export/route.ts"
Cohesion: 0.29
Nodes (6): GET, runtime, escapeCell(), FORMULA_PREFIXES, toCsv(), ADMIN

### Community 49 - "logo.tsx"
Cohesion: 0.27
Nodes (5): GlobalError(), NotFound(), Logo(), LogoProps, sizes

### Community 50 - "badge.tsx"
Cohesion: 0.29
Nodes (6): NoteMultiSelect(), NoteMultiSelectProps, Badge(), badgeVariants, mockUseAdminNotes, mockUseQueryStates

### Community 51 - "file-upload-field.tsx"
Cohesion: 0.25
Nodes (7): FileUploadField(), FileUploadFieldProps, useDeleteUpload(), useFileUpload(), mockApiClient, mockToastError, mockToastSuccess

### Community 52 - "use-notes-query-state.ts"
Cohesion: 0.31
Nodes (6): ActiveFilterChips(), NotesUrlState, parsers, useNotesQueryState(), NOTE_SORTS, mockUseNotesQueryState

### Community 53 - "counter.model.ts"
Cohesion: 0.38
Nodes (5): Counter, CounterDoc, counterSchema, generateOrderNumber(), mockExec

### Community 54 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, seed, start, test, test:coverage (+1 more)

### Community 56 - "navbar.tsx"
Cohesion: 0.22
Nodes (5): PublicLayout(), ThemeToggle(), Navbar(), NAV_LINKS, mockUseTheme

### Community 58 - "useHome.ts"
Cohesion: 0.36
Nodes (4): HomePage(), useHome(), HomeResponse, mockApiClient

### Community 59 - "Minimum Release Age Policy"
Cohesion: 0.29
Nodes (7): esbuild Build Allowance, Minimum Release Age Policy, Reject Downloads Policy, pnpm Security Hardening Policy, sharp Image Processing Allowance, Trust Policy: No Downgrade, unrs-resolver Allowance

### Community 60 - "[id]/page.tsx"
Cohesion: 0.33
Nodes (3): AdminOrderPage(), OrderDetailView(), mockUseAdminOrder

### Community 61 - "proxy.ts"
Cohesion: 0.38
Nodes (6): config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, unauthorizedJson()

### Community 62 - "next/navigation"
Cohesion: 0.25
Nodes (4): AdminPage(), metadata, OrderLookupPage(), mockUseOrderLookup

### Community 63 - "Razorpay Payment Gateway"
Cohesion: 0.33
Nodes (6): nodemailer, nodemailer, Payment Flow, PDF Delivery Mechanism, File/Document SVG Icon, Razorpay Payment Gateway

### Community 64 - "export-button.tsx"
Cohesion: 0.40
Nodes (3): ExportButton(), mockMutate, mockUseMutation

### Community 65 - "group/[slug]/route.tsx"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 66 - "home/route.tsx"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 67 - "logo/route.tsx"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 68 - "note/[slug]/route.tsx"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 69 - "SEO Optimization"
Cohesion: 0.40
Nodes (5): Dynamic Sitemap, JSON-LD Structured Data, Open Graph Meta Tags, robots.txt AI Crawler Blocking, SEO Optimization

### Community 70 - "doctor.config.json"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

### Community 71 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 72 - "PWA (Progressive Web App) Support"
Cohesion: 0.83
Nodes (4): Apple Touch Icon, Favicon 16x16 PNG, Favicon 32x32 PNG, PWA (Progressive Web App) Support

### Community 74 - "Next.js 16"
Cohesion: 0.67
Nodes (3): Next.js App Router, Next.js 16, Next.js Logo SVG

### Community 75 - "Notes Catalog"
Cohesion: 0.67
Nodes (3): Group Bundles, Note Preview Feature, Notes Catalog

## Knowledge Gaps
- **417 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+412 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Razorpay Payment Gateway` connect `Razorpay Payment Gateway` to `Notes Provider`, `orders.test.ts`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`, `date-fns`, `lucide-react`, `mongoose`, `Notes Provider`, `react`, `react-razorpay`, `shadcn`, `sonner`, `zod`, `tailwind-merge`, `Razorpay Payment Gateway`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `nodemailer` connect `Razorpay Payment Gateway` to `Notes Provider`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _417 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `json-ld.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.051111111111111114 - nodes in this community are weakly interconnected._
- **Should `format.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07753164556962025 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11294117647058824 - nodes in this community are weakly interconnected._