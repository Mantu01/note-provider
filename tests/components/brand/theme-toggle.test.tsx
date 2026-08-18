import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeToggle } from "@/components/brand/theme-toggle";

const mockUseTheme = vi.fn();

vi.mock("next-themes", () => ({
  __esModule: true,
  useTheme: (...args: any[]) => mockUseTheme(...args),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTheme.mockReturnValue({ theme: "dark", setTheme: vi.fn() });
  });

  it("renders a button", () => {
    render(<ThemeToggle />);
    expect(document.querySelector("button")).toBeInTheDocument();
  });

  it("toggles between light and dark themes", async () => {
    const setTheme = vi.fn();
    mockUseTheme.mockReturnValue({ theme: "dark", setTheme });
    render(<ThemeToggle />);
    const user = (await import("@testing-library/user-event")).userEvent;
    await user.click(document.querySelector("button")!);
    expect(setTheme).toHaveBeenCalled();
  });
});
