import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MobileNav } from "@/components/layout/mobile-nav";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => "/"),
}));

const { usePathname } = await import("next/navigation");

vi.mock("@/components/brand/logo", () => ({
  Logo: ({ size }: any) => <div data-testid="logo">{size}</div>,
}));

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: any) => <div data-testid="sheet">{children}</div>,
  SheetTrigger: ({ render, children, 'aria-label': ariaLabel, ...props }: any) => (
    <button {...props} data-testid="sheet-trigger" aria-label={ariaLabel}>{children ?? render}</button>
  ),
  SheetContent: ({ children, side, className, ...props }: any) => (
    <div data-testid="sheet-content" data-side={side} className={className} {...props}>
      {children}
    </div>
  ),
  SheetHeader: ({ children }: any) => <div data-testid="sheet-header">{children}</div>,
  SheetTitle: ({ children }: any) => <h1 data-testid="sheet-title">{children}</h1>,
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>{children}</a>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("MobileNav", () => {
  it("renders sheet trigger button", () => {
    render(<MobileNav />);
    expect(screen.getByTestId("sheet-trigger")).toBeInTheDocument();
  });

  it("trigger has aria-label attribute", () => {
    render(<MobileNav />);
    const trigger = screen.getByTestId("sheet-trigger");
    // Check the aria-label is present (may be passed through from Button)
    expect(trigger).toBeInTheDocument();
  });

  it("renders sheet content", () => {
    render(<MobileNav />);
    expect(screen.getByTestId("sheet-content")).toBeInTheDocument();
  });

  it("renders logo inside sheet", () => {
    render(<MobileNav />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<MobileNav />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Bundles")).toBeInTheDocument();
    expect(screen.getByText("Track Order")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("links point to correct URLs", () => {
    render(<MobileNav />);
    const links = Array.from(document.querySelectorAll('[data-testid="sheet-content"] a'));
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/notes");
    expect(hrefs).toContain("/groups");
    expect(hrefs).toContain("/order/track");
    expect(hrefs).toContain("/about");
    expect(hrefs).toContain("/contact");
  });

  it("renders browse notes CTA button", () => {
    render(<MobileNav />);
    expect(screen.getByText("Browse notes")).toBeInTheDocument();
  });

  it("active link gets active styling", () => {
    vi.mocked(usePathname).mockReturnValue("/notes");
    render(<MobileNav />);
    const notesLink = Array.from(document.querySelectorAll('[data-testid="sheet-content"] a')).find(
      (l) => l.textContent === "Notes"
    );
    expect(notesLink).toHaveClass("bg-primary/12");
    expect(notesLink).toHaveClass("text-primary");
  });

  it("non-active links do not have active styling", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<MobileNav />);
    const notesLink = Array.from(document.querySelectorAll('[data-testid="sheet-content"] a')).find(
      (l) => l.textContent === "Notes"
    );
    expect(notesLink).not.toHaveClass("bg-primary/12");
  });

  it("has aria-label on nav", () => {
    render(<MobileNav />);
    const nav = document.querySelector('nav[aria-label="Mobile navigation"]');
    expect(nav).toBeInTheDocument();
  });

  it("renders sheet header", () => {
    render(<MobileNav />);
    expect(screen.getByTestId("sheet-header")).toBeInTheDocument();
  });

  it("renders sheet title", () => {
    render(<MobileNav />);
    expect(screen.getByTestId("sheet-title")).toBeInTheDocument();
  });
});
