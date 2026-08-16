import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ActiveFilterChips } from "@/features/notes/components/active-filter-chips";

vi.mock("@/features/notes/hooks/use-notes-query-state", () => ({
  useNotesQueryState: vi.fn(),
}));

const { useNotesQueryState } = await import("@/features/notes/hooks/use-notes-query-state");
const mockUseNotesQueryState = vi.mocked(useNotesQueryState);

describe("ActiveFilterChips", () => {
  const mockSetFilter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNotesQueryState.mockReturnValue({
      state: {
        page: 1, limit: 12, q: "", category: [], level: [], pricing: "",
        minPrice: null, maxPrice: null, sort: "newest", view: "grid",
      },
      setFilter: mockSetFilter,
      clearFilters: vi.fn(),
      activeFilterCount: 0,
    } as any);
  });

  it("returns null when no filters are active", () => {
    const { container } = render(<ActiveFilterChips
      state={{ category: [], level: [] } as any}
      setFilter={mockSetFilter}
    />);
    expect(container.firstChild).toBeNull();
  });

  it("renders chips for active categories", () => {
    render(<ActiveFilterChips
      state={{ category: ["web-dev"], level: [] } as any}
      setFilter={mockSetFilter}
    />);
    expect(screen.getByText("web-dev")).toBeInTheDocument();
  });

  it("renders chips for active levels", () => {
    render(<ActiveFilterChips
      state={{ category: [], level: ["beginner"] } as any}
      setFilter={mockSetFilter}
    />);
    expect(screen.getByText("beginner")).toBeInTheDocument();
  });

  it("renders chips for both categories and levels", () => {
    render(<ActiveFilterChips
      state={{ category: ["web-dev"], level: ["beginner"] } as any}
      setFilter={mockSetFilter}
    />);
    expect(screen.getByText("web-dev")).toBeInTheDocument();
    expect(screen.getByText("beginner")).toBeInTheDocument();
  });

  it("calls setFilter when a chip is clicked", () => {
    render(<ActiveFilterChips
      state={{ category: ["web-dev"], level: [] } as any}
      setFilter={mockSetFilter}
    />);
    const chip = screen.getByText("web-dev");
    fireEvent.click(chip);
    expect(mockSetFilter).toHaveBeenCalledWith({ category: [] });
  });

  it("removes level filter when level chip is clicked", () => {
    render(<ActiveFilterChips
      state={{ category: [], level: ["beginner", "intermediate"] } as any}
      setFilter={mockSetFilter}
    />);
    const beginnerChip = screen.getByText("beginner");
    fireEvent.click(beginnerChip);
    expect(mockSetFilter).toHaveBeenCalledWith({ level: ["intermediate"] });
  });

  it("shows X icon on each chip", () => {
    render(<ActiveFilterChips
      state={{ category: ["web-dev"], level: [] } as any}
      setFilter={mockSetFilter}
    />);
    const svgElements = document.querySelectorAll("svg");
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it("renders button elements for each chip", () => {
    render(<ActiveFilterChips
      state={{ category: ["web-dev", "dsa"], level: ["beginner"] } as any}
      setFilter={mockSetFilter}
    />);
    const buttons = document.querySelectorAll('button[type="button"]');
    expect(buttons.length).toBe(3);
  });

  it("does not crash with empty state arrays", () => {
    const { container } = render(<ActiveFilterChips
      state={{ category: [], level: [] } as any}
      setFilter={mockSetFilter}
    />);
    expect(container.firstChild).toBeNull();
  });
});
