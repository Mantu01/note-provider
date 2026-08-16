import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PublicLayout from "@/app/(public)/layout";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { className, ...rest } = props;
    return <img {...rest} className={className} />;
  },
}));

vi.mock("@/components/layout/navbar", () => ({
  Navbar: () => <header data-testid="navbar">Navbar</header>,
}));

vi.mock("@/components/layout/footer", () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

describe("PublicLayout", () => {
  it("renders children", () => {
    render(
      <PublicLayout>
        <main data-testid="children">Page content</main>
      </PublicLayout>
    );
    expect(screen.getByTestId("children")).toBeInTheDocument();
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("renders Navbar", () => {
    render(
      <PublicLayout>
        <div>Content</div>
      </PublicLayout>
    );
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("renders Footer", () => {
    render(
      <PublicLayout>
        <div>Content</div>
      </PublicLayout>
    );
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("applies flex column layout with min-h-screen", () => {
    const { container } = render(
      <PublicLayout>
        <div>Content</div>
      </PublicLayout>
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("flex");
    expect(root).toHaveClass("min-h-screen");
    expect(root).toHaveClass("flex-col");
  });

  it("places Navbar before children and Footer after", () => {
    render(
      <PublicLayout>
        <main data-testid="children">Content</main>
      </PublicLayout>
    );
    const navbar = document.querySelector('[data-testid="navbar"]') as HTMLElement;
    const mainEl = document.querySelector('[data-testid="children"]') as HTMLElement;
    const footer = document.querySelector('[data-testid="footer"]') as HTMLElement;
    expect(navbar).toBeInTheDocument();
    expect(mainEl).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
    expect(navbar!.compareDocumentPosition(footer!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(mainEl!.compareDocumentPosition(footer!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(navbar!.compareDocumentPosition(mainEl!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("applies flex-1 to main element", () => {
    const { container } = render(
      <PublicLayout>
        <main data-testid="children">Content</main>
      </PublicLayout>
    );
    const main = container.querySelector("main");
    expect(main).toHaveClass("flex-1");
  });
});
