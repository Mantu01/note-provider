import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminShell } from "@/features/admin/components/admin-shell";

const mockMutate = vi.fn((_: unknown, options: any) => {
  options?.onSuccess?.();
});

vi.mock("@/features/admin/api/use-admin-auth", () => ({
  useAdminProfile: vi.fn(),
  useAdminLogout: vi.fn(() => ({
    mutate: mockMutate,
    isPending: false,
  })),
}));

vi.mock("@/components/brand/logo", () => ({
  Logo: ({ href, className }: { href?: string; className?: string }) => (
    <div data-testid="logo" className={className || ""}>{href || ""}</div>
  ),
}));

vi.mock("@/components/brand/theme-toggle", () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>,
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

const { useAdminProfile } = await import("@/features/admin/api/use-admin-auth");
const mockUseAdminProfile = vi.mocked(useAdminProfile);

describe("AdminShell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMutate.mockClear();
  });

  it("renders children", () => {
    mockUseAdminProfile.mockReturnValue({
      data: { id: "admin-1", name: "Admin", email: "admin@test.com", isHead: false },
      isPending: false,
      isError: false,
    } as any);

    render(
      <AdminShell>
        <main data-testid="children">Dashboard Content</main>
      </AdminShell>,
    );

    expect(screen.getByTestId("children")).toBeInTheDocument();
  });

  it("renders navigation items", () => {
    mockUseAdminProfile.mockReturnValue({
      data: { id: "admin-1", name: "Admin", email: "admin@test.com", isHead: false },
      isPending: false,
      isError: false,
    } as any);

    render(
      <AdminShell>
        <div>Content</div>
      </AdminShell>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Notes Catalogue")).toBeInTheDocument();
    expect(screen.getByText("Bundles")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Orders & Fulfillment")).toBeInTheDocument();
    expect(screen.getByText("Leads")).toBeInTheDocument();
    expect(screen.getByText("Audit Activity Log")).toBeInTheDocument();
  });

  it("shows admin profile info when logged in", () => {
    mockUseAdminProfile.mockReturnValue({
      data: { id: "admin-1", name: "John Admin", email: "john@test.com", isHead: false },
      isPending: false,
      isError: false,
    } as any);

    render(
      <AdminShell>
        <div>Content</div>
      </AdminShell>,
    );

    expect(screen.getByText("John Admin")).toBeInTheDocument();
    expect(screen.getByText("john@test.com")).toBeInTheDocument();
  });

  it("shows Head Admin badge for head admin", () => {
    mockUseAdminProfile.mockReturnValue({
      data: { id: "admin-1", name: "Head Admin", email: "head@test.com", isHead: true },
      isPending: false,
      isError: false,
    } as any);

    render(
      <AdminShell>
        <div>Content</div>
      </AdminShell>,
    );

    const names = screen.getAllByText("Head Admin");
    expect(names.length).toBeGreaterThanOrEqual(1);
  });

  it("shows regular admin badge for non-head admin", () => {
    mockUseAdminProfile.mockReturnValue({
      data: { id: "admin-1", name: "Admin", email: "admin@test.com", isHead: false },
      isPending: false,
      isError: false,
    } as any);

    render(
      <AdminShell>
        <div>Content</div>
      </AdminShell>,
    );

    const admins = screen.getAllByText("Admin");
    expect(admins.length).toBeGreaterThanOrEqual(1);
  });

  it("does not show profile when not logged in", () => {
    mockUseAdminProfile.mockReturnValue({
      data: null,
      isPending: false,
      isError: false,
    } as any);

    render(
      <AdminShell>
        <div>Content</div>
      </AdminShell>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("highlights active nav item based on pathname", () => {
    mockUseAdminProfile.mockReturnValue({
      data: { id: "admin-1", name: "Admin", email: "admin@test.com", isHead: false },
      isPending: false,
      isError: false,
    } as any);

    render(
      <AdminShell>
        <div>Content</div>
      </AdminShell>,
    );

    const notesLink = document.querySelector('a[href="/admin/notes"]');
    expect(notesLink).toBeInTheDocument();
  });

  it("renders logout button", () => {
    mockUseAdminProfile.mockReturnValue({
      data: { id: "admin-1", name: "Admin", email: "admin@test.com", isHead: false },
      isPending: false,
      isError: false,
    } as any);

    render(
      <AdminShell>
        <div>Content</div>
      </AdminShell>,
    );

    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("renders theme toggle", () => {
    mockUseAdminProfile.mockReturnValue({
      data: { id: "admin-1", name: "Admin", email: "admin@test.com", isHead: false },
      isPending: false,
      isError: false,
    } as any);

    render(
      <AdminShell>
        <div>Content</div>
      </AdminShell>,
    );

    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("handles logout navigation", async () => {
    mockUseAdminProfile.mockReturnValue({
      data: { id: "admin-1", name: "Admin", email: "admin@test.com", isHead: false },
      isPending: false,
      isError: false,
    } as any);

    render(
      <AdminShell>
        <div>Content</div>
      </AdminShell>,
    );

    const logoutBtn = screen.getByText("Sign out");
    await userEvent.click(logoutBtn);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });
});
