import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotesCatalogue } from '@/features/notes/components/notes-catalogue';

vi.mock('@/features/notes/api/use-notes', () => ({
  useNotes: vi.fn(),
}));

vi.mock('@/features/notes/hooks/use-notes-query-state', () => ({
  useNotesQueryState: vi.fn(() => ({
    state: {
      page: 1,
      limit: 12,
      q: '',
      category: [],
      level: [],
      pricing: '',
      minPrice: null,
      maxPrice: null,
      sort: 'newest',
      view: 'grid',
    },
    setFilter: vi.fn(),
    clearFilters: vi.fn(),
    activeFilterCount: 0,
  })),
}));

vi.mock('@/components/shared/note-card', () => ({
  NoteCard: ({ note }: { note: { id: string; title: string } }) => (
    <div data-testid={`note-card-${note.id}`}>{note.title}</div>
  ),
}));

vi.mock('@/components/shared/note-card-skeleton', () => ({
  NoteCardSkeleton: () => <div data-testid='note-skeleton' />,
}));

vi.mock('@/components/shared/empty-state', () => ({
  EmptyState: ({ title, description, action }: any) => (
    <div data-testid='empty-state'>
      <span>{title}</span>
      <p>{description}</p>
      {action}
    </div>
  ),
}));

vi.mock('@/components/shared/error-state', () => ({
  ErrorState: ({ onRetry }: { onRetry: () => void }) => (
    <button onClick={onRetry} data-testid='error-retry'>Retry</button>
  ),
}));

vi.mock('@/components/shared/pagination-bar', () => ({
  PaginationBar: ({ totalPages, onPageChange }: any) => (
    <div data-testid='pagination'>
      <span>Total: {totalPages}</span>
      <button onClick={() => onPageChange(2)}>Next Page</button>
    </div>
  ),
}));

const { useNotes } = await import('@/features/notes/api/use-notes');
const mockUseNotes = vi.mocked(useNotes);

const { useNotesQueryState } = await import('@/features/notes/hooks/use-notes-query-state');
const mockUseNotesQueryState = vi.mocked(useNotesQueryState);

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function renderWithProvider(ui: React.ReactElement) {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('NotesCatalogue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('renders loading skeletons while fetching notes', () => {
    mockUseNotes.mockReturnValue({
      isPending: true,
      isError: false,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    renderWithProvider(<NotesCatalogue />);
    const skeletons = document.querySelectorAll('[data-testid="note-skeleton"]');
    expect(skeletons.length).toBe(12);
  });

  it('renders notes when data is available', async () => {
    mockUseNotes.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        items: [
          { id: '1', slug: 'note-1', title: 'React Notes', price: 0 },
          { id: '2', slug: 'note-2', title: 'Node Notes', price: 499 },
        ],
        pagination: { total: 2, page: 1, limit: 12, totalPages: 1 },
      },
      refetch: vi.fn(),
    } as any);

    renderWithProvider(<NotesCatalogue />);
    await waitFor(() => {
      expect(screen.getByTestId('note-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('note-card-2')).toBeInTheDocument();
    });
  });

  it('shows no results message when notes array is empty', async () => {
    mockUseNotes.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        items: [],
        pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
      },
      refetch: vi.fn(),
    } as any);

    renderWithProvider(<NotesCatalogue />);
    await waitFor(() => {
      expect(screen.getByText('No notes match these filters')).toBeInTheDocument();
    });
  });

  it('renders error state when notes query fails', async () => {
    mockUseNotes.mockReturnValue({
      isPending: false,
      isError: true,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    renderWithProvider(<NotesCatalogue />);
    await waitFor(() => {
      expect(screen.getByTestId('error-retry')).toBeInTheDocument();
    });
  });

  it('renders pagination when data is available', async () => {
    mockUseNotes.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        items: [],
        pagination: { total: 50, page: 1, limit: 12, totalPages: 5 },
      },
      refetch: vi.fn(),
    } as any);

    renderWithProvider(<NotesCatalogue />);
    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });
  });

  it('shows showing count when data is available', async () => {
    mockUseNotes.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        items: [{ id: '1', slug: 'note-1', title: 'Note 1' }],
        pagination: { total: 10, page: 1, limit: 12, totalPages: 1 },
      },
      refetch: vi.fn(),
    } as any);

    renderWithProvider(<NotesCatalogue />);
    await waitFor(() => {
      expect(screen.getByText(/Showing 1 of 10 notes/)).toBeInTheDocument();
    });
  });

  it('shows loading text when data is not yet available', () => {
    mockUseNotes.mockReturnValue({
      isPending: true,
      isError: false,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    renderWithProvider(<NotesCatalogue />);
    expect(screen.getByText(/Loading notes/)).toBeInTheDocument();
  });

  it('respects list view from query state', () => {
    mockUseNotesQueryState.mockReturnValue({
      state: {
        page: 1,
        limit: 12,
        q: '',
        category: [],
        level: [],
        pricing: '',
        minPrice: null,
        maxPrice: null,
        sort: 'newest',
        view: 'list',
      },
      setFilter: vi.fn(),
      clearFilters: vi.fn(),
      activeFilterCount: 0,
    } as any);

    mockUseNotes.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        items: [],
        pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
      },
      refetch: vi.fn(),
    } as any);

    renderWithProvider(<NotesCatalogue />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('passes query params to useNotes hook', () => {
    mockUseNotes.mockReturnValue({
      isPending: false,
      isError: false,
      data: { items: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0 } },
      refetch: vi.fn(),
    } as any);

    renderWithProvider(<NotesCatalogue />);
    expect(mockUseNotes).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 12, sort: 'newest' }),
    );
  });
});
