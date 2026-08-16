import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { CategoryDialog } from "@/features/admin/components/categories/category-dialog";

vi.mock("@/features/admin/api/use-admin-categories", () => ({
  useCreateCategory: vi.fn(() => ({ mutate: vi.fn(), isPending: false, error: null })),
  useUpdateCategory: vi.fn(() => ({ mutate: vi.fn(), isPending: false, error: null })),
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({ ...props }: any) => <input {...props} />,
}));

vi.mock("@/components/ui/textarea", () => ({
  Textarea: ({ ...props }: any) => <textarea {...props} />,
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <option>{children}</option>,
  SelectValue: ({ children }: any) => <span>{children}</span>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: any) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

describe("CategoryDialog", () => {
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dialog when open", () => {
    render(<CategoryDialog open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("does not render dialog when closed", () => {
    render(<CategoryDialog open={false} onOpenChange={mockOnOpenChange} />);
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("renders title for new category", () => {
    render(<CategoryDialog open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByText("Create New Category")).toBeInTheDocument();
  });

  it("renders title for edit category", () => {
    render(
      <CategoryDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        category={{ id: "cat-1", name: "Web Development", slug: "web-dev" } as any}
      />
    );
    expect(screen.getByText("Edit Category")).toBeInTheDocument();
  });

  it("renders category name input", () => {
    render(<CategoryDialog open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByPlaceholderText("e.g. Computer Science")).toBeInTheDocument();
  });

  it("renders description textarea", () => {
    render(<CategoryDialog open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByPlaceholderText("Brief summary of notes in this category...")).toBeInTheDocument();
  });

  it("renders icon selection", () => {
    render(<CategoryDialog open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByText("Choose Category Icon")).toBeInTheDocument();
  });

  it("renders order input", () => {
    render(<CategoryDialog open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByPlaceholderText("0")).toBeInTheDocument();
  });

  it("renders cancel button", () => {
    render(<CategoryDialog open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("renders create category button", () => {
    render(<CategoryDialog open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByText("Create Category")).toBeInTheDocument();
  });

  it("renders save changes button when editing", () => {
    render(
      <CategoryDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        category={{ id: "cat-1", name: "Web Development" } as any}
      />
    );
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  it("populates form with existing category data", () => {
    render(
      <CategoryDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        category={{ id: "cat-1", name: "React", description: "React notes", icon: "Code2", order: 5 } as any}
      />
    );
    expect(screen.getByDisplayValue("React")).toBeInTheDocument();
    expect(screen.getByDisplayValue("React notes")).toBeInTheDocument();
  });

  it("closes dialog on cancel button click", async () => {
    render(<CategoryDialog open={true} onOpenChange={mockOnOpenChange} />);
    const cancelBtn = screen.getByText("Cancel");
    await userEvent.click(cancelBtn);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("has default icon preset visible in options", () => {
    render(<CategoryDialog open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByText("Programming")).toBeInTheDocument();
    expect(screen.getByText("Science")).toBeInTheDocument();
  });
});
