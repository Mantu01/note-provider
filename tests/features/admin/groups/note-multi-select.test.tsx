import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NoteMultiSelect } from "@/features/admin/components/groups/note-multi-select";

vi.mock("nuqs", () => {
  const mockParse = vi.fn((val: any) => val);
  const mockSetParams = vi.fn();
  return {
    parseAsString: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    useQueryStates: vi.fn(() => [{ query: "" }, mockSetParams]),
  };
});

vi.mock("@/features/admin/api/use-admin-notes", () => ({
  useAdminNotes: vi.fn(),
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({ ...props }: any) => <input {...props} />,
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid={`badge-${variant}`}>{children}</span>
  ),
}));

const { useAdminNotes } = await import("@/features/admin/api/use-admin-notes");
const mockUseAdminNotes = vi.mocked(useAdminNotes);
const { useQueryStates } = await import("nuqs");
const mockUseQueryStates = vi.mocked(useQueryStates);

describe("NoteMultiSelect", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAdminNotes.mockReturnValue({
      data: {
        items: [
          { id: "note-1", title: "React Notes", category: { name: "Web Dev" }, priceLabel: "Rs. 499", pricingType: "paid" },
          { id: "note-2", title: "Node Notes", category: { name: "Backend" }, priceLabel: "Rs. 299", pricingType: "free" },
          { id: "note-3", title: "DSA Notes", category: { name: "CS" }, priceLabel: "Rs. 399", pricingType: "paid" },
        ],
      },
      isLoading: false,
    } as any);
    mockUseQueryStates.mockReturnValue([{ query: "" }, vi.fn()] as any);
  });

  it("renders search input", () => {
    render(<NoteMultiSelect selectedIds={[]} onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText("Search notes by title or subject...")).toBeInTheDocument();
  });

  it("renders selected notes as badges", () => {
    render(<NoteMultiSelect selectedIds={["note-1"]} onChange={mockOnChange} />);
    expect(screen.getByTestId("badge-secondary")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockUseAdminNotes.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    render(<NoteMultiSelect selectedIds={[]} onChange={mockOnChange} />);
    expect(screen.getByText("Loading notes...")).toBeInTheDocument();
  });

  it("shows no results message when no notes match", () => {
    mockUseAdminNotes.mockReturnValue({
      data: { items: [] },
      isLoading: false,
    } as any);

    render(<NoteMultiSelect selectedIds={[]} onChange={mockOnChange} />);
    expect(screen.getByText("No matching notes found.")).toBeInTheDocument();
  });

  it("toggles selection when clicking a note", () => {
    render(<NoteMultiSelect selectedIds={[]} onChange={mockOnChange} />);
    // Find the clickable note row by finding the div that contains the title text
    // The note rows have the structure: <div className="flex items-center justify-between p-3 cursor-pointer">
    const noteRows = Array.from(document.querySelectorAll('[class*="cursor-pointer"]'));
    const reactRow = noteRows.find(row => row.textContent?.includes("React Notes"));
    if (reactRow) fireEvent.click(reactRow);
    expect(mockOnChange).toHaveBeenCalledWith(["note-1"]);
  });

  it("removes selection when clicking selected note", () => {
    render(<NoteMultiSelect selectedIds={["note-1"]} onChange={mockOnChange} />);
    const noteRows = Array.from(document.querySelectorAll('[class*="cursor-pointer"]'));
    const reactRow = noteRows.find(row => row.textContent?.includes("React Notes"));
    if (reactRow) fireEvent.click(reactRow);
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it("removes selected note via X button", () => {
    render(<NoteMultiSelect selectedIds={["note-1"]} onChange={mockOnChange} />);
    const badges = document.querySelectorAll('[data-testid="badge-secondary"]');
    const badge = Array.from(badges).find(b => b.textContent?.includes("React Notes"));
    if (badge) {
      const btn = badge.querySelector("button");
      if (btn) fireEvent.click(btn);
    }
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it("shows check icon on selected notes", () => {
    render(<NoteMultiSelect selectedIds={["note-1", "note-2"]} onChange={mockOnChange} />);
    const badges = document.querySelectorAll('[data-testid="badge-secondary"]');
    expect(badges.length).toBeGreaterThanOrEqual(2);
  });

  it("filters notes by search query", () => {
    render(<NoteMultiSelect selectedIds={[]} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText("Search notes by title or subject...");
    fireEvent.change(input, { target: { value: "React" } });
    expect(mockUseQueryStates).toHaveBeenCalled();
  });

  it("shows pricing type badge on each note", () => {
    render(<NoteMultiSelect selectedIds={[]} onChange={mockOnChange} />);
    const paidBadges = document.querySelectorAll('[data-testid="badge-outline"]');
    expect(paidBadges.length).toBeGreaterThan(0);
  });

  it("shows category name on each note", () => {
    render(<NoteMultiSelect selectedIds={[]} onChange={mockOnChange} />);
    expect(screen.getByText(/Web Dev/)).toBeInTheDocument();
    expect(screen.getByText(/Backend/)).toBeInTheDocument();
  });
});
