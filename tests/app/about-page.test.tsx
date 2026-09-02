import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage from "@/app/(public)/about/page";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { className, ...rest } = props;
    return <img {...rest} className={className} />;
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => "/about"),
}));

vi.mock("@/components/layout/static-page", () => ({
  StaticPage: ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
    <div data-testid="static-page">
      <h1>{title}</h1>
      <p>{description}</p>
      <div data-testid="static-page-children">{children}</div>
    </div>
  ),
}));

vi.mock("@/lib/constants", () => ({
  APP_URL: "http://localhost:3000",
  BRAND: { name: "Notes Provider", description: "Test brand description" },
  ABOUT_VALUES: [
    { title: "Focused learning", text: "We curate the developer notes that help you learn faster." },
    { title: "Clear structure", text: "Every note is designed to reduce confusion." },
    { title: "Practical value", text: "Useful, readable content tailored to engineers." },
  ],
  SEO: { siteName: "Notes Provider", ogImageWidth: 1200, ogImageHeight: 630, twitterCard: "summary_large_image", locale: "en_IN" },
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/seo/json-ld", () => ({
  __esModule: true,
  default: () => null,
  webpageJsonLd: () => [],
}));

describe("AboutPage", () => {
  it("renders the about page title", () => {
    render(<AboutPage />);
    expect(screen.getByText("About us")).toBeInTheDocument();
  });

  it("renders brand description", () => {
    render(<AboutPage />);
    expect(screen.getByText(/Notes Provider exists to make clear/i)).toBeInTheDocument();
  });

  it("renders built for better learning heading", () => {
    render(<AboutPage />);
    expect(screen.getByText("Built for better learning")).toBeInTheDocument();
  });

  it("renders all about values", () => {
    render(<AboutPage />);
    expect(screen.getByText("Focused learning")).toBeInTheDocument();
    expect(screen.getByText("Clear structure")).toBeInTheDocument();
    expect(screen.getByText("Practical value")).toBeInTheDocument();
  });

  it("renders about value descriptions", () => {
    render(<AboutPage />);
    expect(screen.getByText(/we curate the developer notes that help you learn faster/i)).toBeInTheDocument();
    expect(screen.getByText(/every note is designed to reduce confusion/i)).toBeInTheDocument();
    expect(screen.getByText(/useful, readable content tailored to engineers/i)).toBeInTheDocument();
  });

  it("renders three value cards", () => {
    const { container } = render(<AboutPage />);
    const cards = container.querySelectorAll('[class*="rounded-2xl"]');
    expect(cards.length).toBe(3);
  });

  it("renders json-ld script without crash", () => {
    const { container } = render(<AboutPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
