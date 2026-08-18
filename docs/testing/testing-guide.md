# Testing Guide

## Overview

The project uses **Vitest** as its test runner with React Testing Library for component tests. There are **199 test files** covering all layers of the application.

## Test Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    environment: 'jsdom',      // Browser-like environment for DOM tests
    globals: true,             // Import vitest globals without prefix
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/app/', 'src/providers/'],
    },
  },
});
```

## Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (re-runs on file changes)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run a specific test file
pnpm test -- tests/api/home-route.test.ts

# Run tests matching a pattern
pnpm test -- --reporter=verbose --grep="dashboard"
```

## Test Structure

Tests mirror the source directory structure one-to-one:

```
tests/
├── api/                      # API route handler tests (~28 files)
├── app/                      # Page and layout tests (~22 files)
│   └── og/                   # OG image generation tests (~4 files)
├── components/               # UI component tests (~28 files)
│   ├── brand/
│   ├── layout/
│   ├── seo/
│   ├── shared/
│   └── ui/
├── features/                 # Feature module tests
│   ├── admin/                # Admin dashboard + CRUD (~25 files)
│   ├── checkout/             # Checkout flow (~3 files)
│   ├── groups/               # Group pages (~4 files)
│   ├── home/                 # Homepage (~2 files)
│   ├── notes/                # Notes browsing (~8 files)
│   └── orders/               # Order tracking (~4 files)
├── hooks/                    # Custom hook tests (~1 file)
├── lib/                      # Utility and schema tests (~10 files)
│   └── schemas/
├── providers/                # Provider context tests (~3 files)
└── server/                   # Server-side tests
    ├── lib/                  # Auth, JWT, mailer, rate limit, etc. (~13 files)
    ├── mappers/              # Data mapper tests (~6 files)
    └── services/             # Business logic service tests (~9 files)
```

## Mocking Patterns

### Pattern 1: Hoisted Mocks (API/Server Tests)

For tests that share mock objects across multiple imports:

```typescript
const mocks = vi.hoisted(() => ({
  mockConnectDb: vi.fn(),
  mockRequireAdmin: vi.fn(),
  mockFail: vi.fn(),
}));

vi.mock('@/server/db/connect', () => ({
  connectDb: mocks.mockConnectDb,
}));

vi.mock('@/server/lib/auth-guard', () => ({
  requireAdmin: mocks.mockRequireAdmin,
}));

vi.mock('@/server/lib/api-response', () => ({
  ok: vi.fn((data) => data),
  fail: mocks.mockFail,
}));
```

### Pattern 2: Module Replacement (Component Tests)

Mock entire component modules for isolation:

```typescript
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/features/notes/api/use-notes', () => ({
  useNotes: vi.fn(() => ({ data: mockNotes, isLoading: false })),
}));
```

### Pattern 3: Next.js Mocks

These are set up globally in `vitest.setup.ts`:

```typescript
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...rest} className={className} />,
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => '/'),
}));

vi.mock('nuqs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('nuqs')>();
  return {
    ...actual,
    useQueryStates: vi.fn(() => [{ page: 1, search: '' }, vi.fn()]),
    useQueryState: vi.fn(() => ['', vi.fn()]),
  };
});
```

### Pattern 4: React Query Wrapper

For component tests that use React Query hooks:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

render(<MyComponent />, { wrapper: createWrapper() });
```

### Pattern 5: Source Module Mocking

Mock specific functions from a source module:

```typescript
import * as OrderNumberLib from '@/server/lib/order-number';
vi.mocked(OrderNumberLib.generateOrderNumber).mockResolvedValue('NP-20240101-0001');
```

## Test Writing Conventions

### API Route Tests

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { handler } from '@/server/lib/api-handler';

describe('GET /api/notes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns paginated notes with filters', async () => {
    const req = new NextRequest('http://localhost:3000/api/notes?page=1&limit=12');
    const response = await handler(async ({ res }) => {
      return res.json({ success: true, data: { items: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 1, hasNext: false, hasPrev: false } } });
    });
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);
  });
});
```

