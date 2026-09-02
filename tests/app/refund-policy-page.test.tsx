import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RefundPolicyPage from "@/app/(public)/refund-policy/page";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { className, ...rest } = props;
    return <img {...rest} className={className} />;
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => "/refund-policy"),
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
  SEO: { siteName: "Notes Provider", contactEmail: "support@notesprovider.com", ogImageWidth: 1200, ogImageHeight: 630, twitterCard: "summary_large_image", locale: "en_IN" },
  REFUND_POLICY_SECTIONS: [
    { id: "item-1", title: "1. Digital Goods Policy", content: "Due to the digital nature of the products sold, all sales are non-refundable once the digital material has been delivered." },
    { id: "item-2", title: "2. Previewing Before Purchase", content: "To ensure complete satisfaction before making a payment, every paid note features a downloadable Preview PDF." },
    { id: "item-3", title: "3. Non-Delivery & Exceptional Assistance", content: "If you have not received your study notes within 6 hours of payment confirmation, please check your delivery channels." },
    { id: "item-4", title: "4. How to Request Assistance", content: "Contact our support team with your order number if you experience any issues." },
  ],
}));

vi.mock("@/components/seo/json-ld", () => ({
  __esModule: true,
  default: () => null,
  webpageJsonLd: () => [],
}));

describe("RefundPolicyPage", () => {
  it("renders page title", () => {
    render(<RefundPolicyPage />);
    expect(screen.getByText("Refund Policy")).toBeInTheDocument();
  });

  it("renders refund description", () => {
    render(<RefundPolicyPage />);
    expect(screen.getByText(/Please review our refund and delivery policy/i)).toBeInTheDocument();
  });

  it("renders all refund sections", () => {
    render(<RefundPolicyPage />);
    expect(screen.getByText("1. Digital Goods Policy")).toBeInTheDocument();
    expect(screen.getByText("2. Previewing Before Purchase")).toBeInTheDocument();
    expect(screen.getByText("3. Non-Delivery & Exceptional Assistance")).toBeInTheDocument();
    expect(screen.getByText("4. How to Request Assistance")).toBeInTheDocument();
  });

  it("renders four accordion items", () => {
    const { container } = render(<RefundPolicyPage />);
    const items = container.querySelectorAll('[data-slot="accordion-item"]');
    expect(items.length).toBe(4);
  });
});
