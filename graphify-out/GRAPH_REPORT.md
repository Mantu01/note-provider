# Graph Report - notes-provider  (2026-09-05)

## Corpus Check
- 428 files · ~171,263 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1541 nodes · 4679 edges · 110 communities (66 shown, 44 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Admin Auth API
- Order Page
- Category Routes
- Group Routes
- Admin Orders Dashboard
- Note Pages & Components
- Error/NotFound/Layout
- Delete Routes
- UI Primitives (Checkbox/Select)
- Edit Note Page
- Dynamic Revalidation
- Pricing Badges
- Admin Order Detail
- Patch/Update Routes
- TypeScript Config
- Domain Constants
- Upload Routes
- Checkout Flow
- Group Route
- Layout Container
- PDF Preview Dialog
- Data Hooks
- Seed Script
- Admin Categories
- Privacy Policy Page
- Shared UI State
- Dashboard Hooks
- shadcn Config
- Admin Groups
- About Page
- Payment Routes
- Font/Layout Config
- Filter Bar & Query State
- Order Lookup
- Note Schema Validation
- PWA Manifest
- Public Layout/Footer
- Pagination
- Group Service
- File Upload Field
- Admin Auth Hooks
- Category Service
- Group Page SSR
- Empty States
- Group Schema
- Dev Dependencies
- Proxy/Security Middleware
- Category Schema
- NPM Scripts
- Checkout Content
- Counter Model
- React Dependencies
- Error Handling
- Admin Leads
- Logo Route
- React Doctor Config
- Package Root
- Admin Layout
- Next Config
- New Group Page
- class-variance-authority
- Cloudinary
- clsx
- date-fns
- ESLint
- ESLint Config
- Hookform Resolvers
- Next.js
- next-themes
- Next Third Parties
- Nodemailer
- bcryptjs
- jose
- nuqs
- Razorpay
- React
- React DOM
- react-hook-form
- react-razorpay
- Recharts
- shadcn/ui
- Sonner
- tailwind-merge
- @tanstack/react-query
- tw-animate-css
- Zod
- react-doctor
- tailwindcss
- tailwindcss/postcss
- @testing-library/jest-dom
- @testing-library/react
- @testing-library/user-event
- @types/bcryptjs
- @types/node
- @types/nodemailer
- @types/react
- TypeScript
- @vitejs/plugin-react
- Vitest
- vitest-canvas-mock
- PostCSS Config

## God Nodes (most connected - your core abstractions)
1. `cn()` - 107 edges
2. `ok()` - 67 edges
3. `AppError` - 56 edges
4. `apiClient()` - 52 edges
5. `Note` - 48 edges
6. `Button()` - 40 edges
7. `Group` - 34 edges
8. `fail()` - 27 edges
9. `Order` - 26 edges
10. `rupeesToPaise()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `seed()` --calls--> `connectDB()`  [EXTRACTED]
  seed.ts → src/server/db/connect.ts
- `mountHook()` --calls--> `useDownloadFile()`  [EXTRACTED]
  tests/hooks/use-download-file.test.tsx → src/hooks/use-download-file.ts
- `GET` --indirect_call--> `toAdminLead()`  [INFERRED]
  src/app/api/admin/leads/route.ts → src/server/mappers/order.mapper.ts
- `GET` --indirect_call--> `toAdminNote()`  [INFERRED]
  src/app/api/admin/notes/route.ts → src/server/mappers/note.mapper.ts
- `GET` --indirect_call--> `toAdminOrder()`  [INFERRED]
  src/app/api/admin/orders/route.ts → src/server/mappers/order.mapper.ts

## Import Cycles
- None detected.

## Communities (110 total, 44 thin omitted)

### Community 0 - "Admin Auth API"
Cohesion: 0.05
Nodes (73): dynamic, revalidate, GET, revalidate, runtime, dynamic, EMPTY_HOME, fetchHomeData() (+65 more)

### Community 1 - "Order Page"
Cohesion: 0.06
Nodes (50): GET, runtime, GET, runtime, GET, runtime, GET, dynamic (+42 more)

### Community 2 - "Category Routes"
Cohesion: 0.06
Nodes (47): GET, runtime, POST, runtime, POST, runtime, GET, runtime (+39 more)

### Community 3 - "Group Routes"
Cohesion: 0.11
Nodes (30): GET, POST, runtime, GET, runtime, POST, runtime, AppError (+22 more)

### Community 4 - "Admin Orders Dashboard"
Cohesion: 0.05
Nodes (23): AdminOrdersPage(), AdminPage(), metadata, contentType, runtime, contentType, runtime, contentType (+15 more)

### Community 5 - "Note Pages & Components"
Cohesion: 0.07
Nodes (21): NotesLoading(), CategoryCard(), GroupCard(), GroupCardProps, ShimmerGroupCard(), ShimmerLoader(), ShimmerNoteCard(), ShimmerStatCard() (+13 more)

### Community 6 - "Error/NotFound/Layout"
Cohesion: 0.09
Nodes (18): GlobalError(), NotFound(), Logo(), LogoProps, sizes, ThemeToggle(), MobileNav(), Navbar() (+10 more)

### Community 7 - "Delete Routes"
Cohesion: 0.12
Nodes (32): DELETE, GET, runtime, DELETE, GET, PATCH, runtime, GET (+24 more)

### Community 8 - "UI Primitives (Checkbox/Select)"
Cohesion: 0.11
Nodes (26): Checkbox(), Label(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton() (+18 more)

### Community 9 - "Edit Note Page"
Cohesion: 0.09
Nodes (25): EditNotePage(), NoteFormContent(), DynamicNoteForm, NewNotePage(), AdminNotesPage(), useAdminNote(), useAdminNotes(), useCreateNote() (+17 more)

### Community 10 - "Dynamic Revalidation"
Cohesion: 0.10
Nodes (15): dynamic, revalidate, dynamic, revalidate, safeQuery(), sitemap(), STATIC_PAGES, Category (+7 more)

### Community 11 - "Pricing Badges"
Cohesion: 0.09
Nodes (23): LEVEL_BADGE, LevelBadge(), LevelBadgeProps, PRICING_BADGE, PricingBadge(), PricingBadgeProps, NoteCard(), NoteCardProps (+15 more)

### Community 12 - "Admin Order Detail"
Cohesion: 0.13
Nodes (19): AdminOrderPage(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle() (+11 more)

### Community 13 - "Patch/Update Routes"
Cohesion: 0.11
Nodes (26): GET, runtime, dynamic, GET, revalidate, runtime, buildSignedUrl(), driveToDownloadUrl() (+18 more)

### Community 14 - "TypeScript Config"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 15 - "Domain Constants"
Cohesion: 0.11
Nodes (30): ABOUT_VALUES, ADMIN_PAGE_LIMIT, CONTACT_CHANNELS, FULFILLMENT_STATUS_LABELS, FULFILLMENT_STATUSES, FULL_NAME_PATTERN, LEADS_EXPORT_MAX_ROWS, MAX_PAGE_LIMIT (+22 more)

### Community 16 - "Upload Routes"
Cohesion: 0.13
Nodes (18): POST, runtime, UPLOAD_LIMITS, UploadKind, CloudinaryDeliveryType, CloudinaryResourceType, destroyAsset(), uploadBuffer() (+10 more)

### Community 17 - "Checkout Flow"
Cohesion: 0.10
Nodes (15): useCreateOrder(), CheckoutPage(), useGroup(), useNote(), checkoutSchema, CheckoutValues, GroupDetailResponse, NoteDetailResponse (+7 more)

### Community 18 - "Group Route"
Cohesion: 0.19
Nodes (21): RootLayout(), HomePageRoute(), metadata, GroupRoute(), NotePageProps, NoteRoute(), PopulatedNote, articleJsonLd() (+13 more)

### Community 19 - "Layout Container"
Cohesion: 0.13
Nodes (16): Container(), Section(), Sheet(), SheetClose(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader() (+8 more)

### Community 20 - "PDF Preview Dialog"
Cohesion: 0.20
Nodes (17): PdfPreviewDialog(), Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay() (+9 more)

### Community 21 - "Data Hooks"
Cohesion: 0.12
Nodes (13): useAdminLeads(), useGroups(), useNotes(), ApiError, buildQueryString(), AdminLead, ApiResult, ErrorCode (+5 more)

### Community 22 - "Seed Script"
Cohesion: 0.17
Nodes (17): seed(), seedDate, dynamic, POST(), runtime, connectDB(), MongooseCache, adminHandler() (+9 more)

### Community 23 - "Admin Categories"
Cohesion: 0.15
Nodes (14): AdminCategoriesPage(), useAdminCategories(), useCreateCategory(), useDeleteCategory(), useUpdateCategory(), useAdminOrder(), useAdminOrders(), useUpdateOrderFulfillment() (+6 more)

### Community 24 - "Privacy Policy Page"
Cohesion: 0.20
Nodes (13): metadata, PrivacyPage(), metadata, RefundPolicyPage(), metadata, TermsPage(), StaticPage(), Accordion() (+5 more)

### Community 25 - "Shared UI State"
Cohesion: 0.29
Nodes (13): EmptyState(), PaginationBar(), StatusBadge(), StatusBadgeProps, Input(), Table(), TableBody(), TableCaption() (+5 more)

### Community 26 - "Dashboard Hooks"
Cohesion: 0.16
Nodes (13): useDashboard(), CreateOrderInput, useFilters(), queryKeys, AdminCategory, CheckoutOrderResponse, FiltersResponse, GroupsQuery (+5 more)

### Community 27 - "shadcn Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 28 - "Admin Groups"
Cohesion: 0.15
Nodes (13): EditGroupPage(), GroupFormContent(), AdminGroupsPage(), useAdminGroup(), useAdminGroups(), useCreateGroup(), useDeleteGroup(), useUpdateGroup() (+5 more)

### Community 29 - "About Page"
Cohesion: 0.15
Nodes (13): AboutPage(), metadata, ContactPage(), ICON_MAP, metadata, GroupsPageRoute(), metadata, metadata (+5 more)

### Community 30 - "Payment Routes"
Cohesion: 0.18
Nodes (12): PATCH, runtime, GET, POST, runtime, slugify(), uniqueSlug(), toAdminCategory() (+4 more)

### Community 31 - "Font/Layout Config"
Cohesion: 0.16
Nodes (10): caveat, instrumentSans, inter, metadata, outfit, AppProviders(), getErrorMessage(), QueryProvider() (+2 more)

### Community 32 - "Filter Bar & Query State"
Cohesion: 0.21
Nodes (11): ActiveFilterChips(), NotesUrlState, parsers, useNotesQueryState(), DEFAULT_PAGE_LIMIT, NOTE_LEVELS, NOTE_SORTS, ORDER_SORTS (+3 more)

### Community 33 - "Order Lookup"
Cohesion: 0.16
Nodes (6): OrderLookupResponse, useOrderLookup(), useOrder(), PublicOrder, mockApiClient, mockApiClient

### Community 34 - "Note Schema Validation"
Cohesion: 0.21
Nodes (14): cloudinaryFileSchema, createNoteSchema, googleDriveFileSchema, noteBaseSchema, noteFileSchema, objectIdSchema, priceRupeesSchema, refineNote() (+6 more)

### Community 35 - "PWA Manifest"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 36 - "Public Layout/Footer"
Cohesion: 0.24
Nodes (9): PublicLayout(), Footer(), FOOTER_LINKS, SOCIAL_LINKS, SocialLink, GithubIcon(), InstagramIcon(), XIcon() (+1 more)

### Community 37 - "Pagination"
Cohesion: 0.29
Nodes (10): PaginationBarProps, Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink(), PaginationLinkProps, PaginationNext() (+2 more)

### Community 38 - "Group Service"
Cohesion: 0.25
Nodes (12): GroupDoc, validateNoteIdsExist(), createGroup(), deleteGroup(), getFeaturedGroups(), getGroupById(), getGroupBySlug(), getRelatedGroups() (+4 more)

### Community 39 - "File Upload Field"
Cohesion: 0.24
Nodes (8): FileUploadField(), FileUploadFieldProps, useDeleteUpload(), useFileUpload(), UploadResponse, mockApiClient, mockToastError, mockToastSuccess

### Community 40 - "Admin Auth Hooks"
Cohesion: 0.22
Nodes (9): useAdminLogin(), useAdminLogout(), useAdminProfile(), AdminShell(), AdminAuthResponse, AdminProfile, mockMutate, mockUseAdminProfile (+1 more)

### Community 41 - "Category Service"
Cohesion: 0.26
Nodes (11): CategoryDoc, createCategory(), deleteCategory(), getCategoryById(), getCategoryBySlug(), getCategoryCounts(), getCategoryWithNoteCount(), listActiveCategories() (+3 more)

### Community 42 - "Group Page SSR"
Cohesion: 0.18
Nodes (5): GroupRouteProps, PopulatedGroup, metadata, TrackOrderRoute(), APP_URL

### Community 43 - "Empty States"
Cohesion: 0.36
Nodes (8): EmptyStateProps, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 44 - "Group Schema"
Cohesion: 0.23
Nodes (10): NOTE_VISIBILITIES, CreateGroupInput, CreateGroupPayload, createGroupSchema, groupBaseSchema, priceRupeesSchema, refineGroup(), UpdateGroupInput (+2 more)

### Community 45 - "Dev Dependencies"
Cohesion: 0.18
Nodes (11): eslint-config-next, jsdom, devDependencies, eslint-config-next, jsdom, tsx, @types/react-dom, @vitest/ui (+3 more)

### Community 46 - "Proxy/Security Middleware"
Cohesion: 0.22
Nodes (9): ADMIN_SESSION_COOKIE, config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, unauthorizedJson(), okPaginated() (+1 more)

### Community 47 - "Category Schema"
Cohesion: 0.25
Nodes (9): categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload, createCategorySchema, SubjectInput, subjectSchema, UpdateCategoryInput, UpdateCategoryPayload (+1 more)

### Community 48 - "NPM Scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, seed, start, test, test:coverage (+1 more)

### Community 49 - "Checkout Content"
Cohesion: 0.32
Nodes (5): CheckoutRoute(), metadata, CheckoutContent(), mockSearchParams, mockUseParams

### Community 50 - "Counter Model"
Cohesion: 0.39
Nodes (5): Counter, CounterDoc, counterSchema, generateOrderNumber(), mockLean

### Community 51 - "React Dependencies"
Cohesion: 0.29
Nodes (7): @base-ui/react, lucide-react, dependencies, @base-ui/react, lucide-react, mongoose, mongoose

### Community 52 - "Error Handling"
Cohesion: 0.48
Nodes (5): ERROR_STATUS, duplicateKeyToAppError(), isAppError(), isDuplicateKeyError(), MongoDuplicateKeyError

### Community 53 - "Admin Leads"
Cohesion: 0.40
Nodes (3): AdminLeadsPage(), LeadsTable(), mockUseAdminLeads

### Community 54 - "Logo Route"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 55 - "React Doctor Config"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

### Community 56 - "Package Root"
Cohesion: 0.50
Nodes (3): name, private, version

## Knowledge Gaps
- **389 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+384 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Primitives (Checkbox/Select)` to `Note Pages & Components`, `Error/NotFound/Layout`, `Pagination`, `Admin Auth Hooks`, `Pricing Badges`, `Admin Order Detail`, `Empty States`, `Layout Container`, `PDF Preview Dialog`, `Privacy Policy Page`, `Shared UI State`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `Button()` connect `Error/NotFound/Layout` to `Filter Bar & Query State`, `Pagination`, `Note Pages & Components`, `File Upload Field`, `UI Primitives (Checkbox/Select)`, `Edit Note Page`, `Pricing Badges`, `Admin Order Detail`, `Checkout Flow`, `Layout Container`, `PDF Preview Dialog`, `Shared UI State`, `About Page`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `ok()` connect `Delete Routes` to `Admin Auth API`, `Order Page`, `Category Routes`, `Group Routes`, `Dynamic Revalidation`, `Proxy/Security Middleware`, `Upload Routes`, `Payment Routes`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _389 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Auth API` be split into smaller, more focused modules?**
  _Cohesion score 0.05294208973761838 - nodes in this community are weakly interconnected._
- **Should `Order Page` be split into smaller, more focused modules?**
  _Cohesion score 0.05630834086118639 - nodes in this community are weakly interconnected._
- **Should `Category Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.06012176560121765 - nodes in this community are weakly interconnected._