# Deployment Guide

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the default deployment target for Next.js applications and provides the best experience out of the box.

#### Steps

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Add documentation"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New..." → "Project"
   - Select your repository and click "Import"

3. **Configure Environment Variables**
   In the Vercel project settings, add all variables from `docs/deployment/environment-config.md`:
   - `NEXT_PUBLIC_APP_URL` — your production URL
   - `MONGODB_URI` — MongoDB Atlas connection string
   - `JWT_SECRET` — generated secret
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` — from Razorpay dashboard
   - `RAZORPAY_WEBHOOK_SECRET` — from Razorpay webhook settings
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `ADMIN_REGISTER_SECRET` — your registration secret
   - `MAIL_*` variables — your SMTP configuration
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` — Google Analytics ID

4. **Deploy**
   - Vercel auto-detects Next.js and builds automatically
   - Each push to `main` triggers a new deployment
   - Preview deployments are created for every branch

5. **Configure Custom Domain**
   - Go to Project Settings → Domains
   - Add your domain and configure DNS records as instructed

#### MongoDB on Vercel

Since Vercel servers are serverless, you cannot run a local MongoDB. Use:
- **MongoDB Atlas** (free tier available) — recommended
- Connect string format: `mongodb+srv://user:pass@cluster.mongodb.net/notes-provider`

#### Razorpay Webhook Setup

After deployment:
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Create webhook with URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events: `payment.captured`, `payment.failed`, `order.paid`, `order.canceled`
4. Copy the Webhook Secret and add it to Vercel environment variables as `RAZORPAY_WEBHOOK_SECRET`

---

### Option 2: Self-Hosted (Docker / VPS)

If you prefer to self-host, deploy on any platform that supports Node.js.

#### Requirements

- Node.js 20+ LTS
- MongoDB 7.0+ (local or Atlas)
- 512 MB RAM minimum (1 GB recommended)
- SSL certificate (Let's Encrypt recommended)

#### Build & Run

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Start the server
pnpm start
```

#### Docker Deployment

While there is no Dockerfile in the project root, you can create one:

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN corepack enable && pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
RUN corepack enable && pnpm install --frozen-lockfile --prod
EXPOSE 3000
CMD ["pnpm", "start"]
```

Then run:
```bash
docker build -t notes-provider .
docker run -p 3000:3000 --env-file .env notes-provider
```

#### Nginx Reverse Proxy Configuration

```nginx
server {
    listen 80;
    server_name notesprovider.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name notesprovider.com;

    ssl_certificate /etc/letsencrypt/live/notesprovider.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/notesprovider.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### Option 3: Railway

Railway provides an easy platform-as-a-service option for Next.js apps.

1. Connect your GitHub repository to Railway
2. Railway auto-detects the Next.js project
3. Add environment variables in the Railway dashboard
4. Deploy — Railway handles builds and scaling automatically

---

## Post-Deployment Checklist

After deploying, verify the following:

### Functionality Checks

- [ ] Homepage loads correctly at your domain
- [ ] Notes catalog page shows notes with images
- [ ] Note detail page shows preview and download buttons
- [ ] Checkout flow creates a Razorpay order successfully
- [ ] Payment webhook receives and processes `payment.captured` events
- [ ] Admin login works with correct credentials
- [ ] Admin dashboard loads with stats
- [ ] Note creation/upload works (Cloudinary integration)
- [ ] Email notifications are sent on new purchases

### Security Checks

- [ ] `.env` file is not committed to the repository
- [ ] Admin routes return 401 without valid session cookie
- [ ] Rate limiting is active on login and registration
- [ ] HTTPS is enforced (redirect HTTP to HTTPS)
- [ ] Razorpay webhook signature verification is working

### SEO Checks

- [ ] `sitemap.xml` returns all public pages and dynamic content
- [ ] `robots.txt` blocks `/admin` and `/api/` paths
- [ ] Open Graph meta tags appear when sharing on social media
- [ ] JSON-LD structured data is present on note and group pages
- [ ] Google Search Console verification HTML is served

### Performance Checks

- [ ] Lighthouse score is 90+ on Core Web Vitals
- [ ] Images are served in WebP/AVIF format
- [ ] ISR revalidation is working (check Network tab for cache headers)
- [ ] No console errors in browser DevTools

---

## Monitoring & Maintenance

### Log Monitoring

The application uses `console.log` / `console.error` for logging. On Vercel, check:
- Vercel Dashboard → Your Project → Logs
- Look for `[api] unhandled error`, `[webhook] error`, `[Cloudinary` error patterns

### Database Backup

Set up automated MongoDB backups:
- **Atlas**: Enable automatic daily backups in the cluster settings
- **Self-hosted**: Use `mongodump` on a cron schedule

### Environment Variable Rotation

Rotate these periodically:
- `JWT_SECRET` — every 6 months
- `ADMIN_REGISTER_SECRET` — when team changes
- `RAZORPAY_KEY_SECRET` — if compromised or annually

### Update Process

```bash
git pull origin main
pnpm install
pnpm build
pnpm start
```

On Vercel, simply push to `main` and the deployment updates automatically.
