import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TermsPage from "@/app/(public)/terms/page";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { className, ...rest } = props;
    return <img {...rest} className={className} />;
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => "/terms"),
}));

vi.mock("@/components/layout/static-page", () => ({
  StaticPage: ({ title, description, children }: any) => (
    <div data-testid="sp">
      <h1>{title}</h1>
      <p>{description}</p>
      <div data-testid="spc">{children}</div>
    </div>
  ),
}));

vi.mock("@/lib/constants", () => ({
  APP_URL: "http://localhost:3000",
  BRAND: { name: "Notes Provider" },
  SEO: { siteName: "Notes Provider", ogImageWidth: 1200, ogImageHeight: 630, twitterCard: "summary_large_image", locale: "en_IN" },
  TERMS_OF_SERVICE_SECTIONS: [
    { id: "item-1", title: "1. General Agreement", content: "By accessing our services you agree to these terms." },
    { id: "item-2", title: "2. Personal Use Only", content: "Our study notes are for personal use only." },
    { id: "item-3", title: "3. Final Sales & Termination", content: "All sales are final unless otherwise stated." },
  ],
}));

vi.mock("@/components/seo/json-ld", () => ({
  __esModule: true,
  default: () => null,
  webpageJsonLd: () => [],
}));

describe("TermsPage", () => {
  it("renders page title", () => {
    render(<TermsPage />);
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
  });

  it("renders all terms sections", () => {
    render(<TermsPage />);
    expect(screen.getByText("1. General Agreement")).toBeInTheDocument();
    expect(screen.getByText("2. Personal Use Only")).toBeInTheDocument();
    expect(screen.getByText("3. Final Sales & Termination")).toBeInTheDocument();
  });

  it("renders three accordion items", () => {
    const { container } = render(<TermsPage />);
    const items = container.querySelectorAll('[data-slot="accordion-item"]');
    expect(items.length).toBe(3);
  });
});
