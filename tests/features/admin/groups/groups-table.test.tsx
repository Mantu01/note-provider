import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GroupsTable } from "@/features/admin/components/groups/groups-table";

vi.mock("nuqs", () => {
  const mockParse = vi.fn((val: any) => val);
  return {
    parseAsBoolean: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    parseAsString: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    parseAsInteger: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    useQueryStates: vi.fn(() => [{ page: 1, search: "", deleteId: null }, vi.fn()]),
  };
});

vi.mock("@/features/admin/api/use-admin-groups", () => ({
  useAdminGroups: vi.fn(),
  useDeleteGroup: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock("@/features/admin/api/use-admin-auth", () => ({
  useAdminProfile: vi.fn(() => ({
    data: { id: "admin-1", name: "Admin", email: "admin@test.com", isHead: true },
  })),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({ ...props }: any) => <input {...props} />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, title, className, render: renderProp, ...props }: any) => {
    if (renderProp) {
      return <a href="/mock" title={title} className={className}>{children}</a>;
    }
    return <button onClick={onClick} disabled={disabled} title={title} className={className} {...props}>{children}</button>;
  },
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

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: any) => open ? <div>{children}</div> : null,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/shared/empty-state", () => ({
  EmptyState: ({ title, description, action }: any) => (
    <div data-testid="empty-state">
      <span>{title}</span>
      <p>{description}</p>
      {action}
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

const { useAdminGroups } = await import("@/features/admin/api/use-admin-groups");
const mockUseAdminGroups = vi.mocked(useAdminGroups);

describe("GroupsTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input", () => {
    mockUseAdminGroups.mockReturnValue({
      data: { items: [], pagination: null },
      isLoading: false,
    } as any);

    render(<GroupsTable />);
    expect(screen.getByPlaceholderText("Search note bundles...")).toBeInTheDocument();
  });

  it("renders create bundle button", () => {
    mockUseAdminGroups.mockReturnValue({
      data: { items: [], pagination: null },
      isLoading: false,
    } as any);

    render(<GroupsTable />);
    // "Create Bundle" appears in both header and empty state
    expect(screen.getAllByText("Create Bundle").length).toBeGreaterThan(0);
  });

  it("renders loading skeleton rows", () => {
    mockUseAdminGroups.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    render(<GroupsTable />);
    const skeletonRows = document.querySelectorAll(".animate-pulse");
    expect(skeletonRows.length).toBeGreaterThan(0);
  });

  it("renders empty state when no bundles", async () => {
    mockUseAdminGroups.mockReturnValue({
      data: { items: [], pagination: null },
      isLoading: false,
    } as any);

    render(<GroupsTable />);
    await screen.findByText("No bundles created yet");
  });

  it("renders group rows with data", async () => {
    mockUseAdminGroups.mockReturnValue({
      data: {
        items: [
          {
            id: "1",
            name: "React Complete Bundle",
            slug: "react-bundle",
            description: "Complete React notes",
            category: { name: "Web Development" },
            noteCount: 5,
            priceLabel: "Rs. 999",
            visibility: "public",
          },
        ],
        pagination: { total: 1, page: 1, limit: 12, totalPages: 1 },
      },
      isLoading: false,
    } as any);

    render(<GroupsTable />);
    await screen.findByText("React Complete Bundle");
    expect(screen.getByText("Rs. 999")).toBeInTheDocument();
  });

  it("shows edit and delete action buttons", async () => {
    mockUseAdminGroups.mockReturnValue({
      data: {
        items: [{ id: "1", name: "Test Bundle", category: { name: "Web Dev" }, noteCount: 3, priceLabel: "Rs. 499", visibility: "public" }],
        pagination: null,
      },
      isLoading: false,
    } as any);

    render(<GroupsTable />);
    const editLinks = document.querySelectorAll('a[title="Edit bundle"]');
    const deleteBtns = document.querySelectorAll('button[title="Delete bundle"]');
    expect(editLinks.length).toBeGreaterThan(0);
    expect(deleteBtns.length).toBeGreaterThan(0);
  });

  it("renders pagination when multiple pages", async () => {
    mockUseAdminGroups.mockReturnValue({
      data: {
        items: [],
        pagination: { total: 50, page: 1, limit: 12, totalPages: 5 },
      },
      isLoading: false,
    } as any);

    render(<GroupsTable />);
    await screen.findByTestId("pagination");
  });
});
