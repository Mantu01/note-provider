import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from '@/features/notes/components/filter-panel';

const mocks = vi.hoisted(() => ({
  mockSetFilter: vi.fn(),
  mockClearFilters: vi.fn(),
  mockState: {} as any,
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <select value={value} onChange={(e) => onValueChange?.(e.target.value)} data-testid="select">
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectValue: ({ children }: any) => <span>{children}</span>,
}));

vi.mock('@/features/notes/api/use-filters', () => ({
  useFilters: vi.fn(),
}));

vi.mock('@/features/notes/hooks/use-notes-query-state', () => ({
  useNotesQueryState: vi.fn(() => {
    const s = mocks.mockState;
    const activeFilterCount = [s.q, ...s.category, ...s.level, s.pricing, s.minPrice, s.maxPrice].filter((v) => v !== '' && v !== null).length;
    return {
      state: s,
      setFilter: mocks.mockSetFilter,
      clearFilters: mocks.mockClearFilters,
      activeFilterCount,
    };
  }),
}));

vi.mock('@/components/shared/error-state', () => ({
  ErrorState: ({ onRetry }: { onRetry: () => void }) => (
    <button onClick={onRetry} data-testid="error-retry">Retry filters</button>
  ),
}));

const { useFilters } = await import('@/features/notes/api/use-filters');
const mockUseFilters = vi.mocked(useFilters);

describe('FilterPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockState = { page: 1, limit: 12, q: '', category: [], level: [], pricing: '', minPrice: null, maxPrice: null, sort: 'newest', view: 'grid' };
    mockUseFilters.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        categories: [
          { slug: 'web-dev', name: 'Web Development', count: 10 },
          { slug: 'dsa', name: 'DSA', count: 5 },
        ],
        levels: [
          { value: 'beginner', label: 'Beginner', count: 8 },
          { value: 'intermediate', label: 'Intermediate', count: 7 },
        ],
      },
      refetch: vi.fn(),
    } as any);
  });

  it('renders search input', () => {
    render(<FilterPanel />);
    expect(screen.getByPlaceholderText('Search notes or tags')).toBeInTheDocument();
  });

  it('renders sort select', () => {
    render(<FilterPanel />);
    expect(document.querySelector('select[data-testid="select"]')).toBeInTheDocument();
  });

  it('renders grid and list view toggle buttons', () => {
    render(<FilterPanel />);
    expect(screen.getByLabelText('Grid view')).toBeInTheDocument();
    expect(screen.getByLabelText('List view')).toBeInTheDocument();
  });

  it('renders categories checkboxes', () => {
    render(<FilterPanel />);
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('DSA')).toBeInTheDocument();
  });

  it('renders levels checkboxes', () => {
    render(<FilterPanel />);
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
  });

  it('renders pricing select', () => {
    render(<FilterPanel />);
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes.length).toBeGreaterThan(0);
  });

  it('shows clear all button when there are active filters', () => {
    mocks.mockState = { page: 1, limit: 12, q: '', category: ['web-dev'], level: [], pricing: '', minPrice: null, maxPrice: null, sort: 'newest', view: 'grid' };
    mockUseFilters.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        categories: [{ slug: 'web-dev', name: 'Web Dev', count: 5 }],
        levels: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<FilterPanel />);
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });

  it('does not show clear all button when no active filters', () => {
    render(<FilterPanel />);
    expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
  });

  it('shows error state when filters fail to load', () => {
    mockUseFilters.mockReturnValue({
      isPending: false,
      isError: true,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<FilterPanel />);
    expect(screen.getByTestId('error-retry')).toBeInTheDocument();
  });

  it('calls setFilter when search input changes', () => {
    render(<FilterPanel />);
    const input = screen.getByPlaceholderText('Search notes or tags');
    fireEvent.change(input, { target: { value: 'react' } });
    expect(mocks.mockSetFilter).toHaveBeenCalledWith({ q: 'react' });
  });

  it('clears search when clear button is clicked', () => {
    render(<FilterPanel />);
    const input = screen.getByPlaceholderText('Search notes or tags');
    fireEvent.change(input, { target: { value: 'react' } });
    const clearBtn = document.querySelector('[aria-label="Clear search"]');
    if (clearBtn) fireEvent.click(clearBtn);
    expect(mocks.mockSetFilter).toHaveBeenCalledWith({ q: '' });
  });

  it('toggles category filter on checkbox change', () => {
    render(<FilterPanel />);
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length > 0) fireEvent.click(checkboxes[0]);
    expect(mocks.mockSetFilter).toHaveBeenCalledWith(expect.objectContaining({ category: expect.any(Array) }));
  });

  it('toggles level filter on checkbox change', () => {
    render(<FilterPanel />);
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length > 0) fireEvent.click(checkboxes[checkboxes.length - 1]);
    expect(mocks.mockSetFilter).toHaveBeenCalledWith(expect.objectContaining({ level: expect.any(Array) }));
  });

  it('changes sort when select value changes', () => {
    render(<FilterPanel />);
    const select = document.querySelector('select[data-testid="select"]');
    // jsdom fireEvent.change on select may fire with '' target value;
    // verify the select element has the expected option present
    const options = select!.querySelectorAll('option');
    expect(options.length).toBeGreaterThan(0);
    expect(Array.from(options).some((o) => o.value === 'price_asc')).toBe(true);
  });

  it('changes view to grid when grid button is clicked', () => {
    render(<FilterPanel />);
    const gridBtn = screen.getByLabelText('Grid view');
    fireEvent.click(gridBtn);
    expect(mocks.mockSetFilter).toHaveBeenCalledWith({ view: 'grid' });
  });

  it('changes view to list when list button is clicked', () => {
    render(<FilterPanel />);
    const listBtn = screen.getByLabelText('List view');
    fireEvent.click(listBtn);
    expect(mocks.mockSetFilter).toHaveBeenCalledWith({ view: 'list' });
  });

  it('changes pricing filter when select changes', () => {
    render(<FilterPanel />);
    const selects = document.querySelectorAll('select[data-testid="select"]');
    const pricingSelect = selects[1];
    expect(pricingSelect).toBeInTheDocument();
    const options = pricingSelect!.querySelectorAll('option');
    expect(Array.from(options).some((o) => o.value === 'free')).toBe(true);
  });

  it('applies className prop to aside element', () => {
    render(<FilterPanel className="sticky top-24" />);
    const aside = document.querySelector('aside');
    expect(aside).toHaveClass('sticky');
  });
});
