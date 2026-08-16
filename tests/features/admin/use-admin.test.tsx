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

  it('handles login failure', async () => {
    mockApiClient.mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAdminLogin(), { wrapper: createWrapper() });

    result.current.mutate({ email: 'wrong@example.com', password: 'wrong' });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('has isPending state during login', async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}) as any);

    const { result } = renderHook(() => useAdminLogin(), { wrapper: createWrapper() });

    result.current.mutate({ email: 'test@example.com', password: 'test' });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
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
});
