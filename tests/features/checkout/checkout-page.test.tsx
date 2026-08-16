import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CheckoutPage } from '@/features/checkout/components/checkout-page';

vi.mock('@/features/notes/api/use-note', () => ({
  useNote: vi.fn(),
}));

vi.mock('@/features/groups/api/use-group', () => ({
  useGroup: vi.fn(),
}));

vi.mock('@/features/checkout/api/use-create-order', () => ({
  useCreateOrder: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    error: null,
  })),
}));

vi.mock('react-razorpay', () => ({
  useRazorpay: vi.fn(() => ({ Razorpay: vi.fn(), isLoading: false })),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

vi.mock('@/hooks/use-download-file', () => ({
  useDownloadFile: vi.fn(() => ({ download: vi.fn(), isDownloading: false })),
}));

vi.mock('@/components/shared/error-state', () => ({
  ErrorState: ({ message, onRetry }: { message?: string; onRetry: () => void }) => (
    <div data-testid="error-state">
      <p>{message || "Error"}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

vi.mock('@/components/shared/price-tag', () => ({
  PriceTag: ({ priceLabel }: { priceLabel?: string }) => (
    <span data-testid="price-tag">{priceLabel || "Free"}</span>
  ),
}));

const { useNote } = await import('@/features/notes/api/use-note');
const mockUseNote = vi.mocked(useNote);

const { useGroup } = await import('@/features/groups/api/use-group');
const mockUseGroup = vi.mocked(useGroup);

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton while fetching item', () => {
    mockUseNote.mockReturnValue({
      isPending: true,
      isError: false,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="react-notes" itemType="note" />);
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders error state when item not found', async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: true,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="not-found" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });

  it('shows free note guard for free notes', async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: { id: '1', title: 'Free Note', slug: 'free-note', pricingType: 'free' as const },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="free-note" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByText('This note is free')).toBeInTheDocument();
      expect(screen.getByText('Go to note')).toBeInTheDocument();
    });
  });

  it('renders checkout form for paid notes', async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: '1', title: 'React Notes', slug: 'react-notes', pricingType: 'paid' as const,
          price: 49900, priceLabel: 'Rs. 499', compareAtPrice: 99900,
          coverImageUrl: null, category: { name: 'Web Development' },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="react-notes" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByText('Where should we deliver your notes?')).toBeInTheDocument();
      expect(screen.getByLabelText(/Full name/i)).toBeInTheDocument();
      expect(screen.getByText(/Delivery channel/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Instagram handle/i)).toBeInTheDocument();
    });
  });

  it('renders checkout form for groups', async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: '1', name: 'React Bundle', slug: 'react-bundle', price: 99900,
          priceLabel: 'Rs. 999', compareAtPrice: 199900,
          coverImageUrl: null, category: { name: 'Web Development' },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="react-bundle" itemType="group" />);
    await waitFor(() => {
      expect(screen.getByText('Where should we deliver your notes?')).toBeInTheDocument();
    });
  });

  it('shows delivery channel options', async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: '1', title: 'Note', slug: 'note', pricingType: 'paid' as const,
          price: 49900, priceLabel: 'Rs. 499', compareAtPrice: null,
          coverImageUrl: null, category: { name: 'Web Dev' },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="note" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByText(/Delivery channel/i)).toBeInTheDocument();
      const comboboxes = screen.getAllByRole('combobox');
      expect(comboboxes.length).toBeGreaterThan(0);
    });
  });

  it('renders consent checkbox', async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: '1', title: 'Note', slug: 'note', pricingType: 'paid' as const,
          price: 49900, priceLabel: 'Rs. 499', compareAtPrice: null,
          coverImageUrl: null, category: { name: 'Web Dev' },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="note" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByText(/I agree to the/i)).toBeInTheDocument();
    });
  });

  it('shows back link to item page', async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: '1', title: 'Note', slug: 'note', pricingType: 'paid' as const,
          price: 49900, priceLabel: 'Rs. 499', compareAtPrice: null,
          coverImageUrl: null, category: { name: 'Web Dev' },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="note" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByText('Back to item')).toBeInTheDocument();
    });
  });

  it('shows order summary with item details', async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: '1', title: 'React Notes', slug: 'react-notes', pricingType: 'paid' as const,
          price: 49900, priceLabel: 'Rs. 499', compareAtPrice: 99900,
          coverImageUrl: 'https://example.com/cover.jpg', category: { name: 'Web Development' },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="react-notes" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByText('Order summary')).toBeInTheDocument();
      expect(screen.getByText('React Notes')).toBeInTheDocument();
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });
  });

  it('uses note data for note item type', async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: '1', title: 'Test Note', slug: 'test-note', pricingType: 'paid' as const,
          price: 29900, priceLabel: 'Rs. 299', compareAtPrice: null,
          coverImageUrl: null, category: { name: 'Backend' },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="test-note" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByText('Test Note')).toBeInTheDocument();
    });
  });

  it('uses group data for group item type', async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: '1', name: 'Test Bundle', slug: 'test-bundle', price: 79900,
          priceLabel: 'Rs. 799', compareAtPrice: null,
          coverImageUrl: null, category: { name: 'Full Stack' },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="test-bundle" itemType="group" />);
    await waitFor(() => {
      expect(screen.getByText('Test Bundle')).toBeInTheDocument();
    });
  });
});
