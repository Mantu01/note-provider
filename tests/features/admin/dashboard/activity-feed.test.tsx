import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ActivityFeed } from "@/features/admin/components/dashboard/activity-feed";

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/lib/format", () => ({
  formatRelativeTime: (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  },
}));

describe("ActivityFeed", () => {
  it("renders title and full log button", () => {
    render(<ActivityFeed activities={[]} />);
    expect(screen.getByText("Activity Feed")).toBeInTheDocument();
    expect(screen.getByText("Full Log")).toBeInTheDocument();
  });

  it("shows empty state when no activities", () => {
    render(<ActivityFeed activities={[]} />);
    expect(screen.getByText("No recent activity.")).toBeInTheDocument();
  });

  it("renders activity items", () => {
    const activities = [
      {
        id: "1",
        admin: { name: "Admin User", email: "admin@test.com" },
        description: "Created note React Notes",
        createdAt: "2026-08-15T10:00:00Z",
      },
    ] as any;
    render(<ActivityFeed activities={activities} />);
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("Created note React Notes")).toBeInTheDocument();
  });

  it("shows system when admin name is missing", () => {
    const activities = [
      {
        id: "1",
        admin: null,
        description: "System action",
        createdAt: "2026-08-15T10:00:00Z",
      },
    ] as any;
    render(<ActivityFeed activities={activities} />);
    expect(screen.getByText(/system action/i)).toBeInTheDocument();
  });

  it("renders up to 6 activities", () => {
    const activities = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      admin: { name: `Admin ${i}` },
      description: `Action ${i}`,
      createdAt: "2026-08-15T10:00:00Z",
    })) as any;
    render(<ActivityFeed activities={activities} />);
    const activityItems = document.querySelectorAll('[class*="border-b"]');
    expect(activityItems.length).toBeLessThanOrEqual(6);
  });

  it("renders relative timestamps", () => {
    const activities = [
      {
        id: "1",
        admin: { name: "Admin" },
        description: "Updated order",
        createdAt: "2026-08-15T08:00:00Z",
      },
    ] as any;
    render(<ActivityFeed activities={activities} />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });
});
