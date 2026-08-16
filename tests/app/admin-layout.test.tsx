import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminLayout from "@/app/admin/(dashboard)/layout";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { className, ...rest } = props;
    return <img {...rest} className={className} />;
  },
}));

vi.mock("@/features/admin/components/admin-shell", () => ({
  AdminShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="admin-shell">{children}</div>
  ),
}));

describe("AdminLayout", () => {
  it("renders children inside AdminShell", () => {
    render(
      <AdminLayout>
        <main data-testid="children">Dashboard content</main>
      </AdminLayout>
    );
    expect(screen.getByTestId("children")).toBeInTheDocument();
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
  });

  it("wraps children with AdminShell", () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    );
    expect(screen.getByTestId("admin-shell")).toBeInTheDocument();
  });

  it("exports metadata with robots noindex", async () => {
    const mod = await import("@/app/admin/(dashboard)/layout");
    expect(mod.metadata).toBeDefined();
    expect((mod.metadata as any)?.robots).toBeDefined();
    expect((mod.metadata as any)?.robots?.index).toBe(false);
    expect((mod.metadata as any)?.robots?.follow).toBe(false);
  });
});
