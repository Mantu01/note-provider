import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GlobalError from "@/app/error";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { className, ...rest } = props;
    return <img {...rest} className={className} />;
  },
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/brand/logo", () => ({
  Logo: ({ variant }: { variant?: string }) => (
    <div data-testid="logo" data-variant={variant || "full"}>
      <img alt="logo" />
    </div>
  ),
}));

vi.mock("@/components/ui/button", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/ui/button")>();
  return {
    ...actual,
    Button: ({ children, variant, size, className, onClick, render: RenderComponent }: any) => {
      if (RenderComponent) {
        return <a href={RenderComponent.props?.href || "#"} className={className}>{children}</a>;
      }
      return (
        <button className={className} onClick={onClick}>
          {children}
        </button>
      );
    },
  };
});

describe("GlobalError", () => {
  const mockReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the not found heading", () => {
    render(<GlobalError error={new Error("test") as any} reset={mockReset} />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Something went wrong");
  });

  it("renders the error icon", () => {
    render(<GlobalError error={new Error("test") as any} reset={mockReset} />);
    const icon = document.querySelector('[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
  });

  it("renders the descriptive paragraph", () => {
    render(<GlobalError error={new Error("test") as any} reset={mockReset} />);
    expect(screen.getByText(/please try again or contact support/i)).toBeInTheDocument();
  });

  it("renders the Try again button", () => {
    render(<GlobalError error={new Error("test") as any} reset={mockReset} />);
    const button = screen.getByRole("button", { name: /try again/i });
    expect(button).toBeInTheDocument();
  });

  it("calls reset when Try again button is clicked", () => {
    render(<GlobalError error={new Error("test") as any} reset={mockReset} />);
    const button = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(button);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("renders Contact Support link", () => {
    render(<GlobalError error={new Error("test") as any} reset={mockReset} />);
    const link = document.querySelector('a[href="/contact"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent("Support");
  });

  it("renders Home link", () => {
    render(<GlobalError error={new Error("test") as any} reset={mockReset} />);
    const link = document.querySelector('a[href="/"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent("Home");
  });

  it("applies grid layout classes", () => {
    const { container } = render(<GlobalError error={new Error("test") as any} reset={mockReset} />);
    const main = container.querySelector("main");
    expect(main).toHaveClass("grid");
    expect(main).toHaveClass("min-h-screen");
    expect(main).toHaveClass("place-items-center");
  });

  it("renders logo", () => {
    render(<GlobalError error={new Error("test") as any} reset={mockReset} />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("has back home button linking to /", () => {
    render(<GlobalError error={new Error("test") as any} reset={mockReset} />);
    const link = document.querySelector('a[href="/"]');
    expect(link).toBeInTheDocument();
  });
});
