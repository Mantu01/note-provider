import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import EditGroupPage from "@/app/admin/(dashboard)/groups/[id]/edit/page";

vi.mock("@/features/admin/api/use-admin-groups", () => ({
  useAdminGroup: vi.fn(() => ({ data: { id: "1", name: "Test Group" }, isLoading: false })),
}));

vi.mock("@/features/admin/components/groups/group-form", () => ({
  GroupForm: ({ initialData }: { initialData?: any }) => (
    <div data-testid="group-form">
      <span>Editing: {initialData?.name || "new"}</span>
    </div>
  ),
}));

vi.mock("@/components/shared/error-state", () => ({
  ErrorState: ({ message }: { message: string }) => (
    <div data-testid="error-state">{message}</div>
  ),
}));

describe("EditGroupPage", () => {
  it("renders GroupForm with initial data", async () => {
    await act(async () => {
      render(<EditGroupPage params={Promise.resolve({ id: "test-id" })} />);
    });
    await waitFor(() => {
      const form = document.querySelector('[data-testid="group-form"]');
      expect(form).toBeInTheDocument();
    });
  });

  it("does not crash on render", () => {
    expect(() => render(<EditGroupPage params={Promise.resolve({ id: "test-id" })} />)).not.toThrow();
  });
});
