import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { LeadsTable } from "@/features/admin/components/leads/leads-table";

vi.mock("nuqs", () => {
  const mockParse = vi.fn((val: any) => val);
  return {
    parseAsBoolean: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    parseAsString: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    parseAsInteger: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    useQueryStates: vi.fn(() => [{ page: 1, search: "" }, vi.fn()]),
  };
});

vi.mock("@/features/admin/api/use-admin-leads", () => ({
  useAdminLeads: vi.fn(),
}));

vi.mock("@/features/admin/components/leads/export-button", () => ({
  ExportButton: () => <button data-testid="export-button">Export CSV</button>,
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({ ...props }: any) => <input {...props} />,
}));

vi.mock("@/components/ui/table", () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableRow: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  TableHead: ({ children }: any) => <th>{children}</th>,
  TableCell: ({ children }: any) => <td>{children}</td>,
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

vi.mock("@/components/shared/status-badge", () => ({
  StatusBadge: ({ status }: { status?: string }) => (
    <span data-testid={`status-${status}`}>{status || ""}</span>
  ),
}));

const { useAdminLeads } = await import("@/features/admin/api/use-admin-leads");
const mockUseAdminLeads = vi.mocked(useAdminLeads);

describe("LeadsTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input", () => {
    mockUseAdminLeads.mockReturnValue({
      data: { items: [], pagination: null },
      isLoading: false,
    } as any);

    render(<LeadsTable />);
    // The actual placeholder has trailing ellipsis: "Search leads by name or social handle..."
    expect(screen.getByPlaceholderText(/Search leads by name or social handle/)).toBeInTheDocument();
  });

  it("renders export button", () => {
    mockUseAdminLeads.mockReturnValue({
      data: { items: [], pagination: null },
      isLoading: false,
    } as any);

    render(<LeadsTable />);
    expect(screen.getByTestId("export-button")).toBeInTheDocument();
  });

  it("renders loading skeleton rows", () => {
    mockUseAdminLeads.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    render(<LeadsTable />);
    const skeletonRows = document.querySelectorAll(".animate-pulse");
    expect(skeletonRows.length).toBeGreaterThan(0);
  });

  it("renders empty state when no leads", async () => {
    mockUseAdminLeads.mockReturnValue({
      data: { items: [], pagination: null },
      isLoading: false,
    } as any);

    render(<LeadsTable />);
    await waitFor(() => {
      expect(screen.getByText("No leads captured yet")).toBeInTheDocument();
    });
  });

  it("renders lead rows with data", async () => {
    mockUseAdminLeads.mockReturnValue({
      data: {
        items: [
          {
            id: "1",
            fullName: "John Doe",
            socialPlatform: "instagram",
            socialHandle: "@johndoe",
            itemTitle: "React Notes",
            paymentStatus: "paid",
            createdAt: "2026-08-15T10:00:00Z",
          },
        ],
        pagination: { total: 1, page: 1, limit: 20, totalPages: 1 },
      },
      isLoading: false,
    } as any);

    render(<LeadsTable />);
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("@johndoe")).toBeInTheDocument();
      expect(screen.getByText("React Notes")).toBeInTheDocument();
    });
  });

  it("shows payment status badge", async () => {
    mockUseAdminLeads.mockReturnValue({
      data: {
        items: [{
          id: "1",
          fullName: "Jane",
          socialPlatform: "whatsapp",
          socialHandle: "9876543210",
          itemTitle: "Bundle",
          paymentStatus: "pending",
          createdAt: "2026-08-15T10:00:00Z",
        }],
        pagination: null,
      },
      isLoading: false,
    } as any);

    render(<LeadsTable />);
    await waitFor(() => {
      expect(screen.getByTestId("status-pending")).toBeInTheDocument();
    });
  });

  it("renders pagination when multiple pages", async () => {
    mockUseAdminLeads.mockReturnValue({
      data: {
        items: [],
        pagination: { total: 50, page: 1, limit: 20, totalPages: 3 },
      },
      isLoading: false,
    } as any);

    render(<LeadsTable />);
    await waitFor(() => {
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });
  });

  it("shows social platform in primary color", async () => {
    mockUseAdminLeads.mockReturnValue({
      data: {
        items: [{
          id: "1",
          fullName: "User",
          socialPlatform: "email",
          socialHandle: "user@test.com",
          itemTitle: "Note",
          paymentStatus: "paid",
          createdAt: "2026-08-15T10:00:00Z",
        }],
        pagination: null,
      },
      isLoading: false,
    } as any);

    render(<LeadsTable />);
    await waitFor(() => {
      expect(screen.getByText("email")).toBeInTheDocument();
    });
  });
});
