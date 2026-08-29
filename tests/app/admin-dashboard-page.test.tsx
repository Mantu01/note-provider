import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import AdminPage from "@/app/admin/(dashboard)/page";

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return {
    ...actual,
    useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
    useSearchParams: vi.fn(() => new URLSearchParams()),
    usePathname: vi.fn(() => "/admin"),
  };
});

vi.mock("@/providers/app-providers", () => ({
  QueryProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
}));

vi.mock("@/features/admin/api/use-admin-auth", () => ({
  useAdminProfile: vi.fn(() => ({ data: { id: "a1", name: "Admin", email: "a@b.com", isHead: false }, isLoading: false, error: null })),
}));

vi.mock("@/features/admin/api/use-admin-dashboard", () => ({
  useDashboard: vi.fn(() => ({
    data: {
      revenue: { totalLabel: "₹1,00,000", todayLabel: "₹5,000", last30DaysLabel: "₹80,000" },
      orders: { total: 10, paid: 8, failed: 1, pendingFulfillment: 2, completed: 6, today: 3 },
      catalog: { totalNotes: 50, freeNotes: 15, paidNotes: 35, totalGroups: 5, totalCategories: 3 },
      leads: { total: 20, today: 2 },
      revenueSeries: [],
      topNotes: [],
      categoryBreakdown: [],
      recentOrders: [],
      recentActivities: [],
    },
    isLoading: false,
    error: null,
  })),
}));

describe("AdminDashboard page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<AdminPage />);
    expect(container).toBeDefined();
  });

  it("renders the admin dashboard component", () => {
    const { container } = render(<AdminPage />);
    expect(container.innerHTML).toContain("admin");
  });
});
