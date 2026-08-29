import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminLoginPage from "@/app/admin/login/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

vi.mock("@/providers/app-providers", () => ({
  QueryProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/features/admin/api/use-admin-auth", () => ({
  useAdminLogin: vi.fn(() => ({ mutate: vi.fn(), isPending: false, error: null })),
}));

describe("AdminLoginPage", () => {
  it("renders admin login form", () => {
    render(<AdminLoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders back to homepage link", () => {
    render(<AdminLoginPage />);
    expect(screen.getByText(/back to homepage/i)).toBeInTheDocument();
  });

  it("disables submit when form is invalid", () => {
    render(<AdminLoginPage />);
    const btn = screen.getByRole("button", { name: /sign in/i });
    expect(btn).toBeDisabled();
  });
});
