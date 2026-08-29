import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "@/components/layout/navbar";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => "/"),
}));

const { usePathname } = await import("next/navigation");

vi.mock("@/components/brand/logo", () => ({
  Logo: ({ variant, size }: any) => (
    <div data-testid="logo" data-variant={variant} data-size={size} />
  ),
}));

vi.mock("@/components/brand/theme-toggle", () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>,
}));

vi.mock("@/lib/constants", () => ({
  BRAND: { name: "Notes Provider", tagline: "Test", description: "Test desc" },
}));

vi.mock("@/components/layout/mobile-nav", () => ({
  MobileNav: () => <div data-testid="mobile-nav" />,
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>{children}</a>
  ),
}));

describe("Navbar", () => {
  it("renders navbar header", () => {
    render(<Navbar />);
    expect(document.querySelector("header")).toBeInTheDocument();
  });

  it("renders logo with icon variant", () => {
    render(<Navbar />);
    expect(screen.getByTestId("logo")).toHaveAttribute("data-variant", "icon");
    expect(screen.getByTestId("logo")).toHaveAttribute("data-size", "sm");
  });

  it("renders brand name", () => {
    render(<Navbar />);
    expect(screen.getByText("Notes Provider")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Bundles")).toBeInTheDocument();
    expect(screen.getByText("Track Order")).toBeInTheDocument();
  });

  it("link hrefs are correct", () => {
    render(<Navbar />);
    const links = Array.from(document.querySelectorAll("nav a"));
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/notes");
    expect(hrefs).toContain("/groups");
    expect(hrefs).toContain("/order/track");
  });

  it("renders search button", () => {
    render(<Navbar />);
    expect(screen.getByLabelText("Search notes (Ctrl+K)")).toBeInTheDocument();
  });

  it("renders theme toggle", () => {
    render(<Navbar />);
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("renders mobile nav", () => {
    render(<Navbar />);
    expect(screen.getByTestId("mobile-nav")).toBeInTheDocument();
  });

  it("marks home link as active when on home page", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<Navbar />);
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveClass("bg-primary/12");
    expect(homeLink).toHaveClass("text-primary");
  });

  it("marks notes link as active when on notes page", () => {
    vi.mocked(usePathname).mockReturnValue("/notes");
    render(<Navbar />);
    const notesLink = screen.getByText("Notes").closest("a");
    expect(notesLink).toHaveClass("bg-primary/12");
  });

  it("does not render on admin paths", () => {
    vi.mocked(usePathname).mockReturnValue("/admin/dashboard");
    render(<Navbar />);
    expect(document.querySelector("header")).not.toBeInTheDocument();
  });

  it("has aria-label on nav element", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<Navbar />);
    const header = document.querySelector("header");
    expect(header).toBeInTheDocument();
    const nav = header?.querySelector("nav");
    expect(nav).toHaveAttribute("aria-label", "Primary navigation");
  });
});
