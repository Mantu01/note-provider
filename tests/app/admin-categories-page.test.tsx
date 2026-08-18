import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminCategoriesPage from "@/app/admin/(dashboard)/categories/page";

vi.mock("@/features/admin/components/categories/categories-table", () => ({
  CategoriesTable: () => <div data-testid="categories-table">Categories Table</div>,
}));

describe("AdminCategoriesPage", () => {
  it("renders CategoriesTable inside Suspense", () => {
    render(<AdminCategoriesPage />);
    expect(screen.getByTestId("categories-table")).toBeInTheDocument();
  });

  it("does not crash on render", () => {
    expect(() => render(<AdminCategoriesPage />)).not.toThrow();
  });
});
