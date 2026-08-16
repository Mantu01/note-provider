import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ActivitiesTable } from "@/features/admin/components/activities/activities-table";

vi.mock("nuqs", () => {
  const mockParse = vi.fn((val: any) => val);
  return {
    parseAsBoolean: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    parseAsString: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    parseAsInteger: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    useQueryStates: vi.fn(() => [
      { page: 1, q: null, action: null, targetType: null, from: null, to: null },
      vi.fn(),
    ]),
  };
});

vi.mock("@/features/admin/api/use-admin-activities", () => ({
  useAdminActivities: vi.fn(),
}));

vi.mock("@/features/admin/components/activities/activity-filter-bar", () => ({
  ActivityFilterBar: ({ onChange }: any) => (
    <div data-testid="activity-filter-bar">
      <button onClick={() => onChange({})}>Reset Filters</button>
    </div>
  ),
}));

vi.mock("@/components/ui/table", () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableRow: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  TableHead: ({ children }: any) => <th>{children}</th>,
  TableCell: ({ children }: any) => <td>{children}</td>,
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid={`badge-${variant}`}>{children}</span>
  ),
}));

vi.mock("@/components/shared/empty-state", () => ({
  EmptyState: ({ title, description }: any) => (
    <div data-testid="empty-state">
      <span>{title}</span>
      <p>{description}</p>
    </div>
  ),
}));

vi.mock("@/components/shared/pagination-bar", () => ({
  PaginationBar: ({ totalPages }: any) => (
    <div data-testid="pagination">
      <span>Total pages: {totalPages}</span>
    </div>
  ),
}));

const { useAdminActivities } = await import("@/features/admin/api/use-admin-activities");
const mockUseAdminActivities = vi.mocked(useAdminActivities);

describe("ActivitiesTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders activity filter bar", () => {
    mockUseAdminActivities.mockReturnValue({
      data: { items: [], pagination: null },
      isLoading: false,
    } as any);

    render(<ActivitiesTable />);
    expect(screen.getByTestId("activity-filter-bar")).toBeInTheDocument();
  });

  it("renders loading skeleton rows", () => {
    mockUseAdminActivities.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    render(<ActivitiesTable />);
    const skeletonRows = document.querySelectorAll(".animate-pulse");
    expect(skeletonRows.length).toBeGreaterThan(0);
  });

  it("renders empty state when no activities", async () => {
    mockUseAdminActivities.mockReturnValue({
      data: { items: [], pagination: null },
      isLoading: false,
    } as any);

    render(<ActivitiesTable />);
    await waitFor(() => {
      expect(screen.getByText("No activity log entries")).toBeInTheDocument();
    });
  });

  it("renders activity rows with data", async () => {
    mockUseAdminActivities.mockReturnValue({
      data: {
        items: [
          {
            id: "1",
            admin: { name: "Admin User", email: "admin@test.com" },
            action: "note.create",
            description: "Created note React Notes",
            targetLabel: "react-notes",
            ipAddress: "192.168.1.1",
            createdAt: "2026-08-15T10:00:00Z",
          },
        ],
        pagination: { total: 1, page: 1, limit: 20, totalPages: 1 },
      },
      isLoading: false,
    } as any);

    render(<ActivitiesTable />);
    await waitFor(() => {
      expect(screen.getByText("Admin User")).toBeInTheDocument();
      expect(screen.getByText("admin@test.com")).toBeInTheDocument();
      expect(screen.getByText("note.create")).toBeInTheDocument();
      expect(screen.getByText("Created note React Notes")).toBeInTheDocument();
      expect(screen.getByText("192.168.1.1")).toBeInTheDocument();
    });
  });

  it("shows System when admin is missing", async () => {
    mockUseAdminActivities.mockReturnValue({
      data: {
        items: [{
          id: "1",
          admin: null,
          action: "system",
          description: "System event",
          ipAddress: null,
          createdAt: "2026-08-15T10:00:00Z",
        }],
        pagination: null,
      },
      isLoading: false,
    } as any);

    render(<ActivitiesTable />);
    await waitFor(() => {
      expect(screen.getByText("System")).toBeInTheDocument();
    });
  });

  it("shows dash for missing IP address", async () => {
    mockUseAdminActivities.mockReturnValue({
      data: {
        items: [{
          id: "1",
          admin: { name: "Admin", email: "a@b.com" },
          action: "test",
          description: "Test action",
          ipAddress: null,
          createdAt: "2026-08-15T10:00:00Z",
        }],
        pagination: null,
      },
      isLoading: false,
    } as any);

    render(<ActivitiesTable />);
    await waitFor(() => {
      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  it("shows target label when present", async () => {
    mockUseAdminActivities.mockReturnValue({
      data: {
        items: [{
          id: "1",
          admin: { name: "Admin", email: "a@b.com" },
          action: "note.create",
          description: "Created note",
          targetLabel: "react-notes",
          ipAddress: "10.0.0.1",
          createdAt: "2026-08-15T10:00:00Z",
        }],
        pagination: null,
      },
      isLoading: false,
    } as any);

    render(<ActivitiesTable />);
    await waitFor(() => {
      expect(screen.getByText("Target: react-notes")).toBeInTheDocument();
    });
  });

  it("renders pagination when multiple pages", async () => {
    mockUseAdminActivities.mockReturnValue({
      data: {
        items: [],
        pagination: { total: 50, page: 1, limit: 20, totalPages: 3 },
      },
      isLoading: false,
    } as any);

    render(<ActivitiesTable />);
    await waitFor(() => {
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });
  });

  it("hides pagination when single page", () => {
    mockUseAdminActivities.mockReturnValue({
      data: {
        items: [],
        pagination: { total: 5, page: 1, limit: 20, totalPages: 1 },
      },
      isLoading: false,
    } as any);

    render(<ActivitiesTable />);
    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });
});
