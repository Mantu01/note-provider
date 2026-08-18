# Component Reference

## UI Primitives (shadcn/ui)

Located in `src/components/ui/`. These are headless-accessible components built on Base UI / Radix UI.

### Button
```tsx
import { Button } from '@/components/ui/button';

<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button disabled>Loading...</Button>
```

### Card
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Note Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Description text...</p>
  </CardContent>
</Card>
```

### Dialog
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild><button>Edit</button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Edit Note</DialogTitle></DialogHeader>
    {/* form fields */}
  </DialogContent>
</Dialog>
```

### Table
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    {items.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell><StatusBadge status={item.status} /></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Select
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select onValueChange={setCategory}>
  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="maths">Maths</SelectItem>
    <SelectItem value="science">Science</SelectItem>
  </SelectContent>
</Select>
```

### Input
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="admin@example.com" {...form.register('email')} />
```

### Badge
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="success">Paid</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Failed</Badge>
```

### Checkbox
```tsx
import { Checkbox } from '@/components/ui/checkbox';

<Checkbox checked={consent} onCheckedChange={setConsent} id="consent" />
<label htmlFor="consent">I agree to the terms</label>
```

### Skeleton
```tsx
import { Skeleton } from '@/components/ui/skeleton';

<Skeleton className="h-4 w-full" />
<Skeleton className="h-32 w-full rounded-lg" />
```

### Switch
```tsx
import { Switch } from '@/components/ui/switch';

<Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
```

### Pagination
```tsx
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href={`/notes?page=${page - 1}`} /></PaginationItem>
    {pages.map(p => (
      <PaginationItem key={p}>
        <PaginationLink href={`/notes?page=${p}`} isActive={p === page}>{p}</PaginationLink>
      </PaginationItem>
    ))}
    <PaginationItem><PaginationNext href={`/notes?page=${page + 1}`} /></PaginationItem>
  </PaginationContent>
</Pagination>
```

---

## Shared Components

### NoteCard
Displays a single note in the catalog. Shows cover image, title, price, level badge, and category.

```tsx
import { NoteCard } from '@/components/shared/note-card';

<NoteCard
  note={note}
  onPreview={() => setPreviewSlug(note.slug)}
  onBuy={() => router.push(`/checkout/${note.slug}`)}
/>
```

Props:
| Prop | Type | Description |
|------|------|-------------|
| `note` | `PublicNote` | Note data object |
| `onPreview` | `() => void` | Callback when preview button clicked |
| `onBuy` | `() => void` | Callback when buy button clicked |

### GroupCard
Displays a group bundle in the catalog. Similar to NoteCard but shows note count.

```tsx
import { GroupCard } from '@/components/shared/group-card';

<GroupCard group={group} onPreview={() => {}} onViewDetails={() => router.push(`/groups/${group.slug}`)} />
```

Props:
| Prop | Type | Description |
|------|------|-------------|
| `group` | `PublicGroup` | Group data object |
| `onPreview` | `() => void` | Preview callback |
| `onViewDetails` | `() => void` | Navigate to detail page |

### PriceTag
Shows price with optional comparison price (strikethrough). Handles INR formatting.

```tsx
import { PriceTag } from '@/components/shared/price-tag';

<PriceTag price={19900} compareAtPrice={29900} pricingType="paid" />
// Renders: ₹199 <s>₹299</s> (with savings badge)

<PriceTag price={0} pricingType="free" />
// Renders: Free
```

### StatusBadge
Colored badge for payment and fulfillment statuses.

```tsx
import { StatusBadge } from '@/components/shared/status-badge';

<StatusBadge type="payment" status="paid" />      // Green "Paid"
<StatusBadge type="payment" status="created" />    // Yellow "Awaiting payment"
<StatusBadge type="payment" status="failed" />     // Red "Failed"
<StatusBadge type="fulfillment" status="pending" /> // Orange "Pending"
<StatusBadge type="fulfillment" status="completed" /> // Green "Completed"
<StatusBadge type="fulfillment" status="cancelled" /> // Gray "Cancelled"
<StatusBadge type="pricing" status="free" />       // Green "Free"
<StatusBadge type="pricing" status="paid" />       // Blue "Paid"
<StatusBadge type="level" status="basics" />       // Blue "Basics"
<StatusBadge type="level" status="intermediate" /> // Yellow "Intermediate"
<StatusBadge type="level" status="advance" />      // Red "Advanced"
```

### ShimmerLoader
Animated skeleton placeholder using shimmer effect.

```tsx
import { ShimmerLoader } from '@/components/shared/shimmer-loader';

<ShimmerLoader rows={5} />
<ShimmerLoader count={6} type="card" />
```

### PDFPreviewDialog
Modal that renders a PDF preview using Cloudinary's hosted viewer.

```tsx
import { PDFPreviewDialog } from '@/components/shared/pdf-preview-dialog';

<PDFPreviewDialog
  isOpen={isPreviewOpen}
  onClose={() => setIsPreviewOpen(false)}
  url={note.previewFileUrl}
  title={note.title}
/>
```

### CopyButton
Clipboard copy button with visual feedback.

```tsx
import { CopyButton } from '@/components/shared/copy-button';

<CopyButton value="NP-20240101-0001" tooltip="Copy order number" />
```

### FileUploadField
Drag-and-drop file upload with progress indication and validation.

```tsx
import { FileUploadField } from '@/components/shared/file-upload-field';

<FileUploadField
  kind="note_full"
  label="Full PDF"
  hint="Upload the complete note PDF (max 50MB)"
  value={uploadedFiles.full}
  onChange={(file) => setUploadedFiles(prev => ({ ...prev, full: file }))}
/>
```

Props:
| Prop | Type | Description |
|------|------|-------------|
| `kind` | `UploadKind` | Upload type determining allowed file types |
| `label` | `string` | Field label |
| `hint` | `string` | Helper text below the field |
| `value` | `{ url, publicId, bytes } \| null` | Currently uploaded file |
| `onChange` | `(file) => void` | Callback when file is uploaded |

### PaginationBar
Client-side pagination controls with prev/next and page numbers.

```tsx
import { PaginationBar } from '@/components/shared/pagination-bar';

<PaginationBar
  page={page}
  totalPages={data.pagination.totalPages}
  baseUrl={`/notes`}
  query={{ search, category, level }}
/>
```

### EmptyState
Placeholder displayed when no items match the current filter.

```tsx
import { EmptyState } from '@/components/shared/empty-state';

<EmptyState
  title="No notes found"
  description="Try adjusting your filters or search terms."
  actionLabel="Clear filters"
  onAction={() => router.push('/notes')}
/>
```

### ErrorState
Fallback UI for failed data loading.

```tsx
import { ErrorState } from '@/components/shared/error-state';

<ErrorState
  title="Something went wrong"
  message={error.message}
  onRetry={() => refetch()}
/>
```

---

## Layout Components

### Container
Max-width wrapper with responsive padding.

```tsx
import { Container } from '@/components/layout/container';

<Container className="max-w-7xl">
  {/* page content */}
</Container>
```

### Section
Content section with consistent vertical rhythm.

```tsx
import { Section } from '@/components/layout/section';

<Section>
  <Section.Content>
    {/* content */}
  </Section.Content>
</Section>
```

### PageHeader
Page title with optional subtitle and breadcrumbs.

```tsx
import { PageHeader } from '@/components/layout/page-header';

<PageHeader
  title="Notes Catalog"
  subtitle="Browse our collection of study materials"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Notes' },
  ]}
