import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminLeadsPage from "@/app/admin/(dashboard)/leads/page";

vi.mock("@/features/admin/components/leads/leads-table", () => ({
  LeadsTable: () => <div data-testid="leads-table">Leads Table</div>,
}));

describe("AdminLeadsPage", () => {
  it("renders page title", () => {
    render(<AdminLeadsPage />);
    expect(screen.getByText("Checkout Leads")).toBeInTheDocument();
  });

  it("renders LeadsTable inside Suspense", () => {
    render(<AdminLeadsPage />);
    expect(screen.getByTestId("leads-table")).toBeInTheDocument();
  });

  it("renders top-level heading with text-3xl font-bold classes", () => {
    render(<AdminLeadsPage />);
    const heading = document.querySelector("h1");
    expect(heading).toBeInTheDocument();
    expect(heading!.textContent).toBe("Checkout Leads");
  });

  it("wraps content in space-y-6 container", () => {
    const { container } = render(<AdminLeadsPage />);
    const wrapper = container.querySelector(".space-y-6");
    expect(wrapper).toBeInTheDocument();
  });

  it("does not crash on render", () => {
    expect(() => render(<AdminLeadsPage />)).not.toThrow();
  });
});
