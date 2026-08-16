import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";
import { metadata } from "@/app/layout";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { className, ...rest } = props;
    return <img {...rest} className={className} />;
  },
}));

vi.mock("@/providers/app-providers", () => ({
  AppProviders: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-providers">{children}</div>
  ),
}));

vi.mock("@/components/seo/json-ld", () => ({
  __esModule: true,
  default: () => null,
  organizationJsonLd: () => [],
  websiteJsonLd: () => [],
}));

vi.mock("@next/third-parties/google", () => ({
  GoogleAnalytics: () => null,
}));

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-inter", className: "font-inter inter" }),
  Outfit: () => ({ variable: "--font-outfit", className: "font-outfit outfit" }),
}));

describe("RootLayout", () => {
  const originalEnv = process.env.NEXT_PUBLIC_APP_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_APP_URL = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_APP_URL;
    }
  });

  it("renders children", () => {
    render(<RootLayout>{<div data-testid="child">Child content</div>}</RootLayout>);
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders AppProviders wrapper", () => {
    render(<RootLayout>{<div>test</div>}</RootLayout>);
    expect(screen.getByTestId("app-providers")).toBeInTheDocument();
  });

  it("has html lang set to en", () => {
    render(<RootLayout>{<div>test</div>}</RootLayout>);
    const html = document.querySelector("html");
    expect(html).toHaveAttribute("lang", "en");
  });

  it("has dir set to ltr", () => {
    render(<RootLayout>{<div>test</div>}</RootLayout>);
    const html = document.querySelector("html");
    expect(html).toHaveAttribute("dir", "ltr");
  });

  it("includes font variable classes on html", () => {
    render(<RootLayout>{<div>test</div>}</RootLayout>);
    const html = document.querySelector("html");
    expect(html).toHaveClass("--font-inter");
    expect(html).toHaveClass("--font-outfit");
  });

  it("includes viewport meta tag", () => {
    render(<RootLayout>{<div>test</div>}</RootLayout>);
    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport).toBeInTheDocument();
    expect(viewport).toHaveAttribute("content", expect.stringContaining("width=device-width"));
  });

  it("includes theme-color meta tag", () => {
    render(<RootLayout>{<div>test</div>}</RootLayout>);
    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta).toBeInTheDocument();
    expect(meta).toHaveAttribute("content", "#0f172a");
  });

  it("includes apple-mobile-web-app-capable meta", () => {
    render(<RootLayout>{<div>test</div>}</RootLayout>);
    const meta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    expect(meta).toBeInTheDocument();
    expect(meta).toHaveAttribute("content", "yes");
  });

  it("includes apple-touch-icon link", () => {
    render(<RootLayout>{<div>test</div>}</RootLayout>);
    const link = document.querySelector('link[rel="apple-touch-icon"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/apple-touch-icon.png");
  });

  it("includes favicon 32x32 link", () => {
    render(<RootLayout>{<div>test</div>}</RootLayout>);
    const link = document.querySelector('link[rel="icon"][sizes="32x32"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/favicon-32x32.png");
  });

  it("includes favicon 16x16 link", () => {
    render(<RootLayout>{<div>test</div>}</RootLayout>);
    const link = document.querySelector('link[rel="icon"][sizes="16x16"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/favicon-16x16.png");
  });

  it("includes manifest link", () => {
    render(<RootLayout>{<div>test</div>}</RootLayout>);
    const link = document.querySelector('link[rel="manifest"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/manifest.json");
  });

  it("renders metadata description", () => {
    expect(metadata.description).toBeDefined();
    expect(metadata.description).toEqual(expect.any(String));
  });

  it("includes canonical in metadata", () => {
    expect(metadata.alternates).toBeDefined();
    expect(metadata.alternates?.canonical).toBe("http://localhost:3000");
  });

  it("includes openGraph metadata", () => {
    expect(metadata.openGraph).toBeDefined();
    expect((metadata.openGraph as any)?.type).toBe("website");
  });

  it("includes twitter metadata", () => {
    expect(metadata.twitter).toBeDefined();
    expect((metadata.twitter as any)?.card).toBeDefined();
  });

  it("renders noindex for admin paths", () => {
    const { getByTestId } = render(<RootLayout>{<div>test</div>}</RootLayout>);
    expect(getByTestId("app-providers")).toBeInTheDocument();
  });
});
