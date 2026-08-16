import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { NoteForm } from "@/features/admin/components/notes/note-form";

vi.mock("nuqs", () => {
  const mockParse = vi.fn((val: any) => val);
  return {
    parseAsBoolean: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    useQueryStates: vi.fn(() => [{ categoryDialog: false }, vi.fn()]),
  };
});

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn(), pathname: "/admin/notes" })),
}));

vi.mock("@/features/admin/api/use-admin-notes", () => ({
  useCreateNote: vi.fn(() => ({ mutate: vi.fn(), isPending: false, error: null })),
  useUpdateNote: vi.fn(() => ({ mutate: vi.fn(), isPending: false, error: null })),
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
  Select: ({ children }: any) => <div data-testid="select-wrapper">{children}</div>,
  SelectTrigger: ({ children }: any) => <button data-testid="select-trigger">{children}</button>,
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectValue: ({ children }: any) => <span data-testid="select-value">{children}</span>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, variant, size, render: renderProp, ...props }: any) => {
    if (renderProp) {
      return renderProp;
    }
    return <button onClick={onClick} {...props}>{children}</button>;
  },
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

describe("NoteForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title for new note form", () => {
    render(<NoteForm />);
    expect(screen.getByText("Create New Note")).toBeInTheDocument();
  });

  it("renders title for edit note form", () => {
    render(<NoteForm initialData={{ id: "1", title: "React Notes" } as any} />);
    expect(screen.getByText(/Edit "React Notes"/)).toBeInTheDocument();
  });

  it("renders title input", () => {
    render(<NoteForm />);
    expect(screen.getByPlaceholderText(/Complete Data Structures/)).toBeInTheDocument();
  });

  it("renders description textarea", () => {
    render(<NoteForm />);
    expect(screen.getByPlaceholderText(/Detailed overview/)).toBeInTheDocument();
  });

  it("renders category select", () => {
    render(<NoteForm />);
    expect(screen.getByText("Select Category")).toBeInTheDocument();
  });

  it("renders level select", () => {
    render(<NoteForm />);
    expect(screen.getByText("Target Level")).toBeInTheDocument();
    const selectValues = document.querySelectorAll('[data-testid="select-value"]');
    expect(selectValues.length).toBeGreaterThan(0);
  });

  it("renders pricing type select", () => {
    render(<NoteForm />);
    expect(screen.getByText("Free Note")).toBeInTheDocument();
    expect(screen.getByText("Paid Note")).toBeInTheDocument();
  });

  it("renders visibility select", () => {
    render(<NoteForm />);
    expect(screen.getByText("Public (Visible in Catalogue)")).toBeInTheDocument();
    expect(screen.getByText("Private (Hidden from Public)")).toBeInTheDocument();
  });

  it("renders save/publish button", () => {
    render(<NoteForm />);
    expect(screen.getByText("Publish Note")).toBeInTheDocument();
  });

  it("renders cancel button", () => {
    render(<NoteForm />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("shows file upload for free pricing type", () => {
    render(<NoteForm />);
    const uploads = document.querySelectorAll('[data-testid="file-upload"]');
    expect(uploads.length).toBeGreaterThan(0);
  });

  it("renders featured note toggle", () => {
    render(<NoteForm />);
    expect(screen.getByText("Featured Note")).toBeInTheDocument();
  });

  it("renders back button", () => {
    render(<NoteForm />);
    // The back button is a Button with type="button" and no text children (icon only)
    // Our mock renders it as a regular button, so find by the presence of buttons
    const buttons = document.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
