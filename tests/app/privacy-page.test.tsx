import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacyPage from "@/app/(public)/privacy/page";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { className, ...rest } = props;
    return <img {...rest} className={className} />;
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => "/privacy"),
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
  BRAND: { name: "Notes Provider" },
  SEO: { siteName: "Notes Provider", ogImageWidth: 1200, ogImageHeight: 630, twitterCard: "summary_large_image" },
  PRIVACY_POLICY_SECTIONS: [
    { id: "item-1", title: "1. Information Collection", content: "We take your privacy seriously. This policy describes how we collect and protect your information." },
    { id: "item-2", title: "2. Use of Information", content: "We use this information to process transactions and respond to requests." },
    { id: "item-3", title: "3. Data Sharing", content: "We do not sell your personal information to third parties." },
  ],
}));

vi.mock("@/components/seo/json-ld", () => ({
  __esModule: true,
  default: () => null,
  webpageJsonLd: () => [],
}));

describe("PrivacyPage", () => {
  it("renders page title", () => {
    render(<PrivacyPage />);
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });

  it("renders privacy sections", () => {
    render(<PrivacyPage />);
    expect(screen.getByText("1. Information Collection")).toBeInTheDocument();
    expect(screen.getByText("2. Use of Information")).toBeInTheDocument();
    expect(screen.getByText("3. Data Sharing")).toBeInTheDocument();
  });

  it("renders section content", () => {
    const { container } = render(<PrivacyPage />);
    const text = container.textContent || "";
    expect(text).toContain("Your privacy is paramount");
    expect(text).toContain("Information Collection");
    expect(text).toContain("Use of Information");
    expect(text).toContain("Data Sharing");
  });

  it("renders three accordion items", () => {
    const { container } = render(<PrivacyPage />);
    const items = container.querySelectorAll('[data-slot="accordion-item"]');
    expect(items.length).toBe(3);
  });
});
