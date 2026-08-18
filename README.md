# Notes Provider

A modern digital content marketplace for selling and managing educational notes and study materials online.

## What Is This Project?

Notes Provider is a web-based platform that allows creators to sell digital study notes — either as individual PDF documents or as curated bundles (called "groups"). Buyers can browse, preview, purchase, and download notes directly from the website.

Think of it as a small online bookstore, but specifically for academic notes. A teacher or student can upload their notes, set a price (or make them free), and the platform handles the rest: payments, delivery, and analytics.

## Who Is It For?

**For Sellers (Admins):**
- Students or educators who want to monetize their handwritten or typed notes
- Study groups or coaching centers selling compiled materials
- Anyone with valuable study content they want to share for a fee

**For Buyers:**
- Students looking for quality study material
- Anyone who wants affordable access to well-organized notes
- People who prefer browsing and filtering by subject, level, or price

## Key Features

### For Buyers
- **Browse Notes**: Explore a catalog of notes organized by category, subject, difficulty level, and price
- **Free Preview**: Before buying, you can preview sample pages of any paid note
- **Easy Search**: Find exactly what you need using keyword search, filters, and sorting options
- **Secure Payment**: Pay using Razorpay (supports UPI, cards, net banking, wallets)
- **Quick Download**: Get your purchased notes delivered instantly via Instagram, WhatsApp, or Email
- **Track Orders**: Look up any order using your order number to check status

### For Sellers (Admin Panel)
- **Complete Dashboard**: See revenue, order counts, and top-performing notes at a glance
- **Manage Content**: Add, edit, or remove notes and grouped bundles anytime
- **Organize Categories**: Create subjects and categories to keep your library tidy
- **Fulfill Orders**: Mark orders as completed once you deliver the notes to customers
- **View Analytics**: Track which notes are most popular and where your revenue comes from
- **Audit Activity**: See a complete log of everything that happens in your admin panel

### Technical Highlights
- **Fast & Modern**: Built with Next.js 16 for lightning-fast page loads
- **Mobile Friendly**: Works beautifully on phones, tablets, and desktops
- **Dark Mode**: Switch between light and dark themes with one click
- **SEO Optimized**: Your notes appear in Google search results automatically
- **Secure Payments**: All transactions are processed through Razorpay's secure gateway
- **Cloud Storage**: Files are stored safely on Cloudinary with protected download links

## How It Works

### Buying Notes
1. Browse the notes catalog or search for a specific topic
2. Click on a note to see details, pricing, and a free preview
3. Add it to your cart and proceed to checkout
4. Fill in your details (name, WhatsApp/Instagram/email)
5. Pay securely through Razorpay
6. Your admin will deliver the full PDF within 6 hours
7. Download your notes directly from the order page

### Selling Notes
1. Log into the admin dashboard
2. Upload your note PDF, a preview version, and a cover image
3. Set the price, category, difficulty level, and tags
4. Publish — your note becomes available to buyers immediately
5. When someone buys, you get notified and can fulfill the order
6. Track your earnings and performance from the dashboard

## Pages Overview

| Page | What You'll Find |
|------|------------------|
| Home (`/`) | Featured notes, latest additions, popular categories, and quick stats |
| Notes (`/notes`) | Full catalog of all notes with search and filter options |
| Note Detail (`/notes/[slug]`) | Complete info about a single note, preview PDF, related notes |
| Groups (`/groups`) | Browse bundled collections of notes |
| Group Detail (`/groups/[slug]`) | Details of a bundle, included notes, purchase button |
| Checkout (`/checkout/[slug]`) | Secure payment form to buy a note or group |
| Order Track (`/order/track`) | Look up your order status using your order number |
| Order Detail (`/order/[id]`) | View payment status, download your notes |
| About (`/about`) | Learn about Notes Provider |
| Contact (`/contact`) | Reach out via X/Twitter, GitHub, or Email |
| Privacy Policy (`/privacy`) | How we handle your data |
| Terms (`/terms`) | Rules for using the platform |
| Refund Policy (`/refund-policy`) | Digital goods are non-refundable |
| Admin Login (`/admin/login`) | Secure login for sellers |
| Admin Dashboard (`/admin/dashboard`) | Sales overview, charts, and quick stats |
| Admin Notes (`/admin/dashboard/notes`) | Manage all your notes |
| Admin Groups (`/admin/dashboard/groups`) | Manage note bundles |
| Admin Categories (`/admin/dashboard/categories`) | Organize your note categories |
| Admin Orders (`/admin/dashboard/orders`) | View and fulfill customer orders |
| Admin Leads (`/admin/dashboard/leads`) | Pending orders awaiting fulfillment |
| Admin Activities (`/admin/dashboard/activities`) | Complete audit log of admin actions |

## Technology Used

This project is built with modern, battle-tested technologies:

