# SEO & Metadata Guide

## Overview

Notes Provider implements comprehensive SEO optimization including dynamic sitemap generation, robots.txt configuration, Open Graph meta tags, JSON-LD structured data, and PWA support. All SEO elements are dynamically generated based on content from the database.

---

## Meta Tags & Open Graph

### Root Layout Metadata (`src/app/layout.tsx`)

The root layout sets global metadata that applies to every page:

```typescript
export const metadata: Metadata = {
  title: {
    default: 'Notes Provider — Premium Study Notes & Materials',
    template: '%s | Notes Provider',
  },
  description: 'Browse and download quality study notes, solved papers, and exam preparation materials for all subjects and levels.',
  keywords: ['study notes', 'exam preparation', 'college notes', 'engineering notes', 'medical notes'],
  authors: [{ name: 'Notes Provider' }],
  creator: 'Notes Provider',
  publisher: 'Notes Provider',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: APP_URL,
    siteName: 'Notes Provider',
    title: 'Notes Provider — Premium Study Notes & Materials',
    description: 'Browse and download quality study notes...',
    images: [`${APP_URL}/og/home.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notes Provider',
    description: 'Browse and download quality study notes...',
    images: [`${APP_URL}/og/home.png`],
    creator: '@notesprovider',
  },
  metadataBase: new URL(APP_URL),
  category: 'education',
  referrer: 'strict-origin-when-cross-origin',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};
```

### Dynamic Page Metadata

Each page overrides the default metadata with page-specific values:

```typescript
// Note detail page
export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Metadata {
  return {
    title: `${note.title} — Download Study Notes | Notes Provider`,
    description: note.description.substring(0, 160),
    alternates: { canonical: `${APP_URL}/notes/${slug}` },
    openGraph: {
      url: `${APP_URL}/notes/${slug}`,
      type: 'article',
      images: [note.coverImageUrl || `${APP_URL}/og/note/${slug}`],
    },
    twitter: {
      images: [note.coverImageUrl || `${APP_URL}/og/note/${slug}`],
    },
  };
}
```

---

## JSON-LD Structured Data

Located in `src/components/seo/json-ld.tsx`. These are injected into pages as `<script type="application/ld+json">` tags.

### Organization Schema (Root Layout)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Notes Provider",
  "url": "https://notesprovider.com",
  "logo": "https://notesprovider.com/og/logo.png",
  "sameAs": ["https://twitter.com/notesprovider", "https://github.com/notes-provider"]
}
```

### WebSite Schema (Root Layout)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Notes Provider",
  "url": "https://notesprovider.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://notesprovider.com/notes?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### Product Schema (Note Detail Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Calculus Notes",
  "description": "Complete calculus study material...",
  "image": "https://res.cloudinary.com/.../cover.jpg",
  "offers": {
    "@type": "Offer",
    "price": "199.00",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "124"
  }
}
```

### BreadcrumbList Schema (All Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://notesprovider.com" },
    { "@type": "ListItem", "position": 2, "name": "Notes", "item": "https://notesprovider.com/notes" },
    { "@type": "ListItem", "position": 3, "name": "Calculus Notes" }
  ]
}
```

---

## Sitemap Generation

**File:** `src/app/sitemap.ts`

The sitemap is generated dynamically at build time and includes:

### Static Pages
- `/` — Homepage
- `/notes` — Notes catalog
- `/groups` — Groups catalog
- `/about` — About page
- `/contact` — Contact page
- `/terms` — Terms of service
- `/privacy` — Privacy policy
- `/refund-policy` — Refund policy

### Dynamic Content Pages
- `/notes/[slug]` — Every public note
- `/groups/[slug]` — Every public group
- `/notes?category=[slug]` — Category filter pages
- `/notes?level=[level]` — Level filter pages
- `/notes?pricing=[free|paid]` — Pricing filter pages
- `/notes?sort=[sort]` — Sort pages

### Sitemap Configuration

```typescript
export default async function sitemap() {
  const staticPages = [
    { url: `${APP_URL}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${APP_URL}/notes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${APP_URL}/groups`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    // ... more static pages
  ];

  const notes = await safeQuery(Note.find({ visibility: 'public' }).select('slug updatedAt'));
  const notePages = notes.map(note => ({
    url: `${APP_URL}/notes/${note.slug}`,
    lastModified: note.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...notePages, ...groupPages, ...categoryFilterPages];
}
```

---

## Robots.txt

**File:** `src/app/robot.ts`

Comprehensive robots.txt that blocks AI crawlers and sensitive paths:

```
User-agent: *
Allow: /
Allow: /notes
Allow: /groups
Allow: /about
Allow: /contact
Disallow: /admin
Disallow: /checkout
Disallow: /api/
Disallow: /order/track
Disallow: /order/*

User-agent: CCBot
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Anthropic AI
Disallow: /

Sitemap: https://notesprovider.com/sitemap.xml
Host: notesprovider.com
```

---

## Open Graph Image Generation

Dynamic OG images are generated via route handlers in `src/app/og/`:

| Route | Generates |
|-------|-----------|
| `/og/home` | Homepage social sharing image |
| `/og/note/[slug]` | Note detail page image |
| `/og/group/[slug]` | Group detail page image |
| `/og/logo` | Brand logo |

These use Next.js's built-in image response API to generate PNG images on the fly with text overlaid on gradient backgrounds.

---

## PWA Configuration

**File:** `public/manifest.json`

```json
{
  "name": "Notes Provider",
  "short_name": "Notes Provider",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#6366f1",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "en-IN",
  "categories": ["education", "shopping"],
  "icons": [
    { "src": "/favicon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/favicon-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Linked in the root layout:
```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#6366f1" />
```

---

## Performance Optimization

### Font Loading
Google Fonts (Inter + Outfit) are loaded via `next/font/google` with `display: swap` to prevent FOIT (Flash of Invisible Text).

```typescript
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], display: 'swap', variable: '--font-outfit' });
```

### Preconnect Hints
The layout includes DNS-prefetch and preconnect hints for external services:
- Google Fonts
- Cloudinary
- Razorpay checkout

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link rel="dns-prefetch" href="https://res.cloudinary.com" />
<link rel="dns-prefetch" href="https://checkout.razorpay.com" />
```

### Image Optimization
Next.js Image component automatically serves AVIF/WebP formats with lazy loading:

```typescript
import Image from 'next/image';

<Image
  src={note.coverImageUrl}
  alt={note.title}
  width={400}
  height={300}
  loading="lazy"
  placeholder="blur"
/>
```

Remote patterns are configured in `next.config.ts` for Cloudinary and YouTube avatars.

---

## SEO Checklist

| Check | Implementation |
|-------|---------------|
| Unique titles per page | ✅ Template-based with page-specific prefix |
| Meta descriptions | ✅ Dynamic from content, truncated to 160 chars |
| Canonical URLs | ✅ Set on every page |
| Open Graph tags | ✅ Complete OG + Twitter Card meta |
| JSON-LD structured data | ✅ Organization, WebSite, Product, BreadcrumbList |
| Sitemap | ✅ Dynamic, regenerated on each build |
| Robots.txt | ✅ Comprehensive, blocks AI crawlers |
| H1 hierarchy | ✅ Single H1 per page, proper heading structure |
| Alt text on images | ✅ Note/group titles as alt text |
| Mobile-friendly | ✅ Responsive Tailwind CSS |
| Fast loading | ✅ ISR, image optimization, font loading optimization |
| PWA support | ✅ Manifest + theme colors |
