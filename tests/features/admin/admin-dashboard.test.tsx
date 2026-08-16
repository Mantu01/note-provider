import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";

vi.mock("@/features/admin/api/use-admin", () => ({
  useDashboard: vi.fn(),
}));

vi.mock("@/features/admin/components/dashboard/stats-grid", () => ({
  StatsGrid: ({ stats }: { stats: any }) => (
    <div data-testid="stats-grid">
      <span>Total Revenue: {stats?.revenue?.totalLabel}</span>
      <span>Paid Orders: {stats?.orders?.paid}</span>
    </div>
  ),
}));

vi.mock("@/features/admin/components/dashboard/revenue-chart", () => ({
  RevenueChart: () => <div data-testid="revenue-chart">Revenue Chart</div>,
}));

vi.mock("@/features/admin/components/dashboard/recent-orders", () => ({
  RecentOrders: ({ orders }: { orders: any[] }) => (
    <div data-testid="recent-orders">
      <span>Orders: {orders?.length}</span>
    </div>
  ),
}));

vi.mock("@/features/admin/components/dashboard/activity-feed", () => ({
  ActivityFeed: ({ activities }: { activities: any[] }) => (
    <div data-testid="activity-feed">
      <span>Activities: {activities?.length}</span>
    </div>
  ),
}));

vi.mock("@/components/shared/error-state", () => ({
  ErrorState: ({ onRetry }: { onRetry: () => void }) => (
    <button onClick={onRetry} data-testid="error-retry">Retry</button>
  ),
}));

const { useDashboard } = await import("@/features/admin/api/use-admin");
const mockUseDashboard = vi.mocked(useDashboard);

describe("AdminDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeleton while fetching", () => {
    mockUseDashboard.mockReturnValue({
      isPending: true,
      isError: false,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<AdminDashboard />);
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders error state when dashboard fails", async () => {
    mockUseDashboard.mockReturnValue({
      isPending: false,
      isError: true,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByTestId("error-retry")).toBeInTheDocument();
    });
  });

  it("renders dashboard with stats grid", async () => {
    mockUseDashboard.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        revenue: { totalLabel: "Rs. 50,000", todayLabel: "Rs. 2,500" },
        orders: { paid: 10, pendingFulfillment: 3 },
        catalog: { totalNotes: 50, paidNotes: 30, freeNotes: 20 },
        leads: { total: 100, today: 5 },
        revenueSeries: [],
        recentOrders: [],
        recentActivities: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByTestId("stats-grid")).toBeInTheDocument();
      expect(screen.getByTestId("revenue-chart")).toBeInTheDocument();
      expect(screen.getByTestId("recent-orders")).toBeInTheDocument();
      expect(screen.getByTestId("activity-feed")).toBeInTheDocument();
    });
  });

  it("renders page title", async () => {
    mockUseDashboard.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        revenue: { totalLabel: "Rs. 50,000" },
        orders: { paid: 10, pendingFulfillment: 0 },
        catalog: { totalNotes: 50, paidNotes: 30, freeNotes: 20 },
        leads: { total: 100, today: 5 },
        revenueSeries: [],
        recentOrders: [],
        recentActivities: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Analytics & Operations")).toBeInTheDocument();
    });
  });

  it("renders create buttons", async () => {
    mockUseDashboard.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        revenue: { totalLabel: "Rs. 0" },
        orders: { paid: 0, pendingFulfillment: 0 },
        catalog: { totalNotes: 0, paidNotes: 0, freeNotes: 0 },
        leads: { total: 0, today: 0 },
        revenueSeries: [],
        recentOrders: [],
        recentActivities: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Create Bundle")).toBeInTheDocument();
      expect(screen.getByText("Create Note")).toBeInTheDocument();
    });
  });

  it("passes revenue series to chart component", async () => {
    const revenueSeries = [
      { date: "2026-08-15", revenuePaise: 500000, orders: 10 },
      { date: "2026-08-14", revenuePaise: 300000, orders: 6 },
    ];
    mockUseDashboard.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        revenue: { totalLabel: "Rs. 50,000" },
        orders: { paid: 10, pendingFulfillment: 0 },
        catalog: { totalNotes: 50, paidNotes: 30, freeNotes: 20 },
        leads: { total: 100, today: 5 },
        revenueSeries,
        recentOrders: [],
        recentActivities: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByTestId("revenue-chart")).toBeInTheDocument();
    });
  });

  it("passes recent orders to component", async () => {
    const orders = [
      { id: "1", orderNumber: "NP-001", buyerFull: { fullName: "John" }, itemTitle: "React Notes" },
    ];
    mockUseDashboard.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        revenue: { totalLabel: "Rs. 0" },
        orders: { paid: 1, pendingFulfillment: 0 },
        catalog: { totalNotes: 1, paidNotes: 1, freeNotes: 0 },
        leads: { total: 1, today: 1 },
        revenueSeries: [],
        recentOrders: orders,
        recentActivities: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByTestId("recent-orders")).toBeInTheDocument();
    });
  });

  it("passes recent activities to component", async () => {
    const activities = [
      { id: "1", description: "Note created", createdAt: "2026-08-15T10:00:00Z", admin: { name: "Admin" } },
    ];
    mockUseDashboard.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        revenue: { totalLabel: "Rs. 0" },
        orders: { paid: 0, pendingFulfillment: 0 },
        catalog: { totalNotes: 0, paidNotes: 0, freeNotes: 0 },
        leads: { total: 0, today: 0 },
        revenueSeries: [],
        recentOrders: [],
        recentActivities: activities,
      },
      refetch: vi.fn(),
    } as any);

    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByTestId("activity-feed")).toBeInTheDocument();
    });
  });
});
