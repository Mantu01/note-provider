import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import JsonLd, {
  organizationJsonLd,
  websiteJsonLd,
  breadcrumbJsonLd,
  productJsonLd,
  courseJsonLd,
  reviewJsonLd,
  faqJsonLd,
  howToJsonLd,
  webpageJsonLd,
  collectionPageJsonLd,
  articleJsonLd,
} from "@/components/seo/json-ld";

function countJsonLdScripts() {
  return document.querySelectorAll('script[type="application/ld+json"]').length;
}

function clearJsonLdScripts() {
  document.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove());
}

describe("JsonLd component", () => {
  beforeEach(() => {
    vi.stubGlobal("process", {
      env: { NEXT_PUBLIC_APP_URL: "https://notesprovider.com" },
    });
    clearJsonLdScripts();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearJsonLdScripts();
  });

  it("renders Script tags for each script", () => {
    const scripts = [
      { "@context": "https://schema.org", "@type": "Organization", name: "Test Org" },
    ];
    render(<JsonLd scripts={scripts} />);
    expect(countJsonLdScripts()).toBe(1);
  });

  it("renders multiple Script tags for multiple scripts", () => {
    const scripts = [
      { "@context": "https://schema.org", "@type": "Organization", name: "Org 1" },
      { "@context": "https://schema.org", "@type": "Website", name: "Site 1" },
    ];
    render(<JsonLd scripts={scripts} />);
    expect(countJsonLdScripts()).toBe(2);
  });

  it("handles nested array of scripts", () => {
    const scripts = [
      [
        { "@context": "https://schema.org", "@type": "Organization", name: "Org 1" },
      ],
      [
        { "@context": "https://schema.org", "@type": "Website", name: "Site 1" },
      ],
    ];
    render(<JsonLd scripts={scripts} />);
    expect(countJsonLdScripts()).toBe(2);
  });

  it("filters out invalid scripts without @context", () => {
    const scripts = [
      { "@context": "https://schema.org", "@type": "Organization", name: "Valid" },
      null as unknown as { "@context": string; "@type": string; name: string },
      "invalid" as unknown as { "@context": string; "@type": string; name: string },
    ];
    render(<JsonLd scripts={scripts} />);
    expect(countJsonLdScripts()).toBe(1);
  });

  it("renders empty when no scripts provided", () => {
    render(<JsonLd scripts={[]} />);
    expect(countJsonLdScripts()).toBe(0);
  });

  it("renders valid JSON-LD in script content", () => {
    const scriptData = { "@context": "https://schema.org", "@type": "Organization", name: "Test" };
    render(<JsonLd scripts={[scriptData]} />);
    const scriptsEl = document.querySelectorAll('script[type="application/ld+json"]');
    const content = JSON.parse(scriptsEl[0].textContent ?? "");
    expect(content).toEqual(scriptData);
  });
});

describe("organizationJsonLd factory", () => {
  beforeEach(() => {
    vi.stubGlobal("process", {
      env: { NEXT_PUBLIC_APP_URL: "https://notesprovider.com" },
    });
    clearJsonLdScripts();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearJsonLdScripts();
  });

  it("returns an array with one Organization script", () => {
    const result = organizationJsonLd();
    expect(result).toHaveLength(1);
    expect((result[0] as any)["@type"]).toBe("Organization");
  });

  it("includes correct name and url", () => {
    const result = organizationJsonLd();
    expect((result[0] as any).name).toBe("Notes Provider");
    expect((result[0] as any).url).toBe("https://notesprovider.com");
  });

  it("includes contactPoint with email", () => {
    const result = organizationJsonLd();
    expect((result[0] as any).contactPoint.email).toBe("support@notesprovider.com");
    expect((result[0] as any).contactPoint.contactType).toBe("customer service");
  });
});

describe("websiteJsonLd factory", () => {
  beforeEach(() => {
    vi.stubGlobal("process", {
      env: { NEXT_PUBLIC_APP_URL: "https://notesprovider.com" },
    });
    clearJsonLdScripts();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearJsonLdScripts();
  });

  it("returns an array with one Website script", () => {
    const result = websiteJsonLd();
    expect(result).toHaveLength(1);
    expect((result[0] as any)["@type"]).toBe("WebSite");
  });

  it("includes SearchAction", () => {
    const result = websiteJsonLd();
    expect((result[0] as any).potentialAction["@type"]).toBe("SearchAction");
    expect((result[0] as any).potentialAction.target).toContain("/notes?q=");
  });
});

describe("breadcrumbJsonLd factory", () => {
  beforeEach(() => {
    vi.stubGlobal("process", {
      env: { NEXT_PUBLIC_APP_URL: "https://notesprovider.com" },
    });
    clearJsonLdScripts();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearJsonLdScripts();
  });

  it("returns BreadcrumbList with correct structure", () => {
    const result = breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Notes", url: "/notes" },
    ]);
    expect(result).toHaveLength(1);
    expect((result[0] as any)["@type"]).toBe("BreadcrumbList");
    expect((result[0] as any).itemListElement).toHaveLength(2);
  });

  it("prepends app URL to relative URLs", () => {
    const result = breadcrumbJsonLd([{ name: "Notes", url: "/notes" }]);
    expect((result[0] as any).itemListElement[0].item).toBe("https://notesprovider.com/notes");
  });

  it("does not prepend URL to absolute URLs", () => {
    const result = breadcrumbJsonLd([{ name: "External", url: "https://example.com" }]);
    expect((result[0] as any).itemListElement[0].item).toBe("https://example.com");
  });
});

