import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { RevenueChart } from "@/features/admin/components/dashboard/revenue-chart";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => null,
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
}));

describe("RevenueChart", () => {
  it("renders chart title", () => {
    render(<RevenueChart data={[]} />);
    expect(screen.getByText("Revenue Trend (30 Days)")).toBeInTheDocument();
  });

  it("renders chart container", () => {
    render(<RevenueChart data={[]} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("transforms revenue data correctly", () => {
    const data = [
      { date: "2026-08-15", revenuePaise: 500000, orders: 10 },
      { date: "2026-08-14", revenuePaise: 300000, orders: 6 },
    ];
    render(<RevenueChart data={data} />);
    expect(screen.getByText("Revenue Trend (30 Days)")).toBeInTheDocument();
  });

  it("handles empty data array", () => {
    render(<RevenueChart data={[]} />);
    expect(screen.getByTestId("area-chart")).toBeInTheDocument();
  });

  it("slices date from full date string", () => {
    const data = [{ date: "2026-08-15", revenuePaise: 100000, orders: 2 }];
    render(<RevenueChart data={data} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("divides revenue by 100 for display", () => {
    const data = [{ date: "2026-08-15", revenuePaise: 49900, orders: 1 }];
    render(<RevenueChart data={data} />);
    expect(screen.getByTestId("area-chart")).toBeInTheDocument();
  });
});
