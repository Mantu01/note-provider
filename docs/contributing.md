# Contributing Guide

## Development Workflow

### Prerequisites

Ensure you have the following installed:
- Node.js 20+ LTS
- pnpm 8+
- Docker (for local MongoDB)
- Git

### Setting Up Local Development

```bash
# 1. Clone and enter the project
git clone <repository-url>
cd notes-provider

# 2. Install dependencies
pnpm install

# 3. Copy and configure environment
cp .env.example .env
# Edit .env — see docs/deployment/environment-config.md

# 4. Start MongoDB
docker-compose up -d

# 5. Start the development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Code Style

This project uses ESLint with the Next.js recommended configuration. There is no Prettier — formatting is handled by ESLint rules.

```bash
# Lint the codebase
pnpm lint

# Auto-fix fixable issues
pnpm lint --fix
```

Key style conventions:
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings, except in JSON
- **Semicolons**: Required
- **Trailing commas**: Required in multi-line objects/arrays
- **Import order**: Built-in → external → internal (`@/`) → relative
- **File naming**: kebab-case for components and pages, PascalCase for React components

### Branch Strategy

```
main            — Production-ready code (protected)
feature/*      — New features (e.g., feature/admin-dashboard)
bugfix/*       — Bug fixes (e.g., bugfix/order-lookup)
hotfix/*       — Urgent production fixes
```

Workflow:
1. Create a branch from `main`
2. Make your changes
3. Run tests: `pnpm test`
4. Run linter: `pnpm lint --fix`
5. Commit with conventional commits: `feat: add note filtering by price range`
6. Push and create a Pull Request

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation only changes
- `style` — Code style changes (formatting, semicolons, etc.)
- `refactor` — Code change that neither fixes a bug nor adds a feature
- `test` — Adding or updating tests
- `chore` — Build process, CI/CD, dependency updates

**Examples:**
```
feat(admin): add revenue chart to dashboard
fix(checkout): handle expired Razorpay orders gracefully
docs: add payment flow diagram
test(notes): add filter edge case tests
refactor(mappers): extract price formatting to shared utility
```

---

## Adding a New Feature

### 1. Define the Data Model

If your feature requires new database entities, add a Mongoose model in `src/server/db/models/`:

```typescript
// src/server/db/models/my-entity.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface MyEntityDoc extends Document {
  name: string;
  slug: string;
  // ... fields
}

const MyEntitySchema = new Schema<MyEntityDoc>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

export const MyEntity = mongoose.model<MyEntityDoc>('MyEntity', MyEntitySchema);
```

### 2. Add Validation Schema

Add a Zod schema in `src/lib/schemas/`:

```typescript
// src/lib/schemas/my-entity.schema.ts
import { z } from 'zod';

export const createMyEntitySchema = z.object({
  name: z.string().min(2).max(160),
  // ... other fields
});
```

### 3. Add Service Logic

Add business logic in `src/server/services/`:

```typescript
// src/server/services/my-entity.service.ts
import { MyEntity } from '../db/models/my-entity.model';

export async function createMyEntity(data: CreateMyEntityInput, admin: AdminDoc) {
  const slug = await uniqueSlug(MyEntity, slugify(data.name));
  return MyEntity.create({ ...data, slug, createdBy: admin.id });
}
```

### 4. Add Mapper

Add data transformation in `src/server/mappers/`:

```typescript
// src/server/mappers/my-entity.mapper.ts
export function toPublicMyEntity(entity: MyEntityDoc): PublicMyEntity {
  return {
    id: entity._id.toString(),
    name: entity.name,
    // ... mapped fields
  };
}
```

### 5. Add API Route

Add the route handler in `src/app/api/`:

```typescript
// src/app/api/my-entity/route.ts
import { handler } from '@/server/lib/api-handler';
import { createMyEntity } from '@/server/services/my-entity.service';

export const POST = handler(async ({ req, res, admin }) => {
  const data = createMyEntitySchema.parse(await req.json());
  const entity = await createMyEntity(data, admin);
  return res.json(ok(toPublicMyEntity(entity)));
});
```

### 6. Add Frontend Feature

Create a feature module in `src/features/`:

```
src/features/my-feature/
  ├── api/
  │   └── use-my-entity.ts       # React Query hook
  └── components/
      ├── my-entity-list.tsx     # List component
      └── my-entity-page.tsx     # Page component
```

### 7. Add Tests

Mirror the source structure under `tests/`:

```
tests/
  ├── api/my-entity.test.ts
  └── features/my-feature/
      ├── api/use-my-entity.test.ts
      └── components/my-entity-list.test.tsx
```

### 8. Update Documentation

Add or update relevant documentation in the `docs/` folder.

---

## Adding a New Test

### API Route Test Template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { handler } from '@/server/lib/api-handler';

describe('GET /api/my-entity', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns paginated entities', async () => {
    const req = new NextRequest('http://localhost:3000/api/my-entity?page=1');
    // ... set up mocks
    const response = await handler(/* ... */);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.items).toHaveLength(12);
  });
});
```

### Component Test Template

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyEntityList } from '@/features/my-feature/components/my-entity-list';

describe('MyEntityList', () => {
  it('renders the list of entities', () => {
    render(<MyEntityList entities={mockEntities} />);
    expect(screen.getByText('Entity 1')).toBeInTheDocument();
    expect(screen.getByText('Entity 2')).toBeInTheDocument();
  });
});
```

