import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsGrid } from "@/features/admin/components/dashboard/stats-grid";

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

describe("StatsGrid", () => {
  const mockStats: any = {
    revenue: { totalLabel: "Rs. 50,000", todayLabel: "Rs. 2,500" },
    orders: { paid: 10, pendingFulfillment: 3 },
    catalog: { totalNotes: 50, paidNotes: 30, freeNotes: 20 },
    leads: { total: 100, today: 5 },
    revenueSeries: [],
    recentOrders: [],
    recentActivities: [],
    topNotes: [],
    categoryBreakdown: [],
  };

  it("renders total revenue stat", () => {
    render(<StatsGrid stats={mockStats} />);
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("Rs. 50,000")).toBeInTheDocument();
    expect(screen.getByText("Today: Rs. 2,500")).toBeInTheDocument();
  });

  it("renders paid orders stat", () => {
    render(<StatsGrid stats={mockStats} />);
    expect(screen.getByText("Paid Orders")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("3 pending fulfillment")).toBeInTheDocument();
  });

  it("renders catalogue notes stat", () => {
    render(<StatsGrid stats={mockStats} />);
    expect(screen.getByText("Catalogue Notes")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("30 paid, 20 free")).toBeInTheDocument();
  });

  it("renders total leads stat", () => {
    render(<StatsGrid stats={mockStats} />);
    expect(screen.getByText("Total Leads")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Today: 5 submissions")).toBeInTheDocument();
  });

  it("renders four stat cards", () => {
    render(<StatsGrid stats={mockStats} />);
    const cards = document.querySelectorAll('[class*="rounded-2xl"]');
    expect(cards.length).toBeGreaterThanOrEqual(4);
  });

  it("handles zero values", () => {
    const emptyStats: any = {
      revenue: { totalLabel: "Rs. 0", todayLabel: "Rs. 0" },
      orders: { paid: 0, pendingFulfillment: 0 },
      catalog: { totalNotes: 0, paidNotes: 0, freeNotes: 0 },
      leads: { total: 0, today: 0 },
      revenueSeries: [],
      recentOrders: [],
      recentActivities: [],
      topNotes: [],
      categoryBreakdown: [],
    };

    render(<StatsGrid stats={emptyStats} />);
    expect(screen.getByText("Rs. 0")).toBeInTheDocument();
    expect(screen.getAllByText(/\b0\b/).length).toBeGreaterThan(0);
  });
});