describe("productJsonLd factory", () => {
  beforeEach(() => {
    vi.stubGlobal("process", {
      env: { NEXT_PUBLIC_APP_URL: "https://notesprovider.com" },
    });
    clearJsonLdScripts();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearJsonLdScripts();
  });

  it("returns Product script with correct fields", () => {
    const result = productJsonLd({
      title: "React Notes",
      description: "React study notes",
      price: 29900,
      priceLabel: "₹299",
      currency: "INR",
      imageUrl: null,
      category: { name: "Frontend" },
      level: "intermediate",
      pageCount: 50,
      url: "/notes/react",
    });
    expect(result).toHaveLength(1);
    expect((result[0] as any)["@type"]).toBe("Product");
    expect((result[0] as any).name).toBe("React Notes");
    expect((result[0] as any).offers.price).toBe(29900);
    expect((result[0] as any).offers.priceCurrency).toBe("INR");
  });

  it("includes aggregateRating when provided", () => {
    const result = productJsonLd({
      title: "React Notes",
      description: "React study notes",
      price: 29900,
      priceLabel: "₹299",
      currency: "INR",
      imageUrl: null,
      category: { name: "Frontend" },
      level: "intermediate",
      pageCount: 50,
      url: "/notes/react",
      ratingValue: 4.5,
      ratingCount: 100,
    });
    expect((result[0] as any).aggregateRating.ratingValue).toBe(4.5);
    expect((result[0] as any).aggregateRating.reviewCount).toBe(100);
  });

  it("omits aggregateRating when not provided", () => {
    const result = productJsonLd({
      title: "React Notes",
      description: "React study notes",
      price: 29900,
      priceLabel: "₹299",
      currency: "INR",
      imageUrl: null,
      category: { name: "Frontend" },
      level: "intermediate",
      pageCount: null,
      url: "/notes/react",
    });
    expect((result[0] as any).aggregateRating).toBeUndefined();
  });
});

describe("courseJsonLd factory", () => {
  beforeEach(() => {
    vi.stubGlobal("process", {
      env: { NEXT_PUBLIC_APP_URL: "https://notesprovider.com" },
    });
    clearJsonLdScripts();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearJsonLdScripts();
  });

  it("returns Course script with correct fields", () => {
    const result = courseJsonLd({
      title: "React Course",
      description: "Learn React",
      url: "/course/react",
      category: { name: "Frontend" },
      level: "basics",
      imageUrl: null,
    });
    expect(result).toHaveLength(1);
    expect((result[0] as any)["@type"]).toBe("Course");
    expect((result[0] as any).educationalLevel).toBe("Beginner");
  });

  it("maps intermediate level to Intermediate", () => {
    const result = courseJsonLd({
      title: "React Course",
      description: "Learn React",
      url: "/course/react",
      category: { name: "Frontend" },
      level: "intermediate",
      imageUrl: null,
    });
    expect((result[0] as any).educationalLevel).toBe("Intermediate");
  });

  it("maps advance level to Advanced", () => {
    const result = courseJsonLd({
      title: "React Course",
      description: "Learn React",
      url: "/course/react",
      category: { name: "Frontend" },
      level: "advance",
      imageUrl: null,
    });
    expect((result[0] as any).educationalLevel).toBe("Advanced");
  });
});

describe("reviewJsonLd factory", () => {
  beforeEach(() => {
    vi.stubGlobal("process", {
      env: { NEXT_PUBLIC_APP_URL: "https://notesprovider.com" },
    });
    clearJsonLdScripts();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearJsonLdScripts();
  });

  it("returns Review script when rating values provided", () => {
    const result = reviewJsonLd({
      title: "React Notes",
      ratingValue: 4.5,
      ratingCount: 100,
      url: "/notes/react",
    });
    expect(result).toHaveLength(1);
    expect((result[0] as any)["@type"]).toBe("Review");
    expect((result[0] as any).reviewRating.ratingValue).toBe(4.5);
  });

  it("returns empty array when ratingValue is missing", () => {
    const result = reviewJsonLd({
      title: "React Notes",
      ratingCount: 100,
      url: "/notes/react",
    });
    expect(result).toEqual([]);
  });

  it("returns empty array when ratingCount is missing", () => {
    const result = reviewJsonLd({
      title: "React Notes",
      ratingValue: 4.5,
      url: "/notes/react",
    });
    expect(result).toEqual([]);
  });
});

