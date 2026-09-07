# Graph Report - notes-provider  (2026-09-08)

## Corpus Check
- 417 files · ~171,027 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1530 nodes · 4608 edges · 112 communities (68 shown, 44 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.85)
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 107 edges
2. `ok()` - 67 edges
3. `AppError` - 56 edges
4. `Note` - 48 edges
5. `apiClient()` - 41 edges
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
- `GroupsPageRoute()` --calls--> `webpageJsonLd`  [EXTRACTED]
  src/app/(public)/groups/page.tsx → src/components/seo/json-ld-helpers.ts
- `GET` --indirect_call--> `toAdminLead()`  [INFERRED]
  src/app/api/admin/leads/route.ts → src/server/mappers/order.mapper.ts
- `GET` --indirect_call--> `toAdminNote()`  [INFERRED]
  src/app/api/admin/notes/route.ts → src/server/mappers/note.mapper.ts

## Import Cycles
- None detected.

## Communities (112 total, 44 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (51): dynamic, revalidate, GET, revalidate, runtime, dynamic, EMPTY_HOME, fetchHomeData() (+43 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (44): GET, runtime, GET, runtime, GET, runtime, GET, dynamic (+36 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (35): seedDate, runtime, runtime, runtime, runtime, dynamic, GET, revalidate (+27 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (32): NotesLoading(), GroupDetailPage(), GroupsPage(), HeroSection(), CategoryCard(), GroupCard(), GroupCardProps, NoteCard() (+24 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (26): GlobalError(), NotFound(), navItems, ExportButton(), Logo(), LogoProps, sizes, ThemeToggle() (+18 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (34): GET, POST, runtime, GET, runtime, POST, runtime, AppError (+26 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (30): RecentOrders(), RevenueChart(), RevenueChartProps, STAT_CARDS, StatsGrid(), StatsGridProps, NoteDetailPage(), lookupSchema (+22 more)

