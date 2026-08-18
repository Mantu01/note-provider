import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminActivitiesPage from "@/app/admin/(dashboard)/activities/page";

vi.mock("@/features/admin/components/activities/activities-table", () => ({
  ActivitiesTable: () => <div data-testid="activities-table">Activities Table</div>,
}));

describe("AdminActivitiesPage", () => {
  it("renders page title", () => {
    render(<AdminActivitiesPage />);
    expect(screen.getByText("Audit Activity Logs")).toBeInTheDocument();
  });

  it("renders page description", () => {
    render(<AdminActivitiesPage />);
    expect(screen.getByText(/Comprehensive tracking of all administrative actions/i)).toBeInTheDocument();
  });

  it("renders ActivitiesTable inside Suspense", () => {
    render(<AdminActivitiesPage />);
    expect(screen.getByTestId("activities-table")).toBeInTheDocument();
  });

  it("renders top-level heading with text-3xl font-bold classes", () => {
    render(<AdminActivitiesPage />);
    const heading = document.querySelector("h1");
    expect(heading).toBeInTheDocument();
    expect(heading!.textContent).toBe("Audit Activity Logs");
  });

  it("wraps content in space-y-6 container", () => {
    const { container } = render(<AdminActivitiesPage />);
    const wrapper = container.querySelector(".space-y-6");
    expect(wrapper).toBeInTheDocument();
  });
});
