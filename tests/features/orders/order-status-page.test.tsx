import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { OrderStatusPage } from '@/features/orders/components/order-status-page';

vi.mock('@/features/orders/api/use-order', () => ({
  useOrder: vi.fn(),
}));

vi.mock('@/components/shared/error-state', () => ({
  ErrorState: ({ onRetry }: { onRetry: () => void }) => (
    <button onClick={onRetry} data-testid="error-retry">Retry</button>
  ),
}));

vi.mock('@/components/shared/status-badge', () => ({
  StatusBadge: ({ value }: { value?: string }) => (
    <span data-testid={`status-${value}`}>{value || ''}</span>
  ),
}));

vi.mock('@/components/shared/copy-button', () => ({
  CopyButton: ({ value }: { value: string }) => (
    <button data-testid={`copy-${value}`}>Copy {value}</button>
  ),
}));

const { useOrder } = await import('@/features/orders/api/use-order');
const mockUseOrder = vi.mocked(useOrder);

describe('OrderStatusPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading spinner while fetching', () => {
    mockUseOrder.mockReturnValue({
      isPending: true,
      isError: false,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<OrderStatusPage orderId="ord-123" />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders error state when order not found', async () => {
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: true,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<OrderStatusPage orderId="invalid" />);
    await waitFor(() => {
      expect(screen.getByTestId('error-retry')).toBeInTheDocument();
    });
  });

  it('shows payment confirming state when status is created', async () => {
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        orderId: 'ord-123',
        orderNumber: 'NP-001',
        paymentStatus: 'created',
        fulfillmentStatus: 'pending',
        itemSlug: 'react-notes',
        itemType: 'note',
        itemTitle: 'React Notes',
        amountLabel: 'Rs. 499',
        createdAt: '2026-08-15T10:00:00Z',
        buyer: { socialHandleMasked: '***@gmail.com' },
      },
      refetch: vi.fn(),
    } as any);

    render(<OrderStatusPage orderId="ord-123" />);
    expect(screen.getByText(/confirming your payment/i)).toBeInTheDocument();
    expect(screen.getByText(/this usually takes a few seconds/i)).toBeInTheDocument();
  });

  it('shows payment failed state', async () => {
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        orderId: 'ord-123',
        orderNumber: 'NP-001',
        paymentStatus: 'failed',
        fulfillmentStatus: 'pending',
        itemSlug: 'react-notes',
        itemType: 'note',
        itemTitle: 'React Notes',
        amountLabel: 'Rs. 499',
        createdAt: '2026-08-15T10:00:00Z',
        buyer: { socialHandleMasked: '***@gmail.com' },
      },
      refetch: vi.fn(),
    } as any);

    render(<OrderStatusPage orderId="ord-123" />);
    await waitFor(() => {
      expect(screen.getByText('Payment failed')).toBeInTheDocument();
      expect(screen.getByText('Try again')).toBeInTheDocument();
    });
  });

  it('shows completed order details', async () => {
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        orderId: 'ord-123',
        orderNumber: 'NP-20260815-0001',
        paymentStatus: 'paid',
        fulfillmentStatus: 'completed',
        itemSlug: 'react-notes',
        itemType: 'note',
        itemTitle: 'React Notes',
        amountLabel: 'Rs. 499',
        createdAt: '2026-08-15T10:00:00Z',
        buyer: { socialHandleMasked: '***@gmail.com' },
      },
      refetch: vi.fn(),
    } as any);

    render(<OrderStatusPage orderId="ord-123" />);
    await waitFor(() => {
      expect(screen.getByText(/payment successful/i)).toBeInTheDocument();
      expect(screen.getByText(/notes delivered/i)).toBeInTheDocument();
      const orderNumbers = screen.getAllByText(/NP-20260815-0001/);
      expect(orderNumbers[0]).toBeInTheDocument();
    });
  });

  it('shows pending fulfillment state', async () => {
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        orderId: 'ord-123',
        orderNumber: 'NP-001',
        paymentStatus: 'paid',
        fulfillmentStatus: 'pending',
        itemSlug: 'bundle-1',
        itemType: 'group',
        itemTitle: 'Full Stack Bundle',
        amountLabel: 'Rs. 999',
        createdAt: '2026-08-15T10:00:00Z',
        buyer: { socialHandleMasked: '***@whatsapp' },
      },
      refetch: vi.fn(),
    } as any);

    render(<OrderStatusPage orderId="ord-123" />);
    await waitFor(() => {
      expect(screen.getByText('Order status: Pending Approval')).toBeInTheDocument();
    });
  });

  it('renders order details card', async () => {
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        orderId: 'ord-123',
        orderNumber: 'NP-001',
        paymentStatus: 'paid',
        fulfillmentStatus: 'pending',
        itemSlug: 'note-1',
        itemType: 'note',
        itemTitle: 'React Notes',
        amountLabel: 'Rs. 499',
        createdAt: '2026-08-15T10:00:00Z',
        buyer: { socialHandleMasked: '***@gmail.com' },
      },
      refetch: vi.fn(),
    } as any);

    render(<OrderStatusPage orderId="ord-123" />);
    await waitFor(() => {
      expect(screen.getByText('Order details')).toBeInTheDocument();
      expect(screen.getByText('Item')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
    });
  });

  it('renders delivery timeline', async () => {
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        orderId: 'ord-123',
        orderNumber: 'NP-001',
        paymentStatus: 'paid',
        fulfillmentStatus: 'completed',
        itemSlug: 'note-1',
        itemType: 'note',
        itemTitle: 'React Notes',
        amountLabel: 'Rs. 499',
        createdAt: '2026-08-15T10:00:00Z',
        buyer: { socialHandleMasked: '***@gmail.com' },
      },
      refetch: vi.fn(),
    } as any);

    render(<OrderStatusPage orderId="ord-123" />);
    await waitFor(() => {
      expect(screen.getByText('Delivery timeline')).toBeInTheDocument();
      const paymentItems = screen.getAllByText(/Payment received/);
      expect(paymentItems[1]).toBeInTheDocument();
      expect(screen.getByText(/Admin review & approval/)).toBeInTheDocument();
      expect(screen.getByText(/Delivered to handle/)).toBeInTheDocument();
    });
  });

  it('shows refresh button', async () => {
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        orderId: 'ord-123',
        orderNumber: 'NP-001',
        paymentStatus: 'paid',
        fulfillmentStatus: 'pending',
        itemSlug: 'note-1',
        itemType: 'note',
        itemTitle: 'React Notes',
        amountLabel: 'Rs. 499',
        createdAt: '2026-08-15T10:00:00Z',
        buyer: { socialHandleMasked: '***@gmail.com' },
      },
      refetch: vi.fn(),
    } as any);

    render(<OrderStatusPage orderId="ord-123" />);
    await waitFor(() => {
      expect(screen.getByText('Refresh status')).toBeInTheDocument();
    });
  });

  it('calls refetch on refresh button click', async () => {
    const mockRefetch = vi.fn();
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        orderId: 'ord-123',
        orderNumber: 'NP-001',
        paymentStatus: 'paid',
        fulfillmentStatus: 'pending',
        itemSlug: 'note-1',
        itemType: 'note',
        itemTitle: 'React Notes',
        amountLabel: 'Rs. 499',
        createdAt: '2026-08-15T10:00:00Z',
        buyer: { socialHandleMasked: '***@gmail.com' },
      },
      refetch: mockRefetch,
    } as any);

    render(<OrderStatusPage orderId="ord-123" />);
    await waitFor(() => {
      expect(screen.getByText('Refresh status')).toBeInTheDocument();
    });
    const buttons = screen.getAllByRole('button');
    const refreshBtn = buttons.find(b => b.textContent?.includes('Refresh status'));
    if (refreshBtn) refreshBtn.click();
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('renders track another order button', async () => {
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        orderId: 'ord-123',
        orderNumber: 'NP-001',
        paymentStatus: 'paid',
        fulfillmentStatus: 'pending',
        itemSlug: 'note-1',
        itemType: 'note',
        itemTitle: 'React Notes',
        amountLabel: 'Rs. 499',
        createdAt: '2026-08-15T10:00:00Z',
        buyer: { socialHandleMasked: '***@gmail.com' },
      },
      refetch: vi.fn(),
    } as any);

    render(<OrderStatusPage orderId="ord-123" />);
    await waitFor(() => {
      expect(screen.getByText('Track another order')).toBeInTheDocument();
    });
  });
});
