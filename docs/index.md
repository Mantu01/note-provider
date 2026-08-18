# Documentation Index

Welcome to the Notes Provider technical documentation. This documentation is organized by topic area.

## Quick Links

| Topic | File | Audience |
|-------|------|----------|
| **Project Overview** | [README.md](../README.md) | Everyone — non-technical intro |
| **Setup Guide** | [setup-guide.md](deployment/setup-guide.md) | Developers setting up locally |
| **Environment Variables** | [environment-config.md](deployment/environment-config.md) | Developers & DevOps |
| **Deployment Guide** | [deploy-guide.md](deployment/deploy-guide.md) | DevOps & deployment |
| **Architecture** | [architecture/overview.md](architecture/overview.md) | Developers |
| **API Reference** | [api/api-reference.md](api/api-reference.md) | Developers & integrators |
| **Database Models** | [database/models.md](database/models.md) | Backend developers |
| **Backend Services** | [backend/services.md](backend/services.md) | Backend developers |
| **Payment Flow** | [backend/payment-flow.md](backend/payment-flow.md) | Backend developers |
| **Frontend Architecture** | [frontend/architecture.md](frontend/architecture.md) | Frontend developers |
| **Component Reference** | [frontend/components.md](frontend/components.md) | Frontend developers |
| **Security Guide** | [security/security-guide.md](security/security-guide.md) | All developers |
| **Testing Guide** | [testing/testing-guide.md](testing/testing-guide.md) | All developers |
| **Constants & Types** | [reference/constants-and-types.md](reference/constants-and-types.md) | All developers |
| **SEO Guide** | [seo/seo-guide.md](seo/seo-guide.md) | Frontend developers |
| **Contributing** | [contributing.md](contributing.md) | Contributors |

## Documentation Structure

```
docs/
├── architecture/
│   └── overview.md              # System architecture, layer breakdown, data flows
├── api/
│   └── api-reference.md         # Complete API endpoint reference with request/response formats
├── backend/
│   ├── services.md              # Service layer, mappers, and server utilities
│   └── payment-flow.md          # Payment processing flow, webhook handling, state machine
├── database/
│   └── models.md                # MongoDB schemas, indexes, relationships
├── deployment/
│   ├── deploy-guide.md          # Vercel, self-hosted, Railway deployment instructions
│   ├── environment-config.md    # All environment variables with descriptions
│   └── setup-guide.md           # Step-by-step local setup instructions
├── frontend/
│   ├── architecture.md          # Frontend tech stack, state management, patterns
│   └── components.md            # Complete component library reference
├── reference/
│   └── constants-and-types.md   # All TypeScript types and project constants
├── security/
│   └── security-guide.md        # Auth, payment security, rate limiting, data privacy
├── seo/
│   └── seo-guide.md             # Sitemap, robots.txt, OG images, JSON-LD, PWA
├── testing/
│   └── testing-guide.md         # Test setup, mocking patterns, writing tests
└── contributing.md              # Contribution guidelines, commit conventions, PR workflow
```

## Reading Order for New Developers

1. **README.md** — Understand what the project does
2. **deployment/setup-guide.md** — Get the project running locally
3. **architecture/overview.md** — Understand the system architecture
4. **database/models.md** — Learn the data model
5. **frontend/architecture.md** — Understand the frontend structure
6. **backend/services.md** — Understand the server logic
7. **api/api-reference.md** — Reference for API endpoints
8. **security/security-guide.md** — Security considerations
9. **testing/testing-guide.md** — How to write and run tests
10. **contributing.md** — How to contribute code

## Audience Guide

| Role | Read These First | Then Explore |
|------|-----------------|--------------|
| **Product Manager** | README.md | seo-guide.md, payment-flow.md |
| **Frontend Developer** | README.md → frontend/architecture.md → frontend/components.md | api/api-reference.md, testing/testing-guide.md |
| **Backend Developer** | README.md → architecture/overview.md → database/models.md | backend/services.md, api/api-reference.md, security/security-guide.md |
| **DevOps Engineer** | README.md → deployment/setup-guide.md → deployment/environment-config.md | deployment/deploy-guide.md, security/security-guide.md |
| **Designer** | README.md → frontend/components.md | seo-guide.md (for OG images) |
| **Contributor** | README.md → contributing.md → architecture/overview.md | All technical docs as needed |
