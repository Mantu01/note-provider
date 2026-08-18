import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAdminProfile, useDashboard, useAdminLogin, useAdminLogout } from '@/features/admin/api/use-admin';

vi.mock('@/lib/api-client', () => ({
  apiClient: vi.fn(),
}));

vi.mock('@/lib/query-keys', () => ({
  queryKeys: {
    admin: {
      me: ['admin', 'me'] as const,
      dashboard: ['admin', 'dashboard'] as const,
    },
  },
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

describe('useAdminProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches admin profile from /admin/auth/me', async () => {
    mockApiClient.mockResolvedValue({
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@example.com',
      isHead: true,
    });

    const { result } = renderHook(() => useAdminProfile(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith('/admin/auth/me');
  });

  it('returns profile data on success', async () => {
    const profileData = { id: 'admin-1', name: 'Test Admin', email: 'test@example.com', isHead: false };
    mockApiClient.mockResolvedValue(profileData);

    const { result } = renderHook(() => useAdminProfile(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(profileData);
    });
  });

  it('handles API error', async () => {
    mockApiClient.mockRejectedValue(new Error('Unauthorized'));

    const { result } = renderHook(() => useAdminProfile(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('shows loading state while fetching', async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}) as any);

    const { result } = renderHook(() => useAdminProfile(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it('can refetch profile manually', async () => {
    mockApiClient
      .mockResolvedValueOnce({ id: 'admin-1', name: 'First', email: 'a@e.com', isHead: true })
      .mockResolvedValueOnce({ id: 'admin-1', name: 'Second', email: 'a@e.com', isHead: false });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAdminProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect((result.current.data as any).name).toBe('First');

    const refetchResult = await result.current.refetch();
    expect(mockApiClient).toHaveBeenCalledTimes(2);
    expect((refetchResult.data as any)?.name).toBe('Second');
  });

  it('includes all profile fields in response', async () => {
    const profileData = { id: 'a1', name: 'Jane Doe', email: 'jane@example.com', isHead: false };
    mockApiClient.mockResolvedValue(profileData);

    const { result } = renderHook(() => useAdminProfile(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const data = result.current.data as any;
    expect(data.id).toBe('a1');
    expect(data.name).toBe('Jane Doe');
    expect(data.email).toBe('jane@example.com');
    expect(data.isHead).toBe(false);
  });
});

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches dashboard stats from /admin/dashboard', async () => {
    mockApiClient.mockResolvedValue({
      revenue: { total: 500000, today: 25000 },
      orders: { paid: 10, pendingFulfillment: 3 },
      catalog: { totalNotes: 50, paidNotes: 30, freeNotes: 20 },
      leads: { total: 100, today: 5 },
      revenueSeries: [],
      recentOrders: [],
      recentActivities: [],
    });

    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith('/admin/dashboard');
  });

  it('handles API error', async () => {
    mockApiClient.mockRejectedValue(new Error('Forbidden'));

    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('shows loading state while fetching', async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}) as any);

    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it('can refetch dashboard data', async () => {
    mockApiClient
      .mockResolvedValueOnce({ revenue: { total: 100 }, orders: {}, catalog: {}, leads: {}, revenueSeries: [], recentOrders: [], recentActivities: [] })
      .mockResolvedValueOnce({ revenue: { total: 200 }, orders: {}, catalog: {}, leads: {}, revenueSeries: [], recentOrders: [], recentActivities: [] });

    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await result.current.refetch();
    expect(mockApiClient).toHaveBeenCalledTimes(2);
  });

  it('returns complete dashboard stats object', async () => {
    const dashData = {
      revenue: { total: 750000, today: 32000 },
      orders: { paid: 25, pendingFulfillment: 8 },
      catalog: { totalNotes: 80, paidNotes: 50, freeNotes: 30 },
      leads: { total: 200, today: 12 },
      revenueSeries: [{ date: '2026-08-01', amount: 10000 }],
      recentOrders: [{ orderId: 'ord-1', status: 'paid' }],
      recentActivities: [{ action: 'note.create' }],
    };
    mockApiClient.mockResolvedValue(dashData);

    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(dashData);
  });
});

describe('useAdminLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs in with email and password', async () => {
    mockApiClient.mockResolvedValue({
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@example.com',
      isHead: true,
    });

    const { result } = renderHook(() => useAdminLogin(), { wrapper: createWrapper() });

    result.current.mutate({ email: 'admin@example.com', password: 'secret123' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      '/admin/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'admin@example.com', password: 'secret123' }),
      }),
    );
  });

  it('handles wrong credentials returning 401', async () => {
    const error = new Error('Unauthorized') as any;
    error.status = 401;
    mockApiClient.mockRejectedValue(error);

    const { result } = renderHook(() => useAdminLogin(), { wrapper: createWrapper() });

    result.current.mutate({ email: 'admin@example.com', password: 'wrong-password' });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(error);
  });

  it('handles network error during login', async () => {
    mockApiClient.mockRejectedValue(new Error('Network connection failed'));

    const { result } = renderHook(() => useAdminLogin(), { wrapper: createWrapper() });

    result.current.mutate({ email: 'admin@example.com', password: 'secret123' });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network connection failed');
  });

  it('has isPending state during login', async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}) as any);

    const { result } = renderHook(() => useAdminLogin(), { wrapper: createWrapper() });

    result.current.mutate({ email: 'test@example.com', password: 'test' });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it('isIdle before mutation is triggered', async () => {
    const { result } = renderHook(() => useAdminLogin(), { wrapper: createWrapper() });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it('sends login request body with exact format', async () => {
    mockApiClient.mockResolvedValue({ id: 'admin-1', name: 'Admin', email: 'a@e.com', isHead: false });

    const { result } = renderHook(() => useAdminLogin(), { wrapper: createWrapper() });

    result.current.mutate({ email: 'login@example.com', password: 'pass123' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      '/admin/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'login@example.com', password: 'pass123' }),
      }),
    );
  });

  it('mutateAsync throws on API failure', async () => {
    mockApiClient.mockRejectedValue(new Error('Connection refused'));

    const { result } = renderHook(() => useAdminLogin(), { wrapper: createWrapper() });

    await expect(
      result.current.mutateAsync({ email: 'a@e.com', password: 'pw' })
    ).rejects.toThrow('Connection refused');
  });
});

describe('useAdminLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs out via POST to /admin/auth/logout', async () => {
    mockApiClient.mockResolvedValue({});

    const { result } = renderHook(() => useAdminLogout(), { wrapper: createWrapper() });

    result.current.mutate(undefined);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      '/admin/auth/logout',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('handles logout failure', async () => {
    mockApiClient.mockRejectedValue(new Error('Session not found'));

    const { result } = renderHook(() => useAdminLogout(), { wrapper: createWrapper() });

    result.current.mutate(undefined);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('has isPending state during logout', async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}) as any);

    const { result } = renderHook(() => useAdminLogout(), { wrapper: createWrapper() });

    result.current.mutate(undefined);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it('isIdle before mutation is triggered', async () => {
    const { result } = renderHook(() => useAdminLogout(), { wrapper: createWrapper() });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isPending).toBe(false);
  });

  it('can be mutated multiple times independently', async () => {
    mockApiClient.mockResolvedValue({});

    const { result } = renderHook(() => useAdminLogout(), { wrapper: createWrapper() });

    result.current.mutate(undefined);
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    mockApiClient.mockResolvedValue({});
    result.current.mutate(undefined);
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledTimes(2);
  });

  it('mutateAsync throws on API failure', async () => {
    mockApiClient.mockRejectedValue(new Error('No active session'));

    const { result } = renderHook(() => useAdminLogout(), { wrapper: createWrapper() });

    await expect(result.current.mutateAsync()).rejects.toThrow('No active session');
  });
});