### Community 7 - "Community 7"
Cohesion: 0.10
Nodes (32): GET, runtime, POST, runtime, POST, runtime, GET, runtime (+24 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (27): GroupFormProps, FileAttachmentsSectionProps, FileFieldSource, FileSource, NoteDetailsSectionProps, PricingVisibilitySectionProps, ServerErrorBannerProps, FilterPanel() (+19 more)

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (18): AdminOrdersPage(), AdminPage(), metadata, contentType, runtime, contentType, runtime, contentType (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (29): DELETE, PATCH, GET, POST, DELETE, GET, PATCH, runtime (+21 more)

### Community 11 - "Community 11"
Cohesion: 0.17
Nodes (24): RootLayout(), HomePageRoute(), metadata, GroupRoute(), GroupRouteProps, PopulatedGroup, NotePageProps, NoteRoute() (+16 more)

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (25): CategoryDoc, GroupDoc, slugify(), uniqueSlug(), createCategory(), deleteCategory(), getCategoryById(), getCategoryBySlug() (+17 more)

### Community 13 - "Community 13"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (25): GET, runtime, dynamic, GET, revalidate, runtime, buildSignedUrl(), driveToDownloadUrl() (+17 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (25): HomePage(), useHome(), queryKeys, AdminAuthResponse, AdminRef, ApiFailure, ApiSuccess, CategoryRef (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (26): ABOUT_VALUES, ADMIN_PAGE_LIMIT, CONTACT_CHANNELS, ERROR_STATUS, FULFILLMENT_STATUS_LABELS, FULFILLMENT_STATUSES, FULL_NAME_PATTERN, LEADS_EXPORT_MAX_ROWS (+18 more)

### Community 17 - "Community 17"
Cohesion: 0.12
Nodes (23): CreateGroupInput, CreateGroupPayload, createGroupSchema, groupBaseSchema, priceRupeesSchema, refineGroup(), UpdateGroupInput, UpdateGroupPayload (+15 more)

### Community 18 - "Community 18"
Cohesion: 0.11
Nodes (18): EditNotePage(), NoteFormContent(), DynamicNoteForm, NewNotePage(), FileFieldSource, FileSource, NoteForm(), NoteFormProps (+10 more)

### Community 19 - "Community 19"
Cohesion: 0.19
Nodes (18): CATEGORY_ICON_PRESETS, CategoryDialogProps, FulfillmentDialog(), FulfillmentDialogProps, PdfPreviewDialog(), Dialog(), DialogClose(), DialogContent() (+10 more)

### Community 20 - "Community 20"
Cohesion: 0.14
Nodes (15): CheckoutPage(), useAdminGroups(), useAdminLeads(), useAdminNotes(), useAdminOrders(), useCreateOrder(), useFilters(), useNote() (+7 more)

### Community 21 - "Community 21"
Cohesion: 0.12
Nodes (15): AdminCategoriesPage(), AdminDashboard(), CategoriesTable(), CategoryDialog(), useAdminCategories(), useAdminOrder(), useCreateCategory(), useDashboard() (+7 more)

### Community 22 - "Community 22"
Cohesion: 0.15
Nodes (16): DELETE, POST, runtime, UPLOAD_LIMITS, UploadKind, CloudinaryDeliveryType, CloudinaryResourceType, destroyAsset() (+8 more)

### Community 23 - "Community 23"
Cohesion: 0.12
Nodes (16): ContactPage(), ICON_MAP, metadata, NoteMultiSelect(), NoteMultiSelectProps, LEVEL_BADGE, LevelBadge(), LevelBadgeProps (+8 more)

### Community 24 - "Community 24"
Cohesion: 0.20
Nodes (13): metadata, PrivacyPage(), metadata, RefundPolicyPage(), metadata, TermsPage(), StaticPage(), Accordion() (+5 more)

### Community 25 - "Community 25"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 26 - "Community 26"
Cohesion: 0.11
Nodes (13): AdminGroupsPage(), AdminLayout(), metadata, AdminShell(), GroupsTable(), useAdminLogin(), useAdminLogout(), useAdminProfile() (+5 more)

### Community 27 - "Community 27"
Cohesion: 0.22
Nodes (15): seed(), runtime, connectDB(), MongooseCache, adminHandler(), AdminRouteContext, buildContext(), getClientIp() (+7 more)

### Community 28 - "Community 28"
Cohesion: 0.34
Nodes (12): EmptyState(), PaginationBar(), Input(), Table(), TableBody(), TableCaption(), TableCell(), TableFooter() (+4 more)

### Community 29 - "Community 29"
Cohesion: 0.14
Nodes (10): checkoutSchema, CheckoutValues, CreateOrderPayload, CheckoutOrderResponse, PurchaseItemType, mockUseCreateOrder, mockUseGroup, mockUseNote (+2 more)

### Community 30 - "Community 30"
Cohesion: 0.15
Nodes (8): OrderLookupResponse, useOrder(), ApiError, ApiResult, ErrorCode, mockApiClient, mockApiClient, mockApiClient

### Community 31 - "Community 31"
Cohesion: 0.16
Nodes (10): caveat, instrumentSans, inter, metadata, outfit, AppProviders(), getErrorMessage(), QueryProvider() (+2 more)

### Community 32 - "Community 32"
Cohesion: 0.17
Nodes (11): ActiveFilterChips(), NotesCatalogue(), NotesUrlState, parsers, useNotesQueryState(), DEFAULT_PAGE_LIMIT, NOTE_SORTS, mockUseNotesQueryState (+3 more)

### Community 33 - "Community 33"
Cohesion: 0.18
Nodes (13): auth, developmentConfig, MailProps, notifyAdminsOnPurchase(), productionConfig, sendMail(), transport, getTemplate() (+5 more)

### Community 34 - "Community 34"
Cohesion: 0.22
Nodes (9): GET, runtime, formatPaise(), generateRevenueSeries(), getCategoryBreakdown(), getDashboardStats(), getTopNotes(), toDateKey() (+1 more)

### Community 35 - "Community 35"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 36 - "Community 36"
Cohesion: 0.18
Nodes (8): EditGroupPage(), GroupFormContent(), NewGroupPage(), GroupForm(), useAdminGroup(), useCreateGroup(), useUpdateGroup(), mockApiClient

### Community 37 - "Community 37"
Cohesion: 0.24
Nodes (9): PublicLayout(), Footer(), FOOTER_LINKS, SOCIAL_LINKS, SocialLink, GithubIcon(), InstagramIcon(), XIcon() (+1 more)

### Community 38 - "Community 38"
Cohesion: 0.17
Nodes (10): AdminLoginInput, AdminLoginPayload, adminLoginSchema, AdminRegisterInput, AdminRegisterPayload, adminRegisterSchema, UpdateOrderPayload, updateOrderSchema (+2 more)

### Community 39 - "Community 39"
Cohesion: 0.19
Nodes (9): AboutPage(), metadata, GroupsPageRoute(), metadata, metadata, NotesPage(), JsonLd(), safeStringifyJsonLd() (+1 more)

### Community 40 - "Community 40"
Cohesion: 0.29
Nodes (10): PaginationBarProps, Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink(), PaginationLinkProps, PaginationNext() (+2 more)

### Community 41 - "Community 41"
Cohesion: 0.36
Nodes (8): EmptyStateProps, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 42 - "Community 42"
Cohesion: 0.18
Nodes (11): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tsx, @types/react-dom, @vitest/ui (+3 more)

### Community 43 - "Community 43"
Cohesion: 0.25
Nodes (7): FileUploadField(), FileUploadFieldProps, useDeleteUpload(), useFileUpload(), mockApiClient, mockToastError, mockToastSuccess

### Community 44 - "Community 44"
Cohesion: 0.27
Nodes (8): categoryBaseSchema, CreateCategoryInput, CreateCategoryPayload, createCategorySchema, SubjectInput, subjectSchema, UpdateCategoryInput, UpdateCategoryPayload

### Community 45 - "Community 45"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, seed, start, test, test:coverage (+1 more)

### Community 46 - "Community 46"
Cohesion: 0.36
Nodes (7): AdminDoc, createAdmin(), getAdminByEmail(), getAdminById(), getAllAdmins(), updateLastLogin(), mockAdmin

### Community 47 - "Community 47"
Cohesion: 0.32
Nodes (5): CheckoutRoute(), metadata, CheckoutContent(), mockSearchParams, mockUseParams

### Community 48 - "Community 48"
Cohesion: 0.39
Nodes (5): Counter, CounterDoc, counterSchema, generateOrderNumber(), mockLean

### Community 49 - "Community 49"
Cohesion: 0.29
Nodes (7): @hookform/resolvers, lucide-react, dependencies, @hookform/resolvers, lucide-react, mongoose, mongoose

### Community 50 - "Community 50"
Cohesion: 0.33
Nodes (4): AdminNotesPage(), NotesTable(), useDeleteNote(), mockUseAdminNotes

### Community 51 - "Community 51"
Cohesion: 0.33
Nodes (3): AdminOrderPage(), OrderDetailView(), mockUseAdminOrder

### Community 52 - "Community 52"
Cohesion: 0.38
Nodes (6): config, hasValidSession(), middleware, proxy(), PUBLIC_ADMIN_PATHS, unauthorizedJson()

### Community 53 - "Community 53"
Cohesion: 0.40
Nodes (3): AdminLeadsPage(), LeadsTable(), mockUseAdminLeads

### Community 54 - "Community 54"
Cohesion: 0.33
Nodes (3): contentType, runtime, mockImageResponse

### Community 56 - "Community 56"
Cohesion: 0.60
Nodes (4): NOTE_LEVELS, ORDER_SORTS, NotesQuerySchema, OrdersQuerySchema

### Community 57 - "Community 57"
Cohesion: 0.50
Nodes (3): rules, react-doctor/prefer-dynamic-import, $schema

### Community 58 - "Community 58"
Cohesion: 0.50
Nodes (3): name, private, version

## Knowledge Gaps
- **388 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+383 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 8` to `Community 32`, `Community 3`, `Community 4`, `Community 6`, `Community 40`, `Community 41`, `Community 19`, `Community 55`, `Community 23`, `Community 24`, `Community 26`, `Community 28`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 4` to `Community 32`, `Community 3`, `Community 6`, `Community 8`, `Community 40`, `Community 43`, `Community 18`, `Community 19`, `Community 23`, `Community 28`, `Community 29`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `ok()` connect `Community 10` to `Community 0`, `Community 1`, `Community 2`, `Community 34`, `Community 5`, `Community 7`, `Community 22`, `Community 27`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _388 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08851674641148326 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06442058496853018 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06103286384976526 - nodes in this community are weakly interconnected._