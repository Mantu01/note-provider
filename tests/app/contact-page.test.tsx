import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactPage from "@/app/(public)/contact/page";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { className, ...rest } = props;
    return <img {...rest} className={className} />;
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => "/contact"),
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

vi.mock("@/components/layout/static-page", () => ({
  StaticPage: ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
    <div data-testid="static-page">
      <h1>{title}</h1>
      <p>{description}</p>
      <div data-testid="sc">{children}</div>
    </div>
  ),
}));

vi.mock("@/lib/constants", () => ({
  APP_URL: "http://localhost:3000",
  SEO: {
    siteName: "Notes Provider",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterCard: "summary_large_image",
    locale: "en_IN",
    countryName: "India",
    contactEmail: "support@notesprovider.com",
  },
  CONTACT_CHANNELS: [
    { title: "X (Twitter)", description: "Quick updates, support replies, and announcements.", href: "https://x.com", icon: "MessageSquareText", label: "Follow on X" },
    { title: "GitHub", description: "Code references, resources, and project-driven learning material.", href: "https://github.com", icon: "Code2", label: "Explore GitHub" },
    { title: "Email", description: "For order help, delivery questions, and support requests.", href: "mailto:support@notesprovider.com", icon: "Mail", label: "Send an email" },
  ],
}));

const mockIcons: Record<string, React.FC<{ className?: string }>> = {
  MessageSquareText: ({ className }) => <span className={className} data-testid="icon-ms">MS</span>,
  Code2: ({ className }) => <span className={className} data-testid="icon-c2">C2</span>,
  Mail: ({ className }) => <span className={className} data-testid="icon-m">M</span>,
};

vi.mock("@/components/ui/button", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/ui/button")>();
  return {
    ...actual,
    Button: ({ children, variant, className, onClick, render: RenderComponent }: any) => {
      if (RenderComponent) {
        return <a href={RenderComponent.props?.href || "#"} className={className}>{children}</a>;
      }
      return <button className={className} onClick={onClick}>{children}</button>;
    },
  };
});

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/seo/json-ld", () => ({
  __esModule: true,
  default: () => null,
  webpageJsonLd: () => [],
}));

describe("ContactPage", () => {
  it("renders contact title", () => {
    render(<ContactPage />);
    expect(screen.getByText("Contact Support")).toBeInTheDocument();
  });

  it("renders contact description", () => {
    render(<ContactPage />);
    expect(screen.getByText(/Need help with a note, preview, or delivery/i)).toBeInTheDocument();
  });

  it("renders all contact channels", () => {
    render(<ContactPage />);
    expect(screen.getByText("X (Twitter)")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders action labels for each channel", () => {
    render(<ContactPage />);
    expect(screen.getByText(/Follow on X/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore GitHub/i)).toBeInTheDocument();
    expect(screen.getByText(/Send an email/i)).toBeInTheDocument();
  });

  it("renders note delivery info", () => {
    render(<ContactPage />);
    expect(screen.getByText("Instant note delivery")).toBeInTheDocument();
    expect(screen.getByText(/Paid orders are fulfilled automatically/i)).toBeInTheDocument();
  });

  it("renders FAQ guidance section", () => {
    render(<ContactPage />);
    expect(screen.getByText("Preview before you buy")).toBeInTheDocument();
    expect(screen.getByText(/Browse our FAQ for common questions/i)).toBeInTheDocument();
  });

  it("has link to home page present", () => {
    render(<ContactPage />);
    expect(screen.getByText(/Visit home page/)).toBeInTheDocument();
  });
});
