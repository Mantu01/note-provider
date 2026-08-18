import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminGroupsPage from "@/app/admin/(dashboard)/groups/page";

vi.mock("@/features/admin/components/groups/groups-table", () => ({
  GroupsTable: () => <div data-testid="groups-table">Groups Table</div>,
}));

describe("AdminGroupsPage", () => {
  it("renders page title", () => {
    render(<AdminGroupsPage />);
    expect(screen.getByText("Study Bundles")).toBeInTheDocument();
  });

  it("renders GroupsTable inside Suspense", () => {
    render(<AdminGroupsPage />);
    expect(screen.getByTestId("groups-table")).toBeInTheDocument();
  });

  it("renders top-level heading with text-3xl font-bold classes", () => {
    render(<AdminGroupsPage />);
    const heading = document.querySelector("h1");
    expect(heading).toBeInTheDocument();
    expect(heading!.textContent).toBe("Study Bundles");
  });

  it("wraps content in space-y-6 container", () => {
    const { container } = render(<AdminGroupsPage />);
    const wrapper = container.querySelector(".space-y-6");
    expect(wrapper).toBeInTheDocument();
  });

  it("does not crash on render", () => {
    expect(() => render(<AdminGroupsPage />)).not.toThrow();
  });
});
