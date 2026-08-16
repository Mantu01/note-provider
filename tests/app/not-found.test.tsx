import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "@/app/not-found";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { className, ...rest } = props;
    return <img {...rest} className={className} />;
  },
}));

vi.mock("@/components/brand/logo", () => ({
  Logo: ({ href, size }: { href?: any; size?: string }) => (
    <div data-testid="logo" data-size={size || "lg"}>
      <img alt="logo" />
    </div>
  ),
}));

vi.mock("@/components/ui/button", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/ui/button")>();
  return {
    ...actual,
    Button: ({ children, className, render: RenderComponent, ...rest }: any) => {
      if (RenderComponent) {
        return <a href={RenderComponent.props?.href || "#"} className={className}>{children}</a>;
      }
      return (
        <button className={className} {...rest}>
          {children}
        </button>
      );
    },
  };
});

describe("NotFound", () => {
  it("renders the page not found heading", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Page not found");
  });

  it("renders the descriptive paragraph", () => {
    render(<NotFound />);
    expect(screen.getByText(/the page you are looking for does not exist/i)).toBeInTheDocument();
  });

  it("renders the search icon", () => {
    render(<NotFound />);
    const icon = document.querySelector('[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
  });

  it("renders logo", () => {
    render(<NotFound />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("applies grid layout classes", () => {
    const { container } = render(<NotFound />);
    const main = container.querySelector("main");
    expect(main).toHaveClass("grid");
    expect(main).toHaveClass("min-h-screen");
    expect(main).toHaveClass("place-items-center");
  });

  it("renders max-w-md wrapper", () => {
    const { container } = render(<NotFound />);
    const wrapper = container.querySelector(".max-w-md");
    expect(wrapper).toBeInTheDocument();
  });

  it("renders text-center wrapper", () => {
    const { container } = render(<NotFound />);
    const wrapper = container.querySelector(".text-center");
    expect(wrapper).toBeInTheDocument();
  });

  it("renders flex gap-6 wrapper", () => {
    const { container } = render(<NotFound />);
    const wrapper = container.querySelector(".gap-6");
    expect(wrapper).toBeInTheDocument();
  });

  it("renders Back home button", () => {
    render(<NotFound />);
    const link = document.querySelector('a[href="/"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent("Back home");
  });
});
