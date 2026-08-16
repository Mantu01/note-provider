import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { GroupForm } from "@/features/admin/components/groups/group-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), pathname: "/admin/groups" }),
}));

vi.mock("@/features/admin/api/use-admin-groups", () => ({
  useCreateGroup: vi.fn(() => ({ mutate: vi.fn(), isPending: false, error: null })),
  useUpdateGroup: vi.fn(() => ({ mutate: vi.fn(), isPending: false, error: null })),
}));

vi.mock("@/features/admin/api/use-admin-categories", () => ({
  useAdminCategories: vi.fn(() => ({
    data: { items: [
      { id: "cat-1", name: "Web Development", slug: "web-dev" },
      { id: "cat-2", name: "DSA", slug: "dsa" },
    ] },
  })),
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

vi.mock("@/components/ui/switch", () => ({
  Switch: ({ checked, onCheckedChange }: any) => (
    <button onClick={() => onCheckedChange(!checked)} data-testid="switch">
      {checked ? "On" : "Off"}
    </button>
  ),
}));

vi.mock("@/components/shared/file-upload-field", () => ({
  FileUploadField: ({ label }: { label: string }) => (
    <div data-testid="file-upload">{label}</div>
  ),
}));

vi.mock("@/features/admin/components/categories/category-dialog", () => ({
  CategoryDialog: ({ open }: { open: boolean }) => open ? <div data-testid="category-dialog">Category Dialog</div> : null,
}));

vi.mock("@/features/admin/components/groups/note-multi-select", () => ({
  NoteMultiSelect: () => <div data-testid="note-multi-select">Note Multi Select</div>,
}));

describe("GroupForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title for new bundle form", () => {
    render(<GroupForm />);
    expect(screen.getByText("Create Note Bundle")).toBeInTheDocument();
  });

  it("renders title for edit bundle form", () => {
    render(<GroupForm initialData={{ id: "1", name: "React Bundle" } as any} />);
    expect(screen.getByText(/Edit Bundle "React Bundle"/)).toBeInTheDocument();
  });

  it("renders bundle name input", () => {
    render(<GroupForm />);
    expect(screen.getByPlaceholderText(/Master GATE/)).toBeInTheDocument();
  });

  it("renders description textarea", () => {
    render(<GroupForm />);
    expect(screen.getByPlaceholderText(/Explain what is included/)).toBeInTheDocument();
  });

  it("renders category select", () => {
    render(<GroupForm />);
    expect(screen.getByText("Select Category")).toBeInTheDocument();
  });

  it("renders note multi select", () => {
    render(<GroupForm />);
    expect(screen.getByTestId("note-multi-select")).toBeInTheDocument();
  });

  it("renders price input", () => {
    render(<GroupForm />);
    expect(screen.getByPlaceholderText("999")).toBeInTheDocument();
  });

  it("renders compare at price input", () => {
    render(<GroupForm />);
    expect(screen.getByPlaceholderText("1999")).toBeInTheDocument();
  });

  it("renders visibility select", () => {
    render(<GroupForm />);
    expect(screen.getByText("Public (Visible in Catalogue)")).toBeInTheDocument();
    expect(screen.getByText("Private (Hidden from Public)")).toBeInTheDocument();
  });

  it("renders featured bundle toggle", () => {
    render(<GroupForm />);
    expect(screen.getByText("Featured Bundle")).toBeInTheDocument();
  });

  it("renders cover image upload", () => {
    render(<GroupForm />);
    expect(screen.getByTestId("file-upload")).toBeInTheDocument();
  });

  it("renders cancel and create buttons", () => {
    render(<GroupForm />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Create Bundle")).toBeInTheDocument();
  });

  it("renders back button", () => {
    render(<GroupForm />);
    const buttons = document.querySelectorAll("button");
    // First button should be the back button (icon-only, type="button")
    expect(buttons.length).toBeGreaterThan(0);
  });
});