- **Frontend**: React 19, Next.js 16 (App Router), TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui component library
- **Database**: MongoDB (NoSQL document database)
- **Payments**: Razorpay (India's leading payment gateway)
- **File Storage**: Cloudinary (cloud-based PDF and image hosting)
- **Email**: Nodemailer (for order notifications)
- **Authentication**: JWT tokens with secure HTTP-only cookies
- **Testing**: Vitest with React Testing Library (199 test files, 2200+ tests passing)

## Getting Started (For Developers)

### Prerequisites
- Node.js 20+ installed
- pnpm package manager
- MongoDB running locally or a MongoDB Atlas connection string

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd notes-provider

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env and fill in your values (MongoDB URI, Razorpay keys, etc.)

# Start MongoDB locally (requires Docker)
docker-compose up -d

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint code checker |
| `pnpm test` | Run all tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage report |

### Environment Variables

Copy `.env.example` to `.env` and fill in these required values:

- `NEXT_PUBLIC_APP_URL` — Your website URL (e.g., `https://notesprovider.com`)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Secret key for signing admin session tokens
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — Razorpay payment keys
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — Cloudinary storage credentials
- `ADMIN_REGISTER_SECRET` — Secret header value to allow creating new admin accounts
- `MAIL_SERVICE` / `MAIL_PROVIDER` / `MAIL_PORT` / `MAIL_USERNAME` / `MAIL_PASSWORD` — Email configuration

See `.env.example` for the complete list with descriptions.

### Adding a First Admin Account

Admin accounts are created through the registration API. You need the `ADMIN_REGISTER_SECRET` header to register. This prevents unauthorized people from creating admin accounts.

```bash
curl -X POST http://localhost:3000/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -H "x-admin-register-secret: YOUR_SECRET_HERE" \
  -d '{"name":"Admin","email":"admin@example.com","password":"yourpassword123"}'
```

## Project Structure

```
notes-provider/
├── src/
│   ├── app/                  # Next.js pages and API routes
│   │   ├── (public)/         # Public-facing pages
│   │   ├── admin/            # Admin dashboard pages
│   │   ├── api/              # Backend API endpoints
│   │   └── og/               # Dynamic social media images
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # shadcn/ui primitives (buttons, cards, etc.)
│   │   ├── layout/           # Navbar, Footer, navigation
│   │   ├── shared/           # Note cards, price tags, badges, etc.
│   │   ├── brand/            # Logo, theme toggle
│   │   └── seo/              # JSON-LD structured data
│   ├── features/             # Feature modules (pages + API hooks)
│   │   ├── home/             # Homepage feature
│   │   ├── notes/            # Notes browsing and detail
│   │   ├── groups/           # Group/bundle management
│   │   ├── orders/           # Order tracking and status
│   │   ├── checkout/         # Payment flow
│   │   └── admin/            # Admin dashboard and CRUD
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Shared utilities, types, schemas
│   ├── providers/            # React context providers
│   └── server/               # Server-side logic
│       ├── db/models/        # MongoDB Mongoose models
│       ├── services/         # Business logic services
│       ├── mappers/          # Data transformation helpers
│       └── lib/              # Auth, payments, email, storage
├── tests/                    # Test suite (mirrors src/ structure)
├── public/                   # Static assets
├── docs/                     # Technical documentation
├── docker-compose.yml        # Local MongoDB container
└── package.json              # Dependencies and scripts
```

## Security Features

- All admin sessions use secure, HTTP-only JWT cookies (7-day expiry)
- Passwords are hashed with bcrypt (cost factor 12)
- Payment processing is handled entirely by Razorpay (we never store card details)
- File downloads use signed URLs that expire after 60 seconds
- Rate limiting protects login, registration, and payment endpoints
- Input validation on every API request using Zod schemas
- Admin registration requires a secret header to prevent abuse
- All external file uploads are validated for type and size before acceptance

## Performance & SEO

- Pages use Incremental Static Regeneration (ISR) for fast loading
- Images are auto-optimized in AVIF/WebP formats via Next.js Image
- Full Open Graph meta tags for social media sharing
- JSON-LD structured data for rich search results
- Dynamic sitemap.xml generated automatically
- Comprehensive robots.txt blocking AI crawlers
- PWA-ready with manifest for mobile installation
- Dark/light theme support with system preference detection

## Testing

This project has an extensive test suite with 199 test files covering:
- API route handlers (mocked database calls)
- React components (rendering and interactions)
- Utility functions and validators
- Database service logic
- Type mapper transformations

Run tests with:
```bash
pnpm test          # Run all tests once
pnpm test:watch    # Run tests and watch for changes
pnpm test:coverage # Run tests with coverage report
```

## Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy is using the Vercel Platform:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project into Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

Vercel automatically detects Next.js and handles builds and deployments.

### Self-Hosting

You can also self-host on any platform that supports Node.js:

1. Build the app: `pnpm build`
2. Start the server: `pnpm start`
3. Ensure MongoDB is accessible (use MongoDB Atlas or run your own)
4. Set all required environment variables
5. Reverse proxy with Nginx or similar for production

### Docker

A `docker-compose.yml` is provided to spin up a local MongoDB instance for development:

```bash
docker-compose up -d
```

There is no Dockerfile for the application itself — this project is designed to be deployed as a standard Next.js app on platforms like Vercel, Railway, or Fly.io.

---

Built with Next.js, TypeScript, MongoDB, and Razorpay.
© 2026 Notes Provider. All rights reserved.
