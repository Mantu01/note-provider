import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useAdminNotes,
  useAdminNote,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from '@/features/admin/api/use-admin-notes';

vi.mock('@/lib/api-client', () => ({
  apiClient: vi.fn(),
  buildQueryString: vi.fn((params: Record<string, unknown>) => {
    const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
    return entries.length ? '?' + entries.map(([k, v]) => `${k}=${v}`).join('&') : '';
  }),
}));

vi.mock('@/lib/query-keys', () => ({
  queryKeys: {
    admin: {
      notes: {
        all: ['admin', 'notes'] as const,
        list: vi.fn((params: unknown) => ['admin', 'notes', 'list', params]),
        detail: vi.fn((id: string) => ['admin', 'notes', 'detail', id]),
      },
      dashboard: ['admin', 'dashboard'] as const,
    },
    notes: { all: ['notes'] as const },
  },
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const { apiClient } = await import('@/lib/api-client');
const mockApiClient = vi.mocked(apiClient);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useAdminNotes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches admin notes with default params', async () => {
    mockApiClient.mockResolvedValue({
      items: [],
      pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
    });

    const { result } = renderHook(() => useAdminNotes(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith('/admin/notes');
  });

  it('appends query params to URL', async () => {
    mockApiClient.mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0 } });

    renderHook(() => useAdminNotes({ page: 2, limit: 10, q: 'react' }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith('/admin/notes?page=2&limit=10&q=react');
    });
  });

  it('handles API error', async () => {
    mockApiClient.mockRejectedValue(new Error('Forbidden'));

    const { result } = renderHook(() => useAdminNotes(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe('useAdminNote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches single admin note by ID', async () => {
    mockApiClient.mockResolvedValue({
      id: 'note-1',
      title: 'React Notes',
      slug: 'react-notes',
    });

    const { result } = renderHook(() => useAdminNote('note-1'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith('/admin/notes/note-1');
  });

  it('does not fetch when id is empty', () => {
    renderHook(() => useAdminNote(''), { wrapper: createWrapper() });
    expect(mockApiClient).not.toHaveBeenCalled();
  });

  it('handles API error', async () => {
    mockApiClient.mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => useAdminNote('nonexistent'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe('useCreateNote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a new note via POST', async () => {
    mockApiClient.mockResolvedValue({
      id: 'note-new',
      title: 'New Note',
      slug: 'new-note',
    });

    const { result } = renderHook(() => useCreateNote(), { wrapper: createWrapper() });

    result.current.mutate({
      title: 'New Note',
      description: 'A new note',
      categoryId: 'cat-1',
      level: 'basics',
      pricingType: 'free',
      visibility: 'public',
      tags: [],
    } as any);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      '/admin/notes',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('New Note'),
      }),
    );
  });

  it('handles creation error', async () => {
    mockApiClient.mockRejectedValue(new Error('Validation failed'));

    const { result } = renderHook(() => useCreateNote(), { wrapper: createWrapper() });

    result.current.mutate({
      title: 'New Note',
      description: 'Desc',
      categoryId: 'cat-1',
      level: 'basics',
      pricingType: 'free',
      visibility: 'public',
      tags: [],
    } as any);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe('useUpdateNote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates a note via PATCH', async () => {
    mockApiClient.mockResolvedValue({
      id: 'note-1',
      title: 'Updated Note',
      slug: 'updated-note',
    });

    const { result } = renderHook(() => useUpdateNote('note-1'), { wrapper: createWrapper() });

    result.current.mutate({
      title: 'Updated Note',
      description: 'Updated description',
      categoryId: 'cat-1',
      level: 'intermediate',
      pricingType: 'paid',
      visibility: 'public',
      tags: ['updated'],
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      '/admin/notes/note-1',
      expect.objectContaining({
        method: 'PATCH',
      }),
    );
  });

  it('handles update error', async () => {
    mockApiClient.mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useUpdateNote('note-1'), { wrapper: createWrapper() });

    result.current.mutate({
      title: 'Updated Note',
      description: 'Desc',
      categoryId: 'cat-1',
      level: 'basics',
      pricingType: 'free',
      visibility: 'public',
      tags: [],
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe('useDeleteNote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes a note via DELETE', async () => {
    mockApiClient.mockResolvedValue({ deleted: true });

    const { result } = renderHook(() => useDeleteNote(), { wrapper: createWrapper() });

    result.current.mutate('note-1');

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockApiClient).toHaveBeenCalledWith(
      '/admin/notes/note-1',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('handles delete error', async () => {
    mockApiClient.mockRejectedValue(new Error('Delete failed'));

    const { result } = renderHook(() => useDeleteNote(), { wrapper: createWrapper() });

    result.current.mutate('note-1');

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