describe("faqJsonLd factory", () => {
  beforeEach(() => {
    vi.stubGlobal("process", {
      env: { NEXT_PUBLIC_APP_URL: "https://notesprovider.com" },
    });
    clearJsonLdScripts();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearJsonLdScripts();
  });

  it("returns FAQPage with correct structure", () => {
    const result = faqJsonLd([
      { question: "Q1", answer: "A1" },
      { question: "Q2", answer: "A2" },
    ]);
    expect(result).toHaveLength(1);
    expect((result[0] as any)["@type"]).toBe("FAQPage");
    expect((result[0] as any).mainEntity).toHaveLength(2);
    expect((result[0] as any).mainEntity[0].name).toBe("Q1");
    expect((result[0] as any).mainEntity[0].acceptedAnswer.text).toBe("A1");
  });
});

describe("howToJsonLd factory", () => {
  beforeEach(() => {
    vi.stubGlobal("process", {
      env: { NEXT_PUBLIC_APP_URL: "https://notesprovider.com" },
    });
    clearJsonLdScripts();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearJsonLdScripts();
  });

  it("returns HowTo with correct structure", () => {
    const result = howToJsonLd([
      { name: "Step 1", text: "Do this" },
      { name: "Step 2", text: "Do that" },
    ]);
    expect(result).toHaveLength(1);
    expect((result[0] as any)["@type"]).toBe("HowTo");
    expect((result[0] as any).step).toHaveLength(2);
    expect((result[0] as any).step[0].position).toBe(1);
    expect((result[0] as any).step[1].position).toBe(2);
  });
});

describe("webpageJsonLd factory", () => {
  beforeEach(() => {
    vi.stubGlobal("process", {
      env: { NEXT_PUBLIC_APP_URL: "https://notesprovider.com" },
    });
    clearJsonLdScripts();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearJsonLdScripts();
  });

  it("returns WebPage script", () => {
    const result = webpageJsonLd({
      title: "Notes",
      description: "Coding notes",
      url: "/notes",
    });
    expect(result).toHaveLength(1);
    expect((result[0] as any)["@type"]).toBe("WebPage");
    expect((result[0] as any).name).toBe("Notes");
  });

  it("includes primaryImageOfPage when image provided", () => {
    const result = webpageJsonLd({
      title: "Notes",
      description: "Coding notes",
      url: "/notes",
      image: "https://notesprovider.com/og/notes.png",
    });
    expect((result[0] as any).primaryImageOfPage.url).toBe("https://notesprovider.com/og/notes.png");
  });

  it("includes numberOfItems when provided", () => {
    const result = webpageJsonLd({
      title: "Notes",
      description: "Coding notes",
      url: "/notes",
      itemCount: 42,
    });
    expect((result[0] as any).numberOfItems).toBe(42);
  });

  it("omits numberOfItems when not provided", () => {
    const result = webpageJsonLd({
      title: "Notes",
      description: "Coding notes",
      url: "/notes",
    });
    expect((result[0] as any).numberOfItems).toBeUndefined();
  });
});

describe("collectionPageJsonLd factory", () => {
  beforeEach(() => {
    vi.stubGlobal("process", {
      env: { NEXT_PUBLIC_APP_URL: "https://notesprovider.com" },
    });
    clearJsonLdScripts();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearJsonLdScripts();
  });

  it("returns CollectionPage script", () => {
    const result = collectionPageJsonLd({
      title: "Categories",
      description: "Browse categories",
      url: "/categories",
    });
    expect(result).toHaveLength(1);
    expect((result[0] as any)["@type"]).toBe("CollectionPage");
  });

  it("includes numberOfItems when provided", () => {
    const result = collectionPageJsonLd({
      title: "Categories",
      description: "Browse categories",
      url: "/categories",
      itemCount: 10,
    });
    expect((result[0] as any).numberOfItems).toBe(10);
  });
});

describe("articleJsonLd factory", () => {
  beforeEach(() => {
    vi.stubGlobal("process", {
      env: { NEXT_PUBLIC_APP_URL: "https://notesprovider.com" },
    });
    clearJsonLdScripts();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearJsonLdScripts();
  });

  it("returns Article script with correct fields", () => {
    const result = articleJsonLd({
      title: "React Notes",
      description: "Learn React",
      url: "/notes/react",
      imageUrl: null,
      category: { name: "Frontend" },
      level: "intermediate",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-06-01T00:00:00.000Z",
    });
    expect(result).toHaveLength(1);
    expect((result[0] as any)["@type"]).toBe("Article");
    expect((result[0] as any).headline).toBe("React Notes");
    expect((result[0] as any).datePublished).toBe("2024-01-01T00:00:00.000Z");
  });

  it("includes tags in keywords", () => {
    const result = articleJsonLd({
      title: "React Notes",
      description: "Learn React",
      url: "/notes/react",
      imageUrl: null,
      category: { name: "Frontend" },
      level: "intermediate",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-06-01T00:00:00.000Z",
      tags: ["hooks", "components"],
    });
    expect((result[0] as any).keywords).toContain("hooks");
    expect((result[0] as any).keywords).toContain("components");
  });
});
