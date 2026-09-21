# Graph Report - notes-provider  (2026-09-21)

## Corpus Check
- 209 files · ~52,856 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 998 nodes · 2809 edges · 90 communities (54 shown, 36 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Admin Dashboard
- API Routes
- Components
- Database Schemas
- Auth & Security
- Payments & Orders
- Shared Helpers
- Public Pages
- SEO & Metadata
- Hooks & Data Fetching
- Providers & Config
- UI Primitives
- Static Assets
- Migrations
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 84 edges
2. `ok()` - 64 edges
3. `AppError` - 43 edges
4. `prisma` - 39 edges
5. `Button()` - 36 edges
6. `apiClient()` - 36 edges
7. `fail()` - 25 edges
8. `webpageJsonLd` - 23 edges
9. `handler()` - 20 edges
10. `APP_URL` - 18 edges

## Surprising Connections (you probably didn't know these)
- `ContactPage()` --calls--> `webpageJsonLd`  [EXTRACTED]
  src/app/(public)/contact/page.tsx → src/components/seo/json-ld-helpers.ts
- `GET` --calls--> `ok()`  [EXTRACTED]
  src/app/api/filters/route.ts → src/helpers/api-response.ts
- `GET` --indirect_call--> `toPublicGroup()`  [INFERRED]
  src/app/api/groups/route.ts → src/helpers/mappers/group.mapper.ts
- `GET` --indirect_call--> `toPublicNote()`  [INFERRED]
  src/app/api/notes/route.ts → src/helpers/mappers/note.mapper.ts
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (90 total, 36 thin omitted)

### Community 0 - "Admin Dashboard"
Cohesion: 0.04
Nodes (47): eslint, eslint-config-next, @next/playwright, devDependencies, eslint, eslint-config-next, @next/playwright, @playwright/test (+39 more)

### Community 1 - "API Routes"
Cohesion: 0.15
Nodes (29): CategoriesTable(), NotesTable(), PaginationBar(), StatusBadge(), Dialog(), DialogContent(), DialogDescription(), DialogFooter() (+21 more)

### Community 2 - "Components"
Cohesion: 0.13
Nodes (20): metadata, GlobalErrorProps, AdminShell(), isActiveLink(), NAV_ITEMS, Logo(), LogoProps, sizes (+12 more)

### Community 3 - "Database Schemas"
Cohesion: 0.13
Nodes (31): GET, toAdminProfile(), toAdminCategory(), toAdminRef(), toCategoryRef(), toPublicCategory(), buyerOf(), snapshotOf() (+23 more)

### Community 4 - "Auth & Security"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, ./generated/prisma/client, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+24 more)

### Community 5 - "Payments & Orders"
Cohesion: 0.12
Nodes (22): POST, POST, POST, AdminSession, clearAdminSessionCookie(), requireAdmin(), requireHeadAdmin(), setAdminSessionCookie() (+14 more)

### Community 6 - "Shared Helpers"
Cohesion: 0.15
Nodes (18): StatsGrid(), OrderDetailView(), lookupSchema, LookupValues, OrderStatusPage(), CopyButton(), Card(), CardAction() (+10 more)

### Community 7 - "Public Pages"
Cohesion: 0.20
Nodes (19): GET, PATCH, GET, POST, GET, PATCH, GET, POST (+11 more)

### Community 8 - "SEO & Metadata"
Cohesion: 0.09
Nodes (17): OrderRouteProps, OrderSuccessRouteProps, safeQuery(), sitemap(), STATIC_PAGES, StatusBadgeProps, APP_URL, ERROR_STATUS (+9 more)

### Community 9 - "Hooks & Data Fetching"
Cohesion: 0.16
Nodes (19): CategoryDialogProps, GroupFormProps, NoteMultiSelect(), NoteMultiSelectProps, FileAttachmentsSectionProps, NoteDetailsSectionProps, PricingVisibilitySectionProps, ServerErrorBannerProps (+11 more)

### Community 10 - "Providers & Config"
Cohesion: 0.17
Nodes (19): RootLayout(), GroupDetail(), GroupRouteProps, NoteDetail(), NotePageProps, articleJsonLd(), breadcrumbJsonLd(), collectionPageJsonLd() (+11 more)

### Community 11 - "UI Primitives"
Cohesion: 0.16
Nodes (18): main(), seedDate, DELETE, POST, POST(), adapter, globalForPrisma, prisma (+10 more)

### Community 12 - "Static Assets"
Cohesion: 0.11
Nodes (22): GET, NOTE_LEVEL_SET, parseArrayParam(), parseBooleanParam(), parseNumberParam(), SORTS, buildNoteFilter(), buildNoteSort() (+14 more)

### Community 13 - "Migrations"
Cohesion: 0.09
Nodes (13): HeroSection(), HomePage(), CategoryCard(), CATEGORY_ICON_OPTIONS, CATEGORY_ICONS, CategoryIcon(), useHome(), HOME_FAQS (+5 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (11): AdminDashboardSkeleton(), AdminOrderDetailSkeleton(), GroupDetailSkeleton(), GroupsCatalogueSkeleton(), NoteDetailSkeleton(), NotesCatalogueSkeleton(), OrderStatusSkeleton(), ShimmerGroupCard() (+3 more)

### Community 15 - "Community 15"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 16 - "Community 16"
Cohesion: 0.22
Nodes (12): GET, GET, PATCH, GET, POST, GET, DELETE, GET (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.16
Nodes (16): OrderLookupResponse, queryKeys, AdminAuthResponse, ApiFailure, ApiSuccess, GroupDetailResponse, GroupsQuery, HomeResponse (+8 more)

### Community 18 - "Community 18"
Cohesion: 0.18
Nodes (15): GroupFormContent(), CategoryDialog(), GroupForm(), NoteForm(), useAdminCategories(), useAdminGroup(), useCreateCategory(), useCreateGroup() (+7 more)

### Community 19 - "Community 19"
Cohesion: 0.17
Nodes (14): DELETE, DELETE, DELETE, GET, GET, GET, GET, POST (+6 more)

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (12): GET, AdminRouteContext, buildContext(), getClientIp(), handler(), NextRouteArgs, parseZodError(), RouteContext (+4 more)

### Community 21 - "Community 21"
Cohesion: 0.15
Nodes (16): HomePageRoute(), metadata, AboutPage(), metadata, GroupsPageRoute(), metadata, metadata, NotesPage() (+8 more)

### Community 22 - "Community 22"
Cohesion: 0.14
Nodes (14): ContactChannel, ContactPage(), ICON_MAP, metadata, Footer(), FOOTER_LINKS, SOCIAL_LINKS, SocialLink (+6 more)

### Community 23 - "Community 23"
Cohesion: 0.18
Nodes (10): metadata, CheckoutContent(), CheckoutPage(), CheckoutSkeleton(), useCreateOrder(), CheckoutOrderResponse, PurchaseItemType, checkoutSchema (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.21
Nodes (13): NoteDetailPage(), LEVEL_CLASS, LEVEL_LABEL, LevelBadge(), PRICING_CLASS, PricingBadge(), NoteCard(), NoteCardProps (+5 more)

### Community 25 - "Community 25"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 26 - "Community 26"
Cohesion: 0.30
Nodes (10): GET, EMPTY_HOME, GET, GET, CategoryShape, toPublicGroup(), CategoryShape, toPublicNote() (+2 more)

### Community 27 - "Community 27"
Cohesion: 0.17
Nodes (11): CloudinaryDeliveryType, CloudinaryResourceType, destroyAsset(), uploadBuffer(), UploadResult, deleteUpload(), uploadFile(), SIGNED_URL_TTL_SECONDS (+3 more)

### Community 28 - "Community 28"
Cohesion: 0.35
Nodes (9): metadata, metadata, metadata, StaticPage(), Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger() (+1 more)

### Community 29 - "Community 29"
Cohesion: 0.16
Nodes (13): FileAttachmentsSection(), NOTE_PRICING_TYPES, CreateNotePayload, fileUploadSchema, isGoogleDriveUrl(), noteBaseSchema, priceRupeesSchema, refineNote() (+5 more)

### Community 30 - "Community 30"
Cohesion: 0.15
Nodes (9): GroupsTable(), OrdersTable(), GroupsPage(), useAdminGroups(), useAdminOrders(), useDeleteGroup(), useGroups(), useNotes() (+1 more)

### Community 31 - "Community 31"
Cohesion: 0.17
Nodes (12): MIN_PAID_PRICE_PAISE, NOTE_VISIBILITIES, CreateGroupInput, CreateGroupPayload, createGroupSchema, groupBaseSchema, refineGroup(), UpdateGroupInput (+4 more)

### Community 32 - "Community 32"
Cohesion: 0.23
Nodes (7): ApiError, ApiResult, ErrorCode, AppProviders(), getErrorMessage(), QueryProvider(), ThemeProvider()

### Community 33 - "Community 33"
Cohesion: 0.20
Nodes (8): DynamicNoteForm, NoteFormProps, NoteDetailsSection(), PricingVisibilitySection(), ServerErrorBanner(), AdminNote, CreateNoteInput, createNoteSchema

### Community 34 - "Community 34"
Cohesion: 0.24
Nodes (7): FilterPanel(), NoteSearchField(), PRICING_OPTIONS, ToggleKey, NotesCatalogue(), Checkbox(), useNotesQueryState()

### Community 35 - "Community 35"
Cohesion: 0.36
Nodes (6): GroupDetailPage(), EmptyState(), ErrorState(), ErrorStateProps, GroupCard(), useGroup()

### Community 36 - "Community 36"
Cohesion: 0.20
Nodes (9): categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload, createCategorySchema, SubjectInput, subjectSchema, UpdateCategoryInput, UpdateCategoryPayload (+1 more)

### Community 37 - "Community 37"
Cohesion: 0.22
Nodes (9): @base-ui/react, @next/third-parties, nuqs, dependencies, @base-ui/react, @next/third-parties, nuqs, @tanstack/react-query (+1 more)

### Community 38 - "Community 38"
Cohesion: 0.28
Nodes (7): ActiveFilterChips(), useFilters(), NOTE_LEVEL_LABELS, FiltersResponse, NoteDetailResponse, NoteLevel, NotesQuery

### Community 39 - "Community 39"
Cohesion: 0.39
Nodes (7): EmptyStateProps, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), EmptyTitle()

### Community 40 - "Community 40"
Cohesion: 0.32
Nodes (5): metadata, AdminDashboard(), RecentOrders(), RevenueChart(), useDashboard()

### Community 41 - "Community 41"
Cohesion: 0.36
Nodes (7): config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, setSecurityHeaders(), unauthorizedJson()

### Community 42 - "Community 42"
Cohesion: 0.33
Nodes (4): contentType, height, Props, width

### Community 43 - "Community 43"
Cohesion: 0.33
Nodes (4): contentType, height, Props, width

### Community 44 - "Community 44"
Cohesion: 0.33
Nodes (4): metadata, OrderLookupPage(), OrderLookupSkeleton(), useOrderLookup()

### Community 45 - "Community 45"
Cohesion: 0.33
Nodes (5): codeComponents, codeTheme, MarkdownPreview(), rehypePlugins, remarkPlugins

### Community 46 - "Community 46"
Cohesion: 0.53
Nodes (5): PdfPreviewDialog(), downloadFile(), extractDriveId(), triggerBlobDownload(), useDownloadFile()

### Community 47 - "Community 47"
Cohesion: 0.40
Nodes (4): inter, metadata, outfit, viewport

### Community 48 - "Community 48"
Cohesion: 0.40
Nodes (3): contentType, height, width

### Community 49 - "Community 49"
Cohesion: 0.50
Nodes (4): COMPACT_NUMBER_FORMAT, formatFileSize(), formatFileSizeLabel(), INR_PRICE_FORMAT

### Community 50 - "Community 50"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

### Community 53 - "Community 53"
Cohesion: 0.67
Nodes (3): escapeCell(), FORMULA_PREFIXES, toCsv()

## Knowledge Gaps
- **243 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+238 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `API Routes` to `Components`, `Community 34`, `Shared Helpers`, `Community 39`, `SEO & Metadata`, `Hooks & Data Fetching`, `Community 14`, `Community 52`, `Community 24`, `Community 28`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `ok()` connect `Community 16` to `Database Schemas`, `Payments & Orders`, `Public Pages`, `UI Primitives`, `Static Assets`, `Community 19`, `Community 20`, `Community 26`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `Button()` connect `Components` to `API Routes`, `Community 33`, `Community 35`, `Community 34`, `Shared Helpers`, `Community 38`, `Community 40`, `Hooks & Data Fetching`, `Migrations`, `Community 22`, `Community 23`, `Community 24`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _243 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Dashboard` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.14982578397212543 - nodes in this community are weakly interconnected._
- **Should `Components` be split into smaller, more focused modules?**
  _Cohesion score 0.12762762762762764 - nodes in this community are weakly interconnected._