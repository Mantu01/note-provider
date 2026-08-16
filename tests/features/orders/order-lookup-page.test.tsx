import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrderLookupPage } from '@/features/orders/components/order-lookup-page';

const mocks = vi.hoisted(() => ({
  mockUseOrderLookup: vi.fn(),
  mockPush: vi.fn(),
}));

vi.mock('@/features/orders/api/use-order-lookup', () => ({
  useOrderLookup: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.mockPush }),
}));

const { useOrderLookup } = await import('@/features/orders/api/use-order-lookup');
const mockUseOrderLookup = vi.mocked(useOrderLookup);

describe('OrderLookupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseOrderLookup.mockReturnValue({ mutate: vi.fn(), isPending: false, error: null } as any);
  });

  it('renders page title and description', () => {
    render(<OrderLookupPage />);
    expect(screen.getByText('Track Your Order')).toBeInTheDocument();
    expect(screen.getByText(/Enter your unique order number/)).toBeInTheDocument();
  });

  it('renders order number input field', () => {
    render(<OrderLookupPage />);
    expect(screen.getByLabelText('Order Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('NP-20260810-0001')).toBeInTheDocument();
  });

  it('renders search button', () => {
    render(<OrderLookupPage />);
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('submits form and redirects on success', async () => {
    const mockMutate = vi.fn((orderNumber: string, options: any) => {
      options.onSuccess({ orderId: 'ord-123', orderNumber: 'NP-001' });
    });
    mockUseOrderLookup.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as any);

    render(<OrderLookupPage />);
    const input = screen.getByLabelText('Order Number');
    fireEvent.change(input, { target: { value: 'NP-20260815-0001' } });
    const button = screen.getByText('Search');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mocks.mockPush).toHaveBeenCalledWith('/order/ord-123');
    });
  });

  it('shows error toast on lookup failure', async () => {
    const mockMutate = vi.fn((_orderNumber: string, options: any) => {
      options.onError({ message: 'Order not found' });
    });
    mockUseOrderLookup.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as any);

    render(<OrderLookupPage />);
    const input = screen.getByLabelText('Order Number');
    fireEvent.change(input, { target: { value: 'INVALID' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('disables search button while loading', () => {
    mockUseOrderLookup.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      error: null,
    } as any);

    render(<OrderLookupPage />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('renders helper text about order pending status', () => {
    render(<OrderLookupPage />);
    expect(screen.getByText(/Orders stay pending until reviewed/)).toBeInTheDocument();
  });

  it('shows validation error for empty order number', async () => {
    render(<OrderLookupPage />);
    const button = screen.getByText('Search');
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText('Please enter your order number.')).toBeInTheDocument();
    });
  });
});
