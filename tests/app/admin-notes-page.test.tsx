import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminNotesPage from "@/app/admin/(dashboard)/notes/page";

vi.mock("@/features/admin/components/notes/notes-table", () => ({
  NotesTable: () => <div data-testid="notes-table">Notes Table</div>,
}));

describe("AdminNotesPage", () => {
  it("renders page title", () => {
    render(<AdminNotesPage />);
    expect(screen.getByText("Notes Catalogue")).toBeInTheDocument();
  });

  it("renders NotesTable inside Suspense", () => {
    render(<AdminNotesPage />);
    expect(screen.getByTestId("notes-table")).toBeInTheDocument();
  });

  it("renders top-level heading with text-3xl font-bold classes", () => {
    render(<AdminNotesPage />);
    const heading = document.querySelector("h1");
    expect(heading).toBeInTheDocument();
    expect(heading!.textContent).toBe("Notes Catalogue");
  });

  it("wraps content in space-y-6 container", () => {
    const { container } = render(<AdminNotesPage />);
    const wrapper = container.querySelector(".space-y-6");
    expect(wrapper).toBeInTheDocument();
  });

  it("does not crash on render", () => {
    expect(() => render(<AdminNotesPage />)).not.toThrow();
  });
});
