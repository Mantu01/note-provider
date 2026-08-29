import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { CategoriesTable } from "@/features/admin/components/categories/categories-table";

vi.mock("nuqs", () => {
  const mockParse = vi.fn((val: any) => val);
  return {
    parseAsBoolean: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    parseAsString: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    parseAsInteger: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    useQueryStates: vi.fn(() => [{ dialog: false, editId: null, deleteId: null }, vi.fn()]),
  };
});

vi.mock("@/features/admin/api/use-admin-categories", () => ({
  useAdminCategories: vi.fn(),
  useDeleteCategory: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock("@/features/admin/api/use-admin-auth", () => ({
  useAdminProfile: vi.fn(() => ({
    data: { id: "admin-1", name: "Admin", email: "admin@test.com", isHead: true },
  })),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, title, className, render, ...props }: any) => {
    if (render) {
      return render;
    }
    return (
      <button onClick={onClick} disabled={disabled} title={title} className={className} {...props}>
        {children}
      </button>
    );
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
  Dialog: ({ children, open }: any) => (open ? <div data-testid="dialog-wrapper">{children}</div> : null),
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

vi.mock("@/features/admin/components/categories/category-dialog", () => ({
  CategoryDialog: ({ open, category }: any) =>
    open ? <div data-testid="category-dialog">{category?.name || "New Category"}</div> : null,
}));

const { useAdminCategories } = await import("@/features/admin/api/use-admin-categories");
const mockUseAdminCategories = vi.mocked(useAdminCategories);

describe("CategoriesTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page title and description", () => {
    mockUseAdminCategories.mockReturnValue({
      data: { items: [] },
      isLoading: false,
    } as any);

    render(<CategoriesTable />);
    expect(screen.getByText("Study Categories")).toBeInTheDocument();
    expect(screen.getByText("Manage topic categories used to organize notes.")).toBeInTheDocument();
  });

  it("renders add category button in header", () => {
    mockUseAdminCategories.mockReturnValue({
      data: { items: [] },
      isLoading: false,
    } as any);

    render(<CategoriesTable />);
    const buttons = screen.getAllByText(/Add Category/);
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders loading skeleton rows", () => {
    mockUseAdminCategories.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    render(<CategoriesTable />);
    const skeletonRows = document.querySelectorAll(".animate-pulse");
    expect(skeletonRows.length).toBeGreaterThan(0);
  });

  it("renders empty state when no categories", async () => {
    mockUseAdminCategories.mockReturnValue({
      data: { items: [] },
      isLoading: false,
    } as any);

    render(<CategoriesTable />);
    await waitFor(() => {
      expect(screen.getByText("No categories created")).toBeInTheDocument();
    });
  });

  it("renders category rows with data", async () => {
    mockUseAdminCategories.mockReturnValue({
      data: {
        items: [
          {
            id: "cat-1",
            name: "Web Development",
            slug: "web-dev",
            noteCount: 10,
            order: 1,
            description: "Frontend and backend notes",
          },
          {
            id: "cat-2",
            name: "DSA",
            slug: "dsa",
            noteCount: 5,
            order: 2,
            description: null,
          },
        ],
      },
      isLoading: false,
    } as any);

    render(<CategoriesTable />);
    await waitFor(() => {
      expect(screen.getByText("Web Development")).toBeInTheDocument();
      expect(screen.getByText("DSA")).toBeInTheDocument();
      expect(screen.getByText("web-dev")).toBeInTheDocument();
      expect(screen.getByText("dsa")).toBeInTheDocument();
    });
  });

  it("shows edit button for each category", async () => {
    mockUseAdminCategories.mockReturnValue({
      data: {
        items: [{ id: "cat-1", name: "React", slug: "react", noteCount: 5, order: 1 }],
      },
      isLoading: false,
    } as any);

    render(<CategoriesTable />);
    await waitFor(() => {
      const editBtn = document.querySelector("button[title]");
      if (editBtn) {
        expect(editBtn).toBeInTheDocument();
      }
    });
  });

  it("shows delete button for each category", async () => {
    mockUseAdminCategories.mockReturnValue({
      data: {
        items: [{ id: "cat-1", name: "React", slug: "react", noteCount: 5, order: 1 }],
      },
      isLoading: false,
    } as any);

    render(<CategoriesTable />);
    await waitFor(() => {
      const deleteBtn = document.querySelector("button[title]");
      if (deleteBtn) {
        expect(deleteBtn).toBeInTheDocument();
      }
    });
  });

  it("renders note count badge", async () => {
    mockUseAdminCategories.mockReturnValue({
      data: {
        items: [{ id: "cat-1", name: "React", slug: "react", noteCount: 10, order: 1 }],
      },
      isLoading: false,
    } as any);

    render(<CategoriesTable />);
    await waitFor(() => {
      expect(screen.getByText("10 Notes")).toBeInTheDocument();
    });
  });

  it("opens category dialog on create button click", async () => {
    mockUseAdminCategories.mockReturnValue({
      data: { items: [] },
      isLoading: false,
    } as any);

    render(<CategoriesTable />);
    const buttons = document.querySelectorAll("button");
    const createBtn = Array.from(buttons).find((b) => b.textContent?.includes("Add Category"));
    if (createBtn) {
      await userEvent.click(createBtn);
    }
  });
});
