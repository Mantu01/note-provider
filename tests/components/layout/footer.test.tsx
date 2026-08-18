import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/footer";
import * as constants from "@/lib/constants";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => "/"),
}));

vi.mock("@/components/brand/logo", () => ({
  Logo: ({ size }: { size?: string }) => <div data-testid="logo">{size}</div>,
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(constants, "BRAND", "get").mockReturnValue({
    name: "Notes Provider",
    tagline: "Developer notes that actually help you build.",
    description: "Curated coding notes for web development, DSA, DBMS, backend, frontend, system design, and interview prep.",
  });
});

describe("Footer", () => {
  it("renders footer element", () => {
    render(<Footer />);
    expect(document.querySelector("footer")).toBeInTheDocument();
  });

  it("renders logo", () => {
    render(<Footer />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("renders brand tagline", () => {
    render(<Footer />);
    expect(screen.getByText("Developer notes that actually help you build.")).toBeInTheDocument();
  });

  it("renders Explore section links", () => {
    render(<Footer />);
    expect(screen.getByText("All Notes")).toBeInTheDocument();
    expect(screen.getByText("Bundles")).toBeInTheDocument();
    expect(screen.getByText("Free Notes")).toBeInTheDocument();
  });

  it("renders Company section links", () => {
    render(<Footer />);
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
  });

  it("renders Legal section links", () => {
    render(<Footer />);
    expect(screen.getByText("Terms")).toBeInTheDocument();
    expect(screen.getByText("Privacy")).toBeInTheDocument();
    expect(screen.getByText("Refunds")).toBeInTheDocument();
  });

  it("links point to correct URLs", () => {
    render(<Footer />);
    const links = Array.from(document.querySelectorAll("a"));
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/notes");
    expect(hrefs).toContain("/groups");
    expect(hrefs).toContain("/notes?pricing=free");
    expect(hrefs).toContain("/about");
    expect(hrefs).toContain("/contact");
    expect(hrefs).toContain("/terms");
    expect(hrefs).toContain("/privacy");
    expect(hrefs).toContain("/refund-policy");
  });

  it("renders social links", () => {
    render(<Footer />);
    expect(screen.getByLabelText("X")).toBeInTheDocument();
    expect(screen.getByLabelText("YouTube")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("social links have correct hrefs", () => {
    render(<Footer />);
    const xLink = screen.getByLabelText("X");
    const ytLink = screen.getByLabelText("YouTube");
    const mailLink = screen.getByLabelText("Email");
    expect(xLink).toHaveAttribute("href", "https://x.com");
    expect(ytLink).toHaveAttribute("href", "https://youtube.com");
    expect(mailLink).toHaveAttribute("href", "mailto:support@notesprovider.com");
  });

  it("external social links open in new tab", () => {
    render(<Footer />);
    const xLink = screen.getByLabelText("X");
    expect(xLink).toHaveAttribute("target", "_blank");
    expect(xLink).toHaveAttribute("rel", "noreferrer");
  });

  it("renders copyright with current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });

  it("is accessible", () => {
    render(<Footer />);
    const footer = document.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });
});
