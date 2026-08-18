import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NewGroupPage from "@/app/admin/(dashboard)/groups/new/page";

vi.mock("@/features/admin/components/groups/group-form", () => ({
  GroupForm: () => <div data-testid="group-form">Group Form</div>,
}));

describe("NewGroupPage", () => {
  it("renders GroupForm inside Suspense", () => {
    render(<NewGroupPage />);
    expect(screen.getByTestId("group-form")).toBeInTheDocument();
  });

  it("does not crash on render", () => {
    expect(() => render(<NewGroupPage />)).not.toThrow();
  });
});
