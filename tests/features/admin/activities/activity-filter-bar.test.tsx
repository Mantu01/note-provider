import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ActivityFilterBar } from "@/features/admin/components/activities/activity-filter-bar";

vi.mock("@/components/ui/input", () => ({
  Input: ({ ...props }: any) => <input {...props} />,
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <select value={value} onChange={(e) => onValueChange?.(e.target.value)}>
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectValue: ({ children }: any) => <span>{children}</span>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

describe("ActivityFilterBar", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders filter title", () => {
    render(<ActivityFilterBar filters={{}} onChange={mockOnChange} />);
    expect(screen.getByText("Filter Activity Logs")).toBeInTheDocument();
  });

  it("does not show reset button when no filters active", () => {
    render(<ActivityFilterBar filters={{}} onChange={mockOnChange} />);
    expect(screen.queryByText("Reset Filters")).not.toBeInTheDocument();
  });

  it("shows reset button when filters are active", () => {
    render(<ActivityFilterBar filters={{ q: "react" }} onChange={mockOnChange} />);
    expect(screen.getByText("Reset Filters")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<ActivityFilterBar filters={{}} onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText("Search action details, target, IP...")).toBeInTheDocument();
  });

  it("renders action type select with options", () => {
    render(<ActivityFilterBar filters={{}} onChange={mockOnChange} />);
    const select = document.querySelector("select");
    expect(select).toBeInTheDocument();
  });

  it("renders target type select", () => {
    render(<ActivityFilterBar filters={{}} onChange={mockOnChange} />);
    const selects = document.querySelectorAll("select");
    expect(selects.length).toBeGreaterThanOrEqual(2);
  });

  it("renders date from input", () => {
    render(<ActivityFilterBar filters={{}} onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText("From")).toBeInTheDocument();
  });

  it("calls onChange when search input changes", () => {
    render(<ActivityFilterBar filters={{}} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText("Search action details, target, IP...");
    fireEvent.change(input, { target: { value: "note" } });
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ q: "note" }));
  });

  it("clears search when input is empty", () => {
    render(<ActivityFilterBar filters={{ q: "test" }} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText("Search action details, target, IP...");
    fireEvent.change(input, { target: { value: "" } });
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ q: undefined }));
  });

  it("calls onChange on reset filters", () => {
    render(<ActivityFilterBar filters={{ q: "test" }} onChange={mockOnChange} />);
    const resetBtn = screen.getByText("Reset Filters");
    fireEvent.click(resetBtn);
    expect(mockOnChange).toHaveBeenCalledWith({});
  });

  it("calls onChange when action filter changes", () => {
    render(<ActivityFilterBar filters={{}} onChange={mockOnChange} />);
    const select = document.querySelector("select");
    if (select) {
      fireEvent.change(select, { target: { value: "note.create" } });
    }
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("renders all action type options", () => {
    render(<ActivityFilterBar filters={{}} onChange={mockOnChange} />);
    expect(screen.getByText("All Actions")).toBeInTheDocument();
    expect(screen.getByText("Note Created")).toBeInTheDocument();
    expect(screen.getByText("Note Deleted")).toBeInTheDocument();
    expect(screen.getByText("Bundle Created")).toBeInTheDocument();
    expect(screen.getByText("Bundle Deleted")).toBeInTheDocument();
    expect(screen.getByText("Order Fulfilled")).toBeInTheDocument();
    expect(screen.getByText("Admin Login")).toBeInTheDocument();
  });

  it("renders target type options", () => {
    render(<ActivityFilterBar filters={{}} onChange={mockOnChange} />);
    expect(screen.getByText("All Targets")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Bundles")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
  });
});