---

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] Tests pass: `pnpm test`
- [ ] No lint errors: `pnpm lint`
- [ ] TypeScript compiles: `pnpm build`
- [ ] New features have corresponding tests
- [ ] API responses match documented shapes
- [ ] Input validation is present on all new endpoints
- [ ] Error handling covers edge cases
- [ ] Security checks (auth, rate limiting) are in place
- [ ] Documentation is updated
- [ ] Environment variables are added to `.env.example` if needed

---

## Debugging Tips

### Enable Verbose Logging

Add `DEBUG=*` to your `.env` to enable detailed logging:
```
DEBUG=notes-provider:*
```

### Database Connection Issues

```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Restart MongoDB
docker-compose restart

# Reset database volume (WARNING: deletes all data)
docker-compose down && docker volume rm notes-provider_mongodb_data
docker-compose up -d
```

### Clear Next.js Cache

```bash
rm -rf .next
pnpm dev
```

### Clear Vitest Cache

```bash
pnpm test -- --clearCache
```

---

## Project Conventions

### File Organization

- One component per file, named after the component
- One service per file, named after the domain
- One schema per file, named after the entity
- Barrel exports (`index.ts`) for public APIs of each module

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `note-card.tsx`, `order.service.ts` |
| Components | PascalCase | `NoteCard`, `OrderDetail` |
| Functions | camelCase | `createNote()`, `getDashboardStats()` |
| Types | PascalCase | `PublicNote`, `AdminOrder` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_PAGE_LIMIT`, `JWT_SECRET` |
| Database fields | camelCase | `fullName`, `socialHandle` |
| URL slugs | kebab-case | `calculus-notes`, `basic-maths` |

### Error Handling

Always use the centralized `AppError` class:
```typescript
throw AppError.notFound('Note');
throw AppError.validation({ email: 'Invalid email' });
throw AppError.forbidden('Head admin access required');
```

Never return raw errors to the client — they are transformed by the API handler.

### Date Handling

Use `date-fns` for all date operations:
```typescript
import { format, parseISO, differenceInHours } from 'date-fns';

const formatted = format(parseISO(dateString), 'dd MMM yyyy');
const hoursSince = differenceInHours(new Date(), parseISO(dateString));
```

Never use `new Date().toISOString()` for user-facing dates — always format explicitly.
