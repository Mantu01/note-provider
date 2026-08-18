# Environment Variables & Configuration

## Required Environment Variables

Copy `.env.example` to `.env` and fill in all values marked as required.

### Application Configuration

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Yes | Base URL of your deployed application. Used for SEO (sitemap, OG images, canonical URLs), email templates, and redirect URLs. | `https://notesprovider.com` |
| `NODE_ENV` | Yes | Runtime environment. Set to `production` for production builds, `development` for local dev. | `development` |

### Database

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | Yes | MongoDB connection string. Supports local MongoDB or MongoDB Atlas. | `mongodb://127.0.0.1:27017/notes-provider` |
| | | Atlas example: `mongodb+srv://user:pass@cluster.mongodb.net/notes-provider` | |

### Authentication

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `JWT_SECRET` | Yes | Secret key used to sign and verify JWT session tokens. Must be at least 32 characters for HS256. Generate with: `openssl rand -base64 64` | `your-super-secret-jwt-key-min-32-chars` |
| `ADMIN_REGISTER_SECRET` | Yes | Secret header value (`x-admin-register-secret`) required to create new admin accounts via the registration API. Prevents unauthorized admin creation. | `super-secret-register-token` |

### Payments (Razorpay)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `RAZORPAY_KEY_ID` | Yes | Razorpay API key ID. Get from [Razorpay Dashboard](https://dashboard.razorpay.com/) → Settings → API Keys. | `rzp_test_XXXXXXXXXXXX` |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay API secret key. | `XXXXXXXXXXXXXXXXXXXX` |
| `RAZORPAY_WEBHOOK_SECRET` | Yes | Webhook verification secret. Configure in Razorpay Dashboard → Settings → Webhooks. Set this value when creating the webhook endpoint. | `whsec_XXXXXXXXXXXXXXXX` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Yes | Public key ID exposed to the browser for client-side Razorpay initialization. Use the same value as `RAZORPAY_KEY_ID`. | `rzp_test_XXXXXXXXXXXX` |

### File Storage (Cloudinary)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `CLOUDINARY_CLOUD_NAME` | Yes | Your Cloudinary cloud name. Get from [Cloudinary Dashboard](https://cloudinary.com/console). | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key. | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret. | `abcdefghijklmnopqrstuvwxyz` |

### Email (Nodemailer)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MAIL_SERVICE` | Yes | Nodemailer service name for production SMTP. Set to `gmail` or leave blank for custom SMTP. | `gmail` |
| `MAIL_PROVIDER` | No | SMTP host for development. Defaults to Mailtrap sandbox. | `sandbox.smtp.mailtrap.io` |
| `MAIL_PORT` | No | SMTP port. Defaults to `2525` for Mailtrap, `587` for Gmail. | `2525` |
| `MAIL_USERNAME` | No | SMTP username. | `your@email.com` |
| `MAIL_PASSWORD` | No | SMTP password or app password. | `your-app-password` |

### Analytics

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics 4 measurement ID (client-side gtag). | `G-XXXXXXXXXX` |
| `GOOGLE_ANALYTICS_ID` | No | Google Analytics ID for server-side component. | `G-21LYC44FJK` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Google Search Console verification token. | `abc123XYZ` |
| `NEXT_PUBLIC_OG_IMAGE_URL` | No | Static OG image URL fallback. If not set, dynamic OG images are generated via route handlers. | `https://notesprovider.com/og/home.png` |

## Optional Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_APP_URL` fallback | `https://notesprovider.online` | Fallback base URL if not set |
| `NODE_ENV` | `development` | Affects cookie security flag and mail config |
| `MAX_PAGE_LIMIT` | `48` | Maximum items per page in API responses |

## Security Considerations

1. **Never commit `.env` to git** — it is listed in `.gitignore`
2. **Use different secrets for dev and production** — generate unique `JWT_SECRET` and `ADMIN_REGISTER_SECRET` per environment
3. **Rotate credentials regularly** — especially `JWT_SECRET` and `RAZORPAY_KEY_SECRET`
4. **Use production Razorpay keys** — test keys (`rzp_test_`) only work in test mode
5. **Enable HTTPS in production** — the `secure` flag on session cookies requires `NODE_ENV=production`
6. **Keep webhook secret private** — Razorpay uses this to verify incoming webhook signatures

## Configuration Files Reference

| File | Purpose |
|------|---------|
| `.env.example` | Template with all variables and descriptions |
| `.env` | Live configuration (ignored by git) |
| `next.config.ts` | Next.js runtime configuration (images, compression, body size) |
| `tsconfig.json` | TypeScript compiler options |
| `vitest.config.ts` | Test runner configuration |
| `docker-compose.yml` | Local MongoDB container setup |
| `components.json` | shadcn/ui component library configuration |
| `postcss.config.mjs` | Tailwind CSS PostCSS configuration |
| `eslint.config.mjs` | ESLint rules and overrides |
| `.vscode/settings.json` | VS Code MongoDB preset connection |

## Running Local Development

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in values
3. Start MongoDB: `docker-compose up -d`
4. Install dependencies: `pnpm install`
5. Start dev server: `pnpm dev`
6. Visit `http://localhost:3000`

To add the first admin account:
```bash
curl -X POST http://localhost:3000/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -H "x-admin-register-secret: YOUR_SECRET" \
  -d '{"name":"Admin","email":"admin@example.com","password":"SecurePass123"}'
```
