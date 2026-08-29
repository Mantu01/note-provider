import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { NotesTable } from "@/features/admin/components/notes/notes-table";

vi.mock("nuqs", () => {
  const mockParse = vi.fn((val: any) => val);
  return {
    parseAsBoolean: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    parseAsString: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    parseAsInteger: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    useQueryStates: vi.fn(() => [{ page: 1, search: "", deleteId: null }, vi.fn()]),
  };
});

vi.mock("@/features/admin/api/use-admin-notes", () => ({
  useAdminNotes: vi.fn(),
  useDeleteNote: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
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

vi.mock("@/components/shared/status-badge", () => ({
  StatusBadge: ({ status }: { status?: string }) => (
    <span data-testid={`status-${status}`}>{status || ""}</span>
  ),
}));

const { useAdminNotes } = await import("@/features/admin/api/use-admin-notes");
const mockUseAdminNotes = vi.mocked(useAdminNotes);

describe("NotesTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input", () => {
    mockUseAdminNotes.mockReturnValue({
      data: { items: [], pagination: null },
      isLoading: false,
    } as any);

    render(<NotesTable />);
    expect(screen.getByPlaceholderText("Search notes catalog...")).toBeInTheDocument();
  });

  it("renders create note button", () => {
    mockUseAdminNotes.mockReturnValue({
      data: { items: [], pagination: null },
      isLoading: false,
    } as any);

    render(<NotesTable />);
    expect(screen.getAllByText("Create Note").length).toBeGreaterThan(0);
  });

  it("renders loading skeleton rows", () => {
    mockUseAdminNotes.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    render(<NotesTable />);
    const skeletonRows = document.querySelectorAll(".animate-pulse");
    expect(skeletonRows.length).toBeGreaterThan(0);
  });

  it("renders empty state when no notes", async () => {
    mockUseAdminNotes.mockReturnValue({
      data: { items: [], pagination: null },
      isLoading: false,
    } as any);

    render(<NotesTable />);
    await screen.findByText("No notes found");
  });

  it("renders note rows with data", async () => {
    mockUseAdminNotes.mockReturnValue({
      data: {
        items: [
          {
            id: "1",
            title: "React Notes",
            slug: "react-notes",
            category: { name: "Web Development" },
            level: "beginner",
            pricingType: "free",
            visibility: "public",
            downloadCount: 10,
            purchaseCount: 0,
          },
        ],
        pagination: { total: 1, page: 1, limit: 12, totalPages: 1 },
      },
      isLoading: false,
    } as any);

    render(<NotesTable />);
    await screen.findByText("React Notes");
    expect(screen.getByText("Web Development")).toBeInTheDocument();
    expect(screen.getByText("beginner")).toBeInTheDocument();
  });

  it("shows edit and delete action buttons", async () => {
    mockUseAdminNotes.mockReturnValue({
      data: {
        items: [{ id: "1", title: "Test Note", category: { name: "Web Dev" }, level: "beginner", pricingType: "free", visibility: "public", downloadCount: 0, purchaseCount: 0 }],
        pagination: null,
      },
      isLoading: false,
    } as any);

    render(<NotesTable />);
    const editLinks = document.querySelectorAll('a[title="Edit note"]');
    const deleteBtns = document.querySelectorAll('button[title="Delete note"]');
    expect(editLinks.length).toBeGreaterThan(0);
    expect(deleteBtns.length).toBeGreaterThan(0);
  });

  it("renders pagination when multiple pages", async () => {
    mockUseAdminNotes.mockReturnValue({
      data: {
        items: [],
        pagination: { total: 50, page: 1, limit: 12, totalPages: 5 },
      },
      isLoading: false,
    } as any);

    render(<NotesTable />);
    await screen.findByTestId("pagination");
  });

  it("hides pagination when single page", () => {
    mockUseAdminNotes.mockReturnValue({
      data: {
        items: [],
        pagination: { total: 5, page: 1, limit: 12, totalPages: 1 },
      },
      isLoading: false,
    } as any);

    render(<NotesTable />);
    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });
});
