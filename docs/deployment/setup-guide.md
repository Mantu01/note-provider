# Setup Guide

## Prerequisites

Before setting up the project locally, ensure you have:

| Tool | Minimum Version | How to Check |
|------|----------------|--------------|
| Node.js | 20 LTS | `node --version` |
| pnpm | 8+ | `pnpm --version` |
| Git | Latest | `git --version` |
| Docker (optional) | Latest | `docker --version` |

Install Node.js from [nodejs.org](https://nodejs.org) and pnpm via:
```bash
npm install -g pnpm
```

## Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd notes-provider

# 2. Install dependencies
pnpm install

# 3. Copy environment template and fill in values
cp .env.example .env
# Edit .env — see docs/deployment/environment-config.md for details

# 4. Start MongoDB (requires Docker)
docker-compose up -d

# 5. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Detailed Setup Steps

### Step 1: MongoDB Setup

#### Option A: Docker (Recommended for Development)

```bash
# Start MongoDB with persistent storage
docker-compose up -d

# Verify it's running
docker ps | grep mongodb

# Stop when done
docker-compose down
```

The Docker Compose setup uses MongoDB 7.0 with a named volume (`mongodb_data`) for data persistence.

#### Option B: MongoDB Atlas (Recommended for Production)

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 Sandbox)
3. Get your connection string (Dashboard → Connections → Connect → Driver)
4. Replace `<password>` with your database user password
5. Add your IP address to the network access list
6. Set `MONGODB_URI` in `.env` to your Atlas connection string

#### Option C: Local MongoDB Installation

Download and install MongoDB Community Edition from [mongodb.com/download-center/community](https://www.mongodb.com/try/download/community).

```bash
# Start MongoDB manually
mongod

# Or on macOS with Homebrew
brew services start mongodb-community
```

### Step 2: Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to Dashboard → Settings → API Keys
3. Generate Test Keys (for development) or Live Keys (for production)
4. Copy `Key Id` and `Key Secret` into `.env`
5. For webhooks: Settings → Webhooks → Create Webhook
   - URL: `http://localhost:3000/api/webhooks/razorpay` (dev) or `https://yourdomain.com/api/webhooks/razorpay` (prod)
   - Events: `payment.captured`, `payment.failed`, `order.paid`, `order.canceled`
   - Copy the Webhook Secret into `.env` as `RAZORPAY_WEBHOOK_SECRET`

### Step 3: Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard to find your Cloud Name, API Key, and API Secret
3. Add all three to `.env`
4. Cloudinary handles PDF uploads, image optimization, and signed URL generation automatically

### Step 4: Email Setup

#### Development (Mailtrap — Recommended)

1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Go to Email Testing → Inboxes
3. Copy the SMTP credentials into `.env`:
   ```
   MAIL_PROVIDER=sandbox.smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USERNAME=your-username
   MAIL_PASSWORD=your-password
   ```

#### Production (Gmail)

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Add to `.env`:
   ```
   MAIL_SERVICE=gmail
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   ```

### Step 5: Authentication Setup

Generate secure secrets:
```bash
# Generate JWT secret (at least 32 characters)
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

# Set it in .env
echo "JWT_SECRET=<generated-secret>" >> .env

# Generate admin register secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set it in .env
echo "ADMIN_REGISTER_SECRET=<generated-secret>" >> .env
```

### Step 6: Create First Admin Account

With your `ADMIN_REGISTER_SECRET` set, create the first admin:
```bash
curl -X POST http://localhost:3000/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -H "x-admin-register-secret: YOUR_SECRET" \
  -d '{
    "name": "Administrator",
    "email": "admin@example.com",
    "password": "SecurePassword123",
    "isHead": true
  }'
```

Then log in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

### Step 7: SEO Configuration (Optional)

Update `.env` with your analytics and verification IDs:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification-token
NEXT_PUBLIC_APP_URL=https://notesprovider.com
```

## Project Scripts Reference

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Start development server with hot reload (port 3000) |
| `build` | `next build` | Create production build in `.next/` directory |
| `start` | `next start` | Start production server (requires `pnpm build` first) |
| `lint` | `eslint` | Check code quality and fix issues |
| `test` | `vitest run` | Run all 199 test files once |
| `test:watch` | `vitest` | Run tests and watch for file changes |
| `test:coverage` | `vitest run --coverage` | Run tests with coverage report in `coverage/` |

## VS Code Setup

The project includes a `.vscode/settings.json` with a MongoDB preset connection:
```json
{
  "mdb.presetConnections": [
    {
      "name": "Preset Connection",
      "connectionString": "mongodb://localhost:27017"
    }
  ]
}
```

Install these recommended extensions:
- **ESLint** — linting support
- **Tailwind CSS IntelliSense** — autocomplete for Tailwind classes
- **MongoDB for VS Code** — database exploration
- **TypeScript + JavaScript Syntax Highlighting** — built-in
- **Prettier** (optional) — code formatting

## Troubleshooting

### MongoDB Connection Failed
- Ensure Docker is running: `docker ps`
- Check if MongoDB container is up: `docker ps | grep mongodb`
- Restart: `docker-compose restart`
- Reset data volume if corrupted: `docker-compose down && docker volume rm notes-provider_mongodb_data && docker-compose up -d`

### Razorpay Order Creation Fails
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correct
- Check that the amount is in paise (integer, not decimal rupees)
- For test mode, use test card numbers from [Razorpay docs](https://razorpay.com/docs/payments/payments/test-card-upi-details/)

### Cloudinary Upload Fails
- Verify `CLOUDINARY_CLOUD_NAME`, `API_KEY`, and `API_SECRET`
- Check that the file size is within limits (50MB full, 20MB preview, 5MB cover)
- Ensure the file is a valid PDF for note uploads

### JWT Cookie Not Working
- Ensure `JWT_SECRET` matches between the login route and the middleware (`src/proxy.ts`)
- Check that `NODE_ENV` is set correctly (affects cookie `secure` flag)
- In development, the cookie is not `secure`, so HTTP works fine

### Tests Failing
- Ensure `.env` exists (some tests read env vars)
- Run `pnpm test -- --clearCache` to clear Vitest cache
- Check that MongoDB container is running for integration tests

## Common Commands

```bash
# Full development workflow
docker-compose up -d          # Start MongoDB
pnpm install                  # Install dependencies
pnpm dev                      # Start dev server

# Production build
pnpm build                    # Build optimized assets
pnpm start                    # Start production server

# Code quality
pnpm lint                     # Check for issues
pnpm lint --fix              # Auto-fix fixable issues
pnpm test                     # Run all tests
pnpm test:coverage            # Run tests with coverage report

# Database
docker-compose up -d          # Start MongoDB
docker-compose down           # Stop MongoDB
docker-compose restart        # Restart MongoDB
```