/>
```

### StaticPage
Layout wrapper for static legal/informational pages.

```tsx
import { StaticPage } from '@/components/layout/static-page';

<StaticPage title="Privacy Policy">
  <article className="prose prose-slate max-w-none">
    <h2>Information We Collect</h2>
    <p>...</p>
  </article>
</StaticPage>
```

---

## Brand Components

### Logo
Site branding component.

```tsx
import { Logo } from '@/components/brand/logo';

<Logo />
<Logo className="h-8" />
```

### ThemeToggle
Dark/light mode switcher.

```tsx
import { ThemeToggle } from '@/components/brand/theme-toggle';

<ThemeToggle />
```

---

## SEO Components

### JSON-LD
Structured data renderer for search engines.

```tsx
import { organizationJsonLd, websiteJsonLd, productJsonLd, breadcrumbJsonLd } from '@/components/seo/json-ld';

// In layout or page component:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(note)) }}
/>
```

Available generators:
| Function | Schema Type | Used On |
|----------|------------|---------|
| `organizationJsonLd()` | Organization | Root layout |
| `websiteJsonLd(url)` | WebSite + SearchAction | Root layout |
| `productJsonLd(note)` | Product | Note detail pages |
| `collectionJsonLd(group)` | CollectionPage | Group detail pages |
| `breadcrumbJsonLd(items)` | BreadcrumbList | All pages |
| `faqJsonLd(faqs)` | FAQPage | About/contact pages |
| `articleJsonLd(note)` | Article | Note detail pages |
| `reviewJsonLd(reviews)` | Review | Pages with reviews |

---

## Feature Components

### Home Page Features (`src/features/home/components/`)

| Component | Purpose |
|-----------|---------|
| `HomePage` | Main homepage with hero, featured notes, free notes, categories |
| `HeroSection` | Top banner with call-to-action |
| `FeaturedNotesCarousel` | Horizontal scroll carousel of featured notes |
| `FreeNotesSection` | Grid of free notes |
| `CategoryShowcase` | Category cards with note counts |
| `StatsSection` | Site statistics display |

### Notes Features (`src/features/notes/components/`)

| Component | Purpose |
|-----------|---------|
| `NotesCatalogue` | Full notes listing with sidebar filters |
| `NoteDetailPage` | Individual note view with preview/download |
| `FilterPanel` | Collapsible sidebar with all filter controls |
| `ActiveFilterChips` | Pill-shaped chips showing current active filters |

### Groups Features (`src/features/groups/components/`)

| Component | Purpose |
|-----------|---------|
| `GroupsCatalogue` | Group listing with search and filters |
| `GroupDetail` | Group detail with included notes list |

### Checkout Features (`src/features/checkout/components/`)

| Component | Purpose |
|-----------|---------|
| `CheckoutPage` | Buyer info form + Razorpay integration |
| `CheckoutPageWrapper` | Layout wrapper for checkout flow |

### Orders Features (`src/features/orders/components/`)

| Component | Purpose |
|-----------|---------|
| `OrderLookupPage` | Order lookup by order number |
| `OrderStatusPage` | Order detail with payment and fulfillment status |

### Admin Features (`src/features/admin/components/`)

| Component | Purpose |
|-----------|---------|
| `AdminShell` | Admin layout with sidebar navigation |
| `AdminDashboard` | Dashboard overview with stats, charts, recent activity |
| `NotesTable` | Paginated notes list with search and filters |
| `NoteForm` | Create/edit note form with file uploads |
| `GroupsTable` | Paginated groups list |
| `GroupForm` | Create/edit group form |
| `CategoriesTable` | Categories list |
| `CategoryDialog` | Create/edit category modal |
| `OrdersTable` | Paginated orders list |
| `OrderDetailView` | Single order detail page |
| `FulfillmentDialog` | Fulfill/cancel order modal |
| `LeadsTable` | Unfulfilled orders list |
| `ExportButton` | CSV export trigger |
| `ActivitiesTable` | Admin activity audit log |
| `ActivityFilterBar` | Filter bar for activity log |
| `StatsGrid` | Dashboard stat cards |
| `RevenueChart` | Recharts line chart for revenue over time |
| `RecentOrders` | Recent orders widget |
| `ActivityFeed` | Recent activity widget |