### Component Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NoteCard } from '@/components/shared/note-card';

describe('NoteCard', () => {
  it('renders the note title', () => {
    render(<NoteCard note={mockNote} onPreview={() => {}} onBuy={() => {}} />);
    expect(screen.getByText('Calculus Notes')).toBeInTheDocument();
  });

  it('shows price for paid notes', () => {
    render(<NoteCard note={{ ...mockNote, pricingType: 'paid', price: 19900 }} onPreview={() => {}} onBuy={() => {}} />);
    expect(screen.getByText('₹199')).toBeInTheDocument();
  });

  it('shows free badge for free notes', () => {
    render(<NoteCard note={{ ...mockNote, pricingType: 'free' }} onPreview={() => {}} onBuy={() => {}} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });
});
```

### Service Tests

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createNote } from '@/server/services/note.service';

describe('createNote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a note with valid data', async () => {
    vi.mocked(Note.create).mockResolvedValue(mockNoteDoc as any);
    const result = await createNote(validNoteData, mockAdmin);
    expect(result.title).toBe('Calculus Notes');
    expect(Note.create).toHaveBeenCalledTimes(1);
  });

  it('throws validation error on invalid data', async () => {
    vi.mocked(Note.create).mockRejectedValue(new Error('Validation failed'));
    await expect(createNote(invalidData, mockAdmin)).rejects.toThrow();
  });
});
```

## Coverage Goals

The project targets comprehensive test coverage:

| Layer | Target Coverage | Current Status |
|-------|----------------|----------------|
| API routes | ~90% | All major routes tested |
| Services | ~95% | Core business logic covered |
| Mappers | ~100% | All transformation paths verified |
| Components | ~80% | Key user flows tested |
| Utilities | ~95% | Edge cases covered |
| Schemas | ~90% | Validation rules tested |

Exclude patterns (`vitest.config.ts`):
- `node_modules/` — third-party code
- `src/app/` — Next.js framework code (layouts, route handlers test separately)
- `src/providers/` — provider wrappers (minimal logic)

## Test Data Patterns

### Mock Factories

Create consistent mock objects using factory functions:

```typescript
function createMockNote(overrides: Partial<PublicNote> = {}): PublicNote {
  return {
    id: '507f1f77bcf86cd799439011',
    slug: 'calculus-notes',
    title: 'Calculus Notes',
    description: 'Complete calculus study material',
    level: 'intermediate',
    category: { id: 'cat1', name: 'Maths', slug: 'maths', icon: null },
    pricingType: 'paid',
    price: 19900,
    priceLabel: '₹199',
    compareAtPrice: 29900,
    coverImageUrl: 'https://res.cloudinary.com/.../cover.jpg',
    pageCount: 42,
    fileSizeLabel: '2.1 MB',
    isLocked: true,
    hasPreview: true,
    tags: ['maths', 'calculus'],
    isFeatured: true,
    downloadCount: 150,
    purchaseCount: 32,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T08:00:00Z',
    ...overrides,
  };
}
```

### beforeEach Cleanup

Always clear mocks and reset state between tests:

```typescript
beforeEach(() => {
  vi.clearAllMocks();
  const store = (globalThis as any).__rateLimitStore;
  if (store) store.clear();
});

afterEach(() => {
  cleanup(); // React Testing Library cleanup
});
```

## Common Pitfalls

1. **Async test timing**: Use `await` on all async operations in tests
2. **Mock isolation**: Use `vi.clearAllMocks()` in `beforeEach` to prevent test leakage
3. **Next.js mocks**: Always mock `next/image` and `next/navigation` in component tests
4. **Database mocks**: Mock Mongoose model methods, not the database connection directly
5. **React Query**: Provide a `QueryClientProvider` wrapper for components using hooks
6. **File uploads**: Mock Cloudinary upload functions, don't perform real uploads in tests
7. **Rate limit store**: Clear `globalThis.__rateLimitStore` between tests to prevent cross-test contamination
