import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NewNotePage from "@/app/admin/(dashboard)/notes/new/page";

vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    return function DynamicComponent() {
      return <div data-testid="note-form">Note Form</div>;
    };
  },
}));

describe("NewNotePage", () => {
  it("renders NoteForm inside Suspense", () => {
    render(<NewNotePage />);
    expect(screen.getByTestId("note-form")).toBeInTheDocument();
  });

  it("does not crash on render", () => {
    expect(() => render(<NewNotePage />)).not.toThrow();
  });
});
